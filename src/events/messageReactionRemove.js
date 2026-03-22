const { fetchReactionContext, removeRulesRole } = require("../services/reactionRoleService");

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

    await removeRulesRole(client, context.guild, user.id, "messageReactionRemove");
  }
};
