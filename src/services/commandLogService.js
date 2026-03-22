const { sendLog } = require("./logService");

async function logCommand(interaction, client) {
  await sendLog(
    interaction.guild,
    client.runtimeConfig?.channels?.commandsLog,
    "Commande executee",
    `${interaction.user.tag} a utilise /${interaction.commandName}.`,
    [{ name: "Salon", value: `${interaction.channel}`, inline: true }]
  );
}

module.exports = { logCommand };
