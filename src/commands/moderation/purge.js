const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Supprimer en masse des messages.")
    .addIntegerOption((option) => option.setName("nombre").setDescription("Nombre de messages").setMinValue(1).setMaxValue(100).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger("nombre", true);
    await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({ content: `${amount} messages supprimes.`, ephemeral: true });
  }
};
