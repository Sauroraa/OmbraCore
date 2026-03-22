const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { sendLog } = require("../../services/logService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bannir un membre.")
    .addUserOption((option) => option.setName("membre").setDescription("Membre cible").setRequired(true))
    .addStringOption((option) => option.setName("raison").setDescription("Raison").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction, client) {
    const user = interaction.options.getUser("membre", true);
    const reason = interaction.options.getString("raison", true);
    await interaction.guild.members.ban(user.id, { reason });
    await sendLog(interaction.guild, client.runtimeConfig.channels?.moderationLog, "Ban", `${user.tag} a ete banni par ${interaction.user.tag}.`, [{ name: "Raison", value: reason }]);
    await interaction.reply({ content: `${user.tag} a ete banni.`, ephemeral: true });
  }
};
