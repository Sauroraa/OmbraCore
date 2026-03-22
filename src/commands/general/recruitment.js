const { SlashCommandBuilder } = require("discord.js");

const { createRecruitmentModal, createRecruitmentPanel } = require("../../modules/recruitment");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recrutement")
    .setDescription("Ouvrir ta candidature ou afficher le panel.")
    .addBooleanOption((option) => option.setName("panel").setDescription("Afficher le panel en prive")),
  async execute(interaction, client) {
    const panel = interaction.options.getBoolean("panel") ?? false;

    if (panel) {
      await interaction.reply({ ...createRecruitmentPanel(), ephemeral: true });
      return;
    }

    await interaction.showModal(createRecruitmentModal(client.runtimeConfig));
  }
};
