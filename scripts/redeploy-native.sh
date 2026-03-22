#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${1:-/home/OmbreCore}"

cd "$PROJECT_DIR"
npm install
npm run doctor
npm run register
pm2 restart ombracore || pm2 start src/index.js --name ombracore
pm2 save
