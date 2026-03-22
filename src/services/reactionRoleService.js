const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const { sendLog } = require("./logService");
const { markRulesAccepted } = require("./profileService");
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

function createValidationDmEmbed(guild, member, roleId, config) {
  const guildIcon = guild.iconURL({ extension: "png", size: 256 }) || undefined;
  const rulesChannelMention = config.channels?.rules ? `<#${config.channels.rules}>` : "le salon règlement";

  return new EmbedBuilder()
    .setColor(config.brand?.primaryColor || 0x161616)
    .setAuthor({
      name: guild.name,
      iconURL: guildIcon
    })
    .setTitle("Validation enregistrée")
    .setDescription(
      [
        `Bonjour ${member},`,
        "",
        "Ta validation du règlement a bien été prise en compte.",
        "L’accès principal t’a été attribué et ton arrivée a été enregistrée proprement par OmbraCore."
      ].join("\n")
    )
    .addFields(
      { name: "Rôle attribué", value: `<@&${roleId}>`, inline: true },
      { name: "Serveur", value: guild.name, inline: true },
      { name: "Repère utile", value: `Référence : ${rulesChannelMention}`, inline: false }
    )
    .setFooter({
      text: config.brand?.footer || "OmbraCore • Società Ombra",
      iconURL: config.brand?.footerIcon || guildIcon
    })
    .setTimestamp();
}

async function applyRulesRole(client, guild, userId, sourceLabel, messageId) {
  if (!client?.runtimeConfig || !guild || !userId) {
    return false;
  }

  const { roleId } = resolveRulesReactionSettings(client);
  const member = await guild.members.fetch(userId).catch(() => null);
  if (!member) {
    logger.warn(`Member ${userId} introuvable pour autorôle règlement (${sourceLabel}).`);
    return false;
  }

  const role = await guild.roles.fetch(roleId).catch(() => null);
  if (!role) {
    logger.warn(`Rôle ${roleId} introuvable pour autorôle règlement (${sourceLabel}).`);
    return false;
  }

  if (member.roles.cache.has(roleId)) {
    logger.info(`Le membre ${member.user.tag} possède déjà le rôle ${roleId} (${sourceLabel}).`);
    return true;
  }

  const botMember = await guild.members.fetchMe().catch(() => null);
  if (!botMember) {
    logger.warn(`Impossible de récupérer le membre bot pour autorôle règlement (${sourceLabel}).`);
    return false;
  }

  if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
    logger.warn("Le bot n'a pas la permission Gérer les rôles pour l'autorôle règlement.");
    return false;
  }

  if (botMember.roles.highest.comparePositionTo(role) <= 0) {
    logger.warn(`Le rôle cible ${roleId} est au-dessus ou au même niveau que le rôle du bot.`);
    return false;
  }

  const roleAdded = await member.roles.add(roleId).catch((error) => {
    logger.warn(`Échec d'ajout du rôle ${roleId} à ${member.user.tag} (${sourceLabel}) : ${error.message}`);
    return null;
  });

  if (!roleAdded) {
    return false;
  }

  if (
    client.runtimeConfig.roles?.unverified &&
    member.roles.cache.has(client.runtimeConfig.roles.unverified)
  ) {
    await member.roles.remove(client.runtimeConfig.roles.unverified).catch(() => null);
  }

  await markRulesAccepted(
    guild.id,
    member.id,
    member.roles.cache.map((memberRole) => memberRole.id)
  );

  await member
    .send({
      embeds: [createValidationDmEmbed(guild, member, roleId, client.runtimeConfig)]
    })
    .catch(() => null);

  logger.info(`Rôle ${roleId} ajouté à ${member.user.tag} via ${sourceLabel}.`);

  await sendLog(
    guild,
    client.runtimeConfig.channels?.rolesLog,
    "Autorôle règlement",
    `${member.user.tag} a obtenu le rôle via réaction sur le message règlement.`,
    [
      { name: "Rôle", value: `<@&${roleId}>`, inline: true },
      { name: "Message", value: `\`${messageId}\``, inline: true },
      { name: "Source", value: sourceLabel, inline: true }
    ]
  );

  return true;
}

async function removeRulesRole(client, guild, userId, sourceLabel) {
  if (!client?.runtimeConfig || !guild || !userId) {
    return false;
  }

  const { roleId } = resolveRulesReactionSettings(client);
  const member = await guild.members.fetch(userId).catch(() => null);
  if (!member || !member.roles.cache.has(roleId)) {
    return false;
  }

  await member.roles.remove(roleId).catch(() => null);
  logger.info(`Rôle ${roleId} retiré à ${member.user.tag} via ${sourceLabel}.`);

  await sendLog(
    guild,
    client.runtimeConfig.channels?.rolesLog,
    "Autorôle règlement retiré",
    `${member.user.tag} a perdu le rôle en retirant sa réaction du message règlement.`,
    [{ name: "Rôle", value: `<@&${roleId}>`, inline: true }]
  );

  return true;
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

    if (client.rulesReactionCollector?.message?.id === message.id) {
      return;
    }

    client.rulesReactionCollector?.stop("refresh");
    client.rulesReactionCollector = message.createReactionCollector({
      dispose: true,
      filter: (reaction, user) => !user.bot && reaction.emoji.name === emoji
    });

    client.rulesReactionCollector.on("collect", async (_reaction, user) => {
      await applyRulesRole(client, guild, user.id, "collector", targetMessageId);
    });

    client.rulesReactionCollector.on("remove", async (_reaction, user) => {
      await removeRulesRole(client, guild, user.id, "collector");
    });

    logger.info(`Collector actif sur le message règlement ${targetMessageId}.`);
    return;
  }

  logger.warn(`Rules message ${targetMessageId} introuvable pour ajouter la reaction.`);
}

module.exports = {
  resolveRulesReactionSettings,
  applyRulesRole,
  removeRulesRole,
  fetchReactionContext,
  ensureRulesReaction
};
