const { sendLog } = require("./logService");

async function logCommand(interaction, client) {
  await sendLog(
    interaction.guild,
    client.runtimeConfig?.channels?.commandsLog,
    "Commande executee",
    `${interaction.user.tag} a utilise /${interaction.commandName}.`,
    [
      { name: "Utilisateur", value: `${interaction.user}`, inline: true },
      { name: "Salon", value: `${interaction.channel}`, inline: true }
    ],
    { category: "command", level: "info" }
  );
}

module.exports = { logCommand };
