const spamTracker = new Map();
const recentMentions = new Map();

function isUppercaseAbuse(content, threshold) {
  const letters = content.replace(/[^a-zA-Z]/g, "");
  if (letters.length < 8) {
    return false;
  }

  const uppercaseCount = letters.split("").filter((char) => char === char.toUpperCase()).length;
  return uppercaseCount / letters.length >= threshold;
}

function containsAnyLink(content) {
  return /(https?:\/\/|discord\.gg\/|discord\.com\/invite\/)/i.test(content);
}

async function handleAutomod(message, client) {
  if (!message.guild || message.author.bot) {
    return;
  }

  const config = client.runtimeConfig;
  const exemptRoleIds = config.automod?.exemptRoleIds || [];
  if (message.member?.roles.cache.some((role) => exemptRoleIds.includes(role.id))) {
    return;
  }

  const key = `${message.guild.id}:${message.author.id}`;
  const now = Date.now();
  const entry = spamTracker.get(key) || [];
  const recent = entry.filter((timestamp) => now - timestamp < (config.automod?.spamWindowMs || 8000));
  recent.push(now);
  spamTracker.set(key, recent);

  const content = message.content || "";
  const blockedWords = config.automod?.blockedWords || [];
  const blockedLinkPatterns = config.automod?.blockedLinkPatterns || [];
  const allowedLinkPatterns = config.automod?.allowedLinkPatterns || [];
  const mentionCount = message.mentions.users.size + message.mentions.roles.size;

  if (mentionCount > 0) {
    recentMentions.set(message.id, {
      authorId: message.author.id,
      mentions: [...message.mentions.users.keys(), ...message.mentions.roles.keys()],
      createdAt: now
    });
  }

  let reason = null;

  if (recent.length >= (config.automod?.spamThreshold || 5)) {
    reason = "Spam detecte";
  } else if (blockedWords.some((word) => content.toLowerCase().includes(word.toLowerCase()))) {
    reason = "Mot interdit detecte";
  } else if (
    containsAnyLink(content) &&
    !allowedLinkPatterns.some((pattern) => content.toLowerCase().includes(pattern.toLowerCase())) &&
    blockedLinkPatterns.some((pattern) => content.toLowerCase().includes(pattern.toLowerCase()))
  ) {
    reason = "Lien interdit detecte";
  } else if (mentionCount >= (config.automod?.mentionThreshold || 5)) {
    reason = "Mentions abusives";
  } else if (isUppercaseAbuse(content, config.automod?.capsThreshold || 0.7)) {
    reason = "Abus de majuscules";
  }

  if (!reason) {
    return;
  }

  await message.delete().catch(() => null);
  await message.member.timeout((config.automod?.timeoutMinutes || 10) * 60 * 1000, reason).catch(() => null);

  if (config.channels?.moderationLog) {
    const channel = await message.guild.channels.fetch(config.channels.moderationLog).catch(() => null);
    if (channel?.isTextBased()) {
      await channel.send(`Automod: ${message.author.tag} | ${reason} | ${content.slice(0, 1500) || "[message vide]"}`);
    }
  }
}

async function handleGhostPing(message, client) {
  if (!message.guild || !message.author || message.author.bot) {
    return;
  }

  const cached = recentMentions.get(message.id);
  if (!cached || !cached.mentions.length) {
    return;
  }

  const channel = await message.guild.channels.fetch(client.runtimeConfig.channels?.moderationLog).catch(() => null);
  if (channel?.isTextBased()) {
    await channel.send(`Ghost ping detecte: ${message.author.tag} a supprime un message avec mentions.`);
  }
}

module.exports = { handleAutomod, handleGhostPing };
