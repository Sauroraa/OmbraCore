const { createLogger } = require("../utils/logger");

const logger = createLogger("ReactionRole");

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

  const config = client.runtimeConfig;
  const targetMessageId = config.reactions?.rulesMessageId;
  const roleId = config.reactions?.rulesRoleId || config.roles?.rulesReactionRole;
  const emoji = config.reactions?.rulesEmoji || "✅";

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
  const targetMessageId = client.runtimeConfig?.reactions?.rulesMessageId;
  const emoji = client.runtimeConfig?.reactions?.rulesEmoji || "✅";

  if (!guild || !targetMessageId) {
    return;
  }

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
    }
    return;
  }

  logger.warn(`Rules message ${targetMessageId} introuvable pour ajouter la reaction.`);
}

module.exports = {
  fetchReactionContext,
  ensureRulesReaction
};
