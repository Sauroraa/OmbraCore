const { ChannelType, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

const GuildConfig = require("../../models/GuildConfig");
const { refreshClientConfig } = require("../../services/guildConfigService");
const defaultGuildConfig = require("../../config/defaultGuildConfig");

const channelKeys = [
  "welcome",
  "rules",
  "validation",
  "ticketPanel",
  "recruitmentPanel",
  "farewellLog",
  "applicationsLog",
  "joinLog",
  "rulesLog",
  "ticketsLog",
  "anonymousLog",
  "moderationLog",
  "rolesLog",
  "commandsLog"
];

const roleKeys = ["unverified", "member", "candidate", "partner", "guest", "staff", "recruiter", "moderator"];
const categoryKeys = ["supportTickets", "recruitmentTickets", "directionTickets", "closeArchiveCategoryId"];
const ticketTypeKeys = ["support", "direction", "member_report", "recruitment", "partnership", "rp_complaint"];

function ensureAdministrator(interaction) {
  if (interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    return true;
  }

  interaction.reply({
    content: "Cette commande est reservee aux membres ayant la permission Discord Administrateur.",
    ephemeral: true
  }).catch(() => null);

  return false;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Afficher ou modifier la configuration d'OmbraCore.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) => subcommand.setName("show").setDescription("Afficher un resume de la configuration."))
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-channel")
        .setDescription("Associer un salon a une cle de configuration.")
        .addStringOption((option) => option.setName("cle").setDescription("Cle de salon").setRequired(true).addChoices(...channelKeys.map((key) => ({ name: key, value: key }))))
        .addChannelOption((option) =>
          option
            .setName("salon")
            .setDescription("Salon cible")
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.GuildForum)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-role")
        .setDescription("Associer un role a une cle de configuration.")
        .addStringOption((option) => option.setName("cle").setDescription("Cle de role").setRequired(true).addChoices(...roleKeys.map((key) => ({ name: key, value: key }))))
        .addRoleOption((option) => option.setName("role").setDescription("Role cible").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-category")
        .setDescription("Associer une categorie de tickets.")
        .addStringOption((option) => option.setName("cle").setDescription("Cle de categorie").setRequired(true).addChoices(...categoryKeys.map((key) => ({ name: key, value: key }))))
        .addChannelOption((option) => option.setName("categorie").setDescription("Categorie cible").addChannelTypes(ChannelType.GuildCategory).setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-automod")
        .setDescription("Modifier les seuils principaux de l'automod.")
        .addIntegerOption((option) => option.setName("spam_window_ms").setDescription("Fenetre anti-spam en millisecondes"))
        .addIntegerOption((option) => option.setName("spam_threshold").setDescription("Nombre de messages avant detection spam"))
        .addIntegerOption((option) => option.setName("mention_threshold").setDescription("Nombre de mentions max"))
        .addIntegerOption((option) => option.setName("timeout_minutes").setDescription("Timeout auto en minutes"))
        .addNumberOption((option) => option.setName("caps_threshold").setDescription("Seuil majuscules entre 0.1 et 1.0").setMinValue(0.1).setMaxValue(1))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-list")
        .setDescription("Configurer les listes automod.")
        .addStringOption((option) =>
          option
            .setName("cle")
            .setDescription("Liste cible")
            .setRequired(true)
            .addChoices(
              { name: "blockedWords", value: "blockedWords" },
              { name: "blockedLinkPatterns", value: "blockedLinkPatterns" },
              { name: "allowedLinkPatterns", value: "allowedLinkPatterns" }
            )
        )
        .addStringOption((option) => option.setName("valeurs").setDescription("Valeurs separees par |").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-text")
        .setDescription("Modifier les textes globaux du bot.")
        .addStringOption((option) =>
          option
            .setName("cle")
            .setDescription("Champ texte")
            .setRequired(true)
            .addChoices(
              { name: "brand.name", value: "brand.name" },
              { name: "messages.welcomeTitle", value: "messages.welcomeTitle" },
              { name: "messages.welcomeDescription", value: "messages.welcomeDescription" },
              { name: "messages.rulesTitle", value: "messages.rulesTitle" },
              { name: "messages.rulesDescription", value: "messages.rulesDescription" },
              { name: "messages.rulesSanctions", value: "messages.rulesSanctions" },
              { name: "brand.footer", value: "brand.footer" }
            )
        )
        .addStringOption((option) => option.setName("valeur").setDescription("Nouvelle valeur").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-toggle")
        .setDescription("Activer ou desactiver une option booleenne.")
        .addStringOption((option) =>
          option
            .setName("cle")
            .setDescription("Option cible")
            .setRequired(true)
            .addChoices({ name: "messages.welcomeDmEnabled", value: "messages.welcomeDmEnabled" })
        )
        .addBooleanOption((option) => option.setName("valeur").setDescription("Etat voulu").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-questions")
        .setDescription("Remplacer la liste des questions de recrutement.")
        .addStringOption((option) => option.setName("valeurs").setDescription("Questions separees par |").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-ticket-type")
        .setDescription("Configurer un type de ticket.")
        .addStringOption((option) =>
          option.setName("type").setDescription("Type de ticket").setRequired(true).addChoices(...ticketTypeKeys.map((key) => ({ name: key, value: key })))
        )
        .addStringOption((option) => option.setName("label").setDescription("Label affiche").setRequired(true))
        .addChannelOption((option) => option.setName("categorie").setDescription("Categorie cible").addChannelTypes(ChannelType.GuildCategory).setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-ticket-settings")
        .setDescription("Configurer les options globales des tickets.")
        .addChannelOption((option) =>
          option.setName("archive_category").setDescription("Categorie archive des tickets fermes").addChannelTypes(ChannelType.GuildCategory)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-recruitment")
        .setDescription("Configurer les roles/categories recrutement.")
        .addRoleOption((option) => option.setName("accepted_role").setDescription("Role apres acceptation"))
        .addRoleOption((option) => option.setName("refused_role").setDescription("Role apres refus"))
        .addChannelOption((option) => option.setName("interview_category").setDescription("Categorie des entretiens").addChannelTypes(ChannelType.GuildCategory))
        .addStringOption((option) => option.setName("contact_message").setDescription("Message DM de contact"))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set-exempt-roles")
        .setDescription("Definir les roles exemptes d'automod.")
        .addStringOption((option) => option.setName("role_ids").setDescription("IDs separes par |").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reset")
        .setDescription("Reinitialiser une section de configuration.")
        .addStringOption((option) =>
          option
            .setName("section")
            .setDescription("Section a reinitialiser")
            .setRequired(true)
            .addChoices(
              { name: "messages", value: "messages" },
              { name: "channels", value: "channels" },
              { name: "categories", value: "categories" },
              { name: "roles", value: "roles" },
              { name: "automod", value: "automod" },
              { name: "recruitment", value: "recruitment" },
              { name: "tickets", value: "tickets" }
            )
        )
    ),
  async execute(interaction, client) {
    if (!ensureAdministrator(interaction)) {
      return;
    }

    const subcommand = interaction.options.getSubcommand();
    const config = await GuildConfig.findOne({ guildId: interaction.guild.id });

    if (subcommand === "show") {
      const content = [
        `Salons: welcome=${config.channels?.welcome || "non defini"} | rules=${config.channels?.rules || "non defini"} | tickets=${config.channels?.ticketPanel || "non defini"}`,
        `Logs: join=${config.channels?.joinLog || "non defini"} | rules=${config.channels?.rulesLog || "non defini"} | tickets=${config.channels?.ticketsLog || "non defini"} | anon=${config.channels?.anonymousLog || "non defini"}`,
        `Roles: unverified=${config.roles?.unverified || "non defini"} | member=${config.roles?.member || "non defini"} | staff=${config.roles?.staff || "non defini"} | recruiter=${config.roles?.recruiter || "non defini"}`,
        `Automod: spam=${config.automod?.spamThreshold} | fenetre=${config.automod?.spamWindowMs}ms | mentions=${config.automod?.mentionThreshold} | caps=${config.automod?.capsThreshold} | timeout=${config.automod?.timeoutMinutes}min | ano=3s fixe`,
        `Tickets: archive=${config.tickets?.closeArchiveCategoryId || "non defini"} | support=${config.tickets?.types?.support?.categoryId || "non defini"} | recruitment=${config.tickets?.types?.recruitment?.categoryId || "non defini"}`,
        `Branding: name=${config.brand?.name || "non defini"} | footer=${config.brand?.footer || "non defini"}`
      ].join("\n");
      await interaction.reply({ content, ephemeral: true });
      return;
    }

    if (subcommand === "set-channel") {
      const key = interaction.options.getString("cle", true);
      const channel = interaction.options.getChannel("salon", true);
      config.channels[key] = channel.id;
      await config.save();
      await refreshClientConfig(client, interaction.guild.id);
      await interaction.reply({ content: `Salon \`${key}\` mis a jour vers ${channel}.`, ephemeral: true });
      return;
    }

    if (subcommand === "set-role") {
      const key = interaction.options.getString("cle", true);
      const role = interaction.options.getRole("role", true);
      config.roles[key] = role.id;
      await config.save();
      await refreshClientConfig(client, interaction.guild.id);
      await interaction.reply({ content: `Role \`${key}\` mis a jour vers ${role}.`, ephemeral: true });
      return;
    }

    if (subcommand === "set-category") {
      const key = interaction.options.getString("cle", true);
      const category = interaction.options.getChannel("categorie", true);
      if (key === "closeArchiveCategoryId") {
        config.tickets.closeArchiveCategoryId = category.id;
      } else {
        config.categories[key] = category.id;
      }
      await config.save();
      await refreshClientConfig(client, interaction.guild.id);
      await interaction.reply({ content: `Categorie \`${key}\` mise a jour vers ${category.name}.`, ephemeral: true });
      return;
    }

    if (subcommand === "set-automod") {
      const spamWindowMs = interaction.options.getInteger("spam_window_ms");
      const spamThreshold = interaction.options.getInteger("spam_threshold");
      const mentionThreshold = interaction.options.getInteger("mention_threshold");
      const timeoutMinutes = interaction.options.getInteger("timeout_minutes");
      const capsThreshold = interaction.options.getNumber("caps_threshold");

      if (spamWindowMs !== null) config.automod.spamWindowMs = spamWindowMs;
      if (spamThreshold !== null) config.automod.spamThreshold = spamThreshold;
      if (mentionThreshold !== null) config.automod.mentionThreshold = mentionThreshold;
      if (timeoutMinutes !== null) config.automod.timeoutMinutes = timeoutMinutes;
      if (capsThreshold !== null) config.automod.capsThreshold = capsThreshold;

      await config.save();
      await refreshClientConfig(client, interaction.guild.id);
      await interaction.reply({ content: "Parametres automod mis a jour.", ephemeral: true });
      return;
    }

    if (subcommand === "set-list") {
      const key = interaction.options.getString("cle", true);
      const values = interaction.options
        .getString("valeurs", true)
        .split("|")
        .map((value) => value.trim())
        .filter(Boolean);

      config.automod[key] = values;
      await config.save();
      await refreshClientConfig(client, interaction.guild.id);
      await interaction.reply({ content: `Liste \`${key}\` mise a jour avec ${values.length} valeur(s).`, ephemeral: true });
      return;
    }

    if (subcommand === "set-text") {
      const key = interaction.options.getString("cle", true);
      const value = interaction.options.getString("valeur", true);

      if (key.startsWith("messages.")) {
        config.messages[key.split(".")[1]] = value;
      } else if (key.startsWith("brand.")) {
        config.brand[key.split(".")[1]] = value;
      }

      await config.save();
      await refreshClientConfig(client, interaction.guild.id);
      await interaction.reply({ content: `Texte \`${key}\` mis a jour.`, ephemeral: true });
      return;
    }

    if (subcommand === "set-toggle") {
      const key = interaction.options.getString("cle", true);
      const value = interaction.options.getBoolean("valeur", true);

      if (key === "messages.welcomeDmEnabled") {
        config.messages.welcomeDmEnabled = value;
      }

      await config.save();
      await refreshClientConfig(client, interaction.guild.id);
      await interaction.reply({ content: `Option \`${key}\` mise a jour.`, ephemeral: true });
      return;
    }

    if (subcommand === "set-questions") {
      const values = interaction.options
        .getString("valeurs", true)
        .split("|")
        .map((value) => value.trim())
        .filter(Boolean);

      config.recruitment.questions = values;
      await config.save();
      await refreshClientConfig(client, interaction.guild.id);
      await interaction.reply({ content: `Questions de recrutement mises a jour (${values.length}).`, ephemeral: true });
      return;
    }

    if (subcommand === "set-ticket-type") {
      const type = interaction.options.getString("type", true);
      const label = interaction.options.getString("label", true);
      const category = interaction.options.getChannel("categorie", true);

      config.tickets.types[type] = {
        ...(config.tickets.types[type] || {}),
        label,
        categoryId: category.id
      };

      await config.save();
      await refreshClientConfig(client, interaction.guild.id);
      await interaction.reply({ content: `Ticket \`${type}\` configure vers ${category.name}.`, ephemeral: true });
      return;
    }

    if (subcommand === "set-ticket-settings") {
      const archiveCategory = interaction.options.getChannel("archive_category");

      if (archiveCategory) {
        config.tickets.closeArchiveCategoryId = archiveCategory.id;
      }

      await config.save();
      await refreshClientConfig(client, interaction.guild.id);
      await interaction.reply({ content: "Parametres globaux des tickets mis a jour.", ephemeral: true });
      return;
    }

    if (subcommand === "set-recruitment") {
      const acceptedRole = interaction.options.getRole("accepted_role");
      const refusedRole = interaction.options.getRole("refused_role");
      const interviewCategory = interaction.options.getChannel("interview_category");
      const contactMessage = interaction.options.getString("contact_message");

      if (acceptedRole) config.recruitment.acceptedRoleId = acceptedRole.id;
      if (refusedRole) config.recruitment.refusedRoleId = refusedRole.id;
      if (interviewCategory) config.recruitment.interviewCategoryId = interviewCategory.id;
      if (contactMessage) config.recruitment.contactMessage = contactMessage;

      await config.save();
      await refreshClientConfig(client, interaction.guild.id);
      await interaction.reply({ content: "Configuration recrutement mise a jour.", ephemeral: true });
      return;
    }

    if (subcommand === "set-exempt-roles") {
      const roleIds = interaction.options
        .getString("role_ids", true)
        .split("|")
        .map((value) => value.trim())
        .filter(Boolean);

      config.automod.exemptRoleIds = roleIds;
      await config.save();
      await refreshClientConfig(client, interaction.guild.id);
      await interaction.reply({ content: `Roles exemptes d'automod mis a jour (${roleIds.length}).`, ephemeral: true });
      return;
    }

    if (subcommand === "reset") {
      const section = interaction.options.getString("section", true);
      config[section] = defaultGuildConfig[section];
      await config.save();
      await refreshClientConfig(client, interaction.guild.id);
      await interaction.reply({ content: `Section \`${section}\` reinitialisee avec les valeurs par defaut.`, ephemeral: true });
    }
  }
};
