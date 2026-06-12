# FlightWay — setup & deploy

Static site + Cloudflare Pages Functions (`/functions/`) + Workers KV (`COACH_KV` in `wrangler.toml`).

| Environment | Branch | Project | URL |
|-------------|--------|---------|-----|
| Production | `main` | `flightway` | https://flightway.pages.dev |
| Prototype | `Jacob_Work` | `flightway-prototype` | https://flightway-prototype.pages.dev |

## Deploy

```bash
# Production (main)
npm run deploy

# Prototype (Jacob_Work)
npm run deploy:prototype
```

GitHub Actions deploy prototype on push to `Jacob_Work` (needs `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`).

## Cloudflare Pages build settings

- Build command: *(empty)*
- Output directory: `.`
- Deploy command: *(empty)* — use **Pages**, not a Worker with `wrangler deploy`

## Secrets (Pages → Settings → Variables)

- `GEMINI_API_KEY` — AI coach
- `RESEND_API_KEY` — quiz results email
- Optional: `FROM_EMAIL`, `ALLOWED_ORIGIN`

Set on each Pages project (production and prototype separately).

## App routes

| Page | Path |
|------|------|
| Marketing | `/` (`index.html`) |
| App home | `/Flightway.html#app` |
| Quiz | `/Flightway.html#quiz` |
| AI advisor | `/Flightway.html#coach` |
| Career Hub | `/dashboard.html#r=<token>` |

**Netlify is not used.** `/functions/` replaces legacy `Netlify/Functions/`.

## Prototype vs production

Use a **separate Pages project** (`flightway-prototype`) with production branch `Jacob_Work` so prototype deploys never affect `main`.
