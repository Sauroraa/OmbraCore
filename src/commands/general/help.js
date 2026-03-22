const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Afficher les commandes principales d'OmbraCore."),
  async execute(interaction) {
    const content = [
      "`/ping` verifier le bot",
      "`/reglement` afficher le reglement",
      "`/ticket type:<...>` ouvrir un ticket",
      "`/recrutement` ouvrir la candidature",
      "`/ano` envoyer un message anonyme",
      "`/setup` publier les panneaux principaux",
      "`/config show` voir la configuration",
      "`/panel`, `/accept`, `/refuse` outils staff",
      "`/warn`, `/mute`, `/ban`, `/kick`, `/purge` moderation"
    ].join("\n");

    await interaction.reply({ content, ephemeral: true });
  }
};
