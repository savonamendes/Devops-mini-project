# ────────────────────────────────────────────────────────────
#  Stage 1 – Install dependencies
# ────────────────────────────────────────────────────────────
FROM oven/bun:1-slim AS deps

WORKDIR /app

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
       openssl python3 make g++ gcc ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN bun install

# ────────────────────────────────────────────────────────────
#  Stage 2 – Build the Next.js application
# ────────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# These build-time env vars are needed so Next.js can bake them into the
# static bundle.  Pass them as --build-arg when running docker compose build,
# or define them in the compose file's build.args section.
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_JITSI_SERVER=meet.jit.si
ARG NEXT_PUBLIC_JITSI_ROOM_PREFIX=odrindia-

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_JITSI_SERVER=$NEXT_PUBLIC_JITSI_SERVER
ENV NEXT_PUBLIC_JITSI_ROOM_PREFIX=$NEXT_PUBLIC_JITSI_ROOM_PREFIX
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ────────────────────────────────────────────────────────────
#  Stage 3 – Lean production runner
# ────────────────────────────────────────────────────────────
FROM node:20-slim AS runner

WORKDIR /app

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Standalone output bundles server.js + required node_modules subset
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Next.js standalone produces a server.js at the root
CMD ["node", "server.js"]
