const { SlashCommandBuilder } = require("discord.js");

const { createRulesPanel } = require("../../modules/rules");

module.exports = {
  data: new SlashCommandBuilder().setName("reglement").setDescription("Afficher le reglement et le panneau de validation."),
  async execute(interaction, client) {
    await interaction.reply({ ...createRulesPanel(client.runtimeConfig), ephemeral: true });
  }
};
