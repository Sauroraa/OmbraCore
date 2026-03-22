const { EmbedBuilder } = require("discord.js");

function createBaseEmbed({ title, description, fields = [], color = 0x1c1c1c }) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFields(fields)
    .setFooter({ text: "OmbraCore • Societa Ombra" })
    .setTimestamp();
}

module.exports = { createBaseEmbed };
