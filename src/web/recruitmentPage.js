const DEFAULT_BASE_URL = "https://societa.univers-bot.fr";

function renderRecruitmentPage({
  baseUrl = DEFAULT_BASE_URL,
  user = null,
  error = "",
  submitted = false,
  initialView = "home",
  portal = {}
}) {
  const safeData = JSON.stringify({ baseUrl, user, error, submitted, initialView, portal }).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Società Ombra • OmbraCore</title>
  <meta name="description" content="Portail de recrutement OmbraCore pour la Società Ombra." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root{--bg:#0b0b0c;--bg2:#111111;--panel:#151515;--panel2:#191919;--line:#222;--line2:#2b2b2b;--text:#f1f1f1;--muted:#a0a0a0;--gold:#c9a15d;--gold-soft:rgba(201,161,93,.15);--gold-border:rgba(201,161,93,.35);--shadow:0 12px 30px rgba(0,0,0,.22)}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-height:100vh;font-family:'Manrope',sans-serif;background:linear-gradient(180deg,#0b0b0c 0%,#101011 100%);color:var(--text)}a{text-decoration:none;color:inherit}button,input,textarea,select{font:inherit}button{cursor:pointer}.app{min-height:100vh;display:grid;grid-template-columns:280px minmax(0,1fr)}.sidebar{background:#0f0f10;border-right:1px solid var(--line);padding:24px;display:flex;flex-direction:column;gap:24px}.logo{display:flex;align-items:center;gap:14px}.logo-mark{width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#1f1f1f,#151515);border:1px solid #2a2a2a;display:grid;place-items:center;color:var(--gold);font-weight:800}.logo-text strong{display:block;font-size:1rem}.logo-text span{display:block;color:var(--muted);font-size:.82rem;margin-top:2px}.nav{display:grid;gap:8px}.nav button,.logout{width:100%;text-align:left;padding:14px 16px;border-radius:14px;border:1px solid transparent;background:transparent;color:#d8d8d8;font-weight:600;transition:.18s}.nav button:hover,.logout:hover{background:#171717;border-color:#242424}.nav button.active{background:var(--gold-soft);border-color:var(--gold-border);color:var(--text)}.sidebar-foot{margin-top:auto;display:grid;gap:10px}.session-box{padding:14px 16px;border-radius:14px;background:#151515;border:1px solid var(--line)}.session-box small{display:block;color:var(--muted);font-size:.78rem;margin-bottom:4px}.session-box strong{font-size:.92rem}
    .main{padding:24px}.topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px}.page-title h1{margin:0;font-size:1.8rem}.page-title p{margin:6px 0 0;color:var(--muted);font-size:.95rem}.top-actions{display:flex;gap:12px;flex-wrap:wrap}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border-radius:12px;border:1px solid #2a2a2a;background:#171717;color:#f1f1f1;font-weight:700;font-size:.88rem;transition:.18s}.btn:hover{transform:translateY(-1px);border-color:#333}.btn.primary{background:var(--gold);border-color:var(--gold);color:#141414}.btn.ghost{background:transparent}.btn.danger{background:transparent;border-color:#3a2323;color:#f0d0d0}.btn:disabled{opacity:.5;cursor:not-allowed;transform:none}.alert{padding:14px 16px;border-radius:14px;border:1px solid transparent;margin-bottom:16px;font-size:.92rem}.alert.error{background:#1b1010;border-color:#3f2020;color:#f0d3d3}.alert.success{background:#101910;border-color:#244024;color:#d4ead4}.alert.info{background:#121416;border-color:#25313d;color:#d7e1ea}
    .hero{padding:32px;border-radius:24px;background:linear-gradient(135deg,#151515,#121212);border:1px solid var(--line);box-shadow:var(--shadow);display:grid;grid-template-columns:minmax(0,1.2fr) 360px;gap:24px}.hero h2{margin:0;font-size:2.8rem;line-height:1.05}.hero p{margin:16px 0 0;color:var(--muted);max-width:680px;line-height:1.7}.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.hero-card{padding:20px;border-radius:20px;background:#101010;border:1px solid #232323;display:grid;gap:16px}.hero-card h3{margin:0;font-size:1.05rem}.hero-card p{margin:0;color:var(--muted);line-height:1.7}.grid{display:grid;gap:16px}.grid.cards{grid-template-columns:repeat(4,minmax(0,1fr));margin-top:20px}.card,.panel,.status-band{background:var(--panel);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow)}.card{padding:18px}.card small{display:block;color:var(--muted);font-size:.8rem;margin-bottom:8px}.card strong{font-size:1.25rem}.panel{padding:20px}.panel h3{margin:0 0 8px;font-size:1.1rem}.panel p{margin:0;color:var(--muted);line-height:1.7}
    .dashboard-grid{display:grid;gap:16px;grid-template-columns:repeat(4,minmax(0,1fr))}.status-band{padding:18px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.tone-success{background:linear-gradient(180deg,#162118,#151515)}.tone-danger{background:linear-gradient(180deg,#251616,#151515)}.tone-warning{background:linear-gradient(180deg,#262114,#151515)}.progress{height:10px;border-radius:999px;background:#101010;border:1px solid #222;overflow:hidden}.progress span{display:block;height:100%;background:linear-gradient(90deg,var(--gold),#e3bf85)}.meta-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.meta{padding:14px;border-radius:14px;background:#111;border:1px solid #222}.meta small{display:block;color:var(--muted);margin-bottom:6px}.meta strong{font-size:.95rem}
    .form-wrap{display:grid;gap:16px}.section{background:var(--panel);border:1px solid var(--line);border-radius:18px;overflow:hidden}.section-head{padding:18px 20px;border-bottom:1px solid #222;display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.section-head h3{margin:0;font-size:1rem}.section-head p{margin:6px 0 0;color:var(--muted);font-size:.9rem;line-height:1.6}.section-index{min-width:56px;height:56px;border-radius:14px;background:#101010;border:1px solid #262626;display:grid;place-items:center;color:var(--gold);font-weight:800}.section-body{padding:20px}.fields-2,.fields-3,.fields-quiz{display:grid;gap:16px}.fields-2{grid-template-columns:repeat(2,minmax(0,1fr))}.fields-3{grid-template-columns:repeat(3,minmax(0,1fr))}.fields-quiz{grid-template-columns:1fr}.field.full{grid-column:1/-1}.field label{display:block;font-size:.88rem;font-weight:700;margin-bottom:8px}.field input,.field textarea,.field select{width:100%;padding:14px 15px;border-radius:12px;border:1px solid #2a2a2a;background:#101010;color:var(--text);outline:none;transition:.18s}.field input:focus,.field textarea:focus,.field select:focus{border-color:rgba(201,161,93,.6);box-shadow:0 0 0 3px rgba(201,161,93,.12)}.field textarea{min-height:140px;resize:vertical}.quiz-note{padding:14px 16px;border-radius:14px;background:#121212;border:1px solid var(--line2);color:var(--muted);line-height:1.7}.footer-actions{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:20px;border-radius:18px;background:var(--panel);border:1px solid var(--line)}.footer-actions p{margin:0;color:var(--muted);max-width:760px;line-height:1.7}.answers-list{display:grid;gap:10px;margin-top:18px}.answer-item{padding:14px;border-radius:14px;background:#111;border:1px solid #222}.answer-item strong{display:block;font-size:.92rem;margin-bottom:6px}.answer-item span{display:block;color:var(--muted);line-height:1.65;white-space:pre-wrap}
    .admin-list{display:grid;gap:16px}.admin-card{padding:18px;border-radius:18px;background:var(--panel);border:1px solid var(--line);box-shadow:var(--shadow)}.admin-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap}.admin-head h3{margin:0;font-size:1rem}.admin-head p{margin:6px 0 0;color:var(--muted)}.admin-stack{display:grid;gap:14px;margin-top:16px}.admin-form{display:grid;gap:12px;padding:14px;border-radius:14px;background:#111;border:1px solid #222}.admin-form h4{margin:0;font-size:.92rem}.admin-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    @media(max-width:1180px){.app{grid-template-columns:1fr}.sidebar{border-right:none;border-bottom:1px solid var(--line)}.dashboard-grid,.grid.cards,.meta-grid,.admin-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.hero{grid-template-columns:1fr}.fields-2,.fields-3{grid-template-columns:1fr}}
    @media(max-width:720px){.main,.sidebar{padding:16px}.dashboard-grid,.grid.cards,.meta-grid,.admin-grid{grid-template-columns:1fr}.topbar,.hero-actions,.top-actions,.footer-actions{flex-direction:column;align-items:stretch}.btn{width:100%}}
  </style>
</head>
<body>
  <div id="app"></div>
  <script>window.__OMBRA_PORTAL__=${safeData};</script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel">
    const state = window.__OMBRA_PORTAL__ || {};
    const authUrl = (state.baseUrl || '${DEFAULT_BASE_URL}') + '/recruitment/login';
    const submitUrl = (state.baseUrl || '${DEFAULT_BASE_URL}') + '/recruitment/submit';
    const logoutUrl = (state.baseUrl || '${DEFAULT_BASE_URL}') + '/recruitment/logout';
    const adminUrl = (state.baseUrl || '${DEFAULT_BASE_URL}') + '/admin';
    const draftStorageKey = 'ombra_draft_clean';
    const sections = [
      { index: '01', title: 'Informations RP', caption: 'Identité de ton personnage.', layout: 'fields-2', fields: [['Nom RP','nom_rp'],['Prénom RP','prenom_rp'],['Âge RP','age_rp'],['Origine','origine_rp'],['Profession actuelle','profession_rp','text',true]] },
      { index: '02', title: 'Profil joueur', caption: 'Parcours et présence.', layout: 'fields-2', fields: [['Âge IRL','age_irl','number'],['Pseudo Discord','pseudo_discord'],['Ancienneté RP','anciennete_rp'],['Disponibilités générales','disponibilite_generale'],['Serveurs précédents','serveurs_precedents','textarea',true],['Expérience criminelle','experience_criminelle','textarea',true]] },
      { index: '03', title: 'Expérience', caption: 'Vision du RP et gestion des situations.', layout: 'fields-2', fields: [['Définition du RP sérieux','definition_rp','textarea',true],['Rôle important déjà occupé','role_important','textarea',true],['Gestion d’une situation tendue','situation_tendue','textarea',true],['Exemple de scène RP','scene_rp','textarea',true]] },
      { index: '04', title: 'Motivation', caption: 'Pourquoi Società Ombra.', layout: 'fields-2', fields: [['Pourquoi nous rejoindre','pourquoi_ombra','textarea',true],['Ce qui t’attire chez nous','attirance_organisation','textarea',true],['Ce que tu peux apporter','apport','textarea',true],['Pourquoi toi','pourquoi_toi','textarea',true]] },
      { index: '05', title: 'Comportement', caption: 'Discipline et comportement hors scène.', layout: 'fields-2', fields: [['Sanctions passées','sanctions','textarea',true],['Gestion des conflits','gestion_conflits','textarea',true],['Rapport à la hiérarchie','hierarchie','textarea',true]] },
      { index: '06', title: 'Disponibilités', caption: 'Temps de jeu et fréquence.', layout: 'fields-3', fields: [['Horaires','horaires'],['Fréquence','frequence'],['Temps moyen / session','session_moyenne']] },
      { index: '07', title: 'Engagement', caption: 'Cadre et confidentialité.', layout: 'fields-3', fields: [['Respect du règlement','respect_reglement','select',false,['Oui','Non']],['Confidentialité','confidentialite','select',false,['Oui','Non']],['Engagement long terme','long_terme','select',false,['Oui','Non']]] },
      { index: '08', title: 'Situation RP', caption: 'Réaction face à une situation sensible.', layout: 'fields-2', fields: [['Mise en situation RP','mise_en_situation','textarea',true]] }
    ];
    const quizSections = [
      { index: '09', title: 'Questionnaire Ombra I', caption: 'Fondations, règles et philosophie générale.', fields: [['Sur quoi repose la Società Ombra depuis sa naissance ?','quiz_01',['Violence, peur, territoire','Discrétion, contrôle, influence','Argent, armes, chaos']],['Quelle approche décrit le mieux la Società à Los Santos ?','quiz_02',['Elle conquiert les rues par la guerre','Elle infiltre et devient nécessaire','Elle s’expose pour dominer rapidement']],['Quel type de RP est attendu ?','quiz_03',['RP troll et provocateur','RP sérieux et cohérent','RP libre sans cadre']],['Que faut-il éviter selon la philosophie de la Società ?','quiz_04',['Le contrôle et la patience','Le chaos et l’exposition','La hiérarchie et le silence']],['Si un conflit HRP apparaît, quelle est la bonne attitude ?','quiz_05',['Le régler publiquement dans le général','Rester calme et éviter le conflit public','Ping tout le staff immédiatement']]] },
      { index: '10', title: 'Questionnaire Ombra II', caption: 'Discrétion, méthode et fonctionnement interne.', fields: [['Que représente la visibilité pour la Società Ombra ?','quiz_06',['Une preuve de puissance','Une faiblesse','Une obligation']],['Quel type d’action correspond à la méthode Ombra ?','quiz_07',['Action planifiée, propre et silencieuse','Action rapide, bruyante et dissuasive','Action improvisée selon l’urgence']],['Que doit faire un membre avec les informations internes ?','quiz_08',['Les garder confidentielles','Les partager à ses proches','Les utiliser librement hors contexte']],['Comment la Società contrôle-t-elle le jeu ?','quiz_09',['Par le pouvoir visible','Par le pouvoir invisible','Par la peur publique']],['Quel comportement est interdit sur le Discord ?','quiz_10',['Le respect des salons','Le spam et les mentions abusives','Les tickets clairs']]] },
      { index: '11', title: 'Questionnaire Ombra III', caption: 'Structure, guerre invisible et discipline.', fields: [['La structure Ombra est :','quiz_11',['Ouverte et transparente','Cloisonnée avec identités protégées','Basée sur l’improvisation']],['Pourquoi la Società évite-t-elle les guerres inutiles ?','quiz_12',['Parce qu’elles coûtent cher et exposent','Parce qu’elle n’a pas d’hommes','Parce qu’elles sont interdites par la police']],['Quel est le bon usage des tickets ?','quiz_13',['Les utiliser quand c’est nécessaire, avec respect','Les spam pour accélérer','Les ouvrir pour chaque détail mineur']],['Quand un obstacle apparaît pour la Società, l’idée est de :','quiz_14',['Créer un affrontement direct','Le faire disparaître proprement','Le menacer publiquement']],['Que vaut une candidature pour la Società ?','quiz_15',['Un simple formulaire','Un dossier sérieux et honnête','Une formalité sans conséquence']]] },
      { index: '12', title: 'Questionnaire Ombra IV', caption: 'Lecture RP, façade et lignes de conduite.', fields: [['Quel type de pouvoir attire les balles selon la philosophie ?','quiz_16',['Le pouvoir invisible','Le pouvoir visible','Le pouvoir financier']],['Face à une scène RP en cours, il faut :','quiz_17',['Préserver l’immersion et la cohérence','La casser si elle ralentit','Privilégier le HRP']],['Quelle activité correspond à la couverture de la Società ?','quiz_18',['Import-export discret et entreprises de façade','Streams publics et réseaux sociaux','Convois armés visibles']],['Quand un membre devient trop bruyant, la logique Ombra est :','quiz_19',['L’exposer publiquement','Réduire ou effacer sa présence','L’encourager à s’imposer']],['La force centrale de la Società est surtout :','quiz_20',['L’information','La quantité d’armes','La présence médiatique']]] },
      { index: '13', title: 'Questionnaire Ombra V', caption: 'Hiérarchie, comportement et compréhension globale.', fields: [['Quel comportement est attendu envers les autres membres ?','quiz_21',['Respect et professionnalisme','Compétition et provocation','Distance hostile']],['Comment les ordres circulent-ils dans la structure ?','quiz_22',['Ils descendent','Ils montent uniquement','Ils sont publics']],['Quel est le bon réflexe face à une situation tendue en RP ?','quiz_23',['Garder le contrôle et protéger l’opération','Paniquer avant les autres','Changer totalement de rôle']],['Que signifie rejoindre la Società Ombra ?','quiz_24',['Entrer dans une machine organisée','Entrer dans un gang classique','Obtenir un statut décoratif']],['Quelle phrase décrit le mieux la Società Ombra ?','quiz_25',['Nous faisons du bruit pour exister','Nous contrôlons sans être vus','Nous dominons par la guerre ouverte']]] }
    ];
    const { useEffect, useMemo, useState } = React;
    const formatDate = (value) => value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }) : 'Non défini';
    const toneClass = (tone) => tone === 'success' ? 'tone-success' : tone === 'danger' ? 'tone-danger' : tone === 'warning' ? 'tone-warning' : '';

    function App() {
      const [view, setView] = useState(state.initialView || 'home');
      const [draft, setDraft] = useState(() => {
        try { return JSON.parse(localStorage.getItem(draftStorageKey) || '{}'); } catch { return {}; }
      });
      useEffect(() => { localStorage.setItem(draftStorageKey, JSON.stringify(draft)); }, [draft]);
      const app = state.portal?.latestApplication || null;
      const ticket = state.portal?.latestRecruitmentTicket || null;
      const safeAnswers = Array.isArray(app?.answers) ? app.answers : [];
      const safeStatusLabel = app?.status?.label || 'Transmis';
      const safeQuizScore = Number.isFinite(app?.quizScore) ? app.quizScore : 0;
      const rulesAccepted = Boolean(state.portal?.rulesAccepted);
      const recruitmentLocked = Boolean(state.portal?.recruitmentLocked);
      const lockReason = state.portal?.lockReason || '';
      const canStartFresh = Boolean(app && app.status?.key === 'auto_refused' && !app.locked);
      const progress = useMemo(() => {
        const allFields = [...sections.flatMap((section) => section.fields), ...quizSections.flatMap((section) => section.fields)];
        const total = allFields.length;
        const complete = allFields.filter(([, key]) => String(draft[key] || '').trim()).length;
        return { total, complete, percent: total ? Math.round((complete / total) * 100) : 0 };
      }, [draft]);
      const currentStatus = recruitmentLocked
        ? 'Refus automatique définitif'
        : app
          ? app.status.label
          : progress.percent > 0
            ? 'En cours'
            : 'Non commencé';

      function updateField(key, value) { setDraft((current) => ({ ...current, [key]: value })); }
      function clearDraft() { localStorage.removeItem(draftStorageKey); setDraft({}); }
      function restartApplication() { clearDraft(); setView('form'); }

      const DashboardCards = () => (
        <div className='dashboard-grid'>
          <div className='card'><small>Statut</small><strong>{currentStatus}</strong></div>
          <div className='card'><small>Progression</small><strong>{progress.percent}%</strong><div className='progress' style={{marginTop:'12px'}}><span style={{width: progress.percent + '%'}} /></div></div>
          <div className='card'><small>Dernière modification</small><strong>{app ? formatDate(app.updatedAt) : progress.percent ? 'Brouillon local' : 'Jamais'}</strong></div>
          <div className='card'><small>Ticket recrutement</small><strong>{ticket ? '#' + String(ticket.ticketNumber).padStart(4, '0') : 'Non créé'}</strong></div>
        </div>
      );

      const HomeView = () => (
        <>
          <section className='hero'>
            <div>
              <h2>Società Ombra</h2>
              <p>Portail OmbraCore de candidature, contrôle de cohérence RP et transmission automatique du dossier vers Discord une fois validé.</p>
              <div className='hero-actions'>
                <a className='btn primary' href={authUrl}>Se connecter avec Discord</a>
                <button type='button' className='btn' onClick={() => setView(state.user ? 'dossier' : 'access')}>Accéder au portail</button>
              </div>
            </div>
            <div className='hero-card'>
              <h3>Lecture rapide</h3>
              <p>Âge IRL minimum : 18 ans. Questionnaire lore et règlement : 25 questions. Minimum requis : 20 bonnes réponses pour que le dossier soit transmis.</p>
              <div className='meta-grid'>
                <div className='meta'><small>Session</small><strong>{state.user ? '@' + state.user.username : 'Non connectée'}</strong></div>
                <div className='meta'><small>Règlement</small><strong>{rulesAccepted ? 'Validé' : 'En attente'}</strong></div>
                <div className='meta'><small>Transmission</small><strong>Ticket Discord auto</strong></div>
              </div>
            </div>
          </section>
          <div className='grid cards'>
            <div className='card'><small>Accès</small><strong>Connexion Discord</strong><p style={{color:'var(--muted)',lineHeight:'1.7'}}>Session contrôlée avant toute ouverture de dossier.</p></div>
            <div className='card'><small>Questionnaire</small><strong>25 questions à choix</strong><p style={{color:'var(--muted)',lineHeight:'1.7'}}>Évaluation lore, discipline, RP sérieux et compréhension Ombra.</p></div>
            <div className='card'><small>Filtrage</small><strong>Refus automatique</strong><p style={{color:'var(--muted)',lineHeight:'1.7'}}>Âge IRL insuffisant ou score inférieur à 20/25.</p></div>
            <div className='card'><small>Discord</small><strong>Ticket recrutement auto</strong><p style={{color:'var(--muted)',lineHeight:'1.7'}}>Le ticket s’ouvre automatiquement après une transmission valide.</p></div>
          </div>
        </>
      );

      const AccessView = () => (
        <div className='panel'>
          <h3>Connexion requise</h3>
          <p>Le portail OmbraCore nécessite une session Discord valide avant l’ouverture du dossier candidat et l’accès au suivi interne.</p>
          <div className='top-actions' style={{marginTop:'18px'}}>
            <a className='btn primary' href={authUrl}>Connexion via Discord</a>
            <button type='button' className='btn ghost' onClick={() => setView('home')}>Retour accueil</button>
          </div>
        </div>
      );

      const DossierView = () => (
        <div className='grid'>
          <DashboardCards />
          <div className={'status-band ' + (app ? toneClass(app.status.tone) : '')}>
            <div>
              <small style={{display:'block',color:'var(--muted)',marginBottom:'6px'}}>Mon dossier</small>
              <strong style={{fontSize:'1.15rem'}}>{currentStatus}</strong>
              <div style={{color:'var(--muted)',marginTop:'6px'}}>
                {recruitmentLocked
                  ? lockReason || 'Candidature verrouillée définitivement.'
                  : app
                    ? 'Dernière activité : ' + formatDate(app.updatedAt)
                    : progress.percent
                      ? 'Brouillon local prêt à reprendre.'
                      : 'Aucun dossier transmis pour le moment.'}
              </div>
            </div>
            <div className='top-actions'>
              {!recruitmentLocked ? <button type='button' className='btn primary' onClick={() => setView('form')}>{app ? 'Ouvrir le formulaire' : 'Commencer le formulaire'}</button> : null}
              <button type='button' className='btn' onClick={() => setView('status')}>Voir le statut</button>
              {!app && progress.complete > 0 ? <button type='button' className='btn danger' onClick={clearDraft}>Supprimer le brouillon</button> : null}
              {canStartFresh ? <button type='button' className='btn danger' onClick={restartApplication}>Repartir de zéro</button> : null}
            </div>
          </div>
        </div>
      );

      const StatusView = () => (
        <div className='grid'>
          <DashboardCards />
          <div className={'status-band ' + (app ? toneClass(app.status.tone) : '')}>
            <div>
              <small style={{display:'block',color:'var(--muted)',marginBottom:'6px'}}>État du dossier</small>
              <strong style={{fontSize:'1.15rem'}}>{currentStatus}</strong>
              <div style={{color:'var(--muted)',marginTop:'6px'}}>Dernière activité : {app ? formatDate(app.updatedAt) : progress.percent ? 'Brouillon local' : 'Aucune activité'}</div>
            </div>
            <div className='top-actions'>
              {!recruitmentLocked ? <button type='button' className='btn' onClick={() => setView('form')}>{app ? 'Ouvrir le formulaire' : 'Modifier le brouillon'}</button> : null}
              {!app && rulesAccepted && !recruitmentLocked ? <button type='button' className='btn primary' onClick={() => setView('form')}>Soumettre</button> : null}
              {canStartFresh ? <button type='button' className='btn danger' onClick={restartApplication}>Nouvelle candidature</button> : null}
            </div>
          </div>
          {app ? (
            <div className='panel'>
              <h3>Détails du dossier</h3>
              <div className='meta-grid' style={{marginTop:'16px'}}>
                <div className='meta'><small>Score quiz</small><strong>{app.quizScore || 0}/25</strong></div>
                <div className='meta'><small>Âge IRL</small><strong>{app.ageIrl || 'Non renseigné'}</strong></div>
                <div className='meta'><small>Transmission</small><strong>{ticket ? '#' + String(ticket.ticketNumber).padStart(4, '0') : 'Aucun ticket'}</strong></div>
              </div>
              {app.notes ? <div className='alert info' style={{marginTop:'16px'}}>{app.notes}</div> : null}
              <div className='answers-list'>
                {safeAnswers.slice(0, 8).map((item, index) => (
                  <div className='answer-item' key={item.question + index}>
                    <strong>{item.question}</strong>
                    <span>{item.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      );

      const ConfirmationView = () => (
        <div className='grid'>
          <div className='status-band tone-success'>
            <div>
              <small style={{display:'block',color:'var(--muted)',marginBottom:'6px'}}>Transmission scellée</small>
              <strong style={{fontSize:'1.2rem'}}>Le dossier a été transmis correctement.</strong>
              <div style={{color:'var(--muted)',marginTop:'8px'}}>
                OmbraCore a enregistré le dossier, calculé le score du questionnaire et poussé la candidature dans le circuit recrutement Discord.
              </div>
            </div>
            <div className='top-actions'>
              <button type='button' className='btn primary' onClick={() => setView('status')}>Voir le statut du dossier</button>
              <button type='button' className='btn' onClick={() => setView('dossier')}>Retour au dossier</button>
            </div>
          </div>
          <div className='dashboard-grid'>
            <div className='card'><small>Statut</small><strong>{app ? safeStatusLabel : 'Transmis'}</strong></div>
            <div className='card'><small>Score questionnaire</small><strong>{app ? safeQuizScore + '/25' : 'En cours'}</strong></div>
            <div className='card'><small>Référence ticket</small><strong>{ticket ? '#' + String(ticket.ticketNumber).padStart(4, '0') : 'Création en cours'}</strong></div>
            <div className='card'><small>Dernière transmission</small><strong>{app ? formatDate(app.updatedAt) : formatDate(new Date())}</strong></div>
          </div>
          <div className='panel'>
            <h3>Lecture côté staff</h3>
            <p>Le ticket recrutement reçoit automatiquement un résumé staff, le score du questionnaire et les réponses regroupées dans un format lisible. Tu n’as rien d’autre à faire pour le moment.</p>
            <div className='meta-grid' style={{marginTop:'16px'}}>
              <div className='meta'><small>Questionnaire</small><strong>{app ? safeQuizScore + '/25' : 'N/A'}</strong></div>
              <div className='meta'><small>Ticket</small><strong>{ticket ? 'Ouvert' : 'En attente'}</strong></div>
              <div className='meta'><small>Suivi</small><strong>DM + portail</strong></div>
            </div>
          </div>
          {app ? (
            <div className='panel'>
              <h3>Aperçu rapide du dossier</h3>
              <div className='answers-list'>
                {safeAnswers.slice(0, 6).map((item, index) => (
                  <div className='answer-item' key={item.question + index}>
                    <strong>{item.question}</strong>
                    <span>{item.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      );

      const AdminView = () => (
        <div className='admin-list'>
          {!state.portal?.isAdmin ? <div className='alert error'>Accès admin refusé.</div> : null}
          {(state.portal?.adminApplications || []).map((item) => (
            <div className='admin-card' key={item.id}>
              <div className='admin-head'>
                <div>
                  <h3>{item.userTag}</h3>
                  <p>Référence : {item.id} • Score quiz : {item.quizScore || 0}/25 • Âge IRL : {item.ageIrl || 'N/R'}</p>
                </div>
                <div className={'status-band ' + toneClass(item.status.tone)} style={{padding:'12px 14px'}}>
                  <strong>{item.status.label}</strong>
                </div>
              </div>
              <div className='meta-grid' style={{marginTop:'16px'}}>
                <div className='meta'><small>Créée le</small><strong>{formatDate(item.createdAt)}</strong></div>
                <div className='meta'><small>Dernière mise à jour</small><strong>{formatDate(item.updatedAt)}</strong></div>
                <div className='meta'><small>Entretien</small><strong>{item.interviewScheduledFor ? formatDate(item.interviewScheduledFor) : 'Non fixé'}</strong></div>
              </div>
              {item.notes ? <div className='alert info' style={{marginTop:'16px'}}>{item.notes}</div> : null}
              {item.dossierUrl ? (
                <div className='top-actions' style={{marginTop:'16px'}}>
                  <a className='btn' href={item.dossierUrl}>Consulter le dossier complet</a>
                </div>
              ) : null}
              <div className='admin-stack'>
                <form className='admin-form' method='POST' action={adminUrl + '/recruitment/' + item.id + '/status'}>
                  <h4>Décision staff</h4>
                  <div className='admin-grid'>
                    <div className='field'>
                      <label>Statut</label>
                      <select name='status' defaultValue='on_hold'>
                        <option value='accepted'>Acceptée</option>
                        <option value='refused'>Refusée</option>
                        <option value='on_hold'>En étude</option>
                      </select>
                    </div>
                    <div className='field'>
                      <label>Note staff</label>
                      <input type='text' name='note' placeholder='Motif ou précision transmise en DM' />
                    </div>
                  </div>
                  <div className='top-actions'>
                    <button type='submit' className='btn primary'>Mettre à jour</button>
                  </div>
                </form>
                <form className='admin-form' method='POST' action={adminUrl + '/recruitment/' + item.id + '/schedule'}>
                  <h4>Convocation recrutement</h4>
                  <div className='admin-grid'>
                    <div className='field'>
                      <label>Date et heure</label>
                      <input type='datetime-local' name='scheduled_for' />
                    </div>
                    <div className='field'>
                      <label>Instruction</label>
                      <input type='text' name='schedule_note' placeholder='Ex: Présence vocale requise 10 min avant' />
                    </div>
                  </div>
                  <div className='top-actions'>
                    <button type='submit' className='btn'>Envoyer la convocation</button>
                  </div>
                </form>
                <form className='admin-form' method='POST' action={adminUrl + '/recruitment/' + item.id + '/reset-ticket'}>
                  <h4>Réinitialisation ticket</h4>
                  <p style={{margin:'0',color:'var(--muted)',lineHeight:'1.7'}}>
                    Supprime le ticket recrutement ou l’entretien déjà présent, nettoie l’ancien circuit, puis recrée un ticket propre avec réinjection complète du dossier.
                  </p>
                  <div className='top-actions'>
                    <button type='submit' className='btn danger'>Réinitialiser le ticket</button>
                  </div>
                </form>
                <form className='admin-form' method='POST' action={adminUrl + '/recruitment/' + item.id + '/archive-tickets'}>
                  <h4>Archivage tickets</h4>
                  <p style={{margin:'0',color:'var(--muted)',lineHeight:'1.7'}}>
                    Ferme et archive tous les tickets recrutement ou entretiens liés à ce candidat sans les recréer.
                  </p>
                  <div className='top-actions'>
                    <button type='submit' className='btn'>Archiver les tickets</button>
                  </div>
                </form>
                <form className='admin-form' method='POST' action={adminUrl + '/recruitment/' + item.id + '/delete-tickets'}>
                  <h4>Suppression tickets</h4>
                  <p style={{margin:'0',color:'var(--muted)',lineHeight:'1.7'}}>
                    Supprime les tickets recrutement en trop ou restants et nettoie leur état en base.
                  </p>
                  <div className='top-actions'>
                    <button type='submit' className='btn danger'>Supprimer les tickets</button>
                  </div>
                </form>
              </div>
            </div>
          ))}
          {state.portal?.isAdmin && !(state.portal?.adminApplications || []).length ? (
            <div className='panel'>
              <h3>Aucune candidature</h3>
              <p>Aucun dossier n’est actuellement remonté dans la gestion web.</p>
            </div>
          ) : null}
        </div>
      );

      const FormView = () => (
        <div className='form-wrap'>
          {!state.user ? <div className='alert error'>Connexion Discord requise avant de remplir le formulaire.</div> : null}
          {state.user && !rulesAccepted ? <div className='alert error'>Tu dois accepter le règlement sur Discord avant de soumettre la candidature.</div> : null}
          {recruitmentLocked ? <div className='alert error'>{lockReason || 'Candidature verrouillée définitivement.'}</div> : null}
          {app && app.status?.key === 'auto_refused' && !app.locked ? <div className='alert info'>Une précédente candidature a été refusée automatiquement. Tu peux repartir sur un nouveau brouillon si tu veux corriger ton questionnaire.</div> : null}
          {sections.map((section) => (
            <section className='section' key={section.index}>
              <div className='section-head'>
                <div>
                  <h3>{section.title}</h3>
                  <p>{section.caption}</p>
                </div>
                <div className='section-index'>{section.index}</div>
              </div>
              <div className='section-body'>
                <div className={section.layout}>
                  {section.fields.map(([label, key, type, full, options]) => (
                    <div className={'field ' + (full ? 'full' : '')} key={key}>
                      <label>{label}</label>
                      {type === 'textarea' ? <textarea name={key} value={draft[key] || ''} onChange={(e) => updateField(key, e.target.value)} /> :
                       type === 'select' ? <select name={key} value={draft[key] || ''} onChange={(e) => updateField(key, e.target.value)}><option value=''>Sélectionner</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select> :
                       <input type={type || 'text'} name={key} value={draft[key] || ''} onChange={(e) => updateField(key, e.target.value)} />}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
          {quizSections.map((section) => (
            <section className='section' key={section.index}>
              <div className='section-head'>
                <div>
                  <h3>{section.title}</h3>
                  <p>{section.caption}</p>
                </div>
                <div className='section-index'>{section.index}</div>
              </div>
              <div className='section-body'>
                <div className='quiz-note'>Ce bloc compte dans l’évaluation automatique. Minimum requis pour transmission : <strong>20 / 25</strong>.</div>
                <div className='fields-quiz' style={{marginTop:'16px'}}>
                  {section.fields.map(([label, key, options]) => (
                    <div className='field full' key={key}>
                      <label>{label}</label>
                      <select name={key} value={draft[key] || ''} onChange={(e) => updateField(key, e.target.value)}>
                        <option value=''>Sélectionner une réponse</option>
                        {options.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
          <form action={submitUrl} method='POST'>
            {Object.entries(draft).map(([key, value]) => <input key={key} type='hidden' name={key} value={value} />)}
            <div className='footer-actions'>
              <p>Âge IRL minimum requis : 18 ans. Tant que le dossier n’est pas transmis, tu peux supprimer ton brouillon et repartir de zéro. Si la transmission est valide, OmbraCore crée automatiquement le ticket recrutement sur Discord avec toutes les réponses injectées dedans.</p>
              <div className='top-actions'>
                <button type='button' className='btn danger' onClick={clearDraft}>Supprimer le brouillon</button>
                <button type='submit' className='btn primary' disabled={!state.user || !rulesAccepted || recruitmentLocked}>Soumettre la candidature</button>
              </div>
            </div>
          </form>
          {ticket && ticket.status === 'open' ? (
            <form action={submitUrl} method='POST' className='footer-actions'>
              {Object.entries(draft).map(([key, value]) => <input key={'force-' + key} type='hidden' name={key} value={value} />)}
              <input type='hidden' name='force_resend' value='1' />
              <p>Un ticket recrutement existe déjà. Si tu as eu un problème d’envoi, tu peux forcer une seconde injection du dossier dans le ticket existant sans attendre une suppression manuelle.</p>
              <div className='top-actions'>
                <button type='submit' className='btn' disabled={!state.user || !rulesAccepted || recruitmentLocked}>Forcer l’envoi dans le ticket existant</button>
              </div>
            </form>
          ) : null}
        </div>
      );

      const titles = {
        home: ['Dashboard principal', 'Vue générale du portail de recrutement OmbraCore.'],
        dossier: ['Mon dossier', 'Suivi du dossier candidat et accès rapide au formulaire.'],
        form: ['Formulaire', 'Dossier candidat complet, questionnaire inclus et transmission directe.'],
        status: ['Statut', 'État de traitement du dossier candidat.'],
        confirmation: ['Transmission', 'Résumé clair du dossier envoyé et du ticket recrutement.'],
        access: ['Connexion Discord', 'Validation de session avant accès au portail.'],
        admin: ['Gestion', 'Pilotage staff des candidatures et convocations recrutement.']
      };

      const pageTitle = Array.isArray(titles[view]) ? titles[view] : titles.home;
      const pageHeading = pageTitle?.[0] || titles.home[0];
      const pageDescription = pageTitle?.[1] || titles.home[1];

      return (
        <div className='app'>
          <aside className='sidebar'>
            <div className='logo'>
              <div className='logo-mark'>SO</div>
              <div className='logo-text'><strong>Società Ombra</strong><span>OmbraCore</span></div>
            </div>
            <div className='nav'>
              <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}>Dashboard</button>
              <button className={view === 'dossier' ? 'active' : ''} onClick={() => setView(state.user ? 'dossier' : 'access')}>Mon dossier</button>
              <button className={view === 'form' ? 'active' : ''} onClick={() => setView(state.user ? 'form' : 'access')}>Formulaire</button>
              <button className={view === 'status' ? 'active' : ''} onClick={() => setView(state.user ? 'status' : 'access')}>Statut</button>
              {state.portal?.isAdmin ? <button className={view === 'admin' ? 'active' : ''} onClick={() => setView('admin')}>Gestion</button> : null}
              <button className={view === 'access' ? 'active' : ''} onClick={() => setView('access')}>Connexion</button>
            </div>
            <div className='sidebar-foot'>
              <div className='session-box'><small>Session</small><strong>{state.user ? '@' + state.user.username : 'Non connectée'}</strong></div>
              {state.user ? <a className='logout' href={logoutUrl}>Déconnexion</a> : <a className='logout' href={authUrl}>Connexion Discord</a>}
            </div>
          </aside>
          <main className='main'>
            <div className='topbar'>
              <div className='page-title'><h1>{pageHeading}</h1><p>{pageDescription}</p></div>
              <div className='top-actions'>
                <button type='button' className='btn ghost' onClick={() => setView('home')}>Accueil</button>
                <button type='button' className='btn' onClick={() => setView(state.user ? 'form' : 'access')}>Accéder au recrutement</button>
                {state.portal?.isAdmin ? <button type='button' className='btn' onClick={() => setView('admin')}>Gestion admin</button> : null}
              </div>
            </div>
            {state.error ? <div className='alert error'>{state.error}</div> : null}
            {state.submitted && view !== 'confirmation' ? <div className='alert success'>Votre dossier a été transmis avec succès. OmbraCore a ouvert automatiquement le ticket recrutement sur Discord.</div> : null}
            {view === 'home' ? HomeView() : null}
            {view === 'access' ? AccessView() : null}
            {view === 'dossier' ? DossierView() : null}
            {view === 'form' ? FormView() : null}
            {view === 'status' ? StatusView() : null}
            {view === 'confirmation' ? ConfirmationView() : null}
            {view === 'admin' ? AdminView() : null}
          </main>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('app')).render(<App />);
  </script>
</body>
</html>`;
}

function renderCandidateDetailPage({
  baseUrl = DEFAULT_BASE_URL,
  viewer = null,
  application = null,
  ownerTag = "Candidat",
  error = ""
}) {
  if (!application) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dossier introuvable • Società Ombra</title>
  <style>
    body{margin:0;font-family:Manrope,system-ui,sans-serif;background:#0b0b0c;color:#f1f1f1;display:grid;place-items:center;min-height:100vh}
    .box{max-width:680px;padding:32px;border-radius:24px;background:#151515;border:1px solid #262626}
    a{color:#c9a15d;text-decoration:none;font-weight:700}
  </style>
</head>
<body>
  <div class="box">
    <h1>Dossier introuvable</h1>
    <p>${error || "Le dossier demandé est introuvable ou n'est plus accessible."}</p>
    <a href="${baseUrl}/recruitment">Retour au portail</a>
  </div>
</body>
</html>`;
  }

  const answers = Array.isArray(application.answers) ? application.answers : [];
  const answerMarkup = answers
    .map(
      (item) => `
      <section class="answer">
        <h3>${escapeHtml(item.question)}</h3>
        <p>${escapeHtml(item.answer).replace(/\n/g, "<br />")}</p>
      </section>`
    )
    .join("");

  const interviewDate = application.interviewScheduledFor
    ? new Date(application.interviewScheduledFor).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })
    : "Non fixé";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dossier • ${escapeHtml(ownerTag)}</title>
  <meta name="description" content="Lecture détaillée d'une candidature Società Ombra." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root{--bg:#0b0b0c;--panel:#151515;--panel2:#101010;--line:#232323;--text:#f1f1f1;--muted:#a0a0a0;--gold:#c9a15d;--shadow:0 18px 40px rgba(0,0,0,.22)}
    *{box-sizing:border-box}body{margin:0;font-family:'Manrope',sans-serif;background:linear-gradient(180deg,#0b0b0c 0%,#101011 100%);color:var(--text)}
    a{text-decoration:none;color:inherit}.page{max-width:1320px;margin:0 auto;padding:28px}.top{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap;margin-bottom:22px}
    .title h1{margin:0;font-size:2rem}.title p{margin:8px 0 0;color:var(--muted);max-width:760px;line-height:1.7}.actions{display:flex;gap:12px;flex-wrap:wrap}
    .btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border-radius:12px;border:1px solid #2b2b2b;background:#171717;color:#f1f1f1;font-weight:700}
    .btn.primary{background:var(--gold);border-color:var(--gold);color:#141414}.hero,.panel,.answer{background:var(--panel);border:1px solid var(--line);border-radius:20px;box-shadow:var(--shadow)}
    .hero{padding:22px;margin-bottom:18px}.grid{display:grid;grid-template-columns:minmax(0,1.2fr) 360px;gap:18px}.panel{padding:18px}.meta-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px}
    .meta{padding:14px;border-radius:14px;background:var(--panel2);border:1px solid var(--line)}.meta small{display:block;color:var(--muted);margin-bottom:6px}.meta strong{font-size:.96rem}
    .answers{display:grid;gap:14px}.answer{padding:18px}.answer h3{margin:0 0 10px;font-size:1rem}.answer p{margin:0;color:#ddd;line-height:1.75;white-space:normal}
    .stack{display:grid;gap:18px}.note{padding:14px 16px;border-radius:14px;background:#121416;border:1px solid #25313d;color:#d7e1ea;line-height:1.7}
    @media(max-width:980px){.grid{grid-template-columns:1fr}.meta-grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <div class="page">
    <div class="top">
      <div class="title">
        <h1>Dossier candidat • ${escapeHtml(ownerTag)}</h1>
        <p>Lecture complète et structurée de la candidature Società Ombra, pensée pour éviter le spam dans le ticket tout en gardant chaque réponse accessible proprement.</p>
      </div>
      <div class="actions">
        <a class="btn" href="${baseUrl}/recruitment">Portail</a>
        ${viewer ? `<span class="btn">Session : @${escapeHtml(viewer.username)}</span>` : ""}
      </div>
    </div>
    <div class="hero">
      <div class="meta-grid">
        <div class="meta"><small>Référence</small><strong>${escapeHtml(application.id)}</strong></div>
        <div class="meta"><small>Statut</small><strong>${escapeHtml(application.status?.label || "Transmis")}</strong></div>
        <div class="meta"><small>Score questionnaire</small><strong>${application.quizScore || 0}/25</strong></div>
        <div class="meta"><small>Âge IRL</small><strong>${application.ageIrl || "Non renseigné"}</strong></div>
        <div class="meta"><small>Dernière mise à jour</small><strong>${formatDateString(application.updatedAt)}</strong></div>
        <div class="meta"><small>Entretien</small><strong>${escapeHtml(interviewDate)}</strong></div>
      </div>
    </div>
    <div class="grid">
      <div class="answers">
        ${answerMarkup}
      </div>
      <div class="stack">
        <div class="panel">
          <h3>Résumé</h3>
          <div class="meta-grid">
            <div class="meta"><small>Questions</small><strong>${answers.length}</strong></div>
            <div class="meta"><small>Token dossier</small><strong>${escapeHtml(application.portalToken || "N/A")}</strong></div>
          </div>
        </div>
        ${application.notes ? `<div class="note">${escapeHtml(application.notes)}</div>` : ""}
      </div>
    </div>
  </div>
</body>
</html>`;
}

function formatDateString(value) {
  return value ? new Date(value).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" }) : "Non défini";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = { renderRecruitmentPage, renderCandidateDetailPage };
