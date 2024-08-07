const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Crea un ticket de soporte')
        .addStringOption(option => option.setName('asunto').setDescription('Asunto del ticket').setRequired(true)),
    async execute(interaction) {
        const asunto = interaction.options.getString('asunto');
        const supportRoleId = '1269733783540863128';

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

        const userId = interaction.user.id;
        const userLanguage = languageSettings[userId] || 'es';

        const ticketMessages = {
            es: {
                title: '🎫 Nuevo Ticket de Soporte',
                description: `Se ha creado un nuevo ticket de soporte.\n\n**Asunto:** ${asunto}`,
                fieldTitle: 'Instrucciones',
                fieldValue: 'Por favor, espera a que un miembro del equipo de soporte reclame este ticket. Mientras tanto, puedes proporcionar más detalles sobre tu problema.',
                replyContent: '✅ Ticket creado exitosamente: ',
                footerText: 'Sistema de Soporte'
            },
            en: {
                title: '🎫 New Support Ticket',
                description: `A new support ticket has been created.\n\n**Subject:** ${asunto}`,
                fieldTitle: 'Instructions',
                fieldValue: 'Please wait for a support team member to claim this ticket. In the meantime, you can provide more details about your issue.',
                replyContent: '✅ Ticket successfully created: ',
                footerText: 'Support System'
            },
        };

        const message = ticketMessages[userLanguage] || ticketMessages['es'];

        const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            topic: `Ticket para ${interaction.user.tag}`,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                },
                {
                    id: supportRoleId,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                },
            ],
        });

        const ticketChannelId = ticketChannel.id;
        message.replyContent += `<#${ticketChannelId}>`;

        const embed = new EmbedBuilder()
            .setTitle(message.title)
            .setDescription(message.description)
            .setColor(0x00AE86)
            .addFields(
                { name: message.fieldTitle, value: message.fieldValue }
            )
            .setTimestamp()
            .setFooter({ text: message.footerText, iconURL: interaction.guild.iconURL() });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('claim-ticket')
                    .setLabel('Reclamar Ticket')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🙋'),
                new ButtonBuilder()
                    .setCustomId('close-ticket')
                    .setLabel('Cerrar Ticket')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('🔒')
            );

        await ticketChannel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: message.replyContent, ephemeral: true });
    },
};