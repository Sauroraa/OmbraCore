const cookieParser = require("cookie-parser");
const express = require("express");

const { registerRecruitmentRoutes } = require("../web/recruitmentRoutes");
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
}

module.exports = { startWebServer };
