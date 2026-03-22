const GuildConfig = require("../models/GuildConfig");
const { createRulesPanel } = require("../modules/rules");

const FALLBACK_RULES_CHANNEL_ID = "1485315733318668359";

async function ensurePersistentRulesPanel(client) {
  const guildId = process.env.GUILD_ID;
  const guild = await client.guilds.fetch(guildId).catch(() => null);

  if (!guild) {
    return;
  }

  const config = client.runtimeConfig;
  const channelId = config.channels?.rules || FALLBACK_RULES_CHANNEL_ID;

  if (!channelId) {
    return;
  }

  const channel = await guild.channels.fetch(channelId).catch(() => null);
  if (!channel?.isTextBased()) {
    return;
  }

  let message = null;
  const persistedMessageId = config.messages?.rulesPanelMessageId;

  if (persistedMessageId) {
    message = await channel.messages.fetch(persistedMessageId).catch(() => null);
  }

  const panelPayload = createRulesPanel(config);

  if (message) {
    await message.edit(panelPayload).catch(() => null);
    return;
  }

  const sentMessage = await channel.send(panelPayload);

  await GuildConfig.updateOne(
    { guildId },
    {
      $set: {
        "channels.rules": channelId,
        "messages.rulesPanelMessageId": sentMessage.id
      }
    }
  );

  client.runtimeConfig.channels.rules = channelId;
  client.runtimeConfig.messages.rulesPanelMessageId = sentMessage.id;
}

module.exports = { ensurePersistentRulesPanel };
