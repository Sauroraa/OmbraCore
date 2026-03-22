const { handleAutomod } = require("../modules/automod");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    await handleAutomod(message, client);
  }
};
