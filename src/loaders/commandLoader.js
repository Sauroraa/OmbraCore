const fs = require("node:fs");
const path = require("node:path");

function loadCommands(client) {
  const commandsPath = path.join(__dirname, "..", "commands");
  const folders = fs.readdirSync(commandsPath, { withFileTypes: true }).filter((entry) => entry.isDirectory());

  for (const folder of folders) {
    const folderPath = path.join(commandsPath, folder.name);
    const files = fs.readdirSync(folderPath).filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const command = require(path.join(folderPath, file));
      client.commands.set(command.data.name, command);
    }
  }
}

module.exports = { loadCommands };
