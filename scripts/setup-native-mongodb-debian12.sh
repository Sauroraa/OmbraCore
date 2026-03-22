#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${1:-/home/OmbreCore}"
ENV_FILE="$PROJECT_DIR/.env"
ENV_EXAMPLE="$PROJECT_DIR/.env.production.example"

if [[ ! -d "$PROJECT_DIR" ]]; then
  echo "Project directory not found: $PROJECT_DIR"
  exit 1
fi

apt-get update
apt-get install -y curl gnupg ca-certificates

curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
  gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor

echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/8.0 main" \
  > /etc/apt/sources.list.d/mongodb-org-8.0.list

apt-get update
apt-get install -y mongodb-org

systemctl enable mongod
systemctl restart mongod

if [[ ! -f "$ENV_FILE" ]]; then
  if [[ -f "$ENV_EXAMPLE" ]]; then
    cp "$ENV_EXAMPLE" "$ENV_FILE"
  else
    touch "$ENV_FILE"
  fi
fi

if grep -q '^MONGODB_URI=' "$ENV_FILE"; then
  sed -i 's#^MONGODB_URI=.*#MONGODB_URI=mongodb://127.0.0.1:27017/ombracore#' "$ENV_FILE"
else
  printf '\nMONGODB_URI=mongodb://127.0.0.1:27017/ombracore\n' >> "$ENV_FILE"
fi

echo "MongoDB installed and configured."
echo "Updated: $ENV_FILE"
echo "Current MongoDB URI: mongodb://127.0.0.1:27017/ombracore"
