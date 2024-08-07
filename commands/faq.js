const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('faq')
        .setDescription('Muestra una lista de preguntas frecuentes y sus respuestas'),
    async execute(interaction) {
        const faqEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Preguntas Frecuentes')
            .setDescription('Aquí tienes algunas preguntas frecuentes y sus respuestas:')
            .addFields(
                { name: '¿Cómo creo un ticket?', value: 'Usa el comando `/ticket` seguido del asunto de tu consulta.' },
                { name: '¿Cuánto tiempo tarda en responderse un ticket?', value: 'Nuestro equipo intenta responder en las primeras 24 horas.' },
                { name: '¿Cómo puedo cerrar mi ticket?', value: 'Puedes usar el botón "Cerrar Ticket" en el canal de tu ticket.' },
                { name: '¿Cómo cambio el idioma del bot?', value: 'Usa el comando `/idioma` seguido del código de idioma (es/en).' },
                { name: '¿Cómo puedo contactar al equipo fuera de Discord?', value: 'Usa el comando `/contacto` para obtener información adicional.' }
            )
            .setFooter({ text: 'Si no encuentras tu pregunta, no dudes en abrir un ticket.' });

        await interaction.reply({ embeds: [faqEmbed] });
    },
};