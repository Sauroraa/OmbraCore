const GuildConfig = require("../models/GuildConfig");
const { createRecruitmentPanel } = require("../modules/recruitment");

const FALLBACK_RECRUITMENT_PANEL_CHANNEL_ID = "1485333822210834452";

async function ensurePersistentRecruitmentPanel(client) {
  const guildId = process.env.GUILD_ID;
  const guild = await client.guilds.fetch(guildId).catch(() => null);

  if (!guild) {
    return;
  }

  const config = client.runtimeConfig;
  const channelId = config.channels?.recruitmentPanel || FALLBACK_RECRUITMENT_PANEL_CHANNEL_ID;

  if (!channelId) {
    return;
  }

  const channel = await guild.channels.fetch(channelId).catch(() => null);
  if (!channel?.isTextBased()) {
    return;
  }

  let message = null;
  const persistedMessageId = config.recruitment?.panelMessageId;

  if (persistedMessageId) {
    message = await channel.messages.fetch(persistedMessageId).catch(() => null);
  }

  const panelPayload = createRecruitmentPanel(config);

  if (message) {
    await message.edit(panelPayload).catch(() => null);
    return;
  }

  const sentMessage = await channel.send(panelPayload);

  await GuildConfig.updateOne(
    { guildId },
    {
      $set: {
        "channels.recruitmentPanel": channelId,
        "recruitment.panelMessageId": sentMessage.id
      }
    }
  );

  client.runtimeConfig.channels.recruitmentPanel = channelId;
  client.runtimeConfig.recruitment.panelMessageId = sentMessage.id;
}

module.exports = { ensurePersistentRecruitmentPanel };
