const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { getLatestApplicationByUser } = require("../../services/applicationService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("accept")
    .setDescription("Accepter la derniere candidature d'un membre.")
    .addUserOption((option) => option.setName("membre").setDescription("Candidat").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    const user = interaction.options.getUser("membre", true);
    const application = await getLatestApplicationByUser(interaction.guild.id, user.id);

    if (!application) {
      await interaction.reply({ content: "Aucune candidature trouvee pour ce membre.", ephemeral: true });
      return;
    }

    application.status = "accepted";
    application.reviewedBy = interaction.user.id;
    application.reviewedAt = new Date();
    await application.save();

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (member && interaction.client.runtimeConfig.recruitment?.acceptedRoleId) {
      await member.roles.add(interaction.client.runtimeConfig.recruitment.acceptedRoleId).catch(() => null);
      await member.send("Ta candidature Societa Ombra a ete acceptee.").catch(() => null);
    }

    await interaction.reply({ content: `La candidature de ${user.tag} est acceptee.`, ephemeral: true });
  }
};
