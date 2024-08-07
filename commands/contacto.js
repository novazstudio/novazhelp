const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('contacto')
        .setDescription('Muestra información de contacto alternativa para soporte fuera de Discord'),
    async execute(interaction) {
        const contactEmbed = new EmbedBuilder()
            .setColor(0x1ABC9C)
            .setTitle('Información de Contacto')
            .setDescription('Aquí tienes formas alternativas de contactar con nuestro equipo de soporte:')
            .addFields(
                //{ name: 'Email', value: 'soporte@novazhelp.com' },
                //{ name: 'Teléfono', value: '+1 (555) 123-4567' },
                //{ name: 'Sitio Web', value: 'https://www.novazhelp.com/soporte' },
                { name: 'Discord', value: 'Por ahora nuestro unico metodo de contacto es discord pronto traeremos mas metodos.'},
                { name: 'Horario de Atención', value: 'Lunes a Viernes, 9:00 AM - 6:00 PM (GMT-5)' }
            )
            .setFooter({ text: 'Recuerda que la forma más rápida de obtener ayuda es a través de nuestro sistema de tickets en Discord.' });

        await interaction.reply({ embeds: [contactEmbed] });
    },
};