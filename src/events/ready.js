const { ensurePersistentTicketPanel } = require("../services/ticketPanelService");

module.exports = {
  name: "clientReady",
  once: true,
  async execute(client) {
    client.user.setActivity("Societa Ombra");
    await ensurePersistentTicketPanel(client);
  }
};
