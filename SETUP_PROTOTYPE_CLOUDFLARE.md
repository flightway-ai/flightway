# Prototype environment — `Jacob_Work` branch on Cloudflare Pages

Production **`main`** deploys to the **`flightway`** Pages project (`flightway.pages.dev`).

The **`Jacob_Work`** branch is a merged prototype (Career Hub + AI coach + landing). Deploy it to a **separate** Pages project so you can test without affecting production.

> **Do not use Netlify for this repo.** The old `Leo_Working` branch used `netlify.toml` and `Netlify/Functions/`. `Jacob_Work` uses **Cloudflare Pages** with `/functions/` (same as `main`).

---

## One-time setup (Cloudflare dashboard)

### 1. Create a second Pages project

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Select **`flightway-ai/flightway`**
3. Project name: **`flightway-prototype`** (or any name you prefer)
4. **Production branch:** `Jacob_Work` (not `main`)
5. Build settings:
   - **Build command:** *(leave empty)*
   - **Build output directory:** `.`
   - **Deploy command:** *(leave empty)* — Git will upload static files + `/functions/`

You will get a URL like `https://flightway-prototype.pages.dev`.

### 2. Bind KV for the AI coach (same as production)

In **flightway-prototype** → **Settings** → **Functions** → **KV namespace bindings**:

| Variable name | KV namespace |
|---------------|--------------|
| `COACH_KV` | Same IDs as production (see `wrangler.toml`) |

Production IDs (from this repo):

- Production: `14129792fcce40dabe02380aff80d055`
- Preview: `5a3893c3048b45e3a2bf6dfdcca92e65`

Using the **same** KV as production means prototype coach accounts share storage with prod — fine for internal testing. For isolation, create a new KV namespace and use its ID instead.

### 3. Secrets and variables

**Settings** → **Variables and Secrets** (Production + Preview):

| Name | Type | Purpose |
|------|------|---------|
| `GEMINI_API_KEY` | Secret | AI coach (`/chat`, `/account`, `/dossier`) |
| `RESEND_API_KEY` | Secret | Quiz email (`/send-results`) |
| `FROM_EMAIL` | Variable | e.g. `Flightway <quiz@flightway.ai>` |
| `ALLOWED_ORIGIN` | Variable | e.g. `https://flightway-prototype.pages.dev` |

Redeploy after adding secrets.

### 4. GitHub Actions (optional)

`.github/workflows/deploy-jacob-work.yml` deploys on every push to `Jacob_Work` via:

```bash
wrangler pages deploy . --project-name=flightway-prototype --branch=Jacob_Work
```

Add repo secrets:

- `CLOUDFLARE_API_TOKEN` — Pages Edit permission
- `CLOUDFLARE_ACCOUNT_ID`

If Git-connected Pages **and** GitHub Actions both deploy, that is OK; they target the same prototype project.

---

## Manual deploy from your machine

```bash
git checkout Jacob_Work
npm run deploy:prototype
```

Or:

```bash
npx wrangler pages deploy . --project-name=flightway-prototype --branch=Jacob_Work
```

---

## What runs where

| URL (example) | Branch | Project |
|---------------|--------|---------|
| `flightway.pages.dev` | `main` | `flightway` |
| `flightway-prototype.pages.dev` | `Jacob_Work` | `flightway-prototype` |

### User flow on prototype

1. **Landing** → `index.html`
2. **Quiz + AI coach** → `Flightway.html`
3. **Career Hub map** → `dashboard.html#r=<token>` (from quiz email or “Open Career Hub”)
4. **Talk to career advisor** → `Flightway.html#coach` (full AI advisor, uses quiz scores from Career Hub)

API routes (Pages Functions): `/account`, `/chat`, `/dossier`, `/send-results`

---

## Migrating off Netlify (`Leo_Working`)

If you still have a Netlify site for Leo’s branch:

1. Point DNS / links to the new Cloudflare prototype URL
2. Do **not** copy `netlify.toml` or `Netlify/Functions/` into `Jacob_Work`
3. Use `/functions/*.js` (Cloudflare Pages Functions format) — already in this branch

---

## Troubleshooting

- **404 on `/chat` or `/account`:** Functions not deployed — confirm `/functions/` exists at repo root and KV binding `COACH_KV` is set.
- **Email fails:** Set `RESEND_API_KEY` and verify `FROM_EMAIL` in Resend.
- **Coach says “take the quiz first” from Career Hub:** Complete the quiz or open hub from a `#r=` link so `fw_hub_quiz_v1` is stored in `localStorage`.
