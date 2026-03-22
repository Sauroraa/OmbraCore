const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const Warning = require("../../models/Warning");
const { sendLog } = require("../../services/logService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unwarn")
    .setDescription("Desactiver un avertissement.")
    .addStringOption((option) => option.setName("id").setDescription("ID du warn").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction, client) {
    const warning = await Warning.findById(interaction.options.getString("id", true));
    if (!warning) {
      await interaction.reply({ content: "Warn introuvable.", ephemeral: true });
      return;
    }

    warning.active = false;
    await warning.save();
    await sendLog(interaction.guild, client.runtimeConfig.channels?.moderationLog, "Warn retire", `Le warn ${warning.id} a ete retire par ${interaction.user.tag}.`);
    await interaction.reply({ content: "Warn desactive.", ephemeral: true });
  }
};
