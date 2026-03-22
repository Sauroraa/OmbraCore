const GuildConfig = require("../models/GuildConfig");
const defaultGuildConfig = require("../config/defaultGuildConfig");

async function loadRuntimeConfig() {
  const guildId = process.env.GUILD_ID;

  if (!guildId) {
    throw new Error("GUILD_ID is missing from environment variables.");
  }

  let config = await GuildConfig.findOne({ guildId });

  if (!config) {
    config = await GuildConfig.create({
      guildId,
      ...defaultGuildConfig
    });
  }

  return config;
}

module.exports = { loadRuntimeConfig };
