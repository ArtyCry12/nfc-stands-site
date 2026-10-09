# Touchform.md — Architecture & design decisions

## Product model

Touchform.md is a **Local NFC brand** for Moldova / Romania — not a plain NFC shop. The site sells the combination of:

1. Physical NFC products (review stands, plaques, stickers, custom forms)
2. Digital scenarios (reviews, Smart Menu, interactive pages)
3. AI consultant that turns a business problem into a structured concept
4. Concept visualizer (max **2 successful generations / session**, server-enforced)
5. Telegram handoff with full context (and image when Bot API is configured)

Languages: **ro** (default fallback), **ru**, **en**. Markets: Moldova + Romania.

## Visual concepts evaluated

| # | Concept | Fit | Score |
|---|---------|-----|-------|
| 1 | Ink Stage Coral — flat `#FF7A45` stage, white sheets, TikTok catalog | Strong conversion, but reads as furniture mini-shop; fights “premium NFC object” | Medium |
| 2 | Soft Atelier — cream paper, serif display | Overlaps common AI-template look; banned terracotta/cream bias | Low |
| 3 | **Object Stage (chosen)** — charcoal `#111` stage, coral `#FF7A45` accent hairline, Space Grotesk lowercase, NFC object as full-bleed hero, white sheets only below fold for catalog/forms | Matches master “object stays, context changes”; keeps Ink Stage CTA language | High |

### Object Stage tokens

- Stage / ink: `#111111`
- Accent / hairline: `#FF7A45`
- Sheet: `#FFFFFF`
- Body: `#5E5E5E`
- Meta: `#8A8A8A`
- Photo panel: `#171717`
- Error: `#D92D20`
- Display: Space Grotesk (800–900, lowercase, tight tracking)
- Body: DM Sans (readable, non-default; avoids Inter monoculture while staying neo-grotesk)

Motion: hero ambient context crossfade (cafe → hotel → desk), CTA hover lift, sheet entrance — all honor `prefers-reduced-motion`.

## Information architecture

| Route | Purpose |
|-------|---------|
| `/[locale]` | Brand hero + value + CTA to consultant / catalog |
| `/[locale]/catalog` | Assortment |
| `/[locale]/catalog/[slug]` | Product + configure CTA |
| `/[locale]/configure/[slug]` | Configurator → price estimate → Telegram |
| `/[locale]/consultant` | AI consultant (structured JSON) |
| `/[locale]/concept` | Concept studio / generator (limit 2) |
| `/[locale]/solutions` | Scenario pages (reviews, menu, custom) |
| `/[locale]/about` | Local brand story |
| `/[locale]/contact` | Lead + Telegram |

Root `/` redirects by Accept-Language → cookie → `ro`.

## Technical architecture

```
Browser ──► Next.js App Router ([locale])
              ├── Catalog / Configurator (static data + client state)
              ├── /api/consult   → Zod ConceptContract (+ LLM or mock)
              ├── /api/generate  → session limit + image stub/provider
              └── /api/telegram  → Bot API or honest fallback
```

### Concept JSON contract (v1)

Validated with Zod. Fields: `conceptId`, `locale`, `business`, `problem`, `audience`, `physicalProduct`, `dimensions`, `material`, `color`, `finish`, `branding`, `placement`, `digitalScenario`, `ctaAction`, `offer`, `constraints`, `unknowns[]`, `approvalStatus`, `resultUrl?`.

LLM must not invent SKUs/prices outside the catalog; unknowns go in `unknowns`.

### Generation limits

- Cookie `tf_session` (httpOnly, signed HMAC with `SESSION_SECRET` or dev default)
- Server increments only on **successful** generation
- Cap = 2; further calls return `429` + Telegram handoff payload
- Parallel calls serialized per session id

### Secrets

See `.env.example`. Missing keys → UI shows configured/unavailable states; never fake “sent to manager”.

## Pricing honesty

Starter catalog uses **“from / on request”** MDL bands until founder locks price list from the missing package docs. No invented case studies.

## Out of scope (v1 slice)

Auth, cart/checkout, fine-tuned models, production deploy, real customer Telegram spam, paid provider signup.
