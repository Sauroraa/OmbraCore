const Application = require("../models/Application");

async function getLatestApplicationByUser(guildId, userId) {
  return Application.findOne({ guildId, userId }).sort({ createdAt: -1 });
}

module.exports = { getLatestApplicationByUser };
