const { applyRulesRole, fetchReactionContext } = require("../services/reactionRoleService");

module.exports = {
  name: "messageReactionAdd",
  async execute(reaction, user, client) {
    if (user.bot) {
      return;
    }

    const context = await fetchReactionContext(reaction, client);
    if (!context) {
      return;
    }

    await applyRulesRole(client, context.guild, user.id, "messageReactionAdd", context.targetMessageId);
  }
};
