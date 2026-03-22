const crypto = require("node:crypto");

const Application = require("../models/Application");
const Ticket = require("../models/Ticket");
const UserProfile = require("../models/UserProfile");
const {
  dispatchRecruitmentSubmission,
  resetRecruitmentTicketForApplication,
  manageRecruitmentTicketsForApplication
} = require("../modules/recruitment");
const {
  applyApplicationStatus,
  scheduleApplicationInterview
} = require("../services/recruitmentDecisionService");
const { renderRecruitmentPage } = require("./recruitmentPage");

const ADMIN_USER_IDS = new Set(["976309113749372958", "780527561175597067"]);

const FORM_DEFINITION = [
  { key: "nom_rp", label: "Nom RP" },
  { key: "prenom_rp", label: "Prénom RP" },
  { key: "age_rp", label: "Âge RP" },
  { key: "origine_rp", label: "Origine du personnage" },
  { key: "profession_rp", label: "Profession actuelle RP" },
  { key: "age_irl", label: "Âge IRL" },
  { key: "pseudo_discord", label: "Pseudo Discord" },
  { key: "anciennete_rp", label: "Depuis combien de temps fais-tu du RP ?" },
  { key: "disponibilite_generale", label: "Disponibilités générales" },
  { key: "serveurs_precedents", label: "Serveurs précédents" },
  { key: "experience_criminelle", label: "Expérience dans des organisations criminelles" },
  { key: "definition_rp", label: "Comment définirais-tu un RP sérieux ?" },
  { key: "role_important", label: "As-tu déjà occupé un rôle important (leader / bras droit) ?" },
  { key: "situation_tendue", label: "Comment réagis-tu face à une situation tendue en RP ?" },
  { key: "scene_rp", label: "Donne un exemple de scène RP que tu as vécu" },
  { key: "pourquoi_ombra", label: "Pourquoi veux-tu rejoindre la Società Ombra ?" },
  { key: "attirance_organisation", label: "Qu’est-ce qui t’attire dans notre organisation ?" },
  { key: "apport", label: "Que peux-tu apporter à la Società ?" },
  { key: "pourquoi_toi", label: "Pourquoi devrions-nous te choisir toi et pas un autre ?" },
  { key: "sanctions", label: "As-tu déjà reçu des sanctions sur un serveur ? (Si oui, explique)" },
  { key: "gestion_conflits", label: "Comment gères-tu les conflits avec d’autres joueurs ?" },
  { key: "hierarchie", label: "Es-tu capable de respecter une hiérarchie stricte ?" },
  { key: "horaires", label: "Horaires de jeu" },
  { key: "frequence", label: "Fréquence de connexion" },
  { key: "session_moyenne", label: "Temps moyen par session" },
  { key: "respect_reglement", label: "Acceptes-tu de respecter le règlement ?" },
  { key: "confidentialite", label: "Acceptes-tu de garder confidentielles les informations internes ?" },
  { key: "long_terme", label: "Es-tu prêt à t’investir sur le long terme ?" },
  {
    key: "mise_en_situation",
    label:
      "Mise en situation RP : Tu es en mission discrète pour la Società. La police commence à suspecter quelque chose. Un coéquipier panique et risque de compromettre l’opération. Ta réponse :"
  }
];

