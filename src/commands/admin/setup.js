const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { createRecruitmentPanel } = require("../../modules/recruitment");
const { createRulesPanel } = require("../../modules/rules");
const { createTicketPanel } = require("../../modules/tickets");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Publier tous les panneaux principaux d'OmbraCore.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const rulesChannel =
      (client.runtimeConfig.channels?.rules && (await interaction.guild.channels.fetch(client.runtimeConfig.channels.rules).catch(() => null))) ||
      interaction.channel;
    const ticketChannel =
      (client.runtimeConfig.channels?.ticketPanel && (await interaction.guild.channels.fetch(client.runtimeConfig.channels.ticketPanel).catch(() => null))) ||
      interaction.channel;
    const recruitmentChannel =
      (client.runtimeConfig.channels?.recruitmentPanel &&
        (await interaction.guild.channels.fetch(client.runtimeConfig.channels.recruitmentPanel).catch(() => null))) ||
      interaction.channel;

    await rulesChannel.send(createRulesPanel(client.runtimeConfig));
    await ticketChannel.send(createTicketPanel(client.runtimeConfig));
    await recruitmentChannel.send(createRecruitmentPanel());
    await interaction.reply({ content: "Panneaux OmbraCore publies.", ephemeral: true });
  }
};
