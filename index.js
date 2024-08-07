const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Channel],
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});

client.commands = new Collection();

// Cargar comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`El comando en ${filePath} no tiene la estructura correcta.`);
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No se encontró el comando: ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error('Error al ejecutar el comando:', error);

            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ Error')
                .setDescription('Este comando no funciona. Por favor, reporta este problema para que podamos solucionarlo.')
                .setFooter({ text: 'Si el problema persiste, contacta al equipo de soporte.' });

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    } else if (interaction.isButton()) {
        const supportRoleId = '1269733783540863128';

        if (interaction.customId === 'claim-ticket') {
            const ticketOwnerMatch = interaction.channel.topic.match(/Ticket para (.*)/);
            if (!ticketOwnerMatch) {
                await interaction.reply({ content: 'No se pudo determinar el propietario del ticket.', ephemeral: true });
                return;
            }
            const ticketOwner = ticketOwnerMatch[1];
            if (interaction.user.tag === ticketOwner) {
                await interaction.reply({ content: 'No puedes reclamar tu propio ticket.', ephemeral: true });
            } else if (!interaction.member.roles.cache.has(supportRoleId)) {
                await interaction.reply({ content: 'Solo los miembros del soporte técnico pueden reclamar tickets.', ephemeral: true });
            } else {
                await interaction.channel.setTopic(`Ticket para ${ticketOwner} - Reclamado por ${interaction.user.tag}`);
                
                const claimEmbed = new EmbedBuilder()
                    .setColor(0x00AE86)
                    .setTitle('🎫 Ticket Reclamado')
                    .setDescription(`Este ticket ha sido reclamado por ${interaction.user.tag}.`)
                    .setTimestamp()
                    .setFooter({ text: 'Soporte Técnico', iconURL: interaction.guild.iconURL() });

                await interaction.reply({ embeds: [claimEmbed] });

                // Actualizar el embed original
                const messages = await interaction.channel.messages.fetch({ limit: 1 });
                const firstMessage = messages.first();
                if (firstMessage && firstMessage.embeds.length > 0) {
                    const originalEmbed = EmbedBuilder.from(firstMessage.embeds[0])
                        .setColor(0xFFA500)
                        .addFields({ name: 'Estado', value: `Reclamado por ${interaction.user.tag}`, inline: false });

                    const updatedRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('close-ticket')
                                .setLabel('Cerrar Ticket')
                                .setStyle(ButtonStyle.Danger)
                        );

                    await firstMessage.edit({ embeds: [originalEmbed], components: [updatedRow] });
                }
            }
        } else if (interaction.customId === 'close-ticket') {
            const closeEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🔒 Cerrando Ticket')
                .setDescription('Este ticket será cerrado en 5 segundos.')
                .setTimestamp()
                .setFooter({ text: 'Gracias por usar nuestro sistema de soporte.' });

            await interaction.reply({ embeds: [closeEmbed] });
            setTimeout(() => interaction.channel.delete(), 5000);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);