const QUIZ_DEFINITION = [
  {
    key: "quiz_01",
    question: "Sur quoi repose la Società Ombra depuis sa naissance ?",
    options: ["Violence, peur, territoire", "Discrétion, contrôle, influence", "Argent, armes, chaos"],
    correctAnswer: "Discrétion, contrôle, influence"
  },
  {
    key: "quiz_02",
    question: "Quelle approche décrit le mieux la Società à Los Santos ?",
    options: ["Elle conquiert les rues par la guerre", "Elle infiltre et devient nécessaire", "Elle s’expose pour dominer rapidement"],
    correctAnswer: "Elle infiltre et devient nécessaire"
  },
  {
    key: "quiz_03",
    question: "Quel type de RP est attendu ?",
    options: ["RP troll et provocateur", "RP sérieux et cohérent", "RP libre sans cadre"],
    correctAnswer: "RP sérieux et cohérent"
  },
  {
    key: "quiz_04",
    question: "Que faut-il éviter selon la philosophie de la Società ?",
    options: ["Le contrôle et la patience", "Le chaos et l’exposition", "La hiérarchie et le silence"],
    correctAnswer: "Le chaos et l’exposition"
  },
  {
    key: "quiz_05",
    question: "Si un conflit HRP apparaît, quelle est la bonne attitude ?",
    options: ["Le régler publiquement dans le général", "Rester calme et éviter le conflit public", "Ping tout le staff immédiatement"],
    correctAnswer: "Rester calme et éviter le conflit public"
  },
  {
    key: "quiz_06",
    question: "Que représente la visibilité pour la Società Ombra ?",
    options: ["Une preuve de puissance", "Une faiblesse", "Une obligation"],
    correctAnswer: "Une faiblesse"
  },
  {
    key: "quiz_07",
    question: "Quel type d’action correspond à la méthode Ombra ?",
    options: ["Action planifiée, propre et silencieuse", "Action rapide, bruyante et dissuasive", "Action improvisée selon l’urgence"],
    correctAnswer: "Action planifiée, propre et silencieuse"
  },
  {
    key: "quiz_08",
    question: "Que doit faire un membre avec les informations internes ?",
    options: ["Les garder confidentielles", "Les partager à ses proches", "Les utiliser librement hors contexte"],
    correctAnswer: "Les garder confidentielles"
  },
  {
    key: "quiz_09",
    question: "Comment la Società contrôle-t-elle le jeu ?",
    options: ["Par le pouvoir visible", "Par le pouvoir invisible", "Par la peur publique"],
    correctAnswer: "Par le pouvoir invisible"
  },
  {
    key: "quiz_10",
    question: "Quel comportement est interdit sur le Discord ?",
    options: ["Le respect des salons", "Le spam et les mentions abusives", "Les tickets clairs"],
    correctAnswer: "Le spam et les mentions abusives"
  },
  {
    key: "quiz_11",
    question: "La structure Ombra est :",
    options: ["Ouverte et transparente", "Cloisonnée avec identités protégées", "Basée sur l’improvisation"],
    correctAnswer: "Cloisonnée avec identités protégées"
  },
  {
    key: "quiz_12",
    question: "Pourquoi la Società évite-t-elle les guerres inutiles ?",
    options: ["Parce qu’elles coûtent cher et exposent", "Parce qu’elle n’a pas d’hommes", "Parce qu’elles sont interdites par la police"],
    correctAnswer: "Parce qu’elles coûtent cher et exposent"
  },
  {
    key: "quiz_13",
    question: "Quel est le bon usage des tickets ?",
    options: ["Les utiliser quand c’est nécessaire, avec respect", "Les spam pour accélérer", "Les ouvrir pour chaque détail mineur"],
    correctAnswer: "Les utiliser quand c’est nécessaire, avec respect"
  },
  {
    key: "quiz_14",
    question: "Quand un obstacle apparaît pour la Società, l’idée est de :",
    options: ["Créer un affrontement direct", "Le faire disparaître proprement", "Le menacer publiquement"],
    correctAnswer: "Le faire disparaître proprement"
  },
  {
    key: "quiz_15",
    question: "Que vaut une candidature pour la Società ?",
    options: ["Un simple formulaire", "Un dossier sérieux et honnête", "Une formalité sans conséquence"],
    correctAnswer: "Un dossier sérieux et honnête"
  },
  {
    key: "quiz_16",
    question: "Quel type de pouvoir attire les balles selon la philosophie ?",
    options: ["Le pouvoir invisible", "Le pouvoir visible", "Le pouvoir financier"],
    correctAnswer: "Le pouvoir visible"
  },
  {
    key: "quiz_17",
    question: "Face à une scène RP en cours, il faut :",
    options: ["Préserver l’immersion et la cohérence", "La casser si elle ralentit", "Privilégier le HRP"],
    correctAnswer: "Préserver l’immersion et la cohérence"
  },
  {
    key: "quiz_18",
    question: "Quelle activité correspond à la couverture de la Società ?",
    options: ["Import-export discret et entreprises de façade", "Streams publics et réseaux sociaux", "Convois armés visibles"],
    correctAnswer: "Import-export discret et entreprises de façade"
  },
  {
    key: "quiz_19",
    question: "Quand un membre devient trop bruyant, la logique Ombra est :",
    options: ["L’exposer publiquement", "Réduire ou effacer sa présence", "L’encourager à s’imposer"],
    correctAnswer: "Réduire ou effacer sa présence"
  },
  {
    key: "quiz_20",
    question: "La force centrale de la Società est surtout :",
    options: ["L’information", "La quantité d’armes", "La présence médiatique"],
    correctAnswer: "L’information"
  },
  {
    key: "quiz_21",
    question: "Quel comportement est attendu envers les autres membres ?",
    options: ["Respect et professionnalisme", "Compétition et provocation", "Distance hostile"],
    correctAnswer: "Respect et professionnalisme"
  },
  {
    key: "quiz_22",
    question: "Comment les ordres circulent-ils dans la structure ?",
    options: ["Ils descendent", "Ils montent uniquement", "Ils sont publics"],
    correctAnswer: "Ils descendent"
  },
  {
    key: "quiz_23",
    question: "Quel est le bon réflexe face à une situation tendue en RP ?",
    options: ["Garder le contrôle et protéger l’opération", "Paniquer avant les autres", "Changer totalement de rôle"],
    correctAnswer: "Garder le contrôle et protéger l’opération"
  },
  {
    key: "quiz_24",
    question: "Que signifie rejoindre la Società Ombra ?",
    options: ["Entrer dans une machine organisée", "Entrer dans un gang classique", "Obtenir un statut décoratif"],
    correctAnswer: "Entrer dans une machine organisée"
  },
  {
    key: "quiz_25",
    question: "Quelle phrase décrit le mieux la Società Ombra ?",
    options: ["Nous faisons du bruit pour exister", "Nous contrôlons sans être vus", "Nous dominons par la guerre ouverte"],
    correctAnswer: "Nous contrôlons sans être vus"
  }
];

