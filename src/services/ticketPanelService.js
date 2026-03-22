const GuildConfig = require("../models/GuildConfig");
const { createTicketPanel } = require("../modules/tickets");

const FALLBACK_TICKET_PANEL_CHANNEL_ID = "1485333822210834452";

async function ensurePersistentTicketPanel(client) {
  const guildId = process.env.GUILD_ID;
  const guild = await client.guilds.fetch(guildId).catch(() => null);

  if (!guild) {
    return;
  }

  const config = client.runtimeConfig;
  const channelId = config.channels?.ticketPanel || FALLBACK_TICKET_PANEL_CHANNEL_ID;

  if (!channelId) {
    return;
  }

  const channel = await guild.channels.fetch(channelId).catch(() => null);
  if (!channel?.isTextBased()) {
    return;
  }

  let message = null;

  if (config.tickets?.panelMessageId) {
    message = await channel.messages.fetch(config.tickets.panelMessageId).catch(() => null);
  }

  const panelPayload = createTicketPanel(config);

  if (message) {
    await message.edit(panelPayload).catch(() => null);
    return;
  }

  const sentMessage = await channel.send(panelPayload);

  await GuildConfig.updateOne(
    { guildId },
    {
      $set: {
        "channels.ticketPanel": channelId,
        "tickets.panelMessageId": sentMessage.id
      }
    }
  );

  client.runtimeConfig.channels.ticketPanel = channelId;
  client.runtimeConfig.tickets.panelMessageId = sentMessage.id;
}

module.exports = { ensurePersistentTicketPanel };
