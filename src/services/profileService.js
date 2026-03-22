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

async function setRulesWelcomeMessage(guildId, userId, channelId, messageId) {
  return UserProfile.findOneAndUpdate(
    { guildId, userId },
    {
      $set: {
        rulesWelcomeChannelId: channelId || null,
        rulesWelcomeMessageId: messageId || null
      }
    },
    {
      new: true,
      upsert: true
    }
  );
}

async function getUserProfile(guildId, userId) {
  return UserProfile.findOne({ guildId, userId });
}

module.exports = {
  ensureUserProfile,
  markRulesAccepted,
  setRulesWelcomeMessage,
  getUserProfile
};
