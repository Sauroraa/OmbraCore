const { handleGhostPing } = require("../modules/automod");

module.exports = {
  name: "messageDelete",
  async execute(message, client) {
    await handleGhostPing(message, client);
  }
};
