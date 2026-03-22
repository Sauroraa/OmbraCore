# OmbraCore

Bot Discord modulaire pour la Societa Ombra, pense comme un noyau serveur propre, immersif et evolutif.

## Fonctionnalites deja posees

- socle `discord.js` modulaire avec chargeurs commandes et evenements
- connexion MongoDB avec configuration serveur persistee
- accueil d'un nouveau membre avec role restreint et logs
- panel reglement avec validation et autorole
- panel tickets multi-types avec creation, claim, fermeture, suppression, ajout/retrait membres et transcript texte
- panel recrutement avec modal, score simple, contact candidat et entretien staff
- commande `/ano` en slash command avec cooldown et traçabilite staff
- automod de base : spam, liens interdits, mots bloques, mentions abusives, caps abuse
- moderation staff : `/warn`, `/unwarn`, `/mute`, `/unmute`, `/kick`, `/ban`, `/unban`, `/purge`, `/slowmode`, `/lock`, `/unlock`, `/infractions`
- commandes de support : `/ping`, `/help`, `/setup`, `/config`, `/panel`, `/accept`, `/refuse`

## Arborescence

```text
src/
  commands/      slash commands
  config/        configuration par defaut
  constants/     custom IDs des boutons et menus
  events/        events Discord
  loaders/       chargement auto des modules
  models/        schemas MongoDB
  modules/       logique metier par domaine
  scripts/       utilitaires comme l'enregistrement des commandes
  services/      acces donnees et services transverses
  utils/         helpers divers
```

## Installation

1. Installer Node.js 20+ et MongoDB.
2. Copier `.env.example` vers `.env`.
3. Renseigner les variables Discord et MongoDB.
4. Installer les dependances :

```bash
npm install
```

5. Enregistrer les slash commands :

```bash
npm run register
```

6. Lancer le bot :

```bash
npm run start
```

## Deploiement Docker Debian 12

Les fichiers de deploiement sont prets pour Docker :

- [Dockerfile](/f:/Sauroraa%202k26/Societa/Societa%20Bot/Dockerfile)
- [docker-compose.yml](/f:/Sauroraa%202k26/Societa/Societa%20Bot/docker-compose.yml)
- [.env.production.example](/f:/Sauroraa%202k26/Societa/Societa%20Bot/.env.production.example)
- [DEPLOY_DEBIAN12.md](/f:/Sauroraa%202k26/Societa/Societa%20Bot/DEPLOY_DEBIAN12.md)

Pour Debian 12 :

```bash
cp .env.production.example .env
docker compose up -d --build
```

## Deploiement Natif Debian 12

Si ton serveur est un LXC unprivileged, utilise le mode natif :

```bash
chmod +x scripts/setup-native-mongodb-debian12.sh scripts/redeploy-native.sh
sudo ./scripts/setup-native-mongodb-debian12.sh /home/OmbreCore
./scripts/redeploy-native.sh /home/OmbreCore
```

## Portail Recrutement Web

Le bot embarque maintenant un portail web de recrutement avec connexion Discord.

Variables a renseigner :

```env
CLIENT_SECRET=
WEB_BASE_URL=https://societa.univers-bot.fr
WEB_PORT=3000
SESSION_SECRET=
```

Flux :

- l'utilisateur ouvre `https://societa.univers-bot.fr/recruitment`
- il se connecte via Discord
- il remplit le formulaire complet
- OmbraCore cree automatiquement un ticket recrutement
- toutes les reponses sont injectees dans le ticket et dans le salon staff

## Nginx + Certbot

Une configuration prete pour `societa.univers-bot.fr` est incluse :

- [nginx/conf/ombracore.conf](/f:/Sauroraa%202k26/Societa/Societa%20Bot/nginx/conf/ombracore.conf)
- [nginx/conf/ombracore.bootstrap.conf](/f:/Sauroraa%202k26/Societa/Societa%20Bot/nginx/conf/ombracore.bootstrap.conf)
- [DEPLOY_NGINX_CERTBOT.md](/f:/Sauroraa%202k26/Societa/Societa%20Bot/DEPLOY_NGINX_CERTBOT.md)

Chemin recommande sur le serveur :

```bash
cp /home/OmbreCore/nginx/conf/ombracore.bootstrap.conf /etc/nginx/sites-available/ombracore.conf
ln -sf /etc/nginx/sites-available/ombracore.conf /etc/nginx/sites-enabled/ombracore.conf
certbot --webroot -w /var/www/certbot -d societa.univers-bot.fr
cp /home/OmbreCore/nginx/conf/ombracore.conf /etc/nginx/sites-available/ombracore.conf
systemctl reload nginx
```

## Variables d'environnement

```env
DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=
MONGODB_URI=
```

## Premiere mise en route

- lancer `/setup` dans le salon voulu pour publier les panneaux principaux
- lancer `/config show` pour verifier la config chargee
- completer les IDs de salons, roles et categories dans la collection `guildconfigs`

## Configuration a completer avant production

Le projet cree automatiquement une config par serveur en base MongoDB. Il faut ensuite y renseigner :

- `channels.welcome`
- `channels.rulesLog`
- `channels.ticketsLog`
- `channels.applicationsLog`
- `channels.anonymousLog`
- `channels.moderationLog`
- `roles.unverified`
- `roles.member`
- `roles.staff`
- `roles.recruiter`
- `tickets.types.*.categoryId`

## Commandes admin utiles

- `/config set-channel`
- `/config set-role`
- `/config set-category`
- `/config set-automod`
- `/config set-list`
- `/config set-text`
- `/config set-toggle`
- `/config set-questions`
- `/setrules`
- `/setticketpanel`
- `/setwelcome`
- `/setautomod`
