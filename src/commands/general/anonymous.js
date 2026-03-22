const { ChannelType, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ano")
    .setDescription("Envoyer un message anonyme trace par le staff.")
    .addChannelOption((option) =>
      option
        .setName("salon")
        .setDescription("Salon cible")
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("priorite")
        .setDescription("Niveau de priorite")
        .setRequired(true)
        .addChoices(
          { name: "Basse", value: "low" },
          { name: "Moyenne", value: "medium" },
          { name: "Haute", value: "high" }
        )
    )
    .addBooleanOption((option) => option.setName("signature").setDescription("Afficher la signature anonyme"))
    .addStringOption((option) => option.setName("message").setDescription("Message a transmettre").setRequired(true)),
  async execute(interaction, client) {
    const { submitAnonymousMessage } = require("../../modules/anonymous");
    await submitAnonymousMessage(interaction, client);
  }
};
