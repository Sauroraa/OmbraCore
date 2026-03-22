const {
  applyRulesRole,
  removeRulesRole,
  resolveRulesReactionSettings
} = require("../services/reactionRoleService");
const { createLogger } = require("../utils/logger");

const logger = createLogger("ReactionRoleRaw");

module.exports = {
  name: "raw",
  async execute(packet, client) {
    if (!client?.runtimeConfig || !packet?.t || !packet?.d) {
      return;
    }

    if (packet.t !== "MESSAGE_REACTION_ADD" && packet.t !== "MESSAGE_REACTION_REMOVE") {
      return;
    }

    const settings = resolveRulesReactionSettings(client);
    if (
      packet.d.message_id !== settings.targetMessageId ||
      (settings.emoji.matchId
        ? packet.d.emoji?.id !== settings.emoji.matchId
        : packet.d.emoji?.name !== settings.emoji.matchName) ||
      !packet.d.guild_id ||
      !packet.d.user_id
    ) {
      return;
    }

    if (packet.d.user_id === client.user?.id) {
      return;
    }

    if (packet.t === "MESSAGE_REACTION_ADD") {
      const guild = await client.guilds.fetch(packet.d.guild_id).catch(() => null);
      if (!guild) {
        logger.warn(`Guild ${packet.d.guild_id} introuvable pour raw add.`);
        return;
      }

      await applyRulesRole(client, guild, packet.d.user_id, "raw", packet.d.message_id);
      return;
    }

    const guild = await client.guilds.fetch(packet.d.guild_id).catch(() => null);
    if (!guild) {
      logger.warn(`Guild ${packet.d.guild_id} introuvable pour raw remove.`);
      return;
    }

    await removeRulesRole(client, guild, packet.d.user_id, "raw");
  }
};
