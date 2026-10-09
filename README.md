# Touchform.md

Local NFC brand site for Moldova / Romania — physical products, digital scenarios, AI consultant, concept studio (max 2 generations / session), Telegram handoff.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui · next-intl (`ro` / `ru` / `en`) · Zod concept contract

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317).

Without API keys the site runs in honest demo mode:

- `/api/consult` → catalog-based mock consultant
- `/api/generate` → SVG product stub, **server-enforced** max 2 successes / session cookie
- `/api/telegram` → returns fallback summary + public Telegram URL (does not claim “sent”)

## Key routes

| Path | Purpose |
|------|---------|
| `/ro`, `/ru`, `/en` | Localized home |
| `/[locale]/catalog` | Assortment |
| `/[locale]/configure/[slug]` | Configurator → Telegram |
| `/[locale]/consultant` | AI consultant → JSON contract |
| `/[locale]/concept` | Concept studio |
| `/api/consult`, `/api/generate`, `/api/telegram` | Server APIs |

## Docs

- Project decisions: see Cloud Agent store `docs/architecture-decisions.md` and `docs/handover.md`
- Package notes: `docs/package/` (original numbered package files were not mounted in the VM)

## Production

Do not publish without founder approval. Set real `SESSION_SECRET`, Telegram bot secrets, and optional LLM/image keys first.
