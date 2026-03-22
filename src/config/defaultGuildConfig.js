module.exports = {
  brand: {
    name: "OmbraCore",
    footer: "OmbraCore • Societa Ombra"
  },
  messages: {
    welcomeTitle: "Bienvenue au sein de Societa Ombra",
    welcomeDescription:
      "Bienvenue {user}\nAvant d'acceder au serveur, prends connaissance du reglement et valide-le pour rejoindre officiellement la communaute.",
    welcomeAmbientLine: "Une arrivee propre, un cadre serieux, une structure sous controle.",
    welcomeDmEnabled: false,
    rulesTitle: "Reglement de Societa Ombra",
    rulesDescription:
      "Lis attentivement le reglement du serveur. L'acces complet est reserve aux membres qui valident les regles.",
    rulesSanctions:
      "Le non-respect du reglement peut entrainer un avertissement, un mute ou un bannissement."
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
    supportTickets: "",
    recruitmentTickets: "",
    directionTickets: ""
  },
  roles: {
    unverified: "",
    member: "",
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
    anonymousCooldownSeconds: 300,
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
        categoryId: ""
      },
      direction: {
        label: "Contact direction",
        categoryId: ""
      },
      member_report: {
        label: "Probleme membre",
        categoryId: ""
      },
      recruitment: {
        label: "Ticket recrutement",
        categoryId: ""
      },
      partnership: {
        label: "Ticket partenariat",
        categoryId: ""
      },
      rp_complaint: {
        label: "Plainte RP",
        categoryId: ""
      }
    },
    closeArchiveCategoryId: ""
  }
};
