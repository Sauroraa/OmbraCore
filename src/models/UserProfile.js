const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    joinedAt: { type: Date, default: Date.now },
    rulesAcceptedAt: { type: Date, default: null },
    rolesSnapshot: { type: [String], default: [] },
    rulesWelcomeMessageId: { type: String, default: null },
    rulesWelcomeChannelId: { type: String, default: null },
    anonymousCooldownUntil: { type: Date, default: null },
    automodStrikes: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

userProfileSchema.index({ guildId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("UserProfile", userProfileSchema);
