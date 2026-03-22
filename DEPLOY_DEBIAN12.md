# Deploy OmbraCore On Debian 12

## 1. Install Docker

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Reconnect your shell after `usermod`.

## 2. Clone And Configure

```bash
git clone https://github.com/Sauroraa/OmbraCore.git
cd OmbraCore
cp .env.production.example .env
```

Edit `.env` with the real Discord values.

## 3. Start The Bot

```bash
docker compose up -d --build
```

## 4. Check Logs

```bash
docker compose logs -f ombracore
docker compose logs -f mongodb
```

## 5. Update Later

```bash
git pull
docker compose up -d --build
```
