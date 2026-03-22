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
  <meta name="description" content="Portail OmbraCore de la Società Ombra, dossier classifié et transmission interne." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root{--bg:#050506;--bg2:#0b0b0d;--panel:rgba(16,15,18,.92);--panel2:rgba(9,8,10,.92);--line:#6f5130;--line2:rgba(183,138,74,.45);--gold:#b78a4a;--gold2:#e5c88f;--text:#f0e6d7;--muted:#a39179;--wine:#4a1515;--ok:#223121;--shadow:0 30px 90px rgba(0,0,0,.55)}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-height:100vh;font-family:'Manrope',sans-serif;background:radial-gradient(circle at 15% 12%,rgba(183,138,74,.12),transparent 22%),radial-gradient(circle at 82% 18%,rgba(74,21,21,.16),transparent 20%),linear-gradient(180deg,#050506 0%,#0b0b0d 42%,#050506 100%);color:var(--text);overflow-x:hidden}body:before,body:after{content:'';position:fixed;inset:0;pointer-events:none}body:before{opacity:.18;background-image:linear-gradient(rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.028) 1px,transparent 1px);background-size:72px 72px}body:after{background:radial-gradient(circle at top,transparent 0%,transparent 50%,rgba(0,0,0,.66) 100%)}
    a{text-decoration:none;color:inherit}button,input,textarea,select{font:inherit}button{cursor:pointer}.page{position:relative;max-width:1360px;margin:0 auto;padding:24px 18px 56px}.fade{animation:fadeUp .8s cubic-bezier(.2,.7,.2,1)}@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    .topbar,.grid4,.stats,.cards,.grid2,.grid3,.status-metrics{display:grid;gap:16px}.topbar{grid-template-columns:auto 1fr auto;align-items:center;margin-bottom:18px}.brand{display:flex;align-items:center;gap:14px}.seal{display:grid;place-items:center;width:56px;height:56px;border:1px solid var(--line2);background:linear-gradient(180deg,rgba(183,138,74,.14),rgba(0,0,0,.25));font-family:'Cormorant Garamond',serif;font-size:1.25rem;color:var(--gold2);box-shadow:inset 0 0 0 1px rgba(255,255,255,.03)}.brand-copy small,.eyebrow,.kicker,.field-label,.tab,.status-label{font-size:10px;letter-spacing:.34em;text-transform:uppercase}.brand-copy strong,.hero h1,.panel h2,.section h3,.status-title,.confirm-title{font-family:'Cormorant Garamond',serif;font-weight:700;line-height:.88}.brand-copy strong{display:block;font-size:1.45rem}.brand-copy small{color:var(--muted)}.nav{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.tab{padding:12px 14px;border:1px solid rgba(111,81,48,.5);background:rgba(255,255,255,.02);color:#d7bf98}.tab.active{border-color:rgba(229,200,143,.58);background:rgba(183,138,74,.12);color:var(--text)}.status-chip{padding:12px 16px;border:1px solid rgba(111,81,48,.5);background:rgba(0,0,0,.26);color:#cdb48b;text-align:right}.status-chip strong{display:block;font-size:.78rem;color:var(--text);letter-spacing:.12em;text-transform:uppercase}
    .hero,.panel,.section,.status-card,.final-card{position:relative;overflow:hidden;border:1px solid rgba(111,81,48,.7);background:var(--panel);box-shadow:var(--shadow)}.hero:before,.panel:before,.section:before,.status-card:before,.final-card:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 18% 10%,rgba(183,138,74,.11),transparent 28%),radial-gradient(circle at 84% 54%,rgba(74,21,21,.14),transparent 22%);pointer-events:none}.hero-grid,.split,.final-grid{position:relative;z-index:1;display:grid;gap:28px}.hero-grid{grid-template-columns:minmax(0,1.18fr) minmax(360px,.82fr);padding:34px}.split{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);margin-top:18px}.panel{padding:28px;margin-top:18px}.eyebrow,.kicker{display:flex;align-items:center;gap:14px;color:#d8bd94}.eyebrow:before,.field-label:before{content:'';width:38px;height:1px;background:linear-gradient(90deg,transparent,#d8bd94)}.hero h1{margin:18px 0 0;font-size:clamp(3.7rem,7vw,7.2rem)}.hero h1 span{display:block;color:var(--gold2)}.hero p,.panel p,.status-copy,.confirm-copy{max-width:760px;line-height:1.95;color:var(--muted)}.btn-row{display:flex;flex-wrap:wrap;gap:14px;margin-top:28px}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:56px;padding:0 24px;border:1px solid rgba(111,81,48,.7);background:rgba(0,0,0,.28);color:#ebddc4;text-transform:uppercase;letter-spacing:.18em;font-size:.74rem;font-weight:800;transition:.18s}.btn:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(0,0,0,.28)}.btn.primary{border-color:rgba(229,200,143,.68);background:linear-gradient(135deg,#7e592c,#e5c88f);color:#120f0a}.btn.danger{border-color:rgba(129,34,34,.7);color:#f3dddd}.stats{grid-template-columns:repeat(3,minmax(0,1fr));margin-top:30px}.metric,.card,.status-metric{border:1px solid rgba(111,81,48,.6);background:rgba(255,255,255,.02);padding:18px}.metric .value,.status-metric strong{font-family:'Cormorant Garamond',serif;font-size:2.9rem;color:var(--gold2);line-height:1}.metric .label,.card .title{margin-top:8px;color:#9f8d74}.card .icon,.chapter-icon,.status-icon{display:grid;place-items:center;width:46px;height:46px;border:1px solid rgba(111,81,48,.75);background:rgba(0,0,0,.32);color:var(--gold2);font-size:1.2rem}.cards{grid-template-columns:repeat(2,minmax(0,1fr))}.card .title,.step .title{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#d8bd94}.card p,.step p{line-height:1.8;color:var(--muted)}.frame{position:relative;border:1px solid rgba(111,81,48,.62);background:rgba(0,0,0,.28)}.frame:before{content:'';position:absolute;inset:16px;border:1px solid rgba(90,67,36,.55)}.frame-body{position:relative;z-index:1;padding:28px}.frame h2{margin:20px 0 0;font-size:clamp(3rem,5vw,5rem)}.frame p{max-width:430px;line-height:2;color:var(--muted)}.sig{display:inline-flex;align-items:center;gap:12px;margin-top:22px;padding:14px 16px;border:1px solid rgba(111,81,48,.62);background:rgba(0,0,0,.24);text-transform:uppercase;letter-spacing:.2em;color:var(--gold2);font-size:.75rem}
    .banner{display:flex;justify-content:space-between;align-items:center;gap:18px;flex-wrap:wrap;padding:18px 20px;border:1px solid rgba(111,81,48,.62);background:rgba(0,0,0,.24);margin-top:24px}.banner-copy{max-width:760px;line-height:1.9;color:#bca98a}.alert{padding:16px 18px;margin-bottom:18px;border:1px solid transparent;line-height:1.8}.alert.error{border-color:rgba(129,34,34,.7);background:rgba(31,13,13,.92);color:#f0d6d6}.alert.success{border-color:rgba(61,94,54,.7);background:rgba(16,22,14,.92);color:#dce6d5}
    .section{margin-top:18px}.section:after{content:'';position:absolute;left:0;top:0;width:3px;height:100%;background:linear-gradient(180deg,#f1d29e 0,#b78a4a 42%,transparent 100%)}.section-head,.section-body{position:relative;z-index:1}.section-head{padding:22px 24px;border-bottom:1px solid rgba(47,35,20,.95)}.section-body{padding:24px}.chapter-line{display:flex;align-items:center;gap:12px;margin-bottom:12px;color:#d8bd94}.chapter-line:after{content:'';flex:1;height:1px;background:linear-gradient(90deg,#5d4525,transparent)}.chapter-grid{display:grid;grid-template-columns:auto 1fr;gap:16px}.section h3{margin:0;font-size:clamp(2.2rem,3.4vw,4rem)}.section p{margin-top:12px;line-height:1.9;color:var(--muted)}.grid2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid3{grid-template-columns:repeat(3,minmax(0,1fr))}.field input,.field textarea,.field select{width:100%;padding:16px 18px;border:1px solid rgba(111,81,48,.72);background:rgba(0,0,0,.34);color:var(--text);outline:none;transition:.18s}.field input:focus,.field textarea:focus,.field select:focus{border-color:rgba(229,200,143,.8);background:rgba(0,0,0,.5);box-shadow:0 0 0 1px rgba(229,200,143,.16)}.field textarea{min-height:160px;resize:vertical}.field-label{display:flex;align-items:center;gap:12px;margin-bottom:10px;color:#cfac72}.full{grid-column:1/-1}
    .status-wrap,.confirm-wrap{display:grid;gap:18px}.status-title,.confirm-title{font-size:clamp(3rem,5vw,5.4rem)}.status-band{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:18px 20px;border:1px solid rgba(111,81,48,.62);background:rgba(0,0,0,.24)}.tone-success{border-color:rgba(101,143,88,.7);background:rgba(24,34,20,.8)}.tone-danger{border-color:rgba(129,34,34,.7);background:rgba(36,14,14,.86)}.tone-warning{border-color:rgba(183,138,74,.72);background:rgba(37,27,12,.84)}.progress{height:10px;border:1px solid rgba(111,81,48,.52);background:rgba(0,0,0,.3);overflow:hidden}.progress>span{display:block;height:100%;background:linear-gradient(90deg,#6f5130,#e5c88f)}
    @media(max-width:1100px){.topbar,.hero-grid,.split,.final-grid,.grid2,.grid3{grid-template-columns:1fr}.stats,.cards,.status-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.status-chip{text-align:left}}
    @media(max-width:720px){.page{padding:18px 14px 48px}.topbar,.stats,.cards,.status-metrics{grid-template-columns:1fr}.hero-grid,.panel,.frame-body,.section-head,.section-body,.status-card,.final-card{padding:20px}.btn-row{flex-direction:column}.btn{width:100%}.chapter-grid{grid-template-columns:1fr}}
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
const tabOrder = ['home','access','dossier','form','status','confirmation'];
const strips = ['Portail privé • Società Ombra','Transmission chiffrée • OmbraCore','Lecture interne • Recrutement','Accès cloisonné • Dossier candidat'];
const homeCards = [
  { icon: '✦', title: 'Filtrage', text: 'L’accès n’est pas libre. Il est toléré à ceux qui acceptent le cadre, la hiérarchie et le silence.' },
  { icon: '⟐', title: 'Transmission', text: 'Le dossier ne part pas dans une boîte mail. Il entre dans un circuit interne, structuré et lisible.' },
  { icon: '◈', title: 'Lecture', text: 'Le staff lit un dossier, pas une vitrine. Chaque réponse alimente une véritable décision.' },
  { icon: '⌘', title: 'Réserve', text: 'Tout ici évoque un système déjà en place. Tu n’entres pas dans un site, tu t’approches d’une chambre d’archives.' }
];
const procedureCards = [
  { icon: '◉', title: '01 • Validation d’identité', text: 'Connexion Discord, vérification de session et rattachement du dossier à un profil réel.' },
  { icon: '⌛', title: '02 • Ouverture du dossier', text: 'Le candidat consulte la procédure, comprend le protocole et engage une lecture sérieuse de chaque section.' },
  { icon: '⛨', title: '03 • Transmission scellée', text: 'Une fois remis, le dossier est poussé vers le circuit interne et ouvre automatiquement l’espace recrutement.' }
];
const readingCards = [
  { icon: '◎', title: 'Tenue', text: 'Qualité d’écriture, cohérence RP, stabilité du personnage, capacité à tenir sans forcer.' },
  { icon: '⚔', title: 'Discipline', text: 'Rapport à l’autorité, gestion des tensions, compréhension d’une structure criminelle ordonnée.' },
  { icon: '✧', title: 'Projection', text: 'Vision long terme, valeur opérationnelle et potentiel d’intégration dans une organisation fermée.' }
];
const sections = [
  { index:'01', icon:'◈', title:'Identité du personnage', caption:'Première lecture du dossier : base du personnage, cohérence, origine et fonction.', fields:[['Nom RP','nom_rp'],['Prénom RP','prenom_rp'],['Âge RP','age_rp'],['Origine du personnage','origine_rp'],['Profession actuelle RP','profession_rp','text',true]] },
  { index:'02', icon:'⌘', title:'Profil joueur', caption:'Parcours, constance et profondeur de jeu. Pas une liste, une lecture de trajectoire.', fields:[['Âge IRL','age_irl','number'],['Pseudo Discord','pseudo_discord'],['Depuis combien de temps fais-tu du RP ?','anciennete_rp'],['Disponibilités générales','disponibilite_generale'],['Serveurs précédents','serveurs_precedents','textarea',true],['Expérience criminelle','experience_criminelle','textarea',true]] },
  { index:'03', icon:'◉', title:'Lecture RP', caption:'Méthode, sang-froid, compréhension du RP sérieux et rapport au conflit.', fields:[['Comment définirais-tu un RP sérieux ?','definition_rp','textarea',true],['As-tu déjà occupé un rôle important (leader / bras droit) ?','role_important','textarea',true],['Comment réagis-tu face à une situation tendue en RP ?','situation_tendue','textarea',true],['Donne un exemple de scène RP que tu as vécu','scene_rp','textarea',true]] },
  { index:'04', icon:'♛', title:'Motivation', caption:'On ne cherche pas un discours séduisant, mais une raison crédible et tenable.', fields:[['Pourquoi veux-tu rejoindre la Società Ombra ?','pourquoi_ombra','textarea',true],['Qu’est-ce qui t’attire dans l’organisation ?','attirance_organisation','textarea',true],['Que peux-tu apporter à la Società ?','apport','textarea',true],['Pourquoi toi plutôt qu’un autre ?','pourquoi_toi','textarea',true]] },
  { index:'05', icon:'⛨', title:'Discipline', caption:'La tenue hors scène compte autant que la tenue en scène.', fields:[['Sanctions passées','sanctions','textarea',true],['Gestion des conflits','gestion_conflits','textarea',true],['Rapport à la hiérarchie','hierarchie','textarea',true]] },
  { index:'06', icon:'⌛', title:'Disponibilités', caption:'Le staff doit pouvoir mesurer un investissement réel et durable.', columns:3, fields:[['Horaires de jeu','horaires'],['Fréquence de connexion','frequence'],['Temps moyen par session','session_moyenne']] },
  { index:'07', icon:'⟐', title:'Engagement', caption:'Ces réponses conditionnent l’ouverture réelle du circuit interne.', columns:3, fields:[['Respect du règlement','respect_reglement','select',false,['Oui','Non']],['Confidentialité interne','confidentialite','select',false,['Oui','Non']],['Engagement long terme','long_terme','select',false,['Oui','Non']]] },
  { index:'08', icon:'✧', title:'Mise en situation RP', caption:'Traiter cette scène comme un rapport d’action, pas comme une improvisation.', fields:[['Tu es en mission discrète pour la Società. La police commence à suspecter quelque chose. Un coéquipier panique et risque de compromettre l’opération. Quelle est ta réponse ?','mise_en_situation','textarea',true]] }
];
function formatDate(value) {
  if (!value) return 'Non défini';
  return new Date(value).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });
}

function mapToneClass(tone) {
  if (tone === 'success') return 'tone-success';
  if (tone === 'danger') return 'tone-danger';
  if (tone === 'warning') return 'tone-warning';
  return '';
}

const { useEffect, useMemo, useState } = React;

function App() {
  const [view, setView] = useState(state.initialView || 'home');
  const [draft, setDraft] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ombra_draft') || '{}'); } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('ombra_draft', JSON.stringify(draft));
  }, [draft]);

  const app = state.portal?.latestApplication || null;
  const ticket = state.portal?.latestRecruitmentTicket || null;
  const rulesAccepted = Boolean(state.portal?.rulesAccepted);
  const progress = useMemo(() => {
    const total = sections.reduce((count, section) => count + section.fields.length, 0);
    const complete = sections.reduce((count, section) => count + section.fields.filter(([_, key]) => String(draft[key] || '').trim()).length, 0);
    return { complete, total, percent: total ? Math.round((complete / total) * 100) : 0 };
  }, [draft]);

  const locked = !state.user;
  const canSubmit = state.user && rulesAccepted;

  function navTo(nextView) {
    if (locked && ['dossier','form','status','confirmation'].includes(nextView)) {
      setView('access');
      return;
    }
    setView(nextView);
  }

  function updateField(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function clearDraft() {
    localStorage.removeItem('ombra_draft');
    setDraft({});
  }

  return (
    <main className='page fade'>
      <header className='topbar'>
        <div className='brand'>
          <div className='seal'>SO</div>
          <div className='brand-copy'>
            <strong>Società Ombra</strong>
            <small>OmbraCore • circuit interne de recrutement</small>
          </div>
        </div>
        <nav className='nav'>
          {tabOrder.map((item) => (
            <button key={item} type='button' className={'tab ' + (view === item ? 'active' : '')} onClick={() => navTo(item)}>
              {item === 'home' && 'Accueil'}
              {item === 'access' && 'Accès'}
              {item === 'dossier' && 'Ouverture'}
              {item === 'form' && 'Formulaire'}
              {item === 'status' && 'Dossier'}
              {item === 'confirmation' && 'Transmission'}
            </button>
          ))}
        </nav>
        <div className='status-chip'>
          <span className='status-label'>Session</span>
          <strong>{state.user ? '@' + state.user.username : 'Accès non validé'}</strong>
        </div>
      </header>

      {state.error ? <div className='alert error'>{state.error}</div> : null}
      {state.submitted ? <div className='alert success'>La transmission a été scellée. Le dossier a été remis au circuit interne.</div> : null}

      {view === 'home' && (
        <>
          <section className='top-strip'>
            <div className='grid4'>{strips.map((item) => <div className='chip' key={item}>{item}</div>)}</div>
          </section>
          <section className='hero'>
            <div className='hero-grid'>
              <div>
                <div className='eyebrow'>Seuil d’entrée</div>
                <h1>Une entrée sobre.<span>Un monde qui ne l’est pas.</span></h1>
                <p>Vous ne déposez pas une candidature. Vous ouvrez un dossier. Le silence pèse plus lourd que l’ambition, et l’accès n’est jamais offert. Il est toléré.</p>
                <div className='btn-row'>
                  <a className='btn primary' href={state.user ? '#formulaire' : authUrl} onClick={(e) => { if (state.user) { e.preventDefault(); navTo('dossier'); } }}>Connexion Discord</a>
                  <button type='button' className='btn' onClick={() => navTo('access')}>Lire la procédure</button>
                </div>
                <div className='stats'>
                  <div className='metric'><div className='value'>08</div><div className='label'>sections d’analyse</div></div>
                  <div className='metric'><div className='value'>01</div><div className='label'>dossier structuré</div></div>
                  <div className='metric'><div className='value'>{state.user ? 'ACTIF' : 'FERMÉ'}</div><div className='label'>niveau d’accès</div></div>
                </div>
              </div>
              <div className='stack'>
                <div className='frame'><div className='frame-body'><div className='kicker'>Codex noir</div><h2>Le silence pèse plus lourd que l’ambition.</h2><p>La structure ne lit pas des promesses. Elle lit une tenue, une méthode, une manière de tenir un rôle sous pression.</p><div className='sig'>♛ Società Ombra • OmbraCore</div></div></div>
                <div className='cards'>{homeCards.map((item) => <div className='card' key={item.title}><div className='icon'>{item.icon}</div><div className='title'>{item.title}</div><p>{item.text}</p></div>)}</div>
              </div>
            </div>
          </section>
          <section className='split'>
            <div className='frame'><div className='frame-body'><div className='kicker'>Protocole</div><h2>L’accès est conditionné.</h2><p>Le portail ne propose pas un simple formulaire web. Il reproduit un rituel d’entrée : vérification, ouverture, transmission, lecture.</p><div className='stack'>{procedureCards.map((item) => <div className='step' key={item.title}><div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:'16px'}}><div className='icon'>{item.icon}</div><div><div className='title' style={{marginTop:0}}>{item.title}</div><p>{item.text}</p></div></div></div>)}</div></div></div>
            <div className='stack'>
              <div className='frame'><div className='frame-body'><div className='kicker'>Lecture staff</div><h2>Un circuit déjà en place.</h2><div className='cards' style={{gridTemplateColumns:'repeat(3,minmax(0,1fr))'}}>{readingCards.map((item) => <div className='card' key={item.title}><div className='icon'>{item.icon}</div><div className='title'>{item.title}</div><p>{item.text}</p></div>)}</div></div></div>
              <div className='frame'><div className='frame-body'><div className='kicker'>Manifeste</div><h2>L’accès n’est pas libre. Il est toléré.</h2><p style={{maxWidth:'100%'}}>La porte n’est ouverte ni aux profils pressés, ni aux réponses décoratives. Seuls comptent la cohérence, le calme, la discrétion et la capacité à durer dans une structure fermée.</p></div></div>
            </div>
          </section>
        </>
      )}

      {view === 'access' && (
        <section className='panel'>
          <div className='kicker'>Validation d’identité</div>
          <h2 className='status-title' style={{marginTop:'16px'}}>Demande d’autorisation d’entrée</h2>
          <p className='status-copy'>La connexion n’ouvre pas un espace membre. Elle déclenche un contrôle préalable, rattache le dossier à ton identité Discord et déverrouille le circuit interne de candidature.</p>
          <div className='banner'>
            <div className='banner-copy'>Accès restreint. Usage interne. Les informations de session servent uniquement à rattacher le dossier candidat à un membre réel du serveur.</div>
            <div className='btn-row' style={{marginTop:0}}>
              {state.user ? <button type='button' className='btn primary' onClick={() => navTo('dossier')}>Accès validé</button> : <a href={authUrl} className='btn primary'>Connexion via Discord</a>}
              <button type='button' className='btn' onClick={() => navTo('home')}>Retour au seuil</button>
            </div>
          </div>
        </section>
      )}

      {view === 'dossier' && (
        <section className='panel'>
          <div className='kicker'>Ouverture du dossier candidat</div>
          <h2 className='status-title' style={{marginTop:'16px'}}>L’antichambre avant intégration</h2>
          <p className='status-copy'>Tu n’entres pas dans un formulaire. Tu ouvres un dossier classifié destiné à être lu par une cellule interne. Chaque section sera transmise telle qu’elle est rédigée, structurée pour une lecture staff immédiate.</p>
          <div className='status-band'>
            <div><div className='status-label'>Identité</div><strong>{state.user ? '@' + state.user.username : 'Session absente'}</strong></div>
            <div><div className='status-label'>Règlement</div><strong>{rulesAccepted ? 'Validé' : 'À accepter sur Discord'}</strong></div>
            <div><div className='status-label'>État du dossier</div><strong>{app ? app.status.label : progress.percent > 0 ? 'Brouillon local' : 'Non commencé'}</strong></div>
          </div>
          <div className='status-metrics' style={{marginTop:'18px',gridTemplateColumns:'repeat(4,minmax(0,1fr))'}}>
            <div className='status-metric'><strong>{progress.percent}%</strong><div className='label'>progression locale</div></div>
            <div className='status-metric'><strong>{progress.complete}/{progress.total}</strong><div className='label'>champs préparés</div></div>
            <div className='status-metric'><strong>{ticket ? '#' + String(ticket.ticketNumber).padStart(4,'0') : 'Aucun'}</strong><div className='label'>ticket recrutement</div></div>
            <div className='status-metric'><strong>{app ? formatDate(app.updatedAt) : 'Jamais'}</strong><div className='label'>dernière activité</div></div>
          </div>
          <div className='progress' style={{marginTop:'18px'}}><span style={{width: progress.percent + '%'}} /></div>
          <div className='btn-row'>
            <button type='button' className='btn primary' onClick={() => navTo('form')}>{app ? 'Reprendre le dossier' : 'Commencer le dossier'}</button>
            <button type='button' className='btn' onClick={() => navTo('status')}>Consulter le suivi</button>
            <a href={logoutUrl} className='btn danger'>Fermer la session</a>
          </div>
        </section>
      )}

      {view === 'form' && (
        <section className='panel' id='formulaire'>
          <div className='kicker'>Dossier classifié</div>
          <h2 className='status-title' style={{marginTop:'16px'}}>Formulaire de recrutement interne</h2>
          <p className='status-copy'>Chaque chapitre agit comme une pièce d’archive. Rien n’est cosmétique. Ce que tu écris ici alimente directement le ticket recrutement staff une fois la transmission scellée.</p>
          {!canSubmit ? <div className='alert error' style={{marginTop:'18px'}}>{state.user ? 'Tu dois accepter le règlement sur Discord avant de transmettre le dossier.' : 'Connexion Discord requise avant toute rédaction.'}</div> : null}
          <div className='banner'><div className='banner-copy'>Progression locale : {progress.complete} champs renseignés sur {progress.total}. Les réponses sont conservées dans ce navigateur tant qu’elles ne sont pas remises au circuit interne.</div><div className='btn-row' style={{marginTop:0}}><button type='button' className='btn' onClick={clearDraft}>Effacer le brouillon</button><button type='button' className='btn' onClick={() => navTo('status')}>Voir le dossier</button></div></div>
          <form action={submitUrl} method='POST' className='stack' style={{marginTop:'24px'}}>
            {sections.map((section, index) => {
              const gridClass = section.columns === 3 ? 'grid3' : 'grid2';
              return (
                <section key={section.index} className='section'>
                  <div className='section-head'>
                    <div className='chapter-line'><span className='field-label' style={{marginBottom:0}}>{'Dossier ' + section.index}</span></div>
                    <div className='chapter-grid'>
                      <div className='chapter-icon'>{section.icon}</div>
                      <div>
                        <h3>{section.title}</h3>
                        <p>{section.caption}</p>
                      </div>
                    </div>
                  </div>
                  <div className='section-body'>
                    <div className={gridClass}>
                      {section.fields.map(([label, key, type, full, options]) => (
                        <label key={key} className={'field ' + (full ? 'full' : '')}>
                          <div className='field-label'>{label}</div>
                          {type === 'textarea' ? (
                            <textarea name={key} required value={draft[key] || ''} onChange={(e) => updateField(key, e.target.value)} />
                          ) : type === 'select' ? (
                            <select name={key} required value={draft[key] || ''} onChange={(e) => updateField(key, e.target.value)}>
                              <option value=''>Sélectionner</option>
                              {options.map((option) => <option key={option} value={option}>{option}</option>)}
                            </select>
                          ) : (
                            <input name={key} type={type || 'text'} required value={draft[key] || ''} onChange={(e) => updateField(key, e.target.value)} />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
            <div className='final-card final'>
              <div className='final-grid'>
                <div>
                  <div className='kicker'>Validation finale</div>
                  <h3 className='confirm-title' style={{marginTop:'14px'}}>Sceller la transmission</h3>
                  <p className='confirm-copy'>En validant, tu remets le dossier au tri interne. OmbraCore crée ensuite automatiquement le ticket recrutement et injecte l’ensemble des réponses pour lecture staff.</p>
                </div>
                <div className='btn-row' style={{marginTop:0}}>
                  <button type='button' className='btn' onClick={() => navTo('status')}>Retour dossier</button>
                  <button type='submit' className='btn primary' disabled={!canSubmit}>Transmettre le dossier</button>
                </div>
              </div>
            </div>
          </form>
        </section>
      )}

      {view === 'status' && (
        <section className='status-wrap'>
          <div className='status-card panel'>
            <div className='kicker'>Registre interne</div>
            <h2 className='status-title' style={{marginTop:'16px'}}>Gérer son dossier</h2>
            <p className='status-copy'>Cette interface n’est pas un tableau client. C’est un extrait d’archive : état du dossier, progression, transmission et lecture interne.</p>
            <div className={'status-band ' + (app ? mapToneClass(app.status.tone) : '')}>
              <div><div className='status-label'>Statut actuel</div><strong>{app ? app.status.label : progress.percent > 0 ? 'Brouillon' : 'Non ouvert'}</strong></div>
              <div><div className='status-label'>Dernière modification</div><strong>{app ? formatDate(app.updatedAt) : progress.percent > 0 ? 'Brouillon local' : 'Aucune'}</strong></div>
              <div><div className='status-label'>Transmission</div><strong>{app ? formatDate(app.createdAt) : 'Non transmise'}</strong></div>
            </div>
            <div className='status-metrics' style={{marginTop:'18px',gridTemplateColumns:'repeat(4,minmax(0,1fr))'}}>
              <div className='status-metric'><strong>{progress.percent}%</strong><div className='label'>progression locale</div></div>
              <div className='status-metric'><strong>{app ? app.sectionCount : sections.length}</strong><div className='label'>sections lues</div></div>
              <div className='status-metric'><strong>{app ? app.score : 0}</strong><div className='label'>indice interne</div></div>
              <div className='status-metric'><strong>{ticket ? '#' + String(ticket.ticketNumber).padStart(4,'0') : 'En attente'}</strong><div className='label'>référence ticket</div></div>
            </div>
            <div className='progress' style={{marginTop:'18px'}}><span style={{width: (app ? 100 : progress.percent) + '%'}} /></div>
            <div className='btn-row'>
              <button type='button' className='btn primary' onClick={() => navTo('form')}>{app ? 'Modifier le brouillon local' : 'Reprendre le dossier'}</button>
              {!app && canSubmit ? <button type='button' className='btn' onClick={() => navTo('form')}>Transmettre</button> : null}
              {state.submitted || (app && ['transmis','in_review','retained','refused'].includes(app.status.key)) ? <button type='button' className='btn' onClick={() => navTo('confirmation')}>Voir la clôture</button> : null}
              <a href={logoutUrl} className='btn danger'>Déconnexion</a>
            </div>
          </div>
        </section>
      )}

      {view === 'confirmation' && (
        <section className='confirm-wrap'>
          <div className='final-card panel'>
            <div className='kicker'>Transmission scellée</div>
            <h2 className='confirm-title' style={{marginTop:'16px'}}>Le dossier a été remis au circuit interne.</h2>
            <p className='confirm-copy'>Aucune autre action n’est requise pour le moment. Le calme, ici, fait partie du protocole. Le staff analysera le dossier selon sa propre temporalité.</p>
            <div className='status-metrics' style={{marginTop:'18px',gridTemplateColumns:'repeat(3,minmax(0,1fr))'}}>
              <div className='status-metric'><strong>{app ? app.id.slice(-6).toUpperCase() : 'N/A'}</strong><div className='label'>identifiant de dossier</div></div>
              <div className='status-metric'><strong>{app ? formatDate(app.createdAt) : 'En attente'}</strong><div className='label'>date de transmission</div></div>
              <div className='status-metric'><strong>{ticket ? '#' + String(ticket.ticketNumber).padStart(4,'0') : 'Aucun'}</strong><div className='label'>canal staff</div></div>
            </div>
            <div className='btn-row'>
              <button type='button' className='btn primary' onClick={() => navTo('status')}>Consulter le dossier</button>
              <button type='button' className='btn' onClick={() => navTo('home')}>Retour au seuil</button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
</script>
</body>
</html>`;
}

module.exports = { renderRecruitmentPage };
