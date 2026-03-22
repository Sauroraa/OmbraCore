const { EmbedBuilder } = require("discord.js");

const FIXED_LOG_CHANNEL_ID = "1485373295648964638";

const CATEGORY_META = {
  system: { color: 0x5865f2, label: "Système", icon: "🧠" },
  website: { color: 0x2d6a4f, label: "Site", icon: "🌐" },
  security: { color: 0x8b1e3f, label: "Sécurité", icon: "🛡️" },
  moderation: { color: 0xc97c1e, label: "Modération", icon: "⚖️" },
  recruitment: { color: 0x8c6a2f, label: "Recrutement", icon: "🧤" },
  ticket: { color: 0x376996, label: "Tickets", icon: "🎫" },
  rules: { color: 0x6e5d2d, label: "Règlement", icon: "📜" },
  role: { color: 0x6c4fb5, label: "Rôles", icon: "🪪" },
  command: { color: 0x4b5563, label: "Commandes", icon: "⌨️" },
  member: { color: 0x275d4d, label: "Membres", icon: "👤" },
  anonymous: { color: 0x5f3dc4, label: "Anonyme", icon: "🕶️" },
  general: { color: 0xc9a15d, label: "Journal", icon: "📌" }
};

const LEVEL_COLOR_OVERRIDES = {
  info: null,
  success: 0x2f855a,
  warning: 0xb7791f,
  error: 0xc53030,
  critical: 0x7f1d1d
};

function truncate(value, max = 1024) {
  if (value === undefined || value === null) {
    return "Non renseigné";
  }

  const stringValue = String(value);
  return stringValue.length > max ? `${stringValue.slice(0, max - 1)}…` : stringValue;
}

function normalizeFields(fields = []) {
  return fields
    .filter((field) => field && field.name && field.value !== undefined && field.value !== null)
    .slice(0, 25)
    .map((field) => ({
      name: truncate(field.name, 256),
      value: truncate(field.value, 1024),
      inline: Boolean(field.inline)
    }));
}

function buildErrorFields(error) {
  if (!error) {
    return [];
  }

  const fields = [
    { name: "Type d'erreur", value: truncate(error.name || "Error", 256), inline: true },
    { name: "Message", value: truncate(error.message || String(error), 1024), inline: false }
  ];

  if (error.code) {
    fields.push({ name: "Code", value: truncate(error.code, 256), inline: true });
  }

  if (error.stack) {
    fields.push({ name: "Stack", value: truncate(error.stack, 1024), inline: false });
  }

  return fields;
}

function inferCategory(title, description) {
  const haystack = `${title} ${description}`.toLowerCase();

  if (haystack.includes("site") || haystack.includes("oauth") || haystack.includes("portail") || haystack.includes("web")) return "website";
  if (haystack.includes("ticket")) return "ticket";
  if (haystack.includes("candidature") || haystack.includes("recrut")) return "recruitment";
  if (haystack.includes("ban") || haystack.includes("kick") || haystack.includes("mute") || haystack.includes("warn") || haystack.includes("automod") || haystack.includes("ghost ping")) return "moderation";
  if (haystack.includes("règlement") || haystack.includes("reglement")) return "rules";
  if (haystack.includes("rôle") || haystack.includes("role")) return "role";
  if (haystack.includes("commande")) return "command";
  if (haystack.includes("anonyme") || haystack.includes("/ano")) return "anonymous";
  if (haystack.includes("membre") || haystack.includes("bienvenue") || haystack.includes("départ") || haystack.includes("depart")) return "member";
  if (haystack.includes("exception") || haystack.includes("bootstrap") || haystack.includes("système") || haystack.includes("system")) return "system";
  return "general";
}

async function resolveLogChannel(guild) {
  if (!guild) {
    return null;
  }

  const channel = await guild.channels.fetch(FIXED_LOG_CHANNEL_ID).catch(() => null);
  if (!channel || !channel.isTextBased()) {
    return null;
  }

  return channel;
}

async function sendLog(guild, _channelId, title, description, fields = [], options = {}) {
  const channel = await resolveLogChannel(guild);
  if (!channel) {
    return null;
  }

  const category = options.category || inferCategory(title, description);
  const meta = CATEGORY_META[category] || CATEGORY_META.general;
  const level = options.level || "info";
  const color = LEVEL_COLOR_OVERRIDES[level] || meta.color;
  const normalizedFields = normalizeFields([
    { name: "Module", value: `${meta.icon} ${meta.label}`, inline: true },
    { name: "Niveau", value: level.toUpperCase(), inline: true },
    ...(options.scope ? [{ name: "Portée", value: truncate(options.scope, 256), inline: true }] : []),
    ...fields,
    ...buildErrorFields(options.error)
  ]);

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(`${meta.icon} ${title}`)
    .setDescription(truncate(description, 4096))
    .setFields(normalizedFields)
    .setFooter({ text: "OmbraCore • Journal central" })
    .setTimestamp();

  return channel.send({ embeds: [embed] }).catch(() => null);
}

async function sendErrorLog(guild, title, description, error, options = {}) {
  return sendLog(guild, null, title, description, options.fields || [], {
    ...options,
    level: options.level || "error",
    error
  });
}

module.exports = {
  FIXED_LOG_CHANNEL_ID,
  sendLog,
  sendErrorLog
};
