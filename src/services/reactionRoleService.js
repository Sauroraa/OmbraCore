const { createLogger } = require("../utils/logger");

const logger = createLogger("ReactionRole");
const FALLBACK_RULES_MESSAGE_ID = "1485325130598060132";
const FALLBACK_RULES_ROLE_ID = "1485315803350827118";
const FALLBACK_RULES_EMOJI = "✅";

function resolveRulesReactionSettings(client) {
  const runtimeConfig = client?.runtimeConfig;

  return {
    targetMessageId:
      runtimeConfig?.reactions?.rulesMessageId || FALLBACK_RULES_MESSAGE_ID,
    roleId:
      runtimeConfig?.reactions?.rulesRoleId ||
      runtimeConfig?.roles?.rulesReactionRole ||
      FALLBACK_RULES_ROLE_ID,
    emoji: runtimeConfig?.reactions?.rulesEmoji || FALLBACK_RULES_EMOJI
  };
}

async function fetchReactionContext(reaction, client) {
  if (!reaction || !client?.runtimeConfig) {
    return null;
  }

  if (reaction.partial) {
    const hydratedReaction = await reaction.fetch().catch(() => null);
    if (!hydratedReaction) {
      return null;
    }
  }

  const { targetMessageId, roleId, emoji } = resolveRulesReactionSettings(client);

  if (!reaction.message?.guild || !targetMessageId || !roleId) {
    return null;
  }

  if (reaction.message.id !== targetMessageId) {
    return null;
  }

  if (reaction.emoji.name !== emoji) {
    return null;
  }

  return {
    guild: reaction.message.guild,
    roleId,
    emoji,
    targetMessageId
  };
}

async function ensureRulesReaction(client) {
  if (!client?.runtimeConfig) {
    logger.warn("Runtime config unavailable, impossible d'initialiser la réaction règlement.");
    return;
  }

  const guild = await client.guilds.fetch(process.env.GUILD_ID).catch(() => null);
  const { targetMessageId, roleId, emoji } = resolveRulesReactionSettings(client);

  if (!guild || !targetMessageId || !roleId) {
    return;
  }

  if (!client.runtimeConfig.reactions) {
    client.runtimeConfig.reactions = {};
  }
  if (!client.runtimeConfig.roles) {
    client.runtimeConfig.roles = {};
  }

  client.runtimeConfig.reactions.rulesMessageId = targetMessageId;
  client.runtimeConfig.reactions.rulesRoleId = roleId;
  client.runtimeConfig.reactions.rulesEmoji = emoji;
  client.runtimeConfig.roles.rulesReactionRole = roleId;

  const channels = await guild.channels.fetch().catch(() => null);
  if (!channels) {
    return;
  }

  for (const channel of channels.values()) {
    if (!channel?.isTextBased?.()) {
      continue;
    }

    const message = await channel.messages.fetch(targetMessageId).catch(() => null);
    if (!message) {
      continue;
    }

    const alreadyExists = message.reactions.cache.some((reaction) => reaction.emoji.name === emoji);
    if (!alreadyExists) {
      await message.react(emoji).catch(() => null);
      logger.info(`Reaction ${emoji} added to rules message ${targetMessageId}`);
    } else {
      logger.info(`Reaction ${emoji} already present on rules message ${targetMessageId}`);
    }
    return;
  }

  logger.warn(`Rules message ${targetMessageId} introuvable pour ajouter la reaction.`);
}

module.exports = {
  resolveRulesReactionSettings,
  fetchReactionContext,
  ensureRulesReaction
};
