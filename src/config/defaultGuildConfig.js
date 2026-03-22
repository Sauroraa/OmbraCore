module.exports = {
  brand: {
    name: "OmbraCore",
    footer: "OmbraCore • Società Ombra",
    primaryColor: 1447446,
    footerIcon: ""
  },
  messages: {
    welcomeTitle: "Bienvenue dans l’ombre",
    welcomeDescription:
      "Bienvenue {user} au sein de **{server}**.\n\nAvant d’accéder à l’ensemble du serveur, prends connaissance du règlement et valide ton accès pour rejoindre officiellement la structure.\n\n> Ici, chaque entrée compte. Le cadre passe avant tout.",
    welcomeAmbientLine: "Une arrivée discrète. Un cadre sérieux. Une structure sous contrôle.",
    welcomeRulesLabel: "Lire le règlement",
    welcomeValidateLabel: "Valider l’accès",
    welcomeAccessLabel: "Débloquer les salons",
    welcomeGuidanceTitle: "Parcours d’intégration",
    welcomeGuidanceText:
      "Prends le temps de lire, valider et t’orienter. Une entrée propre facilite tout le reste.",
    welcomeOrientationTitle: "Repères",
    welcomeOrientationText:
      "Le staff conserve une traçabilité complète des validations et accompagne les nouveaux membres si nécessaire.",
    rulesButtonLabel: "Voir le règlement",
    rulesButtonUrl: "",
    welcomeInviteButtonLabel: "Découvrir la structure",
    welcomeInviteButtonUrl: "",
    welcomeDmEnabled: false,
    rulesTitle: "Règlement de Società Ombra",
    rulesDescription:
      "Lis attentivement le règlement du serveur. L’accès complet est réservé aux membres qui valident les règles.",
    rulesSanctions:
      "Le non-respect du règlement peut entraîner un avertissement, un mute ou un bannissement."
  },
  images: {
    welcomeBanner: ""
  },
  channels: {
    welcome: "1485310617735663817",
    rules: "",
    validation: "",
    ticketPanel: "1485333822210834452",
    recruitmentPanel: "",
    farewellLog: "",
    applicationsLog: "",
    joinLog: "",
    rulesLog: "",
    ticketsLog: "",
    anonymousLog: "",
    moderationLog: "",
    rolesLog: "",
    commandsLog: ""
  },
  categories: {
    supportTickets: "1485333181807984760",
    recruitmentTickets: "1485333280596430909",
    directionTickets: "1485333323709546657"
  },
  roles: {
    unverified: "",
    member: "",
    rulesReactionRole: "1485315803350827118",
    candidate: "",
    partner: "",
    guest: "",
    staff: "",
    recruiter: "",
    moderator: ""
  },
  automod: {
    spamWindowMs: 8000,
    spamThreshold: 5,
    mentionThreshold: 5,
    blockedWords: [],
    blockedLinkPatterns: ["discord.gg/", "discord.com/invite/"],
    allowedLinkPatterns: [],
    capsThreshold: 0.7,
    timeoutMinutes: 10,
    exemptRoleIds: []
  },
  recruitment: {
    acceptedRoleId: "",
    refusedRoleId: "",
    interviewCategoryId: "",
    contactMessage:
      "Le staff Societa Ombra souhaite echanger avec toi au sujet de ta candidature. Reste disponible sur Discord.",
    questions: [
      "Nom RP",
      "Prenom RP",
      "Age RP",
      "Identite ou origine du personnage",
      "Experience FiveM",
      "Experience RP serieux",
      "Horaires de disponibilite",
      "Pourquoi rejoindre Societa Ombra",
      "Ce que tu peux apporter a l'organisation",
      "Decris une scene RP tendue",
      "As-tu deja eu des sanctions serveur",
      "Connais-tu les bases d'un RP criminel structure"
    ]
  },
  tickets: {
    panelMessageId: "",
    types: {
      support: {
        label: "Support general",
        categoryId: "1485333181807984760"
      },
      direction: {
        label: "Contact direction",
        categoryId: "1485333323709546657"
      },
      member_report: {
        label: "Probleme membre",
        categoryId: "1485333181807984760"
      },
      recruitment: {
        label: "Ticket recrutement",
        categoryId: "1485333280596430909"
      },
      business_contact: {
        label: "Demande de Contact",
        categoryId: "1485346304329777303"
      },
      partnership: {
        label: "Ticket partenariat",
        categoryId: "1485346304329777303"
      },
      rp_complaint: {
        label: "Plainte RP",
        categoryId: "1485333323709546657"
      }
    },
    closeArchiveCategoryId: "1485333364310282342"
  },
  reactions: {
    rulesMessageId: "1485325130598060132",
    rulesRoleId: "1485315803350827118",
    rulesEmoji: "cartel:1485344042995945542"
  }
};
