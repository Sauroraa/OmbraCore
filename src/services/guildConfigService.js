const GuildConfig = require("../models/GuildConfig");

async function getGuildConfig(guildId) {
  return GuildConfig.findOne({ guildId });
}

async function refreshClientConfig(client, guildId) {
  client.runtimeConfig = await getGuildConfig(guildId);
  return client.runtimeConfig;
}

module.exports = {
  getGuildConfig,
  refreshClientConfig
};
