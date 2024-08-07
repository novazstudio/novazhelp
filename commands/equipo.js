const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('equipo')
        .setDescription('Muestra una lista de los miembros del equipo de soporte y sus roles'),
    async execute(interaction) {
        // En un caso real, esta información podría venir de una base de datos
        const teamMembers = [
            { name: 'Alice', role: 'Administradora' },
            { name: 'Bob', role: 'Moderador' },
            { name: 'Charlie', role: 'Soporte Técnico' },
            { name: 'Diana', role: 'Soporte Técnico' },
        ];

        const teamEmbed = new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle('Equipo de Soporte')
            .setDescription('Estos son los miembros de nuestro equipo de soporte:')
            .addFields(
                teamMembers.map(member => ({
                    name: member.name,
                    value: member.role,
                    inline: true
                }))
            )
            .setFooter({ text: 'No dudes en contactar a cualquiera de ellos si necesitas ayuda.' });

        await interaction.reply({ embeds: [teamEmbed] });
    },
};