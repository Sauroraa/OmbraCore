const { sendLog } = require("../services/logService");

module.exports = {
  name: "guildMemberRemove",
  async execute(member, client) {
    await sendLog(member.guild, client.runtimeConfig.channels?.farewellLog || client.runtimeConfig.channels?.joinLog, "Depart membre", `${member.user.tag} a quitte le serveur.`);
  }
};
