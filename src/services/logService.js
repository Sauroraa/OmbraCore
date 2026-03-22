const { EmbedBuilder } = require("discord.js");

async function sendLog(guild, channelId, title, description, fields = []) {
  if (!channelId) {
    return null;
  }

  const channel = await guild.channels.fetch(channelId).catch(() => null);

  if (!channel || !channel.isTextBased()) {
    return null;
  }

  const embed = new EmbedBuilder()
    .setColor(0xc9a227)
    .setTitle(title)
    .setDescription(description)
    .setFields(fields)
    .setFooter({ text: "OmbraCore • Societa Ombra" })
    .setTimestamp();

  return channel.send({ embeds: [embed] });
}

module.exports = { sendLog };
