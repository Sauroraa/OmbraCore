const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const { ensureUserProfile } = require("../services/profileService");
const { sendLog } = require("../services/logService");
const { createLogger } = require("../utils/logger");

const logger = createLogger("Welcome");

function formatTemplate(template, member, config) {
  const rulesChannelMention = config.channels?.rules
    ? `<#${config.channels.rules}>`
    : "`#règlement`";

  return template
    .replace(/\{user\}/g, `${member}`)
    .replace(/\{username\}/g, member.user.username)
    .replace(/\{tag\}/g, member.user.tag)
    .replace(/\{server\}/g, member.guild.name)
    .replace(/\{count\}/g, `${member.guild.memberCount}`)
    .replace(/\{rules\}/g, rulesChannelMention);
}

function getWelcomeTexts(member, config) {
  const title = config.messages?.welcomeTitle || "Bienvenue dans l’ombre";
  const descriptionTemplate =
    config.messages?.welcomeDescription ||
    [
      "Bienvenue {user} au sein de **{server}**.",
      "",
      "Avant d’accéder à l’ensemble du serveur, prends connaissance du règlement et valide ton accès pour rejoindre officiellement la structure.",
      "",
      "> Ici, chaque entrée compte. Le cadre passe avant tout."
    ].join("\n");

  return {
    title,
    description: formatTemplate(descriptionTemplate, member, config),
    ambientLine:
      config.messages?.welcomeAmbientLine ||
      "Une arrivée discrète. Un cadre sérieux. Une structure sous contrôle.",
    rulesLabel: config.messages?.welcomeRulesLabel || "Lire le règlement",
    validateLabel: config.messages?.welcomeValidateLabel || "Valider l’accès",
    accessLabel: config.messages?.welcomeAccessLabel || "Débloquer les salons",
    guidanceTitle: config.messages?.welcomeGuidanceTitle || "Parcours d’intégration",
    guidanceText:
      config.messages?.welcomeGuidanceText ||
      "Prends le temps de lire, valider et t’orienter. Une entrée propre facilite tout le reste.",
    orientationTitle: config.messages?.welcomeOrientationTitle || "Repères",
    orientationText:
      config.messages?.welcomeOrientationText ||
      "Le staff conserve une traçabilité complète des validations et accompagne les nouveaux membres si nécessaire."
  };
}

function buildFooter(config, guild, fallbackIconUrl) {
  return {
    text: config.brand?.footer || "OmbraCore • Società Ombra",
    iconURL:
      config.brand?.footerIcon ||
      guild.iconURL({ extension: "png", size: 128 }) ||
      fallbackIconUrl ||
      undefined
  };
}

function createWelcomeEmbeds(member, config) {
  const texts = getWelcomeTexts(member, config);
  const rulesChannelMention = config.channels?.rules
    ? `<#${config.channels.rules}>`
    : "`#règlement`";
  const avatarUrl = member.user.displayAvatarURL({
    extension: "png",
    size: 512,
    forceStatic: false
  });
  const guildIcon =
    member.guild.iconURL({ extension: "png", size: 256 }) || avatarUrl;
  const color = config.brand?.primaryColor || 0x161616;

  const heroEmbed = new EmbedBuilder()
    .setColor(color)
    .setAuthor({
      name: member.guild.name,
      iconURL: guildIcon
    })
    .setTitle(`✦ ${texts.title}`)
    .setDescription(texts.description)
    .addFields(
      {
        name: "① Lecture",
        value: `${texts.rulesLabel}\n${rulesChannelMention}`,
        inline: true
      },
      {
        name: "② Validation",
        value: `${texts.validateLabel}\nAccepte le règlement`,
        inline: true
      },
      {
        name: "③ Accès",
        value: `${texts.accessLabel}\nLes salons privés s’ouvrent ensuite`,
        inline: true
      },
      {
        name: "Présence",
        value: `${member}`,
        inline: true
      },
      {
        name: "Identité",
        value: `\`${member.user.tag}\``,
        inline: true
      },
      {
        name: "Population",
        value: `\`${member.guild.memberCount}\` membres`,
        inline: true
      },
      {
        name: "Atmosphère",
        value: `> ${texts.ambientLine}`,
        inline: false
      }
    )
    .setThumbnail(avatarUrl)
    .setFooter(buildFooter(config, member.guild, guildIcon))
    .setTimestamp();

  if (config.images?.welcomeBanner) {
    heroEmbed.setImage(config.images.welcomeBanner);
  }

  const guidanceEmbed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`⟡ ${texts.guidanceTitle}`)
    .setDescription(texts.guidanceText)
    .addFields(
      {
        name: "Point de départ",
        value: rulesChannelMention,
        inline: true
      },
      {
        name: "Validation requise",
        value: "Le rôle membre est attribué après acceptation.",
        inline: true
      },
      {
        name: texts.orientationTitle,
        value: texts.orientationText,
        inline: false
      }
    )
    .setFooter(buildFooter(config, member.guild, guildIcon))
    .setTimestamp();

  return [heroEmbed, guidanceEmbed];
}

