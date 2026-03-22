const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { sendLog } = require("../../services/logService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Retirer un timeout.")
    .addUserOption((option) => option.setName("membre").setDescription("Membre cible").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, client) {
    const user = interaction.options.getUser("membre", true);
    const member = await interaction.guild.members.fetch(user.id);
    await member.timeout(null);
    await sendLog(interaction.guild, client.runtimeConfig.channels?.moderationLog, "Unmute", `${user.tag} a ete unmute par ${interaction.user.tag}.`);
    await interaction.reply({ content: `${user.tag} n'est plus mute.`, ephemeral: true });
  }
};
