const mongoose = require("mongoose");

const anonymousLogSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, index: true },
    authorId: { type: String, required: true, index: true },
    targetChannelId: { type: String, required: true },
    message: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    anonymousSignature: { type: Boolean, default: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("AnonymousLog", anonymousLogSchema);
