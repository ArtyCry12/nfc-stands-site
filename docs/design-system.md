# Touchform.md — Google-inspired Product Studio

Source of truth for visual tokens and page architecture.  
Moodboard: `/cursor/stores/self/media/founder-refs/google-product-studio-moodboard.png`  
Branch: `cursor/redesign-videos-ef45`

## 1. Intent

A clean **product studio** landing — white foundation, modular numbered sections, strong type, restrained Google-inspired blue with careful multicolour accents. Not a charcoal “Object Stage” site and not a CSS-variable-only tweak of the prior redesign.

Working copy only: no final marketing polish claims, no invented metrics.

## 2. Design tokens

### Color

| Token | Value | Use |
|-------|-------|-----|
| `--ps-bg` | `#FFFFFF` | Page foundation |
| `--ps-surface` | `#F8F9FA` | Soft section bands / card wells |
| `--ps-ink` | `#202124` | Primary text |
| `--ps-body` | `#5F6368` | Body / secondary |
| `--ps-meta` | `#80868B` | Captions, labels |
| `--ps-line` | `#E8EAED` | Borders / dividers |
| `--ps-primary` | `#1A73E8` | Primary CTA, links, active chips |
| `--ps-primary-soft` | `#E8F0FE` | Soft blue fills |
| `--ps-green` | `#34A853` | Success / accent chip |
| `--ps-yellow` | `#FBBC04` | Accent chip |
| `--ps-red` | `#EA4335` | Accent chip (stripe only) |
| `--ps-orange` | `#F9AB00` | Warm accent (sparing) |
| `--ps-error` | `#D93025` | Errors |

Multicolour stripe (nav top / product accent bars): blue → red → yellow → green. **No Google affiliation copy.**

### Typography — Manrope

| Role | Size / line | Weight |
|------|-------------|--------|
| H1 | clamp → ~72/80 desktop | 700–800 |
| H2 | ~40–48 / 1.15 | 700 |
| H3 | ~28–32 / 1.25 | 600 |
| Body | 18 / 28 | 400 |
| Caption / section label | 13–14 / 22 | 500–600, tracking wide, uppercase optional |

### Radii & spacing

| Token | Value |
|-------|-------|
| `--ps-radius-sm` | 12px |
| `--ps-radius` | 16px |
| `--ps-radius-lg` | 24px |
| `--ps-radius-pill` | 999px |
| Section padding | `py-16 md:py-24` |
| Content width | `max-w-6xl` (1152px) |
| Gutter | 16 / 24px |

### Motion

- Silent video; posters; `prefers-reduced-motion` → static poster
- Subtle rise/fade on hero only; no decorative noise

## 3. Content architecture (home product story)

| # | Section | Media | Notes |
|---|---------|-------|-------|
| 00 | Nav | — | Products, Solutions, AI consultant, Cases, AI Studio; RO/RU/EN; Telegram CTA |
| 01 | Hero | VIDEO1 `hero-context-shift` | Split: copy + video/lifestyle; primary → products, secondary → AI |
| 02 | Physical catalog | photos | Product cards (SKU), filters optional; price from tiers / on request |
| 03 | Range | VIDEO2 `catalogue-showcase` | Full-bleed range showcase |
| 04 | Personalize | configurator teaser | Link into real `/configure/standard-review-stand` |
| 05 | AI consultant | VIDEO3 + **real HTML chat** | Not a fake mock chat — live `ConsultantPanel` |
| 06 | How NFC works | VIDEO4 `how-nfc-works` | 3 steps + video |
| 07 | Real demo + Padel | VIDEO5 `IMG_5953` + VIDEO6 `IMG_6235` | Side-by-side cards |
| 08 | Use cases | — | Solutions taxonomy — **≠** product categories |
| 09 | Pricing | — | Exact founder tiers only |
| 10 | Final CTA | — | Telegram / consultant |

## 4. Internal page map

| Route | Role |
|-------|------|
| `/catalog` | Physical products grid |
| `/catalog/[slug]` | Product detail → configure |
| `/configure/[slug]` | Real configurator + layered-v1 + QR |
| `/consultant` | AI + VIDEO3 + real chat UI |
| `/concept` | Concept studio (layered generate) |
| `/solutions` | Use cases only |
| `/cases`, `/cases/[slug]` | Evidence; Padel carries VIDEO6 |
| `/contact` | Honest Telegram handoff |

## 5. External ref → where

| Ref pattern (moodboard / founder-refs) | Applied |
|----------------------------------------|---------|
| Antigravity / Product Studio white modular sections | Home section chrome + spacing |
| Numbered section labels `01 Hero` | `SectionLabel` component |
| Primary blue pill CTA | Buttons / active filters |
| Chat UI with product cards in thread | Consultant layout polish (real API) |
| Lifestyle NFC photo | Hero poster / catalog imagery |
| Transparent tier list | Home pricing + catalog note |
| Multicolour accent bar | Header stripe only |

## 6. Preserved architecture (do not regress)

- Pricing `standard-review-stand-tiers-v1`
- Layered-v1 product renderer
- Gen limits (max 2 / session, burst, daily, kill switch)
- Telegram honest fallback
- i18n ro/ru/en
- Tests (`npm test`)

## 7. Out of scope

Paid LLM/image, Aikido, final logo approval, production deploy, invented case metrics, final marketing copy.
