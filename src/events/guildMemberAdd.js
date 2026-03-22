const { handleMemberJoin } = require("../modules/welcome");

module.exports = {
  name: "guildMemberAdd",
  async execute(member, client) {
    await handleMemberJoin(member, client.runtimeConfig);
  }
};
