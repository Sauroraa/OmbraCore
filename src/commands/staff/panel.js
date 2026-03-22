const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const { createRecruitmentPanel } = require("../../modules/recruitment");
const { createRulesPanel } = require("../../modules/rules");
const { createTicketPanel } = require("../../modules/tickets");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panel")
    .setDescription("Publier un panel OmbraCore.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type de panel")
        .setRequired(true)
        .addChoices(
          { name: "Reglement", value: "rules" },
          { name: "Tickets", value: "tickets" },
          { name: "Recrutement", value: "recruitment" },
          { name: "Tous", value: "all" }
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction, client) {
    const type = interaction.options.getString("type", true);

    if (type === "rules" || type === "all") {
      await interaction.channel.send(createRulesPanel(client.runtimeConfig));
    }

    if (type === "tickets" || type === "all") {
      await interaction.channel.send(createTicketPanel(client.runtimeConfig));
    }

    if (type === "recruitment" || type === "all") {
      await interaction.channel.send(createRecruitmentPanel());
    }

    await interaction.reply({ content: `Panel ${type} publie.`, ephemeral: true });
  }
};
