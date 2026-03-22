const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { createRulesPanel } = require("../../modules/rules");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setrules")
    .setDescription("Publier ou republier le panel de reglement.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const channel =
      (client.runtimeConfig.channels?.rules && (await interaction.guild.channels.fetch(client.runtimeConfig.channels.rules).catch(() => null))) ||
      interaction.channel;
    await channel.send(createRulesPanel(client.runtimeConfig));
    await interaction.reply({ content: "Panel reglement publie.", ephemeral: true });
  }
};
