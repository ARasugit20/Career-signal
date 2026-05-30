# Deploy & Local Setup

## One-command local setup (static mode)

From repo root:

```bash
npm run setup && npm run dev:client
```

Open `http://localhost:5173`.

Static mode needs **no API key** and **no backend**.

## Environment variables

Copy root template:

```bash
cp .env.example client/.env.local
```

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_REPORT_MODE` | `static` | `static` = curated JSON only; `ai` = call backend |
| `VITE_API_BASE_URL` | `http://localhost:4000/api` | Backend URL when using AI mode |
| `VITE_LIVE_DEMO_URL` | — | Used in LinkedIn share copy |

Optional backend (`server/.env`):

```bash
cp .env.example server/.env
# ANTHROPIC_API_KEY=... only if VITE_REPORT_MODE=ai
```

## Vercel deploy (recommended)

1. Import [ARasugit20/Career-signal](https://github.com/ARasugit20/Career-signal) on Vercel.
2. Framework: Other (uses root `vercel.json`).
3. Environment variable: `VITE_REPORT_MODE=static`
4. Optional: `VITE_LIVE_DEMO_URL=https://your-app.vercel.app`
5. Deploy.

CLI:

```bash
vercel login
vercel --prod --yes
```

After deploy, set `VITE_LIVE_DEMO_URL` in Vercel project settings and redeploy once.

## Share links

Reports are shareable via:

`https://<your-domain>/?company=amazon&role=sde-intern`

Social crawlers see default Open Graph tags from `index.html`; in-browser title/description update when a report loads.
