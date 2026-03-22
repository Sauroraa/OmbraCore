const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const GuildConfig = require("../../models/GuildConfig");
const { createTicketPanel } = require("../../modules/tickets");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setticketpanel")
    .setDescription("Publier ou republier le panel de tickets.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const channel =
      (client.runtimeConfig.channels?.ticketPanel &&
        (await interaction.guild.channels.fetch(client.runtimeConfig.channels.ticketPanel).catch(() => null))) ||
      interaction.channel;
    const sentMessage = await channel.send(createTicketPanel(client.runtimeConfig));
    client.runtimeConfig.channels.ticketPanel = channel.id;
    client.runtimeConfig.tickets.panelMessageId = sentMessage.id;
    await GuildConfig.updateOne(
      { guildId: interaction.guild.id },
      {
        $set: {
          "channels.ticketPanel": channel.id,
          "tickets.panelMessageId": sentMessage.id
        }
      }
    );
    await interaction.reply({ content: "Panel tickets publie.", ephemeral: true });
  }
};
