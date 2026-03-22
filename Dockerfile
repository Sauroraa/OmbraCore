FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY .env.example ./.env.example
COPY .env.production.example ./.env.production.example

ENV NODE_ENV=production

CMD ["node", "src/index.js"]
