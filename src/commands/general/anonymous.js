const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ano")
    .setDescription("Envoyer un message anonyme trace par le staff.")
    .addStringOption((option) => option.setName("message").setDescription("Message a transmettre anonymement").setRequired(true)),
  async execute(interaction, client) {
    const { submitAnonymousMessage } = require("../../modules/anonymous");
    await submitAnonymousMessage(interaction, client);
  }
};
