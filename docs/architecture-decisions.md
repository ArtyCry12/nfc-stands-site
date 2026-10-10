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

**White foundation** (2026-10-10): white surfaces, generous whitespace, Space Grotesk / DM Sans, restrained blue `#1A73E8`, careful multicolour stripe (Google-inspired accents, no affiliation). Threshold mark coral retained for the logo asset only. Founder still approves final logo before production identity.

## Approved videos

Sourced from `ArtyCry12/nfc-stands-site` branch `public/videos-1` into `public/videos/` (exact GitHub names + ASCII symlinks). Placements: hero environments, catalogue range, AI consultant motion (+ real HTML chat), how-NFC tap, real NFC demo (`IMG_5953`), Padel Point case (`IMG_6235`). Silent playback, posters, reduced-motion static fallbacks.

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

## Layered product renderer

`src/lib/product-layers.ts` (`layered-v1`) composes deterministic SVG layers: stage, stand silhouette (per SKU), material/color surface, Threshold branding, QR plate. Geometry constants stay fixed across iterations; only fills/overlays change. Used by `ProductVisual` (catalog / configure / concept live preview) and `/api/generate` (bakes scannable QR modules when destination is set). Mode `layered_svg` — no paid image API required.

## Persistence & limits

File-backed store under `.data/` (gitignored): concepts by `lead_id`, session quotas, daily image counter. Burst limits per IP for consult/generate/QR. Cookie session still enforces max 2 images + chat turns; persistence survives reload within TTL (`AI_CONCEPT_TTL_HOURS`, default 72).

## Consultant eval

`scripts/consultant-eval.ts` — multi-turn scripted dialogs asserting schema, pricing rules, custom-quote abstinence, and no invented dimensions.


## Product Studio redesign (2026-10-10)

Full composition pass against founder moodboard `google-product-studio-moodboard.png`. Design tokens, section map, and ref→placement table live in `docs/design-system.md`. Manrope + primary blue CTAs + numbered home story (01–10) with all six approved videos. Does not change pricing, layered-v1, generation limits, or Telegram fallbacks.
