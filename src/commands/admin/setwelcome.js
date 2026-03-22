const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { createWelcomeEmbed } = require("../../modules/welcome");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setwelcome")
    .setDescription("Previsualiser le message de bienvenue.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    await interaction.reply({ embeds: [createWelcomeEmbed(interaction.member, client.runtimeConfig)], ephemeral: true });
  }
};
