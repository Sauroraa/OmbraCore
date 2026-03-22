const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { getLatestApplicationByUser } = require("../../services/applicationService");
const { applyApplicationStatus } = require("../../services/recruitmentDecisionService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("refuse")
    .setDescription("Refuser la derniere candidature d'un membre.")
    .addUserOption((option) => option.setName("membre").setDescription("Candidat").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const user = interaction.options.getUser("membre", true);
    const application = await getLatestApplicationByUser(interaction.guild.id, user.id);

    if (!application) {
      await interaction.reply({ content: "Aucune candidature trouvee pour ce membre.", ephemeral: true });
      return;
    }

    await applyApplicationStatus({
      client: interaction.client,
      guild: interaction.guild,
      application,
      status: "refused",
      actorId: interaction.user.id,
      actorLabel: interaction.user.tag
    });

    await interaction.reply({ content: `La candidature de ${user.tag} est refusee.`, ephemeral: true });
  }
};
