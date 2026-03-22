const { ensurePersistentTicketPanel } = require("../services/ticketPanelService");
const { ensurePersistentRulesPanel } = require("../services/rulesPanelService");
const { ensurePersistentRecruitmentPanel } = require("../services/recruitmentPanelService");

module.exports = {
  name: "clientReady",
  once: true,
  async execute(client) {
    client.user.setActivity("Societa Ombra");
    await ensurePersistentRulesPanel(client);
    await ensurePersistentTicketPanel(client);
    await ensurePersistentRecruitmentPanel(client);
  }
};
