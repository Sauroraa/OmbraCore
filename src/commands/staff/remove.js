const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { getActiveTicketByChannel } = require("../../services/ticketService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Retirer un membre du ticket.")
    .addUserOption((option) => option.setName("membre").setDescription("Membre a retirer").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const ticket = await getActiveTicketByChannel(interaction.channelId);
    if (!ticket) {
      await interaction.reply({ content: "Cette commande doit etre utilisee dans un ticket actif.", ephemeral: true });
      return;
    }

    const user = interaction.options.getUser("membre", true);
    await interaction.channel.permissionOverwrites.delete(user.id).catch(() => null);
    await interaction.reply({ content: `${user.tag} a ete retire du ticket.` });
  }
};