function registerRecruitmentRoutes(app, client) {
  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/recruitment", async (req, res) => {
    const user = readSession(req);
    const submitted = req.query.submitted === "1";
    const state = await buildPortalState(client, user, req.query.view, submitted);
    res.type("html").send(renderRecruitmentPage(state));
  });

  app.get("/admin", async (req, res) => {
    const user = readSession(req);
    if (!isAdminUser(user)) {
      res.redirect("/recruitment");
      return;
    }

    const state = await buildPortalState(client, user, "admin", false);
    res.type("html").send(renderRecruitmentPage(state));
  });

  app.get("/admin/recruitment/:applicationId", async (req, res) => {
    const user = readSession(req);
    if (!isAdminUser(user)) {
      res.redirect("/recruitment");
      return;
    }

    const state = await buildPortalState(client, user, "admin_detail", false, req.params.applicationId);
    if (!state.portal?.selectedApplication) {
      res.redirect("/admin");
      return;
    }

    res.type("html").send(renderRecruitmentPage(state));
  });

  app.get("/recruitment/login", async (req, res) => {
    const state = crypto.randomBytes(24).toString("hex");
    res.cookie("ombracore_oauth_state", state, { httpOnly: true, sameSite: "lax", secure: isSecure() });

    const url = new URL("https://discord.com/oauth2/authorize");
    url.searchParams.set("client_id", process.env.CLIENT_ID);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("redirect_uri", `${getBaseUrl()}/recruitment/callback`);
    url.searchParams.set("scope", "identify");
    url.searchParams.set("state", state);
    res.redirect(url.toString());
  });

  app.get("/recruitment/callback", async (req, res) => {
    try {
      if (!req.query.code || !req.query.state || req.cookies.ombracore_oauth_state !== req.query.state) {
        const state = await buildPortalState(client, null, "access", false);
        res.type("html").status(400).send(renderRecruitmentPage({ ...state, error: "Connexion Discord invalide ou expirée." }));
        return;
      }

      const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "authorization_code",
          code: req.query.code,
          redirect_uri: `${getBaseUrl()}/recruitment/callback`
        })
      });

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok || !tokenData.access_token) {
        throw new Error("OAuth token exchange failed.");
      }

      const userResponse = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const user = await userResponse.json();
      if (!userResponse.ok || !user.id) {
        throw new Error("Discord user fetch failed.");
      }

      res.cookie("ombracore_session", signSession(user), {
        httpOnly: true,
        sameSite: "lax",
        secure: isSecure(),
        maxAge: 1000 * 60 * 60 * 8
      });

      res.redirect("/recruitment");
    } catch (_error) {
      const user = readSession(req);
      const state = await buildPortalState(client, user, "access", false);
      res.type("html").status(500).send(renderRecruitmentPage({ ...state, error: "Impossible de finaliser la connexion Discord." }));
    }
  });

  app.get("/recruitment/logout", (_req, res) => {
    res.clearCookie("ombracore_session");
    res.clearCookie("ombracore_oauth_state");
    res.redirect("/recruitment");
  });

  app.post("/recruitment/submit", async (req, res) => {
    const user = readSession(req);
    if (!user) {
      const state = await buildPortalState(client, null, "access", false);
      res.type("html").status(401).send(renderRecruitmentPage({ ...state, error: "Connexion Discord requise." }));
      return;
    }

    try {
      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      const member = await guild.members.fetch(user.id).catch(() => null);
      if (!member) {
        throw new Error("Tu dois être présent sur le serveur Discord pour déposer une candidature.");
      }

      const profile = await UserProfile.findOne({ guildId: guild.id, userId: user.id });
      if (!profile?.rulesAcceptedAt) {
        throw new Error("Tu dois accepter le règlement sur Discord avant de candidater.");
      }

      const lockedApplication = await Application.findOne({
        guildId: guild.id,
        userId: user.id,
        locked: true,
        refusalCode: "underage"
      }).sort({ createdAt: -1 });

      if (lockedApplication) {
        throw new Error("Ta candidature a été refusée automatiquement pour âge IRL insuffisant. Aucun nouveau dépôt n'est autorisé.");
      }

      const forceResend = String(req.body.force_resend || "").trim() === "1";
      const existingOpenTicket = await Ticket.findOne({
        guildId: guild.id,
        authorId: user.id,
        type: "recruitment",
        status: "open"
      });

      if (existingOpenTicket) {
        const existingChannel = await guild.channels.fetch(existingOpenTicket.channelId).catch(() => null);

        if (!existingChannel) {
          existingOpenTicket.status = "deleted";
          await existingOpenTicket.save();
        } else if (!forceResend) {
          throw new Error("Tu as déjà un ticket recrutement ouvert.");
        }
      }

      const missingField = FORM_DEFINITION.find((item) => !String(req.body[item.key] || "").trim());
      if (missingField) {
        throw new Error(`Le champ "${missingField.label}" est requis.`);
      }

      const missingQuiz = QUIZ_DEFINITION.find((item) => !String(req.body[item.key] || "").trim());
      if (missingQuiz) {
        throw new Error(`La question "${missingQuiz.question}" doit être renseignée.`);
      }

      const ageIrl = Number.parseInt(String(req.body.age_irl || "").trim(), 10);
      if (!Number.isFinite(ageIrl)) {
        throw new Error("L'âge IRL doit être un nombre valide.");
      }

      const formAnswers = FORM_DEFINITION.map((item) => ({
        question: item.label,
        answer: String(req.body[item.key]).trim()
      }));

      const quizAnswers = QUIZ_DEFINITION.map((item) => ({
        question: item.question,
        answer: String(req.body[item.key]).trim()
      }));

      const quizScore = evaluateQuiz(req.body);
      const allAnswers = [...formAnswers, ...quizAnswers];

      if (ageIrl < 18) {
        await Application.create({
          guildId: guild.id,
          userId: user.id,
          ageIrl,
          status: "refused",
          score: quizScore,
          quizScore,
          notes: "Refus automatique : âge IRL inférieur à 18 ans.",
          autoRefused: true,
          locked: true,
          refusalCode: "underage",
          answers: allAnswers
        });

        await member.send("Ta candidature Società Ombra a été refusée automatiquement : l'âge IRL minimum requis est de 18 ans. Aucun nouveau dépôt n'est autorisé.").catch(() => null);
        throw new Error("Refus automatique : l'âge IRL minimum requis est de 18 ans. Ta candidature est bloquée définitivement.");
      }

      if (quizScore < 20) {
        await Application.create({
          guildId: guild.id,
          userId: user.id,
          ageIrl,
          status: "refused",
          score: quizScore,
          quizScore,
          notes: `Refus automatique : score quiz insuffisant (${quizScore}/25).`,
          autoRefused: true,
          locked: false,
          refusalCode: "quiz_failed",
          answers: allAnswers
        });

        await member.send(`Ta candidature Società Ombra a été refusée automatiquement : score insuffisant au questionnaire (${quizScore}/25, minimum requis : 20/25).`).catch(() => null);
        throw new Error(`Refus automatique : score insuffisant au questionnaire (${quizScore}/25). Minimum requis : 20/25.`);
      }

      const application = await Application.create({
        guildId: guild.id,
        userId: user.id,
        ageIrl,
        answers: allAnswers,
        score: quizScore,
        quizScore
      });

      const { existingTicket, existingChannel, ticketNumber } = await dispatchRecruitmentSubmission({
        guild,
        member,
        client,
        application,
        answers: allAnswers,
        score: quizScore,
        sourceLabel: "Portail web",
        forceIntoExisting: forceResend,
        existingTicketRecord: existingOpenTicket || null,
        existingChannel: existingOpenTicket ? await guild.channels.fetch(existingOpenTicket.channelId).catch(() => null) : null
      });

      if (existingTicket) {
        throw new Error(existingChannel ? `Tu as déjà un ticket recrutement ouvert : #${existingChannel.name}` : "Tu as déjà un ticket recrutement ouvert.");
      }

      await member.send(`Ton dossier Società Ombra a bien été transmis. Référence : #${String(ticketNumber).padStart(4, "0")} • Score questionnaire : ${quizScore}/25`).catch(() => null);
      res.redirect("/recruitment?submitted=1");
    } catch (error) {
      const state = await buildPortalState(client, user, "form", false);
      res.type("html").status(400).send(renderRecruitmentPage({ ...state, error: error.message || "Impossible de transmettre le dossier." }));
    }
  });

  app.post("/admin/recruitment/:applicationId/status", async (req, res) => {
    const user = readSession(req);
    if (!isAdminUser(user)) {
      res.redirect("/recruitment");
      return;
    }

    try {
      const application = await Application.findById(req.params.applicationId);
      if (!application) {
        throw new Error("Candidature introuvable.");
      }

      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      const status = String(req.body.status || "").trim();
      const note = String(req.body.note || "").trim();

      if (!["accepted", "refused", "on_hold"].includes(status)) {
        throw new Error("Statut admin invalide.");
      }

      await applyApplicationStatus({
        client,
        guild,
        application,
        status,
        actorId: user.id,
        actorLabel: `${user.username}#${user.discriminator || "0000"}`,
        note
      });

      res.redirect("/admin");
    } catch (error) {
      const state = await buildPortalState(client, user, "admin", false);
      res.type("html").status(400).send(renderRecruitmentPage({ ...state, error: error.message || "Impossible de mettre à jour la candidature." }));
    }
  });

  app.post("/admin/recruitment/:applicationId/schedule", async (req, res) => {
    const user = readSession(req);
    if (!isAdminUser(user)) {
      res.redirect("/recruitment");
      return;
    }

    try {
      const application = await Application.findById(req.params.applicationId);
      if (!application) {
        throw new Error("Candidature introuvable.");
      }

      const scheduledFor = String(req.body.scheduled_for || "").trim();
      const note = String(req.body.schedule_note || "").trim();

      if (!scheduledFor) {
        throw new Error("La date de recrutement est requise.");
      }

      const scheduleDate = new Date(scheduledFor);
      if (Number.isNaN(scheduleDate.getTime())) {
        throw new Error("La date de recrutement est invalide.");
      }

      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      await scheduleApplicationInterview({
        client,
        guild,
        application,
        scheduledFor: scheduleDate,
        note,
        actorId: user.id,
        actorLabel: `${user.username}#${user.discriminator || "0000"}`
      });

      res.redirect("/admin");
    } catch (error) {
      const state = await buildPortalState(client, user, "admin", false);
      res.type("html").status(400).send(renderRecruitmentPage({ ...state, error: error.message || "Impossible de fixer l'horaire de recrutement." }));
    }
  });

  app.post("/admin/recruitment/:applicationId/reset-ticket", async (req, res) => {
    const user = readSession(req);
    if (!isAdminUser(user)) {
      res.redirect("/recruitment");
      return;
    }

    try {
      const application = await Application.findById(req.params.applicationId);
      if (!application) {
        throw new Error("Candidature introuvable.");
      }

      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      await resetRecruitmentTicketForApplication({
        client,
        guild,
        application,
        actorId: user.id,
        actorLabel: `${user.username}#${user.discriminator || "0000"}`
      });

      res.redirect("/admin");
    } catch (error) {
      const state = await buildPortalState(client, user, "admin", false);
      res.type("html").status(400).send(renderRecruitmentPage({ ...state, error: error.message || "Impossible de réinitialiser le ticket recrutement." }));
    }
  });

  app.post("/admin/recruitment/:applicationId/archive-tickets", async (req, res) => {
    const user = readSession(req);
    if (!isAdminUser(user)) {
      res.redirect("/recruitment");
      return;
    }

    try {
      const application = await Application.findById(req.params.applicationId);
      if (!application) {
        throw new Error("Candidature introuvable.");
      }

      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      await manageRecruitmentTicketsForApplication({
        client,
        guild,
        application,
        mode: "archive",
        actorLabel: `${user.username}#${user.discriminator || "0000"}`
      });

      res.redirect("/admin");
    } catch (error) {
      const state = await buildPortalState(client, user, "admin", false);
      res.type("html").status(400).send(renderRecruitmentPage({ ...state, error: error.message || "Impossible d'archiver les tickets recrutement." }));
    }
  });

  app.post("/admin/recruitment/:applicationId/delete-tickets", async (req, res) => {
    const user = readSession(req);
    if (!isAdminUser(user)) {
      res.redirect("/recruitment");
      return;
    }

    try {
      const application = await Application.findById(req.params.applicationId);
      if (!application) {
        throw new Error("Candidature introuvable.");
      }

      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      await manageRecruitmentTicketsForApplication({
        client,
        guild,
        application,
        mode: "delete",
        actorLabel: `${user.username}#${user.discriminator || "0000"}`
      });

      res.redirect("/admin");
    } catch (error) {
      const state = await buildPortalState(client, user, "admin", false);
      res.type("html").status(400).send(renderRecruitmentPage({ ...state, error: error.message || "Impossible de supprimer les tickets recrutement." }));
    }
  });
}

