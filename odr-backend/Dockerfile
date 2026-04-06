# ────────────────────────────────────────────────────────────
#  Stage 1 – Dependencies + Prisma client generation
# ────────────────────────────────────────────────────────────
FROM node:20-slim AS deps

WORKDIR /app

# System packages required by Prisma (OpenSSL) and node-gyp
RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
       openssl python3 make g++ gcc ca-certificates curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Bun (used in the original render.sh workflow)
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy Prisma schema and generate the client
COPY prisma ./prisma
RUN bunx prisma generate

# ────────────────────────────────────────────────────────────
#  Stage 2 – TypeScript compilation
# ────────────────────────────────────────────────────────────
FROM deps AS builder

COPY tsconfig.json ./
COPY src ./src

RUN bun run tsc

# ────────────────────────────────────────────────────────────
#  Stage 3 – Lean production image
# ────────────────────────────────────────────────────────────
FROM node:20-slim AS runner

WORKDIR /app

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Non-root user for least-privilege security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 expressjs

# Copy only what is needed to run
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

USER expressjs

# Port 4000 is intentionally NOT published to the host in docker-compose.
# It is only reachable by the frontend container over the internal network.
EXPOSE 4000

CMD ["node", "dist/server.js"]
