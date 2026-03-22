const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { sendLog } = require("../../services/logService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Timeout un membre.")
    .addUserOption((option) => option.setName("membre").setDescription("Membre cible").setRequired(true))
    .addIntegerOption((option) => option.setName("minutes").setDescription("Duree en minutes").setRequired(true))
    .addStringOption((option) => option.setName("raison").setDescription("Raison").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, client) {
    const user = interaction.options.getUser("membre", true);
    const minutes = interaction.options.getInteger("minutes", true);
    const reason = interaction.options.getString("raison", true);
    const member = await interaction.guild.members.fetch(user.id);
    await member.timeout(minutes * 60 * 1000, reason);
    await sendLog(interaction.guild, client.runtimeConfig.channels?.moderationLog, "Mute", `${user.tag} a ete timeout ${minutes} minute(s) par ${interaction.user.tag}.`, [{ name: "Raison", value: reason }]);
    await interaction.reply({ content: `${user.tag} est mute pour ${minutes} minute(s).`, ephemeral: true });
  }
};
