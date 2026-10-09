# Touchform.md — Architecture & design decisions

Aligned with founder package in `docs/package/` (2026-10-09).

## Product model

Touchform.md sells **solutions to business problems** (physical NFC touchpoint + digital destination), not loose chips. Markets: Moldova 75% / Romania 25%. Languages: ro / ru / en (first-visit Accept-Language → cookie → `ro`).

## Pricing (authoritative)

Standard **review stand** tiers only (`standard-review-stand-tiers-v1`):

| Qty | MDL / unit |
|---:|---:|
| 1–2 | 450 |
| 3–6 | 400 |
| 7–10 | 350 |
| 11–19 | 300 |
| 20+ | 250 |

Implemented in `src/lib/pricing.ts` (unit-tested). Custom / stickers / Smart Menu kits → `custom-quote` — never use the tier table. No invented delivery, VAT, warranty or setup fees. No online payment.

## Catalog SKUs (aligned)

| Slug | Pricing |
|------|---------|
| `standard-review-stand` | fixed-tier |
| `custom-nfc-product` | custom-quote |
| `nfc-stickers-signs` | custom-quote |
| `smart-menu-kit` | custom-quote |

Dimensions are **null until confirmed** (no invented mm). Visual colors (white/black/wood/blue/yellow/brand) are options pending production confirmation.

## Cases

Cucurigo, Délice d’Ange, Padel Point — honest summaries; partial verification callouts where live features are not yet confirmed. No fabricated metrics.

## Canonical concept JSON

`schema_version: "1.0"` per `03_AI_CONCEPT_STUDIO.md` — drives offer UI, image stub, Telegram caption. Model prices for standard stands are overwritten by `priceStandardReviewStand()`.

## AI / limits

- Knowledge base: `src/lib/knowledge-base.ts`
- Max images/session from `AI_MAX_IMAGES_PER_SESSION` (default 2), signed cookie + lock
- Kill switch: `AI_GENERATION_KILL_SWITCH`
- Mock consultant when no LLM key; SVG concept stub when no image key

## Telegram

- Standard order: `t.me/share/url` prefilled text (user must Send; no image attach)
- AI concept: Bot API `sendPhoto` + manager caption; idempotency by `lead_id`; honest fallback if unconfigured

## Design

**Object Stage** retained (charcoal hero, coral accent, Space Grotesk / DM Sans). Founder still approves final logo before production identity.

## Route aliases

`/products` → `/catalog`, `/products/standard-review-stand` → configure, `/ai-studio` → `/consultant`. Cases at `/cases/*`.

## Conflicts resolved vs provisional slice

| Provisional | Aligned |
|-------------|---------|
| Invented “from 390/690…” product prices | Official tier table / custom-quote |
| Invented dimensions | `dimensionsConfirmed: null` |
| Old concept schema v1 fields | Founder `schema_version 1.0` |
| Partial env vars | Founder `env.example` merged |
| No cases | Cucurigo / Délice / Padel Point pages |

## Logo directions (editable SVG)

Three strategic alternatives under `public/brand/`:

| File | Direction | Idea |
|------|-----------|------|
| `logo-threshold.svg` | Threshold / portal | Physical block opening into a digital signal |
| `logo-bridge.svg` | Connection / bridge | Two forms linked into one system |
| `logo-type.svg` | Typographic signature | touch + altered “f” tap stem + orm.md |

**Selected for site chrome:** **Threshold / portal** → shipped as `public/brand/mark.svg`, `mark-mono.svg`, and `favicon.svg`. Rationale: reads at favicon size, works monochrome/engraving, visually distinct from generic NFC waves, and matches “physical → digital” positioning. Final production identity still needs founder approval (§13).

## QR

Destinations validated server-side (`src/lib/qr.ts`). PNG/SVG via `/api/qr`. Configurator + concept studio show live previews. Unit test decodes PNG with jsQR to prove scannability. AI image stubs never draw functional QR.

## Persistence & limits

File-backed store under `.data/` (gitignored): concepts by `lead_id`, session quotas, daily image counter. Burst limits per IP for consult/generate/QR. Cookie session still enforces max 2 images + chat turns; persistence survives reload within TTL (`AI_CONCEPT_TTL_HOURS`, default 72).

## Consultant eval

`scripts/consultant-eval.ts` — multi-turn scripted dialogs asserting schema, pricing rules, custom-quote abstinence, and no invented dimensions.
