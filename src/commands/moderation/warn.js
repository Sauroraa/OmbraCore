const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const Warning = require("../../models/Warning");
const { sendLog } = require("../../services/logService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Ajouter un avertissement a un membre.")
    .addUserOption((option) => option.setName("membre").setDescription("Membre cible").setRequired(true))
    .addStringOption((option) => option.setName("raison").setDescription("Raison du warn").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, client) {
    const member = interaction.options.getUser("membre", true);
    const reason = interaction.options.getString("raison", true);

    const warning = await Warning.create({
      guildId: interaction.guild.id,
      userId: member.id,
      moderatorId: interaction.user.id,
      reason
    });

    await sendLog(
      interaction.guild,
      client.runtimeConfig.channels?.moderationLog,
      "Warn ajoute",
      `${member.tag} a recu un avertissement.`,
      [
        { name: "Moderateur", value: `${interaction.user}`, inline: true },
        { name: "Raison", value: reason, inline: false },
        { name: "ID", value: warning.id, inline: true }
      ]
    );

    await interaction.reply({ content: `Warn ajoute a ${member.tag}.`, ephemeral: true });
  }
};
