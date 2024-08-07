const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responde con Pong! y el tiempo de respuesta del bot.'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pong!', fetchReply: true });
        const timeDiff = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`Pong! 🏓 La latencia es de ${timeDiff}ms.`);
    },
};
