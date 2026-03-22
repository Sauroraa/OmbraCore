const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, index: true },
    channelId: { type: String, required: true, unique: true },
    ticketNumber: { type: Number, required: true },
    authorId: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ["open", "closed", "deleted"], default: "open" },
    claimedBy: { type: String, default: null },
    claimedAt: { type: Date, default: null },
    members: { type: [String], default: [] },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    openedAt: { type: Date, default: Date.now },
    closedAt: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

ticketSchema.index({ guildId: 1, ticketNumber: 1 }, { unique: true });

module.exports = mongoose.model("Ticket", ticketSchema);