function createWelcomeEmbed(member, config) {
  return createWelcomeEmbeds(member, config)[0];
}

function createWelcomeComponents(config) {
  const row = new ActionRowBuilder();

  if (config.channels?.rules) {
    row.addComponents(
      new ButtonBuilder()
        .setLabel(config.messages?.rulesButtonLabel || "Voir le règlement")
        .setStyle(ButtonStyle.Link)
        .setURL(
          config.messages?.rulesButtonUrl ||
            `https://discord.com/channels/${config.guildId || "@me"}/${config.channels.rules}`
        )
    );
  }

  if (config.messages?.welcomeInviteButtonUrl) {
    row.addComponents(
      new ButtonBuilder()
        .setLabel(
          config.messages?.welcomeInviteButtonLabel || "Découvrir la structure"
        )
        .setStyle(ButtonStyle.Link)
        .setURL(config.messages.welcomeInviteButtonUrl)
    );
  }

  return row.components.length ? [row] : [];
}

async function safeAddRole(member, roleId) {
  if (!roleId) {
    return false;
  }

  try {
    await member.roles.add(roleId);
    return true;
  } catch (error) {
    logger.warn(`Unable to add role ${roleId} to ${member.user.tag}: ${error.message}`);
    return false;
  }
}

async function safeSendDM(member, payload) {
  try {
    await member.send(payload);
    return true;
  } catch (error) {
    logger.warn(`Unable to DM ${member.user.tag}: ${error.message}`);
    return false;
  }
}

async function safeSendChannelMessage(channel, payload, contextLabel) {
  try {
    await channel.send(payload);
    return true;
  } catch (error) {
    logger.warn(`Failed to send ${contextLabel}: ${error.message}`);
    return false;
  }
}

async function handleMemberJoin(member, config) {
  try {
    await ensureUserProfile(member.guild.id, member.id, {
      joinedAt: new Date(),
      acceptedRules: false
    });

    await safeAddRole(member, config.roles?.unverified);

    const embeds = createWelcomeEmbeds(member, config);
    const components = createWelcomeComponents(config);

    if (config.channels?.welcome) {
      const welcomeChannel = await member.guild.channels
        .fetch(config.channels.welcome)
        .catch(() => null);

      if (welcomeChannel?.isTextBased()) {
        await safeSendChannelMessage(
          welcomeChannel,
          {
            content: `${member}`,
            embeds,
            components
          },
          `welcome message for ${member.user.tag}`
        );

        logger.info(
          `Welcome message sent for ${member.user.tag} in ${config.channels.welcome}`
        );
      } else {
        logger.warn(
          `Welcome channel ${config.channels?.welcome || "undefined"} is invalid or inaccessible.`
        );
      }
    } else {
      logger.warn("Welcome channel is not configured.");
    }

    if (config.messages?.welcomeDmEnabled) {
      await safeSendDM(member, {
        embeds,
        components
      });
    }

    await sendLog(
      member.guild,
      config.channels?.joinLog,
      "Nouveau membre",
      `${member.user.tag} a rejoint le serveur.`,
      [
        { name: "Utilisateur", value: `${member}`, inline: true },
        { name: "Identifiant", value: `\`${member.id}\``, inline: true },
        {
          name: "Compte créé",
          value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`,
          inline: false
        }
      ]
    );
  } catch (error) {
    logger.error(`handleMemberJoin failed for ${member.user.tag}: ${error.stack || error.message}`);
  }
}

module.exports = { handleMemberJoin, createWelcomeEmbed };
