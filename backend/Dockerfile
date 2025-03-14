FROM node:20.18.3 AS builder
ENV NODE_ENV build
RUN apt update && apt install -y openssl procps
WORKDIR /app
COPY . .
COPY .env.example .env
RUN npx prisma generate && npm run build

FROM node:20.18.3 AS runner
ENV NODE_ENV production
USER node
WORKDIR /app

COPY --from=builder --chown=node:node /app/.env ./
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /app/dist/ ./dist/

EXPOSE 3000

CMD ["node", "dist/main.js"]