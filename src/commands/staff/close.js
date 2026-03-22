const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { closeTicket } = require("../../modules/tickets");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("close")
    .setDescription("Demander la fermeture du ticket actuel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction, client) {
    await closeTicket(interaction, client);
  }
};
