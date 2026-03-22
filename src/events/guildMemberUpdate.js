const { sendLog } = require("../services/logService");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember, client) {
    const oldRoles = new Set(oldMember.roles.cache.keys());
    const newRoles = new Set(newMember.roles.cache.keys());
    const added = [...newRoles].filter((roleId) => !oldRoles.has(roleId));
    const removed = [...oldRoles].filter((roleId) => !newRoles.has(roleId));

    if (!added.length && !removed.length) {
      return;
    }

    await sendLog(
      newMember.guild,
      client.runtimeConfig.channels?.rolesLog,
      "Roles modifies",
      `${newMember.user.tag} a eu une mise a jour de roles.`,
      [
        { name: "Ajoutes", value: added.map((roleId) => `<@&${roleId}>`).join(", ") || "Aucun" },
        { name: "Retires", value: removed.map((roleId) => `<@&${roleId}>`).join(", ") || "Aucun" }
      ]
    );
  }
};
