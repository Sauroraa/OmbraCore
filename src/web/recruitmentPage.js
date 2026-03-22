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
    :root{--bg:#0b0b0c;--bg2:#111111;--panel:#151515;--panel2:#191919;--line:#222;--text:#f1f1f1;--muted:#a0a0a0;--gold:#c9a15d;--gold-soft:rgba(201,161,93,.15);--ok:#1d3322;--danger:#3a1b1b;--warning:#3a301a;--radius:16px;--shadow:0 12px 30px rgba(0,0,0,.22)}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-height:100vh;font-family:'Manrope',sans-serif;background:linear-gradient(180deg,#0b0b0c 0%,#101011 100%);color:var(--text)}a{text-decoration:none;color:inherit}button,input,textarea,select{font:inherit}button{cursor:pointer}.app{min-height:100vh;display:grid;grid-template-columns:280px minmax(0,1fr)}.sidebar{background:#0f0f10;border-right:1px solid var(--line);padding:24px;display:flex;flex-direction:column;gap:24px}.logo{display:flex;align-items:center;gap:14px}.logo-mark{width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#1f1f1f,#151515);border:1px solid #2a2a2a;display:grid;place-items:center;color:var(--gold);font-weight:800}.logo-text strong{display:block;font-size:1rem}.logo-text span{display:block;color:var(--muted);font-size:.82rem;margin-top:2px}.nav{display:grid;gap:8px}.nav button,.logout{width:100%;text-align:left;padding:14px 16px;border-radius:14px;border:1px solid transparent;background:transparent;color:#d8d8d8;font-weight:600;transition:.18s}.nav button:hover,.logout:hover{background:#171717;border-color:#242424}.nav button.active{background:var(--gold-soft);border-color:rgba(201,161,93,.35);color:var(--text)}.sidebar-foot{margin-top:auto;display:grid;gap:10px}.session-box{padding:14px 16px;border-radius:14px;background:#151515;border:1px solid var(--line)}.session-box small{display:block;color:var(--muted);font-size:.78rem;margin-bottom:4px}.session-box strong{font-size:.92rem}
    .main{padding:24px}.topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:20px}.page-title h1{margin:0;font-size:1.8rem}.page-title p{margin:6px 0 0;color:var(--muted);font-size:.95rem}.top-actions{display:flex;gap:12px;flex-wrap:wrap}.btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border-radius:12px;border:1px solid #2a2a2a;background:#171717;color:#f1f1f1;font-weight:700;font-size:.88rem;transition:.18s}.btn:hover{transform:translateY(-1px);border-color:#333}.btn.primary{background:var(--gold);border-color:var(--gold);color:#141414}.btn.ghost{background:transparent}.btn.danger{background:transparent;border-color:#3a2323;color:#f0d0d0}.alert{padding:14px 16px;border-radius:14px;border:1px solid transparent;margin-bottom:16px;font-size:.92rem}.alert.error{background:#1b1010;border-color:#3f2020;color:#f0d3d3}.alert.success{background:#101910;border-color:#244024;color:#d4ead4}
    .hero{padding:32px;border-radius:24px;background:linear-gradient(135deg,#151515,#121212);border:1px solid var(--line);box-shadow:var(--shadow);display:grid;grid-template-columns:minmax(0,1.2fr) 360px;gap:24px}.hero h2{margin:0;font-size:2.8rem;line-height:1.05}.hero p{margin:16px 0 0;color:var(--muted);max-width:680px;line-height:1.7}.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.hero-card{padding:20px;border-radius:20px;background:#101010;border:1px solid #232323;display:grid;gap:16px}.hero-card h3{margin:0;font-size:1.05rem}.hero-card p{margin:0;color:var(--muted);line-height:1.7}.grid{display:grid;gap:16px}.grid.cards{grid-template-columns:repeat(4,minmax(0,1fr));margin-top:20px}.card,.panel,.status-band{background:var(--panel);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow)}.card{padding:18px}.card small{display:block;color:var(--muted);font-size:.8rem;margin-bottom:8px}.card strong{font-size:1.25rem}.split{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px}.panel{padding:20px}.panel h3{margin:0 0 8px;font-size:1.1rem}.panel p{margin:0;color:var(--muted);line-height:1.7}.list{display:grid;gap:12px;margin-top:16px}.list-item{padding:14px;border-radius:14px;background:#111;border:1px solid #222}.list-item strong{display:block;font-size:.9rem}.list-item span{display:block;color:var(--muted);font-size:.88rem;margin-top:4px}
    .dashboard-grid{display:grid;gap:16px;grid-template-columns:repeat(4,minmax(0,1fr))}.status-band{padding:18px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}.tone-success{background:linear-gradient(180deg,#162118,#151515)}.tone-danger{background:linear-gradient(180deg,#251616,#151515)}.tone-warning{background:linear-gradient(180deg,#262114,#151515)}.progress{height:10px;border-radius:999px;background:#101010;border:1px solid #222;overflow:hidden}.progress span{display:block;height:100%;background:linear-gradient(90deg,var(--gold),#e3bf85)}
    .form-wrap{display:grid;gap:16px}.section{background:var(--panel);border:1px solid var(--line);border-radius:18px;overflow:hidden}.section-head{padding:18px 20px;border-bottom:1px solid #222;display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.section-head h3{margin:0;font-size:1rem}.section-head p{margin:6px 0 0;color:var(--muted);font-size:.9rem;line-height:1.6}.section-index{min-width:56px;height:56px;border-radius:14px;background:#101010;border:1px solid #262626;display:grid;place-items:center;color:var(--gold);font-weight:800}.section-body{padding:20px}.fields-2,.fields-3{display:grid;gap:16px}.fields-2{grid-template-columns:repeat(2,minmax(0,1fr))}.fields-3{grid-template-columns:repeat(3,minmax(0,1fr))}.field.full{grid-column:1/-1}.field label{display:block;font-size:.88rem;font-weight:700;margin-bottom:8px}.field input,.field textarea,.field select{width:100%;padding:14px 15px;border-radius:12px;border:1px solid #2a2a2a;background:#101010;color:var(--text);outline:none;transition:.18s}.field input:focus,.field textarea:focus,.field select:focus{border-color:rgba(201,161,93,.6);box-shadow:0 0 0 3px rgba(201,161,93,.12)}.field textarea{min-height:140px;resize:vertical}.footer-actions{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;padding:20px;border-radius:18px;background:var(--panel);border:1px solid var(--line)}.footer-actions p{margin:0;color:var(--muted);max-width:760px;line-height:1.7}
    @media(max-width:1180px){.app{grid-template-columns:1fr}.sidebar{border-right:none;border-bottom:1px solid var(--line)}.dashboard-grid,.grid.cards{grid-template-columns:repeat(2,minmax(0,1fr))}.hero{grid-template-columns:1fr}.split,.fields-2,.fields-3{grid-template-columns:1fr}}
    @media(max-width:720px){.main,.sidebar{padding:16px}.dashboard-grid,.grid.cards{grid-template-columns:1fr}.topbar,.hero-actions,.top-actions,.footer-actions{flex-direction:column;align-items:stretch}.btn{width:100%}}
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
    const views = ['home', 'dossier', 'form', 'status', 'access'];
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
    const { useEffect, useMemo, useState } = React;
    const formatDate = (value) => value ? new Date(value).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }) : 'Non défini';
    const toneClass = (tone) => tone === 'success' ? 'tone-success' : tone === 'danger' ? 'tone-danger' : tone === 'warning' ? 'tone-warning' : '';

    function App() {
      const [view, setView] = useState(state.initialView || 'home');
      const [draft, setDraft] = useState(() => {
        try { return JSON.parse(localStorage.getItem('ombra_draft_clean') || '{}'); } catch { return {}; }
      });
      useEffect(() => { localStorage.setItem('ombra_draft_clean', JSON.stringify(draft)); }, [draft]);
      const app = state.portal?.latestApplication || null;
      const ticket = state.portal?.latestRecruitmentTicket || null;
      const rulesAccepted = Boolean(state.portal?.rulesAccepted);
      const progress = useMemo(() => {
        const total = sections.reduce((sum, section) => sum + section.fields.length, 0);
        const complete = sections.reduce((sum, section) => sum + section.fields.filter(([, key]) => String(draft[key] || '').trim()).length, 0);
        return { total, complete, percent: total ? Math.round((complete / total) * 100) : 0 };
      }, [draft]);
      const currentStatus = app ? app.status.label : progress.percent > 0 ? 'En cours' : 'Non commencé';

      function updateField(key, value) { setDraft((current) => ({ ...current, [key]: value })); }
      function clearDraft() { localStorage.removeItem('ombra_draft_clean'); setDraft({}); }

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
              <p>Accès au système interne de recrutement OmbraCore. Interface de suivi, formulaire structuré et transmission automatisée vers le circuit Discord.</p>
              <div className='hero-actions'>
                <a className='btn primary' href={authUrl}>Se connecter avec Discord</a>
                <button type='button' className='btn' onClick={() => setView(state.user ? 'dossier' : 'access')}>Accéder au portail</button>
              </div>
            </div>
            <div className='hero-card'>
              <h3>Résumé d’accès</h3>
              <p>Le portail centralise le dossier candidat, la progression du formulaire, le statut de transmission et l’ouverture automatique du ticket recrutement.</p>
              <div className='grid cards' style={{gridTemplateColumns:'1fr 1fr',marginTop:0}}>
                <div className='card'><small>Session</small><strong>{state.user ? '@' + state.user.username : 'Non connectée'}</strong></div>
                <div className='card'><small>Règlement</small><strong>{rulesAccepted ? 'Validé' : 'En attente'}</strong></div>
              </div>
            </div>
          </section>
          <div className='grid cards'>
            <div className='card'><small>Accès réservé</small><strong>Connexion Discord</strong><p style={{color:'var(--muted)',lineHeight:'1.7'}}>Validation de session avant ouverture du dossier.</p></div>
            <div className='card'><small>Dossier</small><strong>Formulaire structuré</strong><p style={{color:'var(--muted)',lineHeight:'1.7'}}>Sections claires, champs alignés et sauvegarde locale.</p></div>
            <div className='card'><small>Transmission</small><strong>Envoi automatisé</strong><p style={{color:'var(--muted)',lineHeight:'1.7'}}>Création automatique du ticket recrutement côté Discord.</p></div>
            <div className='card'><small>Suivi</small><strong>Statut du dossier</strong><p style={{color:'var(--muted)',lineHeight:'1.7'}}>Consultation de l’état actuel et des dernières actions.</p></div>
          </div>
        </>
      );

      const AccessView = () => (
        <div className='panel'>
          <h3>Connexion requise</h3>
          <p>Le portail OmbraCore nécessite une session Discord valide avant l’ouverture du dossier candidat.</p>
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
            </div>
            <div className='top-actions'>
              <button type='button' className='btn primary' onClick={() => setView('form')}>Reprendre le formulaire</button>
              <button type='button' className='btn' onClick={() => setView('status')}>Voir le statut</button>
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
              <button type='button' className='btn' onClick={() => setView('form')}>Modifier</button>
              {!app && rulesAccepted ? <button type='button' className='btn primary' onClick={() => setView('form')}>Soumettre</button> : null}
            </div>
          </div>
        </div>
      );

      const FormView = () => (
        <div className='form-wrap'>
          {!state.user ? <div className='alert error'>Connexion Discord requise avant de remplir le formulaire.</div> : null}
          {state.user && !rulesAccepted ? <div className='alert error'>Tu dois accepter le règlement sur Discord avant de soumettre la candidature.</div> : null}
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
          <form action={submitUrl} method='POST'>
            {Object.entries(draft).map(([key, value]) => <input key={key} type='hidden' name={key} value={value} />)}
            <div className='footer-actions'>
              <p>Le formulaire est structuré en sections simples. Une fois soumis, OmbraCore transmet le dossier vers le ticket recrutement Discord.</p>
              <div className='top-actions'>
                <button type='button' className='btn ghost' onClick={clearDraft}>Réinitialiser</button>
                <button type='submit' className='btn primary' disabled={!state.user || !rulesAccepted}>Soumettre la candidature</button>
              </div>
            </div>
          </form>
        </div>
      );

      const titles = {
        home: ['Dashboard principal', 'Vue générale du portail de recrutement OmbraCore.'],
        dossier: ['Mon dossier', 'Suivi du dossier candidat et accès rapide au formulaire.'],
        form: ['Formulaire', 'Sections propres, progression claire et soumission directe.'],
        status: ['Statut', 'État de traitement du dossier candidat.'],
        access: ['Connexion Discord', 'Validation de session avant accès au portail.']
      };

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
              <button className={view === 'access' ? 'active' : ''} onClick={() => setView('access')}>Paramètres</button>
            </div>
            <div className='sidebar-foot'>
              <div className='session-box'><small>Session</small><strong>{state.user ? '@' + state.user.username : 'Non connectée'}</strong></div>
              {state.user ? <a className='logout' href={logoutUrl}>Déconnexion</a> : <a className='logout' href={authUrl}>Connexion Discord</a>}
            </div>
          </aside>
          <main className='main'>
            <div className='topbar'>
              <div className='page-title'><h1>{titles[view][0]}</h1><p>{titles[view][1]}</p></div>
              <div className='top-actions'>
                <button type='button' className='btn ghost' onClick={() => setView('home')}>Accueil</button>
                <button type='button' className='btn' onClick={() => setView(state.user ? 'form' : 'access')}>Accéder au recrutement</button>
              </div>
            </div>
            {state.error ? <div className='alert error'>{state.error}</div> : null}
            {submitted ? <div className='alert success'>Votre dossier a été transmis avec succès et injecté dans le circuit interne.</div> : null}
            {view === 'home' && <HomeView />}
            {view === 'access' && <AccessView />}
            {view === 'dossier' && <DossierView />}
            {view === 'form' && <FormView />}
            {view === 'status' && <StatusView />}
          </main>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('app')).render(<App />);
  </script>
</body>
</html>`;
}

module.exports = { renderRecruitmentPage };