function evaluateQuiz(body) {
  return QUIZ_DEFINITION.reduce((score, item) => {
    return score + (String(body[item.key] || "").trim() === item.correctAnswer ? 1 : 0);
  }, 0);
}

async function buildPortalState(client, user, requestedView, submitted, selectedApplicationId = null) {
  const baseUrl = getBaseUrl();
  const portal = {
    guildId: process.env.GUILD_ID || null,
    latestApplication: null,
    latestRecruitmentTicket: null,
    rulesAccepted: false,
    rulesAcceptedAt: null,
    recruitmentLocked: false,
    lockReason: null,
    isAdmin: isAdminUser(user),
    adminApplications: [],
    selectedApplication: null
  };

  if (user) {
    const guildId = process.env.GUILD_ID;
    const queries = [
      UserProfile.findOne({ guildId, userId: user.id }).lean(),
      Application.findOne({ guildId, userId: user.id }).sort({ createdAt: -1 }).lean(),
      Ticket.findOne({ guildId, authorId: user.id, type: "recruitment" }).sort({ createdAt: -1 }).lean(),
      Application.findOne({ guildId, userId: user.id, locked: true, refusalCode: "underage" }).sort({ createdAt: -1 }).lean()
    ];

    if (portal.isAdmin) {
      queries.push(Application.find({ guildId, adminHidden: { $ne: true } }).sort({ createdAt: -1 }).limit(50).lean());
      queries.push(
        selectedApplicationId
          ? Application.findOne({ guildId, _id: selectedApplicationId, adminHidden: { $ne: true } }).lean()
          : Promise.resolve(null)
      );
    }

    const [profile, application, ticket, lockedApplication, adminApplications = [], selectedApplication = null] = await Promise.all(queries);

    portal.rulesAccepted = Boolean(profile?.rulesAcceptedAt);
    portal.rulesAcceptedAt = profile?.rulesAcceptedAt || null;
    portal.latestApplication = serializeApplication(application);
    portal.latestRecruitmentTicket = serializeTicket(ticket);
    portal.recruitmentLocked = Boolean(lockedApplication);
    portal.lockReason = lockedApplication?.notes || null;
    portal.adminApplications = portal.isAdmin
      ? await serializeAdminApplications(client, adminApplications)
      : [];
    portal.selectedApplication = portal.isAdmin ? await serializeAdminApplicationDetail(client, selectedApplication) : null;
  }

  return {
    baseUrl,
    user,
    submitted,
    initialView: resolveInitialView({ requestedView, submitted, user, portal }),
    portal
  };
}

