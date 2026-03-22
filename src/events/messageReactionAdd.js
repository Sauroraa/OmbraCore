const { EmbedBuilder } = require("discord.js");

const { sendLog } = require("../services/logService");
const { markRulesAccepted } = require("../services/profileService");
const { fetchReactionContext } = require("../services/reactionRoleService");
const { createLogger } = require("../utils/logger");

const logger = createLogger("ReactionRole");

function createValidationDmEmbed(guild, member, roleId, config) {
  const guildIcon = guild.iconURL({ extension: "png", size: 256 }) || undefined;
  const rulesChannelMention = config.channels?.rules ? `<#${config.channels.rules}>` : "le salon règlement";

  return new EmbedBuilder()
    .setColor(config.brand?.primaryColor || 0x161616)
    .setAuthor({
      name: guild.name,
      iconURL: guildIcon
    })
    .setTitle("Validation enregistrée")
    .setDescription(
      [
        `Bonjour ${member},`,
        "",
        "Ta validation du règlement a bien été prise en compte.",
        "L’accès principal t’a été attribué et ton arrivée a été enregistrée proprement par OmbraCore."
      ].join("\n")
    )
    .addFields(
      {
        name: "Rôle attribué",
        value: `<@&${roleId}>`,
        inline: true
      },
      {
        name: "Serveur",
        value: guild.name,
        inline: true
      },
      {
        name: "Repère utile",
        value: `Référence : ${rulesChannelMention}`,
        inline: false
      }
    )
    .setFooter({
      text: config.brand?.footer || "OmbraCore • Società Ombra",
      iconURL: config.brand?.footerIcon || guildIcon
    })
    .setTimestamp();
}

module.exports = {
  name: "messageReactionAdd",
  async execute(reaction, user, client) {
    if (user.bot) {
      return;
    }

    const context = await fetchReactionContext(reaction, client);
    if (!context) {
      return;
    }

    const member = await context.guild.members.fetch(user.id).catch(() => null);
    if (!member) {
      logger.warn(`Member ${user.id} introuvable pour reaction role.`);
      return;
    }

    if (!member.roles.cache.has(context.roleId)) {
      const role = await context.guild.roles.fetch(context.roleId).catch(() => null);
      if (!role) {
        return;
      }

      const botMember = await context.guild.members.fetchMe().catch(() => null);
      if (!botMember) {
        return;
      }

      if (!botMember.permissions.has("ManageRoles")) {
        logger.warn("Le bot n'a pas la permission Gérer les rôles pour l'autorôle règlement.");
        return;
      }

      if (botMember.roles.highest.comparePositionTo(role) <= 0) {
        logger.warn(
          `Le rôle cible ${context.roleId} est au-dessus ou au même niveau que le rôle du bot.`
        );
        return;
      }

      const roleAdded = await member.roles.add(context.roleId).catch(() => null);
      if (!roleAdded) {
        logger.warn(`Échec d'ajout du rôle ${context.roleId} à ${user.tag}.`);
        return;
      }

      if (
        client.runtimeConfig.roles?.unverified &&
        member.roles.cache.has(client.runtimeConfig.roles.unverified)
      ) {
        await member.roles.remove(client.runtimeConfig.roles.unverified).catch(() => null);
      }

      await markRulesAccepted(
        context.guild.id,
        member.id,
        member.roles.cache.map((role) => role.id)
      );

      await member
        .send({
          embeds: [createValidationDmEmbed(context.guild, member, context.roleId, client.runtimeConfig)]
        })
        .catch(() => null);

      logger.info(`Rôle ${context.roleId} ajouté à ${user.tag} via réaction règlement.`);

      await sendLog(
        context.guild,
        client.runtimeConfig.channels?.rolesLog,
        "Autorôle règlement",
        `${user.tag} a obtenu le rôle via réaction sur le message règlement.`,
        [
          { name: "Rôle", value: `<@&${context.roleId}>`, inline: true },
          { name: "Message", value: `\`${context.targetMessageId}\``, inline: true }
        ]
      );
    }
  }
};
