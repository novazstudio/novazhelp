const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Proporciona una guía rápida sobre cómo usar el bot'),
    async execute(interaction) {
        const guideEmbed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setTitle('Guía Rápida de NovaZHelp')
            .setDescription('Bienvenido a NovaZHelp. Aquí tienes una guía rápida para usar nuestro bot:')
            .addFields(
                { name: '1. Crear un ticket', value: 'Usa `/ticket [asunto]` para crear un nuevo ticket de soporte.' },
                { name: '2. Ver FAQs', value: 'Usa `/faq` para ver las preguntas más frecuentes.' },
                { name: '3. Reportar un problema', value: 'Usa `/reportar` para informar de un problema sin crear un ticket.' },
                { name: '4. Hacer una sugerencia', value: 'Usa `/sugerir` para proponer mejoras o nuevas funciones.' },
                { name: '5. Cambiar idioma', value: 'Usa `/idioma` para cambiar el idioma del bot.' },
                { name: '6. Ver estado del servicio', value: 'Usa `/estado` para ver el estado actual de nuestros servicios.' }
            )
            .setFooter({ text: 'Para más información, no dudes en contactar a un miembro del equipo.' });

        await interaction.reply({ embeds: [guideEmbed] });
    },
};