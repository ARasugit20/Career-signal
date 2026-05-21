# Career Signal

Career Signal is a role intelligence engine for CS students who know where they want to work but do not know what to build to get there.

**Live demo:** Add your Vercel URL here after deploy  
**Tech stack:** React, Vite, TailwindCSS, Node.js, Express, Anthropic (optional AI mode)

## Problem

Most student portfolios look the same: tutorial clones with weak hiring signal. Recruiters do not reject students because they are untalented; they reject because projects do not map clearly to what teams hire for.

Career Signal solves that by turning a target company + role into a practical build plan: what projects to ship, which JD keywords to mirror, which dataset to use, and how to frame the work in interviews.

## How It Works

1. User selects a company and role.
2. App generates a Signal Report with project recommendations and signal bands.
3. User shares report link (`?company=<id>&role=<id>`) or copies summary.

## Architecture

```
User -> React Client
       -> Static mode: local curated JSON -> instant report (default, zero API cost)
       -> AI mode: Express /api/signal -> Claude response -> validated JSON report
```

## Data Methodology

Company-role signals are manually curated from:
- public job descriptions
- engineering blogs and career pages
- interview pattern writeups and role expectations

Data is intentionally curated, versioned, and explainable instead of being scraped or blindly generated.

## Current Features

- Static report mode (default): no backend or API key required
- Optional AI mode through `/api/signal`
- Searchable company selector
- Role-specific signal bands: Strong / Developing / Gap
- One action per gap
- Shareable deep links and copyable report summary
- Mobile-friendly report UI

## Run Locally

1. Install dependencies
   - `npm install --prefix server`
   - `npm install --prefix client`
2. Run frontend (static mode)
   - `npm run dev:client`
3. Optional AI mode
   - `cp .env.example server/.env`
   - Set `ANTHROPIC_API_KEY`
   - Set frontend env `VITE_REPORT_MODE=ai`
   - Run `npm run dev:server`

## Deploy (Zero-Cost Path)

Use Vercel with static mode:

1. Import GitHub repo
2. Build command: `npm --prefix client run build`
3. Output directory: `client/dist`
4. Set env var: `VITE_REPORT_MODE=static`

`vercel.json` is already included for this configuration.

## Testing and CI

- Client unit test for static report builder: `npm run test:client`
- GitHub Actions CI runs build + tests on push and PR to `main`

## What I Learned

1. **Structured output reliability:** AI responses need strict schemas and defensive parsing to stay production-safe.
2. **Latency-driven UX design:** even a useful product feels broken if users wait too long for value, which pushed static mode as default.
3. **Honest signal design:** categorical signal bands are more trustworthy than fake precision scores without outcome-grounded data.

## Roadmap

- Expand dataset to 20+ companies with consistent role coverage
- Add screenshot/share-card export for social distribution
- Ship Phase 2 gap analysis from resume/GitHub input
