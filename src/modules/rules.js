const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const { ACCEPT_RULES, NEED_HELP } = require("../constants/customIds");
const { createBaseEmbed } = require("../utils/embeds");
const { markRulesAccepted } = require("../services/profileService");
const { sendLog } = require("../services/logService");

function createRulesPanel(config = {}) {
  return createRulesPanelFromConfig(config);
}

function createRulesPanelFromConfig(config) {
  const embed = createBaseEmbed({
    title: config.messages?.rulesTitle || "Reglement de Societa Ombra",
    description:
      config.messages?.rulesDescription ||
      "Lis attentivement le reglement du serveur. L'acces complet est reserve aux membres qui valident les regles.",
    fields: [
      { name: "Validation", value: "Cliquer sur le bouton pour acceder au serveur." },
      {
        name: "Sanctions",
        value:
          config.messages?.rulesSanctions ||
          "Le non-respect du reglement peut entrainer un avertissement, un mute ou un bannissement."
      }
    ],
    color: 0x101010
  });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(ACCEPT_RULES).setLabel("Accepter le reglement").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(NEED_HELP).setLabel("Besoin d'aide").setStyle(ButtonStyle.Secondary)
  );

  return { embeds: [embed], components: [row] };
}

async function acceptRules(interaction, config) {
  const member = interaction.member;
  const guild = interaction.guild;

  if (config.roles?.member && member.roles.cache.has(config.roles.member)) {
    await interaction.reply({ content: "Tu as deja valide le reglement.", ephemeral: true });
    return;
  }

  const roleChanges = [];

  if (config.roles?.unverified && member.roles.cache.has(config.roles.unverified)) {
    await member.roles.remove(config.roles.unverified).catch(() => null);
    roleChanges.push("Retrait du role Non verifie");
  }

  if (config.roles?.member) {
    await member.roles.add(config.roles.member).catch(() => null);
    roleChanges.push("Ajout du role Membre");
  }

  if (config.roles?.candidate && member.roles.cache.has(config.roles.candidate)) {
    roleChanges.push("Conservation du role Candidat");
  }

  await markRulesAccepted(guild.id, member.id, member.roles.cache.map((role) => role.id));

  await sendLog(
    guild,
    config.channels?.rulesLog,
    "Reglement accepte",
    `${member.user.tag} a valide le reglement.`,
    [{ name: "Actions", value: roleChanges.join("\n") || "Aucune modification detectee." }]
  );

  await interaction.reply({ content: "Validation enregistree. Bienvenue dans Societa Ombra.", ephemeral: true });
}

module.exports = {
  createRulesPanel,
  createRulesPanelFromConfig,
  acceptRules
};
