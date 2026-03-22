const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { getLatestApplicationByUser } = require("../../services/applicationService");

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

    application.status = "refused";
    application.reviewedBy = interaction.user.id;
    application.reviewedAt = new Date();
    await application.save();

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (member && interaction.client.runtimeConfig.recruitment?.refusedRoleId) {
      await member.roles.add(interaction.client.runtimeConfig.recruitment.refusedRoleId).catch(() => null);
      await member.send("Ta candidature Societa Ombra a ete refusee.").catch(() => null);
    }

    await interaction.reply({ content: `La candidature de ${user.tag} est refusee.`, ephemeral: true });
  }
};
