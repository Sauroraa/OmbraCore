const mongoose = require("mongoose");

const guildConfigSchema = new mongoose.Schema(
  {
    guildId: {
      type: String,
      required: true,
      unique: true
    },
    brand: {
      name: { type: String, default: "OmbraCore" },
      footer: { type: String, default: "OmbraCore • Societa Ombra" }
    },
    messages: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    channels: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    categories: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    roles: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    automod: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    recruitment: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    tickets: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("GuildConfig", guildConfigSchema);
