const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reglas')
        .setDescription('Muestra las reglas del servidor o del sistema de soporte'),
    async execute(interaction) {
        const rulesEmbed = new EmbedBuilder()
            .setColor(0x4B0082)
            .setTitle('Reglas del Servidor y Sistema de Soporte')
            .setDescription('Por favor, sigue estas reglas para mantener un ambiente agradable:')
            .addFields(
                { name: '1. Respeto', value: 'Trata a todos con respeto. No se tolera el acoso, racismo, sexismo o cualquier forma de discriminación.' },
                { name: '2. Spam', value: 'No hagas spam ni publiques contenido no relacionado.' },
                { name: '3. Lenguaje', value: 'Usa un lenguaje apropiado. Evita las groserías excesivas.' },
                { name: '4. Privacidad', value: 'Respeta la privacidad de los demás. No compartas información personal sin permiso.' },
                { name: '5. Tickets', value: 'Usa el sistema de tickets apropiadamente. No abuses creando múltiples tickets innecesarios.' }
            )
            .setFooter({ text: 'El incumplimiento de estas reglas puede resultar en una sanción.' });

        await interaction.reply({ embeds: [rulesEmbed] });
    },
};