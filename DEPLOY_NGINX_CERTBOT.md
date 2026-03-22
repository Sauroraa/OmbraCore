# Nginx + Certbot For `societa.univers-bot.fr`

Ce guide suppose que :

- OmbraCore tourne deja avec PM2
- le portail web ecoute sur `127.0.0.1:3000`
- le DNS `societa.univers-bot.fr` pointe deja vers ton serveur Debian 12

## 1. Installer Nginx et Certbot

```bash
apt update
apt install -y nginx certbot python3-certbot-nginx
```

## 2. Preparer le challenge ACME

```bash
mkdir -p /var/www/certbot
```

## 3. Installer la config Nginx

Depuis le repo :

```bash
cp /home/OmbreCore/nginx/conf/ombracore.conf /etc/nginx/sites-available/ombracore.conf
ln -sf /etc/nginx/sites-available/ombracore.conf /etc/nginx/sites-enabled/ombracore.conf
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

## 4. Generer le certificat SSL

```bash
certbot --nginx -d societa.univers-bot.fr
```

Choix recommandes :

- redirection HTTP vers HTTPS : `2`
- email LetsEncrypt : ton email admin

## 5. Verifier le renouvellement auto

```bash
systemctl status certbot.timer --no-pager
certbot renew --dry-run
```

## 6. Verifier OmbraCore

```bash
pm2 status
pm2 logs ombracore --lines 40
curl -I http://127.0.0.1:3000/health
curl -I https://societa.univers-bot.fr/health
```

Tu dois obtenir :

- `200 OK` sur `127.0.0.1:3000/health`
- `200 OK` sur `https://societa.univers-bot.fr/health`

## 7. Variables `.env`

Assure-toi d'avoir au minimum :

```env
WEB_BASE_URL=https://societa.univers-bot.fr
WEB_PORT=3000
CLIENT_ID=...
CLIENT_SECRET=...
SESSION_SECRET=...
```

Puis recharge le bot :

```bash
cd /home/OmbreCore
pm2 restart ombracore --update-env
```

## 8. OAuth Discord

Dans le portail Discord Developer, ajoute exactement cette URL de redirection :

```text
https://societa.univers-bot.fr/recruitment/callback
```
