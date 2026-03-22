const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");

require("dotenv").config();

const commands = [];
const commandsPath = path.join(__dirname, "..", "commands");
const folders = fs.readdirSync(commandsPath, { withFileTypes: true }).filter((entry) => entry.isDirectory());

for (const folder of folders) {
  const folderPath = path.join(commandsPath, folder.name);
  const commandFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(path.join(folderPath, file));
    commands.push(command.data.toJSON());
  }
}

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );

  console.log(`Registered ${commands.length} commands.`);
}

registerCommands().catch((error) => {
  console.error(error);
  process.exit(1);
});
