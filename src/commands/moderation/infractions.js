const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const Warning = require("../../models/Warning");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("infractions")
    .setDescription("Afficher les avertissements d'un membre.")
    .addUserOption((option) => option.setName("membre").setDescription("Membre cible").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const member = interaction.options.getUser("membre", true);
    const warnings = await Warning.find({ guildId: interaction.guild.id, userId: member.id }).sort({ createdAt: -1 }).limit(10);

    if (!warnings.length) {
      await interaction.reply({ content: `Aucune infraction enregistree pour ${member.tag}.`, ephemeral: true });
      return;
    }

    const content = warnings
      .map((warning) => `• ${warning.createdAt.toLocaleString("fr-FR")} | ${warning.reason} | staff ${warning.moderatorId}`)
      .join("\n");

    await interaction.reply({ content: `Historique de ${member.tag}\n${content}`, ephemeral: true });
  }
};
