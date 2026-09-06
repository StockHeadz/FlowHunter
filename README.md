# FlowHunter v0.2

A rebuilt React/Vite PWA prototype for an explainable options-flow accumulation scanner.

## What changed from v0.1

- Rebuilt the single-file prototype as a componentized React application.
- Added the supplied FlowHunter artwork as the site brand/logo and PWA icon source.
- Made Opportunity the primary score, with Flow and Upside as supporting signals.
- Added explicit setup stages: Early Accumulation, Strong Accumulation, and High-Conviction Match.
- Added PCG-similarity as a separate metric rather than tying every status label to PCG.
- Added a “Why this score” evidence breakdown with factor-level scoring and notes.
- Added accessible keyboard-selectable candidate rows.
- Replaced blurry fixed-size canvas charts with responsive SVG charts.
- Added explicit demo/stale-data status instead of implying the prototype is live.
- Improved PWA manifest/service-worker behavior and excluded future API/WebSocket routes from caching.
- Added Cloudflare-compatible `_headers` and `_redirects` files.
- Reduced dependencies to React + Vite; no charting dependency is required.

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Cloudflare Pages

Recommended settings:

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`

The static build can live on Cloudflare Pages. A production scanner can later add Cloudflare Workers behind `/api/*`.

## Production API shape

The current demo adapter lives in `src/services/api.js`. Replace it with real calls such as:

- `GET /api/candidates`
- `GET /api/ticker/:symbol`
- `GET /api/ticker/:symbol/flow`
- `GET /api/ticker/:symbol/score-history`
- `GET /api/alerts`
- `POST /api/watchlist`
- `WebSocket /ws/alerts`

Do not cache market-data API or WebSocket responses in the service worker.

## Important production work still remaining

1. Integrate a licensed real-time/delayed stock and options data provider.
2. Calculate scoring on the backend rather than trusting client-submitted values.
3. Store raw evidence behind every score so signals remain explainable/auditable.
4. Build historical backtests by score band before treating the model as predictive.
5. Add authentication, watchlists, alert preferences, persistence, rate limiting, and observability.
6. Define the exact difference between real-time and delayed data in the UI.

This prototype uses fictional/static demo data and is not investment advice.
# FlowHunter
