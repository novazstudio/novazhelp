const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('language')
        .setDescription('Selecciona el idioma para los comandos.')
        .addStringOption(option =>
            option.setName('idioma')
                .setDescription('El idioma deseado.')
                .setRequired(true)
                .addChoices(
                    { name: 'Español', value: 'es' },
                    { name: 'Inglés', value: 'en' }
                )),
    async execute(interaction) {
        const selectedLanguage = interaction.options.getString('idioma');
        const userId = interaction.user.id;

        // Leer el archivo de configuración de idiomas
        const languageFilePath = path.join(__dirname, '..', 'language_settings.json');
        let languageSettings = {};

        try {
            const data = fs.readFileSync(languageFilePath, 'utf8');
            languageSettings = JSON.parse(data);
        } catch (error) {
            console.error('Error al leer o analizar el archivo de configuración de idiomas:', error);
        }

        // Establecer el idioma para el usuario
        languageSettings[userId] = selectedLanguage;

        // Guardar los cambios en el archivo de configuración
        try {
            fs.writeFileSync(languageFilePath, JSON.stringify(languageSettings, null, 2), 'utf8');
            await interaction.reply({ content: `Idioma establecido a ${selectedLanguage}.`, ephemeral: true });
        } catch (error) {
            console.error('Error al guardar la configuración de idiomas:', error);
            await interaction.reply({ content: 'Ocurrió un error al guardar la configuración del idioma.', ephemeral: true });
        }
    },
};
