function renderRecruitmentPage({ baseUrl, user = null, error = "", submitted = false }) {
  const authUrl = `${baseUrl}/recruitment/login`;
  const submitUrl = `${baseUrl}/recruitment/submit`;
  const logoutUrl = `${baseUrl}/recruitment/logout`;

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recrutement Ombra</title>
    <style>
      :root {
        --bg: #0d0d0f;
        --panel: #151519;
        --panel-soft: #1b1b20;
        --line: rgba(212, 175, 55, 0.18);
        --gold: #c9a227;
        --gold-soft: #f0d98a;
        --text: #f7f3e9;
        --muted: #b7b0a3;
        --danger: #b84a4a;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        background:
          radial-gradient(circle at top, rgba(201,162,39,0.16), transparent 40%),
          linear-gradient(180deg, #0b0b0c 0%, #111114 100%);
        color: var(--text);
      }
      .shell {
        max-width: 1120px;
        margin: 0 auto;
        padding: 40px 20px 80px;
      }
      .hero, .panel {
        border: 1px solid var(--line);
        background: linear-gradient(180deg, rgba(20,20,24,0.96), rgba(12,12,15,0.96));
        border-radius: 24px;
        box-shadow: 0 24px 80px rgba(0,0,0,0.45);
      }
      .hero { padding: 28px; margin-bottom: 24px; }
      .eyebrow {
        font-size: 12px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: var(--gold-soft);
      }
      h1 {
        margin: 10px 0 12px;
        font-size: clamp(34px, 5vw, 58px);
        line-height: 1.02;
      }
      .quote {
        color: var(--muted);
        font-style: italic;
        margin: 0;
        font-size: 18px;
      }
      .hero-grid {
        display: grid;
        grid-template-columns: 1.3fr 0.7fr;
        gap: 18px;
        margin-top: 22px;
      }
      .mini {
        background: var(--panel-soft);
        border: 1px solid rgba(255,255,255,0.05);
        border-radius: 18px;
        padding: 18px;
      }
      .mini h3 {
        margin: 0 0 10px;
        font-size: 15px;
        color: var(--gold-soft);
      }
      .mini p {
        margin: 0;
        color: var(--muted);
        line-height: 1.65;
      }
      .panel { padding: 28px; }
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 22px;
      }
      .auth-box {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--muted);
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 10px 16px;
        color: var(--text);
        text-decoration: none;
        background: rgba(201,162,39,0.08);
      }
      .danger {
        border-color: rgba(184,74,74,0.35);
        background: rgba(184,74,74,0.12);
      }
      .error {
        margin: 0 0 18px;
        padding: 14px 16px;
        border-radius: 16px;
        border: 1px solid rgba(184,74,74,0.35);
        background: rgba(184,74,74,0.12);
        color: #ffd4d4;
      }
      .success {
        margin: 0 0 18px;
        padding: 14px 16px;
        border-radius: 16px;
        border: 1px solid rgba(121,188,121,0.35);
        background: rgba(88,140,88,0.14);
        color: #dff6df;
      }
      form {
        display: grid;
        gap: 18px;
      }
      .section {
        padding: 20px;
        border-radius: 20px;
        background: rgba(255,255,255,0.015);
        border: 1px solid rgba(255,255,255,0.04);
      }
      .section h2 {
        margin: 0 0 14px;
        font-size: 20px;
      }
      .section p.caption {
        margin: -6px 0 16px;
        color: var(--muted);
        font-size: 14px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }
      .field {
        display: grid;
        gap: 8px;
      }
      .field.full { grid-column: 1 / -1; }
      label {
        font-size: 14px;
        color: var(--gold-soft);
      }
      input, textarea, select {
        width: 100%;
        border: 1px solid rgba(255,255,255,0.08);
        background: rgba(8,8,10,0.95);
        color: var(--text);
        padding: 14px 14px;
        border-radius: 14px;
        font: inherit;
      }
      textarea { min-height: 120px; resize: vertical; }
      .actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-top: 8px;
      }
      button {
        border: 0;
        border-radius: 999px;
        padding: 14px 20px;
        font: inherit;
        color: #101010;
        background: linear-gradient(135deg, #d9b13d, #f2df9b);
        cursor: pointer;
        font-weight: 700;
      }
      .muted {
        color: var(--muted);
        font-size: 14px;
      }
      @media (max-width: 900px) {
        .hero-grid, .grid { grid-template-columns: 1fr; }
        .topbar, .actions { flex-direction: column; align-items: flex-start; }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        <div class="eyebrow">Società Ombra • Recrutement</div>
        <h1>Dans l’ombre, chaque détail compte.</h1>
        <p class="quote">“Nous ne cherchons pas des réponses parfaites. Nous cherchons des esprits fiables.”</p>
        <div class="hero-grid">
          <div class="mini">
            <h3>Procédure</h3>
            <p>Connecte-toi avec Discord, complète le dossier intégralement, puis OmbraCore ouvre automatiquement un ticket privé avec ton formulaire déjà structuré pour le staff.</p>
          </div>
          <div class="mini">
            <h3>Cadre</h3>
            <p>Le recrutement est réservé aux profils sérieux, constants et capables de respecter une hiérarchie stricte et une confidentialité totale.</p>
          </div>
        </div>
      </section>
      <section class="panel">
        <div class="topbar">
          <div>
            <div class="eyebrow">Portail sécurisé</div>
            <h2 style="margin:8px 0 0;font-size:28px;">Formulaire Recrutement Ombra</h2>
          </div>
          <div class="auth-box">
            ${user ? `<span>Connecté en tant que <strong>${escapeHtml(user.username)}#${escapeHtml(user.discriminator || "0000")}</strong></span><a class="pill danger" href="${logoutUrl}">Déconnexion</a>` : `<a class="pill" href="${authUrl}">Connexion via Discord</a>`}
          </div>
        </div>
        ${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}
        ${submitted ? `<div class="success">Ton dossier a été transmis. Le ticket recrutement a été ouvert automatiquement sur Discord.</div>` : ""}
        ${user ? renderForm(submitUrl) : `<p class="muted">Connecte-toi avec Discord pour débloquer le formulaire complet et transmettre ta candidature.</p>`}
      </section>
    </main>
  </body>
</html>`;
}

function renderForm(submitUrl) {
  return `<form method="post" action="${submitUrl}">
    ${renderSection("👤 Informations personnelles", [
      field("nom_rp", "Nom RP"),
      field("prenom_rp", "Prénom RP"),
      field("age_rp", "Âge RP"),
      field("origine_rp", "Origine du personnage"),
      field("profession_rp", "Profession actuelle RP")
    ])}
    ${renderSection("🎮 Profil joueur", [
      field("age_irl", "Âge IRL"),
      field("pseudo_discord", "Pseudo Discord"),
      field("anciennete_rp", "Depuis combien de temps fais-tu du RP ?"),
      field("serveurs_precedents", "Serveurs précédents", true),
      field("experience_criminelle", "Expérience dans des organisations criminelles", true)
    ])}
    ${renderSection("🧠 Expérience RP", [
      field("definition_rp", "Comment définirais-tu un RP sérieux ?", true),
      field("role_important", "As-tu déjà occupé un rôle important (leader / bras droit) ?", true),
      field("situation_tendue", "Comment réagis-tu face à une situation tendue en RP ?", true),
      field("scene_rp", "Donne un exemple de scène RP que tu as vécu", true)
    ])}
    ${renderSection("🎯 Motivation", [
      field("pourquoi_ombra", "Pourquoi veux-tu rejoindre la Società Ombra ?", true),
      field("attirance_organisation", "Qu’est-ce qui t’attire dans notre organisation ?", true),
      field("apport", "Que peux-tu apporter à la Società ?", true),
      field("pourquoi_toi", "Pourquoi devrions-nous te choisir toi et pas un autre ?", true)
    ])}
    ${renderSection("⚖️ Comportement", [
      field("sanctions", "As-tu déjà reçu des sanctions sur un serveur ? (Si oui, explique)", true),
      field("gestion_conflits", "Comment gères-tu les conflits avec d’autres joueurs ?", true),
      field("hierarchie", "Es-tu capable de respecter une hiérarchie stricte ?", true)
    ])}
    ${renderSection("⏱️ Disponibilités", [
      field("horaires", "Horaires de jeu"),
      field("frequence", "Fréquence de connexion"),
      field("session_moyenne", "Temps moyen par session")
    ])}
    ${renderSection("🕶️ Engagement", [
      selectField("respect_reglement", "Acceptes-tu de respecter le règlement ?", ["Oui", "Non"]),
      selectField("confidentialite", "Acceptes-tu de garder confidentielles les informations internes ?", ["Oui", "Non"]),
      selectField("long_terme", "Es-tu prêt à t’investir sur le long terme ?", ["Oui", "Non"])
    ])}
    ${renderSection("🎭 Mise en situation RP", [
      field("mise_en_situation", "Tu es en mission discrète pour la Società. La police commence à suspecter quelque chose. Un coéquipier panique et risque de compromettre l’opération. Ta réponse :", true)
    ], "Merci d’avoir pris le temps de répondre. Ta candidature sera analysée avec attention.")}
    <div class="actions">
      <div class="muted">En validant, le formulaire est envoyé au bot puis injecté automatiquement dans un ticket recrutement privé.</div>
      <button type="submit">Transmettre le dossier</button>
    </div>
  </form>`;
}

function renderSection(title, fields, caption = "") {
  return `<section class="section">
    <h2>${title}</h2>
    ${caption ? `<p class="caption">${caption}</p>` : ""}
    <div class="grid">
      ${fields.join("")}
    </div>
  </section>`;
}

function field(id, label, textarea = false) {
  return `<div class="field ${textarea ? "full" : ""}">
    <label for="${id}">${label}</label>
    ${textarea ? `<textarea id="${id}" name="${id}" required></textarea>` : `<input id="${id}" name="${id}" required />`}
  </div>`;
}

function selectField(id, label, options) {
  return `<div class="field">
    <label for="${id}">${label}</label>
    <select id="${id}" name="${id}" required>
      <option value="">Choisir</option>
      ${options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
    </select>
  </div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

module.exports = { renderRecruitmentPage };
