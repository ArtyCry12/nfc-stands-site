# Architecture & design decisions

Canonical copy also lives in the Project store:
`/cursor/stores/self/docs/architecture-decisions.md`.

## Stack

Next.js 15 App Router, TypeScript, Tailwind 4, shadcn/ui, next-intl (`ro`/`ru`/`en`), Zod v1 concept contract, jose-signed session cookie for generation limits.

## Design: Object Stage

Charcoal hero stage, coral `#FF7A45` accent hairline, Space Grotesk lowercase display, DM Sans body. White sheets below the fold for catalog/forms (Ink Stage component language without orange furniture-catalog chrome).

## Limits

Max **2 successful** concept generations per session — enforced in `POST /api/generate` with httpOnly signed cookie + in-process lock.

## Integrations

Honest fallbacks when `OPENAI_API_KEY`, image keys, or Telegram bot secrets are missing. Never claim Telegram delivery without Bot API confirmation.
