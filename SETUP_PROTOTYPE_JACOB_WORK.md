# Jacob_Work prototype — Cloudflare hosting

The **Jacob_Work** branch combines:

- **main** — landing page, themed quiz app (`Flightway.html`), AI coach (`/account`, `/chat`, `/dossier`), Cloudflare Pages Functions + KV
- **Leo_Working** — Career Hub map (`dashboard.html`), quiz → hub email flow, Marco trigger → AI advisor

**Netlify is not used on this branch.** Deploy only via Cloudflare Pages (see below).

---

## What works together

| Flow | Path |
|------|------|
| Marketing landing | `/` (`index.html`) |
| Quiz + AI coach | `/Flightway.html` |
| Career Hub (personalized map) | `/dashboard.html#r=<token>` |
| Email results link | Points to `dashboard.html#r=…` (via `/send-results`) |
| **Talk to Marco** | Opens `Flightway.html#coach` with quiz context in `localStorage` |

---

## Host Jacob_Work separately from main (prototype)

Cloudflare Pages can serve **multiple branches** of the same repo. Production stays on `main`; `Jacob_Work` gets its own preview URL.

### Option A — One Pages project, two branches (recommended)

1. **Workers & Pages → flightway (Pages)** → **Settings → Builds**
2. **Production branch:** `main`
3. Connect GitHub repo; enable **Preview deployments** for all branches (default).
4. Push to `Jacob_Work` — GitHub Action `.github/workflows/deploy-jacob-work.yml` deploys automatically.

**URLs:**

| Branch | Typical URL |
|--------|-------------|
| `main` (production) | `https://flightway.pages.dev` |
| `Jacob_Work` (prototype) | `https://jacob-work.flightway.pages.dev` |

Branch alias format: `<branch-slug>.<project>.pages.dev` (slashes in branch names become hyphens).

### Option B — Separate Pages project (fully isolated)

1. Create a new Pages project, e.g. **`flightway-prototype`**
2. Connect the same repo; set **Production branch** to `Jacob_Work`
3. Deploy manually:

```bash
npx wrangler pages deploy . --project-name=flightway-prototype --branch=Jacob_Work
```

4. Use a **separate KV namespace** in `wrangler.toml` if you do not want prototype coach data mixed with production (optional).

### Manual deploy (any option)

```bash
npm run deploy:prototype
# or
npx wrangler pages deploy . --project-name=flightway-prototype --branch=Jacob_Work
```

**Live prototype (after deploy):** `https://flightway-prototype.pages.dev` (or the branch preview URL shown in the deploy output).

---

## Secrets & KV (same as production)

Prototype deployments use **Preview** bindings from `wrangler.toml` unless you configure branch-specific vars in the dashboard.

Add in **Pages → flightway → Settings → Variables and Secrets** (encrypted):

- `GEMINI_API_KEY`
- `RESEND_API_KEY`
- Optional: `FROM_EMAIL`, `ALLOWED_ORIGIN`

For a dedicated prototype project, set secrets on that project instead.

---

## Do not use Netlify on Jacob_Work

Leo_Working used `netlify.toml` and `Netlify/Functions/`. This branch uses:

- `/functions/` — Cloudflare Pages Functions
- `wrangler.toml` — KV bindings
- `_redirects` — static routes only

If you see `netlify.toml` locally, delete it — it is not deployed on Cloudflare.

---

## Quick test checklist

1. Open `Flightway.html`, complete quiz (or dev skip).
2. **Open my Career Hub** → `dashboard.html` with personalized scores.
3. **Talk to Marco** → lands on AI coach in `Flightway.html#coach`.
4. **Email me my link** → email contains `dashboard.html#r=…`; link opens Career Hub.
5. Coach signup/chat works (`POST /account`, `POST /chat`).
