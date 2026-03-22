const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setautomod")
    .setDescription("Raccourci de configuration automod.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((option) => option.setName("spam").setDescription("Seuil anti-spam").setRequired(true))
    .addIntegerOption((option) => option.setName("mentions").setDescription("Seuil anti-mentions").setRequired(true))
    .addIntegerOption((option) => option.setName("timeout").setDescription("Timeout auto en minutes").setRequired(true)),
  async execute(interaction, client) {
    client.runtimeConfig.automod.spamThreshold = interaction.options.getInteger("spam", true);
    client.runtimeConfig.automod.mentionThreshold = interaction.options.getInteger("mentions", true);
    client.runtimeConfig.automod.timeoutMinutes = interaction.options.getInteger("timeout", true);
    await client.runtimeConfig.save();
    await interaction.reply({ content: "Automod mis a jour.", ephemeral: true });
  }
};
