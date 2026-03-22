const { createBaseEmbed } = require("../utils/embeds");
const { ensureUserProfile } = require("../services/profileService");
const { sendLog } = require("../services/logService");
const { createLogger } = require("../utils/logger");

const logger = createLogger("Welcome");

function createWelcomeEmbed(member, config) {
  const title = config.messages?.welcomeTitle || "Bienvenue au sein de Societa Ombra";
  const descriptionTemplate =
    config.messages?.welcomeDescription ||
    "Bienvenue {user}\nAvant d'acceder au serveur, prends connaissance du reglement et valide-le pour rejoindre officiellement la communaute.";
  const description = descriptionTemplate.replace("{user}", `${member}`);
  const rulesChannelMention = config.channels?.rules ? `<#${config.channels.rules}>` : "le salon reglement";
  const ambientLine =
    config.messages?.welcomeAmbientLine || "Une arrivee propre, un cadre serieux, une structure sous controle.";

  return createBaseEmbed({
    title,
    description,
    fields: [
      { name: "Etape 1", value: `Lire ${rulesChannelMention}`, inline: true },
      { name: "Etape 2", value: "Cliquer sur accepter", inline: true },
      { name: "Etape 3", value: "Acceder aux salons", inline: true },
      { name: "Ambiance", value: ambientLine, inline: false },
      { name: "Membres", value: `${member.guild.memberCount}`, inline: true }
    ],
    color: 0x141414
  }).setFooter({ text: config.brand?.footer || "OmbraCore • Societa Ombra" });
}

async function handleMemberJoin(member, config) {
  await ensureUserProfile(member.guild.id, member.id, {
    joinedAt: new Date()
  });

  if (config.roles?.unverified) {
    await member.roles.add(config.roles.unverified).catch(() => null);
  }

  const embed = createWelcomeEmbed(member, config);

  if (config.channels?.welcome) {
    const welcomeChannel = await member.guild.channels.fetch(config.channels.welcome).catch(() => null);
    if (welcomeChannel?.isTextBased()) {
      await welcomeChannel.send({ content: `${member}`, embeds: [embed] });
      logger.info(`Welcome message sent for ${member.user.tag} in ${config.channels.welcome}`);
    } else {
      logger.warn(`Welcome channel ${config.channels?.welcome || "undefined"} is invalid or inaccessible.`);
    }
  } else {
    logger.warn("Welcome channel is not configured.");
  }

  if (config.messages?.welcomeDmEnabled) {
    await member.send({ embeds: [embed] }).catch(() => null);
  }

  await sendLog(
    member.guild,
    config.channels?.joinLog,
    "Nouveau membre",
    `${member.user.tag} a rejoint le serveur.`,
    [{ name: "Utilisateur", value: `${member}`, inline: true }]
  );
}

module.exports = { handleMemberJoin, createWelcomeEmbed };
