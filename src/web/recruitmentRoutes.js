const crypto = require("node:crypto");

const Application = require("../models/Application");
const UserProfile = require("../models/UserProfile");
const { createBaseEmbed } = require("../utils/embeds");
const { createTicketChannel } = require("../modules/tickets");
const { renderRecruitmentPage } = require("./recruitmentPage");

const FORM_DEFINITION = [
  { key: "nom_rp", label: "Nom RP" },
  { key: "prenom_rp", label: "Prénom RP" },
  { key: "age_rp", label: "Âge RP" },
  { key: "origine_rp", label: "Origine du personnage" },
  { key: "profession_rp", label: "Profession actuelle RP" },
  { key: "age_irl", label: "Âge IRL" },
  { key: "pseudo_discord", label: "Pseudo Discord" },
  { key: "anciennete_rp", label: "Depuis combien de temps fais-tu du RP ?" },
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

function registerRecruitmentRoutes(app, client) {
  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/recruitment", async (req, res) => {
    const user = readSession(req);
    const submitted = req.query.submitted === "1";
    res.type("html").send(renderRecruitmentPage({ baseUrl: getBaseUrl(), user, submitted }));
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
        res.type("html").status(400).send(renderRecruitmentPage({ baseUrl: getBaseUrl(), error: "Connexion Discord invalide ou expirée." }));
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
      res.type("html").status(500).send(renderRecruitmentPage({ baseUrl: getBaseUrl(), error: "Impossible de finaliser la connexion Discord." }));
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
      res.type("html").status(401).send(renderRecruitmentPage({ baseUrl: getBaseUrl(), error: "Connexion Discord requise." }));
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

      const missingField = FORM_DEFINITION.find((item) => !String(req.body[item.key] || "").trim());
      if (missingField) {
        throw new Error(`Le champ "${missingField.label}" est requis.`);
      }

      const answers = FORM_DEFINITION.map((item) => ({
        question: item.label,
        answer: String(req.body[item.key]).trim()
      }));

      const score = answers.reduce((total, item) => total + Math.min(item.answer.length, 220), 0);
      const application = await Application.create({
        guildId: guild.id,
        userId: user.id,
        answers,
        score
      });

      const { existingTicket, existingChannel, ticketNumber, channel, typeConfig } = await createTicketChannel(
        guild,
        client.runtimeConfig,
        member.user,
        "recruitment"
      );

      if (existingTicket) {
        throw new Error(existingChannel ? `Tu as déjà un ticket recrutement ouvert : #${existingChannel.name}` : "Tu as déjà un ticket recrutement ouvert.");
      }

      const summaryEmbed = createBaseEmbed({
        title: "Dossier de recrutement • Portail Ombra",
        description:
          `${member} a transmis son formulaire complet via le portail sécurisé.\nToutes les réponses ont été injectées automatiquement dans ce dossier privé.`,
        fields: [
          { name: "Référence", value: `#${String(ticketNumber).padStart(4, "0")}`, inline: true },
          { name: "Motif", value: typeConfig.label, inline: true },
          { name: "Score initial", value: `${score}`, inline: true }
        ],
        color: 0x18130f
      });

      const sectionEmbeds = answers.map((item) =>
        createBaseEmbed({
          title: item.question,
          description: item.answer.slice(0, 4096),
          color: 0x1d1a18
        })
      );

      await channel.send({ embeds: [summaryEmbed, ...sectionEmbeds] });

      if (client.runtimeConfig.channels?.applicationsLog) {
        const logChannel = await guild.channels.fetch(client.runtimeConfig.channels.applicationsLog).catch(() => null);
        if (logChannel?.isTextBased()) {
          await logChannel.send({ embeds: [summaryEmbed, ...sectionEmbeds] });
        }
      }

      await member.send(`Ton dossier Società Ombra a bien été transmis. Référence : #${String(ticketNumber).padStart(4, "0")}`).catch(() => null);

      res.redirect("/recruitment?submitted=1");
    } catch (error) {
      res.type("html").status(400).send(renderRecruitmentPage({ baseUrl: getBaseUrl(), user, error: error.message || "Impossible de transmettre le dossier." }));
    }
  });
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

module.exports = { registerRecruitmentRoutes };
