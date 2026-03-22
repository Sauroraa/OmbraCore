const UserProfile = require("../models/UserProfile");

async function ensureUserProfile(guildId, userId, payload = {}) {
  return UserProfile.findOneAndUpdate(
    { guildId, userId },
    {
      $setOnInsert: {
        guildId,
        userId,
        ...payload
      }
    },
    {
      new: true,
      upsert: true
    }
  );
}

async function markRulesAccepted(guildId, userId, rolesSnapshot = []) {
  return UserProfile.findOneAndUpdate(
    { guildId, userId },
    {
      $set: {
        rulesAcceptedAt: new Date(),
        rolesSnapshot
      }
    },
    {
      new: true,
      upsert: true
    }
  );
}

module.exports = {
  ensureUserProfile,
  markRulesAccepted
};
