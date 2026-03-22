function renderRecruitmentPage({ baseUrl, user = null, error = "", submitted = false }) {
  const authUrl = `${baseUrl}/recruitment/login`;
  const submitUrl = `${baseUrl}/recruitment/submit`;
  const logoutUrl = `${baseUrl}/recruitment/logout`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Societe Ombra • Portail</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;700;800&display=swap" rel="stylesheet" />
  <style>
    :root{--bg:#060708;--panel:rgba(12,12,14,.86);--panel2:rgba(20,15,12,.82);--line:rgba(179,136,72,.22);--gold:#b38848;--gold2:#f0d39a;--text:#f2eadc;--muted:#a79c8b;--danger:#a55252;--ok:#6d8b5f}
    *{box-sizing:border-box} html{scroll-behavior:smooth}
    body{margin:0;color:var(--text);font-family:"Manrope",sans-serif;background:radial-gradient(circle at 15% 15%,rgba(179,136,72,.16),transparent 25%),radial-gradient(circle at 85% 10%,rgba(124,24,24,.14),transparent 24%),linear-gradient(180deg,#050506,#0b0b0d 45%,#060607);overflow-x:hidden}
    body:before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.16;background:repeating-linear-gradient(90deg,transparent 0 78px,rgba(255,255,255,.02) 79px 80px),linear-gradient(transparent,rgba(255,255,255,.03),transparent)}
    .page{position:relative;z-index:1;max-width:1320px;margin:0 auto;padding:26px 18px 90px}.ticker{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px}
    .tick{padding:12px 14px;border-radius:999px;border:1px solid var(--line);background:rgba(255,255,255,.02);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);animation:up .8s ease both}
    .hero{position:relative;overflow:hidden;border:1px solid var(--line);border-radius:34px;background:linear-gradient(135deg,rgba(58,31,17,.26),transparent 35%),linear-gradient(180deg,rgba(9,9,11,.94),rgba(16,14,13,.86));box-shadow:0 26px 80px rgba(0,0,0,.42)}
    .hero:before,.hero:after{content:"";position:absolute;border-radius:50%;filter:blur(30px);opacity:.7}.hero:before{width:420px;height:420px;left:-100px;top:-120px;background:radial-gradient(circle,rgba(179,136,72,.28),transparent 70%);animation:float 12s ease-in-out infinite}.hero:after{width:480px;height:480px;right:-120px;bottom:-180px;background:radial-gradient(circle,rgba(116,26,26,.24),transparent 70%);animation:float 13s ease-in-out infinite reverse}
    .hero-grid{position:relative;z-index:1;display:grid;grid-template-columns:1.1fr .9fr;gap:22px;padding:34px}.eyebrow,.tag{letter-spacing:.3em;text-transform:uppercase;font-size:11px;color:var(--gold2)}.eyebrow{display:inline-flex;align-items:center;gap:10px}.eyebrow:before{content:"";width:42px;height:1px;background:linear-gradient(90deg,transparent,var(--gold2))}
    h1{margin:16px 0 0;font-family:"Cormorant Garamond",serif;font-size:clamp(4rem,9vw,7rem);line-height:.9;max-width:760px;animation:up .95s ease .08s both}.sub{display:block;color:var(--gold2)}
    .lead{max-width:650px;margin:20px 0 0;color:var(--muted);line-height:1.9;font-size:1.05rem;animation:up 1s ease .16s both}.actions{display:flex;flex-wrap:wrap;gap:14px;margin-top:28px;animation:up 1s ease .22s both}
    .btn,.ghost,.danger,button{display:inline-flex;align-items:center;justify-content:center;min-height:54px;padding:0 22px;border-radius:999px;text-decoration:none;font-weight:800;transition:.18s ease all}.btn,button{border:0;color:#110e0b;background:linear-gradient(135deg,#95642c,#f0d39a);box-shadow:0 14px 34px rgba(179,136,72,.24);cursor:pointer}.ghost{border:1px solid var(--line);color:var(--text);background:rgba(255,255,255,.03)}.danger{border:1px solid rgba(165,82,82,.36);color:#ffdede;background:rgba(165,82,82,.12)}.btn:hover,.ghost:hover,.danger:hover,button:hover{transform:translateY(-2px)}
    .metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:30px;animation:up 1.08s ease .28s both}.metric,.card,.panel,.sheet,.side{border:1px solid var(--line);background:linear-gradient(180deg,var(--panel),var(--panel2));box-shadow:0 24px 70px rgba(0,0,0,.34);backdrop-filter:blur(12px)}.metric{padding:16px;border-radius:22px}.metric b{display:block;font-family:"Cormorant Garamond",serif;font-size:2.1rem;color:var(--gold2)}.metric span{font-size:.82rem;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
    .card{position:relative;overflow:hidden;min-height:350px;border-radius:28px;padding:24px;animation:pop .95s ease .2s both}.card:before{content:"";position:absolute;inset:18px;border:1px solid rgba(179,136,72,.14);border-radius:22px}.card h2{position:relative;max-width:300px;margin:28px 0 0;font-family:"Cormorant Garamond",serif;font-size:3rem;line-height:.92}.card p{position:relative;max-width:320px;color:var(--muted);line-height:1.8}.seal{position:absolute;right:28px;bottom:28px;width:118px;height:118px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(179,136,72,.24);background:radial-gradient(circle,rgba(179,136,72,.14),transparent 70%),rgba(10,10,12,.64);color:var(--gold2);font-family:"Cormorant Garamond",serif;font-size:1.35rem}
    .side{border-radius:28px;padding:22px;animation:pop .95s ease .32s both}.intel{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.intel div{padding:15px;border-radius:18px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.05)}.intel strong{display:block;margin-bottom:8px;color:var(--gold2);font-size:.82rem;letter-spacing:.16em;text-transform:uppercase}.intel span{color:var(--muted);line-height:1.7}
    .content{display:grid;grid-template-columns:.88fr 1.12fr;gap:24px;margin-top:24px}.stack{display:grid;gap:24px}.panel,.sheet,.side{border-radius:30px;padding:26px;animation:up .9s ease both}.panel h2,.sheet h2,.side h2{margin:10px 0 0;font-family:"Cormorant Garamond",serif;font-size:3rem;line-height:.95}.panel p,.sheet>p,.side p{color:var(--muted);line-height:1.85}
    .chip{display:inline-flex;align-items:center;gap:10px;margin-top:18px;padding:12px 16px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03)}.chip:before{content:"";width:10px;height:10px;border-radius:50%;background:var(--gold2);box-shadow:0 0 14px rgba(240,211,154,.9)}
    .alert{margin-top:18px;padding:15px 16px;border-radius:18px;border:1px solid;line-height:1.7}.alert.error{border-color:rgba(165,82,82,.38);background:rgba(98,30,30,.24);color:#ffdede}.alert.success{border-color:rgba(109,139,95,.34);background:rgba(46,69,36,.24);color:#e2f1db}
    form{display:grid;gap:22px;margin-top:26px}.section{position:relative;overflow:hidden;border-radius:26px;padding:24px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(11,11,13,.88),rgba(17,13,11,.78));animation:up .85s ease both}.section:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:linear-gradient(180deg,var(--gold2),transparent)}
    .head{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:16px}.idx{font-size:.72rem;letter-spacing:.26em;text-transform:uppercase;color:var(--gold2)}.section h3{margin:0;font-family:"Cormorant Garamond",serif;font-size:1.95rem}.caption{margin:0 0 18px;color:var(--muted);line-height:1.7}
    .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.field{display:grid;gap:8px}.field.full{grid-column:1/-1}label{color:var(--gold2);font-size:.84rem;letter-spacing:.08em;text-transform:uppercase}
    input,textarea,select{width:100%;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:16px 18px;background:linear-gradient(180deg,rgba(8,8,10,.96),rgba(12,11,10,.92));color:var(--text);font:inherit;transition:.18s ease all}input:focus,textarea:focus,select:focus{outline:none;border-color:rgba(240,211,154,.42);box-shadow:0 0 0 4px rgba(179,136,72,.12);transform:translateY(-1px)}textarea{min-height:142px;resize:vertical}
    .steps{display:grid;gap:14px;margin-top:18px}.step{display:grid;grid-template-columns:auto 1fr;gap:14px}.num{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#95642c,#e8c98a);color:#100d0a;font-weight:800}.step strong{display:block;margin-bottom:4px}.step span{color:var(--muted);line-height:1.7}
    .rituals{display:grid;gap:12px;margin-top:18px}.rituals div{padding:14px 16px;border-radius:18px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);color:var(--muted)}.rituals strong{color:var(--gold2)}.final{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-top:8px}.final p{max-width:520px;color:var(--muted);line-height:1.8}
    @keyframes up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}@keyframes pop{from{opacity:0;transform:translateY(20px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes float{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(12px,-18px,0)}}
    @media (max-width:1180px){.ticker{grid-template-columns:repeat(2,minmax(0,1fr))}.hero-grid,.content{grid-template-columns:1fr}.seal{position:relative;right:auto;bottom:auto;margin-top:26px}}
    @media (max-width:760px){.page{padding-inline:14px}.ticker,.metrics,.intel,.grid{grid-template-columns:1fr}.hero,.panel,.sheet,.side,.section,.card{border-radius:24px}.hero-grid,.panel,.sheet,.side,.card{padding:22px}.actions,.final{flex-direction:column;align-items:stretch}}
  </style>
</head>
<body>
  <main class="page">
    <section class="ticker">
      <div class="tick">Portail prive • Societe Ombra</div>
      <div class="tick">Flux securise • OmbraCore</div>
      <div class="tick">Lecture staff • Dossier structure</div>
      <div class="tick">Acces controle • Recrutement</div>
    </section>
    <section class="hero">
      <div class="hero-grid">
        <div>
          <div class="eyebrow">Societe Ombra • Recrutement</div>
          <h1>Une entree sobre.<span class="sub">Un monde qui ne l’est pas.</span></h1>
          <p class="lead">Ce portail agit comme une antichambre. Chaque reponse nourrit un dossier d’entree, transmis ensuite dans un ticket prive automatiquement structure pour le staff. Ici, la precision compte plus que l’effet.</p>
          <div class="actions">${user ? `<a class="btn" href="#formulaire">Ouvrir le dossier</a><a class="ghost" href="${logoutUrl}">Changer d’identite</a>` : `<a class="btn" href="${authUrl}">Connexion via Discord</a><a class="ghost" href="#procedure">Voir la procedure</a>`}</div>
          <div class="metrics"><div class="metric"><b>01</b><span>Connexion validee</span></div><div class="metric"><b>28</b><span>Questions a analyser</span></div><div class="metric"><b>100%</b><span>Ticket injecte auto</span></div></div>
        </div>
        <div class="stack">
          <div class="card">
            <div class="tag">Dossier d’integration</div>
            <h2>Le silence pese autant que la loyaute.</h2>
            <p>Le staff ne recoit pas une simple candidature. Il recoit un dossier lisible, ordonne, pret a etre traite dans un salon prive des la transmission.</p>
            <div class="seal">OMBRA</div>
          </div>
          <div class="side"><div class="intel"><div><strong>Connexion</strong><span>Verification Discord avant acces au formulaire.</span></div><div><strong>Filtrage</strong><span>Controle du reglement avant toute soumission.</span></div><div><strong>Transmission</strong><span>Creation automatique du ticket recrutement.</span></div><div><strong>Lecture</strong><span>Reponses injectees proprement pour le staff.</span></div></div></div>
        </div>
      </div>
    </section>
    <section class="content" id="procedure">
      <div class="stack">
        <section class="panel">
          <div class="eyebrow">Portail securise</div>
          <h2>Le passage ne se fait qu’une fois. Il doit etre net.</h2>
          <p>Connecte-toi avec Discord, ouvre ton dossier, puis remplis le questionnaire comme un rapport d’entree. Une fois valide, OmbraCore ouvre automatiquement le ticket recrutement et y injecte toutes les reponses.</p>
          ${user ? `<div class="chip">Connecte en tant que <strong>${escapeHtml(user.username)}#${escapeHtml(user.discriminator || "0000")}</strong></div>` : ""}
          ${error ? `<div class="alert error">${escapeHtml(error)}</div>` : ""}
          ${submitted ? `<div class="alert success">Transmission confirmee. Le ticket recrutement a ete ouvert automatiquement sur Discord.</div>` : ""}
          ${user ? `<div class="actions" style="margin-top:22px"><a class="ghost" href="#formulaire">Continuer le dossier</a><a class="danger" href="${logoutUrl}">Deconnexion</a></div>` : `<div class="actions" style="margin-top:22px"><a class="btn" href="${authUrl}">Deverrouiller l’acces</a></div>`}
        </section>
        <section class="side">
          <div class="eyebrow">Procedure</div>
          <h2>Deroule interne</h2>
          <div class="steps"><div class="step"><div class="num">1</div><div><strong>Identification</strong><span>Connexion Discord, session signee et acces controle au dossier.</span></div></div><div class="step"><div class="num">2</div><div><strong>Evaluation</strong><span>Lecture du profil RP, de la discipline, de la tenue et de la motivation.</span></div></div><div class="step"><div class="num">3</div><div><strong>Transmission</strong><span>Creation automatique du ticket recrutement avec toutes les reponses.</span></div></div></div>
        </section>
      </div>
      <div class="stack">
        <section class="side"><div class="eyebrow">Lecture staff</div><h2>Le staff recoit un dossier, pas un message.</h2><p>Les reponses sont regroupees, presentees et archivees comme des pieces d’un meme dossier. Le resultat final est pense pour la lecture rapide, le tri des profils et la decision.</p></section>
        <section class="side"><div class="eyebrow">Ce qui est observe</div><h2>Cadre d’analyse</h2><div class="rituals"><div><strong>Tenue :</strong> coherence, ecriture, stabilite sous pression.</div><div><strong>Discipline :</strong> hierarchie, discretion, gestion des conflits.</div><div><strong>Projection :</strong> duree, implication et comprehension du role.</div></div></section>
      </div>
    </section>
    <section class="sheet" id="formulaire">
      <div class="eyebrow">Questionnaire complet</div>
      <h2>Ouverture du dossier candidat</h2>
      <p>Reponds sans masque inutile. Ce formulaire est relie directement au ticket recrutement qui sera cree a la validation.</p>
      ${user ? renderForm(submitUrl) : `<div class="actions" style="margin-top:26px"><a class="btn" href="${authUrl}">Connexion via Discord</a></div>`}
    </section>
  </main>
</body>
</html>`;
}

function renderForm(submitUrl) {
  return `<form method="post" action="${submitUrl}">
    ${renderSection("01","👤 Informations personnelles",[
      field("nom_rp","Nom RP"),field("prenom_rp","Prenom RP"),field("age_rp","Age RP"),field("origine_rp","Origine du personnage"),field("profession_rp","Profession actuelle RP")
    ],"Premiere lecture du dossier : identite du personnage et coherence generale.")}
    ${renderSection("02","🎮 Profil joueur",[
      field("age_irl","Age IRL"),field("pseudo_discord","Pseudo Discord"),field("anciennete_rp","Depuis combien de temps fais-tu du RP ?"),field("serveurs_precedents","Serveurs precedents",true),field("experience_criminelle","Experience dans des organisations criminelles",true)
    ],"Le but est d’evaluer la constance, pas d’empiler des noms de serveurs.")}
    ${renderSection("03","🧠 Experience RP",[
      field("definition_rp","Comment definirais-tu un RP serieux ?",true),field("role_important","As-tu deja occupe un role important (leader / bras droit) ?",true),field("situation_tendue","Comment reagis-tu face a une situation tendue en RP ?",true),field("scene_rp","Donne un exemple de scene RP que tu as vecu",true)
    ],"Decris ton approche avec precision, pas avec des formules toutes faites.")}
    ${renderSection("04","🎯 Motivation",[
      field("pourquoi_ombra","Pourquoi veux-tu rejoindre la Societe Ombra ?",true),field("attirance_organisation","Qu’est-ce qui t’attire dans notre organisation ?",true),field("apport","Que peux-tu apporter a la Societe ?",true),field("pourquoi_toi","Pourquoi devrions-nous te choisir toi et pas un autre ?",true)
    ],"La lucidite vaut plus qu’une posture.")}
    ${renderSection("05","⚖️ Comportement",[
      field("sanctions","As-tu deja recu des sanctions sur un serveur ? (Si oui, explique)",true),field("gestion_conflits","Comment geres-tu les conflits avec d’autres joueurs ?",true),field("hierarchie","Es-tu capable de respecter une hierarchie stricte ?",true)
    ],"La tenue hors scene compte autant que la tenue en scene.")}
    ${renderSection("06","⏱️ Disponibilites",[
      field("horaires","Horaires de jeu"),field("frequence","Frequence de connexion"),field("session_moyenne","Temps moyen par session")
    ],"Le staff doit pouvoir estimer une vraie capacite d’investissement.")}
    ${renderSection("07","🕶️ Engagement",[
      selectField("respect_reglement","Acceptes-tu de respecter le reglement ?",["Oui","Non"]),selectField("confidentialite","Acceptes-tu de garder confidentielles les informations internes ?",["Oui","Non"]),selectField("long_terme","Es-tu pret a t’investir sur le long terme ?",["Oui","Non"])
    ],"Ces reponses conditionnent l’entree dans la structure.")}
    ${renderSection("08","🎭 Mise en situation RP",[
      field("mise_en_situation","Tu es en mission discrete pour la Societe. La police commence a suspecter quelque chose. Un coequipier panique et risque de compromettre l’operation. Ta reponse :",true)
    ],"Merci d’avoir pris le temps de repondre. Dans l’ombre, chaque detail compte.")}
    <div class="final"><p>En validant, OmbraCore transmet le dossier au staff, cree automatiquement le ticket recrutement et structure chaque reponse dans le salon prive associe.</p><button type="submit">Transmettre le dossier</button></div>
  </form>`;
}

function renderSection(index, title, fields, caption = "") {
  return `<section class="section"><div class="head"><div><div class="idx">Section ${index}</div><h3>${title}</h3></div></div>${caption ? `<p class="caption">${caption}</p>` : ""}<div class="grid">${fields.join("")}</div></section>`;
}

function field(id, label, textarea = false) {
  return `<div class="field ${textarea ? "full" : ""}"><label for="${id}">${label}</label>${textarea ? `<textarea id="${id}" name="${id}" required></textarea>` : `<input id="${id}" name="${id}" required />`}</div>`;
}

function selectField(id, label, options) {
  return `<div class="field"><label for="${id}">${label}</label><select id="${id}" name="${id}" required><option value="">Choisir</option>${options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}</select></div>`;
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
