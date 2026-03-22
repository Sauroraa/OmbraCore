const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Verifier que OmbraCore repond."),
  async execute(interaction) {
    await interaction.reply({ content: "OmbraCore est operationnel.", ephemeral: true });
  }
};
