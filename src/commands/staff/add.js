const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { getActiveTicketByChannel } = require("../../services/ticketService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Ajouter un membre au ticket.")
    .addUserOption((option) => option.setName("membre").setDescription("Membre a ajouter").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    const ticket = await getActiveTicketByChannel(interaction.channelId);
    if (!ticket) {
      await interaction.reply({ content: "Cette commande doit etre utilisee dans un ticket actif.", ephemeral: true });
      return;
    }

    const user = interaction.options.getUser("membre", true);
    await interaction.channel.permissionOverwrites.edit(user.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true
    });
    await interaction.reply({ content: `${user} a ete ajoute au ticket.` });
  }
};
