const { EmbedBuilder } = require("discord.js");

const { sendLog } = require("../services/logService");
const { markRulesAccepted } = require("../services/profileService");
const { resolveRulesReactionSettings } = require("../services/reactionRoleService");
const { createLogger } = require("../utils/logger");

const logger = createLogger("ReactionRoleRaw");

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

async function addRulesRole(client, guildId, userId, messageId) {
  const guild = await client.guilds.fetch(guildId).catch(() => null);
  if (!guild) {
    logger.warn(`Guild ${guildId} introuvable pour reaction role raw.`);
    return;
  }

  const member = await guild.members.fetch(userId).catch(() => null);
  if (!member) {
    logger.warn(`Member ${userId} introuvable pour reaction role raw.`);
    return;
  }

  const { roleId } = resolveRulesReactionSettings(client);
  const role = await guild.roles.fetch(roleId).catch(() => null);
  if (!role) {
    logger.warn(`Rôle ${roleId} introuvable pour reaction role raw.`);
    return;
  }

  if (member.roles.cache.has(roleId)) {
    return;
  }

  const botMember = await guild.members.fetchMe().catch(() => null);
  if (!botMember) {
    return;
  }

  if (!botMember.permissions.has("ManageRoles")) {
    logger.warn("Le bot n'a pas la permission Gérer les rôles pour l'autorôle règlement.");
    return;
  }

  if (botMember.roles.highest.comparePositionTo(role) <= 0) {
    logger.warn(`Le rôle cible ${roleId} est au-dessus ou au même niveau que le rôle du bot.`);
    return;
  }

  const roleAdded = await member.roles.add(roleId).catch(() => null);
  if (!roleAdded) {
    logger.warn(`Échec d'ajout du rôle ${roleId} à ${member.user.tag} via raw event.`);
    return;
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

  logger.info(`Rôle ${roleId} ajouté à ${member.user.tag} via raw reaction event.`);

  await sendLog(
    guild,
    client.runtimeConfig.channels?.rolesLog,
    "Autorôle règlement",
    `${member.user.tag} a obtenu le rôle via réaction sur le message règlement.`,
    [
      { name: "Rôle", value: `<@&${roleId}>`, inline: true },
      { name: "Message", value: `\`${messageId}\``, inline: true }
    ]
  );
}

async function removeRulesRole(client, guildId, userId) {
  const guild = await client.guilds.fetch(guildId).catch(() => null);
  if (!guild) {
    return;
  }

  const member = await guild.members.fetch(userId).catch(() => null);
  if (!member) {
    return;
  }

  const { roleId } = resolveRulesReactionSettings(client);
  if (!member.roles.cache.has(roleId)) {
    return;
  }

  await member.roles.remove(roleId).catch(() => null);
  logger.info(`Rôle ${roleId} retiré à ${member.user.tag} via raw reaction event.`);

  await sendLog(
    guild,
    client.runtimeConfig.channels?.rolesLog,
    "Autorôle règlement retiré",
    `${member.user.tag} a perdu le rôle en retirant sa réaction du message règlement.`,
    [{ name: "Rôle", value: `<@&${roleId}>`, inline: true }]
  );
}

module.exports = {
  name: "raw",
  async execute(packet, client) {
    if (!client?.runtimeConfig || !packet?.t || !packet?.d) {
      return;
    }

    if (packet.t !== "MESSAGE_REACTION_ADD" && packet.t !== "MESSAGE_REACTION_REMOVE") {
      return;
    }

    const settings = resolveRulesReactionSettings(client);
    if (
      packet.d.message_id !== settings.targetMessageId ||
      packet.d.emoji?.name !== settings.emoji ||
      !packet.d.guild_id ||
      !packet.d.user_id
    ) {
      return;
    }

    if (packet.d.user_id === client.user?.id) {
      return;
    }

    if (packet.t === "MESSAGE_REACTION_ADD") {
      await addRulesRole(client, packet.d.guild_id, packet.d.user_id, packet.d.message_id);
      return;
    }

    await removeRulesRole(client, packet.d.guild_id, packet.d.user_id);
  }
};