function resolveInitialView({ requestedView, submitted, user, portal }) {
  const allowedViews = new Set(["home", "access", "dossier", "form", "status", "confirmation", "admin", "admin_detail"]);

  if (requestedView && allowedViews.has(requestedView)) {
    return requestedView;
  }

  if (submitted) {
    return "confirmation";
  }

  if (!user) {
    return "home";
  }

  if (requestedView === "admin" && portal.isAdmin) {
    return "admin";
  }

  if (requestedView === "admin_detail" && portal.isAdmin && portal.selectedApplication) {
    return "admin_detail";
  }

  if (portal.recruitmentLocked || portal.latestApplication) {
    return "status";
  }

  return "dossier";
}

function serializeApplication(application) {
  if (!application) {
    return null;
  }

  const statusMap = {
    pending: { key: "transmis", label: "Transmis", tone: "neutral" },
    on_hold: { key: "in_review", label: "En étude", tone: "warning" },
    accepted: { key: "retained", label: "Retenu", tone: "success" },
    refused: {
      key: application.autoRefused ? "auto_refused" : "refused",
      label: application.autoRefused ? "Refus automatique" : "Refusé",
      tone: "danger"
    }
  };

  const mappedStatus = statusMap[application.status] || statusMap.pending;

  return {
    id: String(application._id),
    createdAt: application.createdAt || null,
    updatedAt: application.updatedAt || null,
    reviewedAt: application.reviewedAt || null,
    adminHidden: Boolean(application.adminHidden),
    hiddenAt: application.hiddenAt || null,
    score: application.score || 0,
    quizScore: application.quizScore || 0,
    ageIrl: application.ageIrl || null,
    notes: application.notes || "",
    autoRefused: Boolean(application.autoRefused),
    locked: Boolean(application.locked),
    refusalCode: application.refusalCode || null,
    interviewScheduledFor: application.interviewScheduledFor || null,
    interviewMessage: application.interviewMessage || "",
    sectionCount: Array.isArray(application.answers) ? application.answers.length : 0,
    answers: Array.isArray(application.answers) ? application.answers : [],
    status: mappedStatus
  };
}

