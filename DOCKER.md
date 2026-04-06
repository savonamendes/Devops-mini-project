# ODR India – Docker Setup

## Architecture

```
Internet / Host
     │
     ▼  port 3000 (or 80/443 in production)
┌──────────────────────────────┐
│   frontend  (Next.js)        │  ← public-facing
│   http://localhost:3000      │
└──────────┬───────────────────┘
           │  internal Docker network (private_net)
           │  http://backend:4000
           ▼
┌──────────────────────────────┐
│   backend  (Express / TS)    │  ← NO public port – invisible to internet
│   :4000 (internal only)      │
└──────────┬───────────────────┘
           │  TLS / SSL
           ▼
   AWS RDS (PostgreSQL)
```

**Security model:**
- The backend container has **no `ports:` mapping** in docker-compose. It is completely unreachable from the host or the internet.
- Only the `frontend` container can reach `backend:4000` via the shared internal Docker bridge network (`private_net`).
- The frontend acts as the only public entry point; all browser API calls go to `/api/*` on the Next.js server, which proxies them server-side to `http://backend:4000`.

---

## Quick Start

### 1. Copy and fill in your secrets

```bash
cp .env.example .env
# Edit .env and fill in every value (DATABASE_URL, JWT_SECRET, etc.)
```

### 2. Build and start

```bash
docker compose up --build
```

The frontend will be available at **http://localhost:3000**.

### 3. Stop

```bash
docker compose down
```

---

## Environment Variables

All variables are defined in the root `.env` file (copy from `.env.example`).

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | AWS RDS PostgreSQL connection string |
| `JWT_SECRET` | ✅ | JWT signing secret (64+ random chars) |
| `SESSION_SECRET` | ✅ | Session secret (64+ random chars) |
| `TOGETHER_API_KEY` | ✅ | Together AI key (chatbot) |
| `SENDGRID_API_KEY` | ✅ | SendGrid API key (email) |
| `SENDGRID_FROM_EMAIL` | ❌ | Sender email (default: noreply@odrlab.com) |
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | Public API URL baked into the frontend build |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID |
| `NEXT_PUBLIC_JITSI_SERVER` | ❌ | Jitsi server (default: meet.jit.si) |
| `SESSION_DURATION_HOURS` | ❌ | Session lifetime (default: 24) |

> **⚠️ Important:** `NEXT_PUBLIC_*` variables are **baked into the static Next.js bundle at build time**. If you change them, you must rebuild the image: `docker compose build frontend`.

---

## Project Structure

```
devops-mini-project/
├── docker-compose.yml          ← Root compose (entry point)
├── .env.example                ← Copy to .env and fill in values
├── odr-backend/
│   ├── Dockerfile              ← Multi-stage: deps → tsc build → slim runner
│   ├── .dockerignore
│   └── src/server.ts           ← Express app, port 4000
└── odrindia/
    ├── Dockerfile              ← Multi-stage: deps → next build → slim runner
    ├── .dockerignore
    └── next.config.js          ← output: 'standalone' enabled
```

---

## Production Deployment (HTTPS / Reverse Proxy)

For production, put an Nginx or Traefik reverse proxy in front that:
1. Terminates TLS (Let's Encrypt)
2. Forwards port 80/443 → `frontend:3000`

Change `NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api` in `.env` and rebuild.

---

## Useful Commands

```bash
# Rebuild a single service after code changes
docker compose build backend
docker compose build frontend

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Restart without rebuild
docker compose restart

# Run Prisma migrations (runs inside backend container)
docker compose exec backend npx prisma migrate deploy

# Open a shell in a container
docker compose exec backend sh
docker compose exec frontend sh
```
