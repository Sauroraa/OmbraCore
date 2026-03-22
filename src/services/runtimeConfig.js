const GuildConfig = require("../models/GuildConfig");
const defaultGuildConfig = require("../config/defaultGuildConfig");

function sanitizeLegacyConfig(config) {
  if (config?.tickets?.types?.recruitment) {
    delete config.tickets.types.recruitment;
  }

  return config;
}

function mergeDefaults(currentValue, defaultValue) {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(currentValue) && currentValue.length ? currentValue : defaultValue;
  }

  if (defaultValue && typeof defaultValue === "object") {
    const result = { ...(currentValue || {}) };

    for (const [key, value] of Object.entries(defaultValue)) {
      result[key] = mergeDefaults(result[key], value);
    }

    return result;
  }

  if (currentValue === undefined || currentValue === null || currentValue === "") {
    return defaultValue;
  }

  return currentValue;
}

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
    return sanitizeLegacyConfig(config);
  }

  const mergedConfig = {
    brand: mergeDefaults(config.brand?.toObject?.() || config.brand, defaultGuildConfig.brand),
    messages: mergeDefaults(config.messages?.toObject?.() || config.messages, defaultGuildConfig.messages),
    channels: mergeDefaults(config.channels?.toObject?.() || config.channels, defaultGuildConfig.channels),
    categories: mergeDefaults(config.categories?.toObject?.() || config.categories, defaultGuildConfig.categories),
    roles: mergeDefaults(config.roles?.toObject?.() || config.roles, defaultGuildConfig.roles),
    automod: mergeDefaults(config.automod?.toObject?.() || config.automod, defaultGuildConfig.automod),
    recruitment: mergeDefaults(config.recruitment?.toObject?.() || config.recruitment, defaultGuildConfig.recruitment),
    tickets: mergeDefaults(config.tickets?.toObject?.() || config.tickets, defaultGuildConfig.tickets),
    reactions: mergeDefaults(config.reactions?.toObject?.() || config.reactions, defaultGuildConfig.reactions)
  };

  Object.assign(config, mergedConfig);
  sanitizeLegacyConfig(config);
  await config.save();

  return config;
}

module.exports = { loadRuntimeConfig };
