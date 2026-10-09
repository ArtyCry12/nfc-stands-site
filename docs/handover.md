# Touchform.md — Handover / runbook

## Run

```bash
cp .env.example .env.local
npm install
npm run dev   # http://127.0.0.1:4317
```

Branch: `cursor/touchform-site-ef45`  
Agent: https://cursor.com/agents/bc-e56d29f7-e163-50ca-bfaa-a3ff9b78ef45

## Env

| Variable | Required for | Without it |
|----------|--------------|------------|
| `SESSION_SECRET` | Stable generation limits across restarts | Dev fallback secret (change before prod) |
| `OPENAI_API_KEY` (+ optional `OPENAI_BASE_URL`, `OPENAI_MODEL`) | Live LLM consultant | Catalog mock consultant (`mode: mock`) |
| `IMAGE_API_KEY` | Real image provider | SVG product stub (still counts toward limit) |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_MANAGER_CHAT_ID` | Real manager handoff + photo | Honest 503 fallback + public URL + paste summary |
| `NEXT_PUBLIC_TELEGRAM_URL` | Visitor deep-link | Defaults to `https://t.me/touchform_md` |
| `NEXT_PUBLIC_SITE_URL` | Canonical / sitemap | `http://127.0.0.1:4317` |

## Limits

- Max **2 successful** `POST /api/generate` per signed `tf_session` cookie
- Verified: 1→200 remaining 1, 2→200 remaining 0, 3→**429** `LIMIT`

## What’s tested (no keys)

- `npm run build` — pass
- Locale redirect `/` → `/ro` + cookie
- Home / catalog / consultant / concept / configure routes render
- Consult mock returns valid ConceptContract JSON
- Generation SVG stub + session limit
- Telegram fallback does **not** claim success

## Needs keys / founder

- LLM quality beyond mock
- Real concept images (paid provider — founder gate)
- Telegram Bot API delivery with attachments
- Lock SKU prices (package docs were missing in VM)
- Production publish
- Aikido MCP sign-in (scan blocked until founder authenticates)

## Aikido

Scan not completed — MCP requires user sign-in:

- [EU](https://app.aikido.dev/settings/integrations/ide/mcp?source=mcp&redirect_uri=http%3A%2F%2F127.0.0.1%3A35861%2Fcallback&state=YhRJ1eYoOi88mYRIHdv8xi2HRm5--vbdQ5qwHapkjy0)
- [US](https://app.us.aikido.dev/settings/integrations/ide/mcp?source=mcp&redirect_uri=http%3A%2F%2F127.0.0.1%3A35861%2Fcallback&state=YhRJ1eYoOi88mYRIHdv8xi2HRm5--vbdQ5qwHapkjy0)
- [ME](https://app.me.aikido.dev/settings/integrations/ide/mcp?source=mcp&redirect_uri=http%3A%2F%2F127.0.0.1%3A35861%2Fcallback&state=YhRJ1eYoOi88mYRIHdv8xi2HRm5--vbdQ5qwHapkjy0)

After sign-in, re-run `aikido_full_scan` on `src/app/api/*`, `src/lib/*`, key components.

## PR

Draft PR could not be created: Origin repo kind is `agent_temp` (temp new-project repo). Branch is pushed: `cursor/touchform-site-ef45`. Create a standard repo / PR after the Create repo step if needed.

## Design

Object Stage — see `docs/architecture-decisions.md`.
