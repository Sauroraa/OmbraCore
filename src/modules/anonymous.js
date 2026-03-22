const AnonymousLog = require("../models/AnonymousLog");
const UserProfile = require("../models/UserProfile");
const { createBaseEmbed } = require("../utils/embeds");
const { sendLog } = require("../services/logService");

const ANONYMOUS_COOLDOWN_SECONDS = 3;

async function submitAnonymousMessage(interaction, client) {
  const config = client.runtimeConfig;
  const guildId = interaction.guild.id;
  const authorId = interaction.user.id;
  const targetChannelId = interaction.channelId;
  const priority = "medium";
  const anonymousSignature = true;
  const message = interaction.options.getString("message", true).trim();
  const blockedWords = config.automod?.blockedWords || [];
  const restrictedRoles = [config.roles?.unverified].filter(Boolean);

  if (interaction.member.roles.cache.some((role) => restrictedRoles.includes(role.id))) {
    await interaction.reply({ content: "Tu dois valider le reglement avant d'utiliser /ano.", ephemeral: true });
    return;
  }

  const profile = await UserProfile.findOne({ guildId, userId: authorId });
  if (profile?.anonymousCooldownUntil && profile.anonymousCooldownUntil > new Date()) {
    await interaction.reply({ content: "Cooldown actif pour /ano.", ephemeral: true });
    return;
  }

  if (blockedWords.some((word) => message.toLowerCase().includes(word.toLowerCase()))) {
    await interaction.reply({ content: "Le message contient un terme bloque.", ephemeral: true });
    return;
  }

  if (message.includes("@everyone") || message.includes("@here")) {
    await interaction.reply({ content: "Les mentions globales sont interdites dans /ano.", ephemeral: true });
    return;
  }

  const targetChannel = await interaction.guild.channels.fetch(targetChannelId).catch(() => null);
  if (!targetChannel?.isTextBased()) {
    await interaction.reply({ content: "Salon cible invalide.", ephemeral: true });
    return;
  }

  const embed = createBaseEmbed({
    title: "Transmission anonyme",
    description: message,
    fields: [
      { name: "Canal", value: "Diffusion sécurisée dans ce salon", inline: true },
      { name: "Statut", value: "Origine masquée pour les membres", inline: true }
    ],
    color: 0x171717
  }).setFooter({ text: "OmbraCore • Transmission sécurisée" });

  await targetChannel.send({ embeds: [embed] });

  await AnonymousLog.create({
    guildId,
    authorId,
    targetChannelId,
    message,
    priority,
    anonymousSignature
  });

  await UserProfile.findOneAndUpdate(
    { guildId, userId: authorId },
    {
      $set: {
        anonymousCooldownUntil: new Date(Date.now() + ANONYMOUS_COOLDOWN_SECONDS * 1000)
      }
    },
    { upsert: true }
  );

  await sendLog(
    interaction.guild,
    config.channels?.anonymousLog,
    "Message anonyme tracé",
    `${interaction.user.tag} a utilise /ano.`,
    [
      { name: "Salon cible", value: `<#${targetChannelId}>`, inline: true },
      { name: "Contenu", value: message.slice(0, 1024) }
    ]
  );

  await interaction.reply({ content: "Transmission anonyme effectuée.", ephemeral: true });
}

module.exports = {
  submitAnonymousMessage
};
