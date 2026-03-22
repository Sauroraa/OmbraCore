const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    status: { type: String, enum: ["pending", "accepted", "refused", "on_hold"], default: "pending" },
    score: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    answers: {
      type: [
        {
          question: String,
          answer: String
        }
      ],
      default: []
    },
    reviewedBy: { type: String, default: null },
    reviewedAt: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Application", applicationSchema);
