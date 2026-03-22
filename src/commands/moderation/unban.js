const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { sendLog } = require("../../services/logService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Debannir un utilisateur.")
    .addStringOption((option) => option.setName("userid").setDescription("ID Discord").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction, client) {
    const userId = interaction.options.getString("userid", true);
    await interaction.guild.members.unban(userId);
    await sendLog(interaction.guild, client.runtimeConfig.channels?.moderationLog, "Unban", `L'utilisateur ${userId} a ete debanni par ${interaction.user.tag}.`);
    await interaction.reply({ content: `${userId} a ete debanni.`, ephemeral: true });
  }
};
