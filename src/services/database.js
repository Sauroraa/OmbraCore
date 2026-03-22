const mongoose = require("mongoose");

const { createLogger } = require("../utils/logger");

const logger = createLogger("Database");

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing from environment variables.");
  }

  await mongoose.connect(uri);
  logger.info("MongoDB connection established");
}

module.exports = { connectDatabase };
