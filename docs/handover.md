# Touchform.md — Handover / runbook

Updated after white-foundation redesign + approved videos — 2026-10-10.

## Run

```bash
cp .env.example .env.local
npm install
npm run dev   # http://127.0.0.1:4317
npm test      # pricing + QR decode + product-layers + consultant eval (6)
```

Branch: `cursor/redesign-videos-ef45` (off `cursor/touchform-site-ef45`)  
Agent: https://cursor.com/agents/bc-e56d29f7-e163-50ca-bfaa-a3ff9b78ef45  
Package SoT: `/cursor/stores/self/docs/package/` (also in `docs/package/`)  
Acceptance: `/cursor/stores/self/internal/acceptance-checklist.md`  
Redesign report: `/cursor/stores/self/internal/redesign-media-report.md`

## Standard pricing (founder)

| Qty | MDL / unit |
|---:|---:|
| 1–2 | 450 |
| 3–6 | 400 |
| 7–10 | 350 |
| 11–19 | 300 |
| 20+ | 250 |

Only `standard-review-stand`. Everything else = individual quote.

## Env

See `.env.example`. Critical:

| Variable | Purpose |
|----------|---------|
| `SESSION_SECRET` | Signed generation session |
| `AI_MAX_IMAGES_PER_SESSION=2` | Image cap |
| `AI_DAILY_IMAGE_LIMIT` | Process-wide daily image counter (file store) |
| `AI_CHAT_REQUESTS_PER_MINUTE` | IP burst for consult |
| `AI_GENERATION_KILL_SWITCH` | Disable images, keep site |
| `AI_CONCEPT_TTL_HOURS` | Concept file TTL (default 72) |
| `OPENAI_*` / `GOOGLE_GEMINI_API_KEY` / `AI_TEXT_*` | Live consultant |
| `AI_IMAGE_*` / Gemini image keys | Live concept images (optional; layered SVG used without) |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_MANAGER_CHAT_ID` | Real `sendPhoto` |
| `TELEGRAM_CUSTOMER_CHAT_LINK` | Post-handoff human link |

## What’s done (no paid keys)

- Code-generated scannable QR (`/api/qr`, configurator + concept studio, jsQR unit decode)
- Multi-turn consultant UI (`/api/consult/turn` + history) + eval suite 6/6
- Persistent concept store under `.data/concepts/` + `/api/concepts/[id]`
- IP burst + daily image cap + session cookie max-2 + kill switch
- Three logo SVGs; **Threshold** in chrome; ADR documented
- **Deterministic layered product renderer** (`layered-v1`) — configure / concept / generate
- **White-foundation redesign** + six founder videos in `public/videos/` (hero, catalogue, AI, how-NFC, real demo, Padel case)
- Products ≠ Solutions taxonomy; Hook→Insight→Example→Benefit→Next case copy
- Build + `npm test` green; Try Live on `:4317`

## Needs founder (§13 gates)

- Telegram bot token + manager chat ID (live image send)
- Paid LLM/image spend / budget ceiling (optional — layered preview works without)
- Final logo / production identity (Threshold is interim chrome pick)
- Production deploy / DNS
- Name/domain/trademark pre-launch check evidence
- Verify Délice d’Ange / Padel Point live destinations before detailed claims
- Aikido MCP sign-in to complete security scan

## Still open (non-blocking for this slice)

- Live Telegram `sendPhoto` evidence
- Paid LLM / image path (enhancement over layered SVG)
- Optional compressed video derivatives if weight becomes an issue
- Supabase swap for `.data/` when approved
- Preview deploy (Origin `agent_temp` blocks PR forge)
- LLM-judge language-quality evals

## PR

Draft PR blocked on Origin `agent_temp` repo kind. Branch pushed.
