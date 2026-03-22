const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");

const { loadCommands } = require("./loaders/commandLoader");
const { loadEvents } = require("./loaders/eventLoader");
const { connectDatabase } = require("./services/database");
const { startWebServer } = require("./services/webServer");
const { loadRuntimeConfig } = require("./services/runtimeConfig");
const { createLogger } = require("./utils/logger");

require("dotenv").config();

const logger = createLogger("Bootstrap");

function validateEnvironment() {
  const requiredKeys = ["DISCORD_TOKEN", "CLIENT_ID", "CLIENT_SECRET", "GUILD_ID", "MONGODB_URI", "SESSION_SECRET"];
  const missing = requiredKeys.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  if (!/^\d{17,20}$/.test(process.env.CLIENT_ID)) {
    throw new Error("CLIENT_ID must be a valid Discord snowflake.");
  }

  if (!/^\d{17,20}$/.test(process.env.GUILD_ID)) {
    throw new Error("GUILD_ID must be a valid Discord snowflake.");
  }
}

async function bootstrap() {
  validateEnvironment();

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.Message, Partials.Reaction, Partials.User]
  });

  client.commands = new Collection();
  client.runtimeConfig = null;

  await connectDatabase();
  client.runtimeConfig = await loadRuntimeConfig();

  loadCommands(client);
  loadEvents(client);
  await startWebServer(client);

  await client.login(process.env.DISCORD_TOKEN);
}

bootstrap().catch((error) => {
  logger.error("Fatal bootstrap failure", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  logger.error("Unhandled rejection", error);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", error);
});
