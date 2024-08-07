const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sugerir')
        .setDescription('Hacer una sugerencia para mejorar el servicio')
        .addStringOption(option => 
            option.setName('sugerencia')
                .setDescription('Escribe tu sugerencia')
                .setRequired(true)),
    async execute(interaction) {
        const sugerencia = interaction.options.getString('sugerencia');
        
        const suggestionEmbed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('Nueva Sugerencia')
            .setDescription(`Sugerencia de: ${interaction.user.tag}`)
            .addFields(
                { name: 'Sugerencia', value: sugerencia }
            )
            .setTimestamp();

        // Buscar o crear un canal para las sugerencias
        let suggestionChannel = interaction.guild.channels.cache.find(channel => channel.name === 'ꜱᴜɢᴇʀᴇɴᴄɪᴀꜱ');
        if (!suggestionChannel) {
            suggestionChannel = await interaction.guild.channels.create({
                name: 'ꜱᴜɢᴇʀᴇɴᴄɪᴀꜱ',
                type: ChannelType.GuildText,
            });
        }

        const sentMessage = await suggestionChannel.send({ embeds: [suggestionEmbed] });
        await sentMessage.react('👍');
        await sentMessage.react('👎');

        await interaction.reply({ content: 'Tu sugerencia ha sido enviada. ¡Gracias por tu aporte!', ephemeral: true });
    },
};