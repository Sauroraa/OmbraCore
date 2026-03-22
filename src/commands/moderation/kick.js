const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { sendLog } = require("../../services/logService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulser un membre.")
    .addUserOption((option) => option.setName("membre").setDescription("Membre cible").setRequired(true))
    .addStringOption((option) => option.setName("raison").setDescription("Raison").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction, client) {
    const user = interaction.options.getUser("membre", true);
    const reason = interaction.options.getString("raison", true);
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      await interaction.reply({ content: "Membre introuvable.", ephemeral: true });
      return;
    }

    await member.send(`Tu as ete expulse de Societa Ombra. Raison: ${reason}`).catch(() => null);
    await member.kick(reason);
    await sendLog(interaction.guild, client.runtimeConfig.channels?.moderationLog, "Kick", `${user.tag} a ete expulse par ${interaction.user.tag}.`, [{ name: "Raison", value: reason }]);
    await interaction.reply({ content: `${user.tag} a ete expulse.`, ephemeral: true });
  }
};
