const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    status: { type: String, enum: ["pending", "accepted", "refused", "on_hold"], default: "pending" },
    score: { type: Number, default: 0 },
    quizScore: { type: Number, default: 0 },
    ageIrl: { type: Number, default: null },
    notes: { type: String, default: "" },
    autoRefused: { type: Boolean, default: false },
    locked: { type: Boolean, default: false },
    refusalCode: { type: String, default: null },
    answers: {
      type: [
        {
          question: String,
          answer: String
        }
      ],
      default: []
    },
    interviewScheduledFor: { type: Date, default: null },
    interviewMessage: { type: String, default: "" },
    adminHidden: { type: Boolean, default: false },
    hiddenAt: { type: Date, default: null },
    reviewedBy: { type: String, default: null },
    reviewedAt: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Application", applicationSchema);
