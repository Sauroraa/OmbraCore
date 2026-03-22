const { sendLog } = require("../services/logService");
const { fetchReactionContext } = require("../services/reactionRoleService");

module.exports = {
  name: "messageReactionRemove",
  async execute(reaction, user, client) {
    if (user.bot) {
      return;
    }

    const context = await fetchReactionContext(reaction, client);
    if (!context) {
      return;
    }

    const member = await context.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      return;
    }

    if (member.roles.cache.has(context.roleId)) {
      await member.roles.remove(context.roleId).catch(() => null);
      await sendLog(
        context.guild,
        client.runtimeConfig.channels?.rolesLog,
        "Autorôle règlement retiré",
        `${user.tag} a perdu le rôle en retirant sa réaction du message règlement.`,
        [{ name: "Rôle", value: `<@&${context.roleId}>`, inline: true }]
      );
    }
  }
};
