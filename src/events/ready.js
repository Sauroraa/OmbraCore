const { ensurePersistentTicketPanel } = require("../services/ticketPanelService");
const { ensureRulesReaction } = require("../services/reactionRoleService");

module.exports = {
  name: "clientReady",
  once: true,
  async execute(client) {
    client.user.setActivity("Societa Ombra");
    await ensurePersistentTicketPanel(client);
    await ensureRulesReaction(client);
  }
};
