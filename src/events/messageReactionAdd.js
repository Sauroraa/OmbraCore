const { sendLog } = require("../services/logService");
const { createLogger } = require("../utils/logger");

const logger = createLogger("ReactionRole");

module.exports = {
  name: "messageReactionAdd",
  async execute(reaction, user, client) {
    if (user.bot) {
      return;
    }

    if (reaction.partial) {
      await reaction.fetch().catch(() => null);
    }

    const config = client.runtimeConfig;
    const targetMessageId = config.reactions?.rulesMessageId;
    const roleId = config.reactions?.rulesRoleId || config.roles?.rulesReactionRole;

    if (!reaction.message.guild || !targetMessageId || !roleId) {
      return;
    }

    if (reaction.message.id !== targetMessageId) {
      return;
    }

    const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      return;
    }

    if (!member.roles.cache.has(roleId)) {
      await member.roles.add(roleId).catch(() => null);
      logger.info(`Role ${roleId} attribue a ${user.tag} via reaction sur ${targetMessageId}`);
      await sendLog(
        reaction.message.guild,
        config.channels?.rolesLog,
        "Autorôle règlement",
        `${user.tag} a obtenu le rôle via réaction sur le message règlement.`,
        [{ name: "Rôle", value: `<@&${roleId}>`, inline: true }]
      );
    }
  }
};
