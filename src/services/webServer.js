const cookieParser = require("cookie-parser");
const express = require("express");

const { registerRecruitmentRoutes } = require("../web/recruitmentRoutes");
const { sendLog } = require("./logService");
const { createLogger } = require("../utils/logger");

const logger = createLogger("Web");

async function startWebServer(client) {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser(process.env.SESSION_SECRET));

  registerRecruitmentRoutes(app, client);

  const port = Number(process.env.WEB_PORT || 3000);

  await new Promise((resolve) => {
    app.listen(port, () => {
      logger.info(`Recruitment web portal listening on port ${port}`);
      resolve();
    });
  });

  const guild = await client.guilds.fetch(process.env.GUILD_ID).catch(() => null);
  if (guild) {
    await sendLog(
      guild,
      null,
      "Portail web démarré",
      `Le portail OmbraCore écoute maintenant sur le port ${port}.`,
      [{ name: "Base URL", value: process.env.WEB_BASE_URL || "https://societa.univers-bot.fr", inline: false }],
      { category: "website", level: "success", scope: "webServer" }
    );
  }
}

module.exports = { startWebServer };
