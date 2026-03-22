const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

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
    await channel.send(createTicketPanel(client.runtimeConfig));
    await interaction.reply({ content: "Panel tickets publie.", ephemeral: true });
  }
};
