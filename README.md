# Career Signal

Role intelligence engine for CS students — pick a company and role, get a Signal Report with project ideas, JD keywords, and interview framing.

## Current Boilerplate Status

This repo includes a working Phase 1 starter:

- `server/data/companies.json` seeded with 5 companies and 2 roles each
- `POST /api/signal` route with Claude Sonnet JSON-only prompt pattern
- `GET /api/companies` route for company/role selectors
- React + Vite + Tailwind frontend with:
  - company selector
  - role selector
  - loading/error states
  - Signal Report display cards

## Structure

```
career-signal/
├── client/
├── server/
│   ├── data/companies.json
│   └── routes/signal.js
├── .env.example
└── README.md
```

## Run Locally

1. Install dependencies:
   - `npm install --prefix server`
   - `npm install --prefix client`
2. Create env file:
   - `cp .env.example server/.env`
   - Add `ANTHROPIC_API_KEY`
3. Run backend:
   - `npm run dev:server`
4. Run frontend:
   - `npm run dev:client`

## Next Build Steps

- Expand schema coverage to include SDE full-time and domain roles
- Validate `/api/signal` output against 5 company-role combos with real API key
- Improve report sharing (screenshot-friendly layout + URL params)
