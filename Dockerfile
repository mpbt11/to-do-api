# ---- Base
FROM node:20-alpine AS base
WORKDIR /app

# ---- Deps (com devDeps)
FROM base AS deps
ENV HUSKY=0
RUN apk add --no-cache libc6-compat
COPY package*.json ./

RUN npm ci


COPY prisma ./prisma

RUN npx prisma generate

# ---- Builder
FROM deps AS builder
ENV HUSKY=0
COPY . .

# Build da aplicação (ex.: NestJS -> dist/)
RUN npm run build

RUN npm prune --omit=dev

# ---- Runner (produção)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HUSKY=0

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
