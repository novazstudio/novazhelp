const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reportar-bug')
        .setDescription('Reporta un bug en el servidor/Bots.')
        .addStringOption(option =>
            option.setName('descripcion')
                .setDescription('Descripción del bug')
                .setRequired(true)),
    async execute(interaction) {
        const bugDescription = interaction.options.getString('descripcion');
        const categoryId = '1269740341762986302'; // Reemplaza esto con el ID de la categoría donde quieres crear los canales de reporte

        // Leer la configuración de idiomas
        const languageFilePath = path.join(__dirname, '..', 'language_settings.json');
        let languageSettings = {};

        try {
            if (fs.existsSync(languageFilePath)) {
                const data = fs.readFileSync(languageFilePath, 'utf8');
                languageSettings = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error al leer o analizar el archivo de configuración de idiomas:', error);
        }

        // Obtener el idioma del usuario
        const userId = interaction.user.id;
        const userLanguage = languageSettings[userId] || 'es'; // Por defecto en español

        // Traducciones
        const translations = {
            en: {
                thankYou: 'Thank you for reporting the bug. You can view and follow up on the report in',
                newReport: 'New bug report by'
            },
            es: {
                thankYou: 'Gracias por reportar el bug. Puedes ver y seguir el reporte en',
                newReport: 'Nuevo reporte de bug por'
            },
            // Agrega más idiomas aquí si es necesario
        };

        // Obtener las traducciones correspondientes
        const { thankYou, newReport } = translations[userLanguage] || translations['es'];

        // Crear un canal para el reporte del bug
        const reportChannel = await interaction.guild.channels.create({
            name: `reporte-bug-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: categoryId,
            topic: `${newReport} ${interaction.user.tag}: ${bugDescription}`,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                },
                {
                    id: '1269733783540863128', // Reemplaza con el ID del rol de soporte técnico
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                },
            ],
        });

        await interaction.reply({ content: `${thankYou} ${reportChannel}.`, ephemeral: true });

        await reportChannel.send(`${newReport} ${interaction.user.tag}:\n\n${bugDescription}`);
    },
};
