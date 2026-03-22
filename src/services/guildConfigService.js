const GuildConfig = require("../models/GuildConfig");
const { loadRuntimeConfig } = require("./runtimeConfig");

async function getGuildConfig(guildId) {
  return GuildConfig.findOne({ guildId });
}

async function refreshClientConfig(client, guildId) {
  client.runtimeConfig = await loadRuntimeConfig(guildId);
  return client.runtimeConfig;
}

module.exports = {
  getGuildConfig,
  refreshClientConfig
};
