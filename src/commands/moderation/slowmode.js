const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Configurer le slowmode du salon.")
    .addIntegerOption((option) => option.setName("secondes").setDescription("Duree en secondes").setMinValue(0).setMaxValue(21600).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const seconds = interaction.options.getInteger("secondes", true);
    await interaction.channel.setRateLimitPerUser(seconds);
    await interaction.reply({ content: `Slowmode defini a ${seconds} seconde(s).`, ephemeral: true });
  }
};
