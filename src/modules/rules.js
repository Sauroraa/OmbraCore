const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const { ACCEPT_RULES, NEED_HELP } = require("../constants/customIds");
const { createBaseEmbed } = require("../utils/embeds");
const { markRulesAccepted } = require("../services/profileService");
const { sendLog } = require("../services/logService");
const { sendValidatedWelcome } = require("./welcome");

const FIXED_MEMBER_ROLE_ID = "1485315803350827118";
const VISITOR_ROLE_LABEL = "Visiteurs";

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
  const memberRoleId = FIXED_MEMBER_ROLE_ID;

  if (member.roles.cache.has(memberRoleId)) {
    await interaction.reply({ content: "Tu as deja valide le reglement.", ephemeral: true });
    return;
  }

  const roleChanges = [];

  if (config.roles?.unverified && member.roles.cache.has(config.roles.unverified)) {
    await member.roles.remove(config.roles.unverified).catch(() => null);
    roleChanges.push("Retrait du role Non verifie");
  }

  const assignedRole = await member.roles.add(memberRoleId).then(() => true).catch(() => false);
  roleChanges.push(
    assignedRole
      ? `Ajout du role ${VISITOR_ROLE_LABEL} (${memberRoleId})`
      : `Echec de l'ajout du role ${VISITOR_ROLE_LABEL} (${memberRoleId})`
  );

  if (config.roles?.candidate && member.roles.cache.has(config.roles.candidate)) {
    roleChanges.push("Conservation du role Candidat");
  }

  await markRulesAccepted(guild.id, member.id, member.roles.cache.map((role) => role.id));

  await sendLog(
    guild,
    config.channels?.rulesLog,
    "Reglement accepte",
    `${member.user.tag} a valide le reglement.`,
    [{ name: "Actions", value: roleChanges.join("\n") || "Aucune modification detectee." }],
    { category: "rules", level: "success" }
  );

  await sendValidatedWelcome(member, config);

  await member.send({
    embeds: [
      createBaseEmbed({
        title: "Accès validé • Società Ombra",
        description:
          "Ton accès au serveur a été validé avec succès.\nLe rôle **Visiteurs** t’a été attribué et les espaces autorisés sont désormais accessibles.",
        fields: [
          { name: "Rôle attribué", value: `<@&${memberRoleId}>`, inline: true },
          { name: "Statut", value: "Validation confirmée", inline: true },
          { name: "Suite", value: "Tu peux maintenant suivre les panneaux, ouvrir un ticket si nécessaire et consulter les espaces publics autorisés.", inline: false }
        ],
        color: 0x214428
      })
    ]
  }).catch(() => null);

  await interaction.reply({
    content: "Validation enregistrée. Le rôle Visiteurs a été attribué et un message privé a été envoyé.",
    ephemeral: true
  });
}

module.exports = {
  createRulesPanel,
  createRulesPanelFromConfig,
  acceptRules
};
