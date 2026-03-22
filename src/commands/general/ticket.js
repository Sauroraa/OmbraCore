const { SlashCommandBuilder } = require("discord.js");

const { createTicket, createTicketPanel } = require("../../modules/tickets");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Ouvrir un ticket ou afficher les types disponibles.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type de ticket")
        .addChoices(
          { name: "Support general", value: "support" },
          { name: "Contact direction", value: "direction" },
          { name: "Probleme membre", value: "member_report" },
          { name: "Ticket recrutement", value: "recruitment" },
          { name: "Ticket partenariat", value: "partnership" },
          { name: "Plainte RP", value: "rp_complaint" }
        )
    ),
  async execute(interaction, client) {
    const type = interaction.options.getString("type");

    if (!type) {
      await interaction.reply({ ...createTicketPanel(client.runtimeConfig), ephemeral: true });
      return;
    }

    await createTicket(interaction, client, type);
  }
};