async function serializeAdminApplications(client, applications) {
  return Promise.all(
    applications.map(async (application) => {
      const serialized = serializeApplication(application);
      const user = await client.users.fetch(application.userId).catch(() => null);

      return {
        ...serialized,
        userId: application.userId,
        userTag: user ? user.tag : `Utilisateur ${application.userId}`,
        username: user?.username || application.userId
      };
    })
  );
}

async function serializeAdminApplicationDetail(client, application) {
  if (!application) {
    return null;
  }

  const serialized = serializeApplication(application);
  const user = await client.users.fetch(application.userId).catch(() => null);
  const ticket = await Ticket.findOne({
    guildId: application.guildId,
    authorId: application.userId,
    type: "recruitment",
    status: { $ne: "deleted" }
  })
    .sort({ createdAt: -1 })
    .lean();

  return {
    ...serialized,
    userId: application.userId,
    userTag: user ? user.tag : `Utilisateur ${application.userId}`,
    username: user?.username || application.userId,
    ticket: serializeTicket(ticket)
  };
}

function serializeTicket(ticket) {
  if (!ticket) {
    return null;
  }

  return {
    ticketNumber: ticket.ticketNumber,
    channelId: ticket.channelId,
    status: ticket.status,
    openedAt: ticket.openedAt || ticket.createdAt || null,
    updatedAt: ticket.updatedAt || null
  };
}

function getBaseUrl() {
  return process.env.WEB_BASE_URL || "https://societa.univers-bot.fr";
}

function isSecure() {
  return getBaseUrl().startsWith("https://");
}

function signSession(user) {
  const payload = Buffer.from(JSON.stringify({
    id: user.id,
    username: user.username,
    discriminator: user.discriminator || "0000"
  })).toString("base64url");

  const signature = crypto.createHmac("sha256", process.env.SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function readSession(req) {
  const raw = req.cookies.ombracore_session;
  if (!raw || !raw.includes(".")) {
    return null;
  }

  const [payload, signature] = raw.split(".");
  const expected = crypto.createHmac("sha256", process.env.SESSION_SECRET).update(payload).digest("base64url");
  if (signature !== expected) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function isAdminUser(user) {
  return Boolean(user?.id && ADMIN_USER_IDS.has(user.id));
}

module.exports = { registerRecruitmentRoutes };
