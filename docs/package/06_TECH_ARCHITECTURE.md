# Technical Direction and Architecture

## Guiding approach
Start with a small maintainable full-stack web app. First inventory the current repo and constraints; then verify current stable versions before selecting Next.js App Router + TypeScript or an equivalent stack. Avoid premature microservices and unnecessary frameworks.

## Modules
- Localized public pages, catalog and case data.
- Shared product/pricing rules (single tested source used by UI and server).
- Deterministic standard-stand renderer/asset layers + QR generation library.
- AI consultant orchestrator with conversation state, catalog/knowledge tools, safety checks, output schemas and personalized offer renderer.
- Image provider adapter; all calls server-side; canonical JSON feeds prompt construction.
- Persistent design/lead records with opaque IDs, expiry and status transitions.
- Telegram lead handoff service with Bot API `sendPhoto`, caption and idempotency.
- SEO/i18n and privacy-conscious analytics.

## Canonical AI data
Create typed schemas plus runtime validation. Store schema version. Recommended state includes business context, pain point, desired action, audience, placement, product type, selected digital experience, design colors/material/shape/text/logo asset ID, target URL, quantity, offer content, price type/source, known facts, unknowns, production feasibility status, generation attempt number, image ID/URL, and handoff status. Don't accept arbitrary model-created price, catalog IDs or product capabilities.

## Telegram delivery architecture
1. `POST /api/leads/concept` accepts opaque concept ID plus explicit submit consent; authenticate the record/session and validate all fields server-side.
2. Verify record state, quota and idempotency; load canonical record and preview asset internally. Do not trust arbitrary client-supplied image URL/chat ID.
3. Ensure preview asset is within Telegram photo format/size constraints; send via `sendPhoto` to configured `TELEGRAM_MANAGER_CHAT_ID` with a concise localized caption (or photo + follow-up message if caption length is too long).
4. Persist Telegram result, message ID, sent time and status. Only then return `sent`; errors return `pending/failed`, log safe metadata, and retain a fallback path.
5. UI shows confirmation only after the server returns confirmed success. Optional CTA opens manager contact, but doesn't represent that direct link as carrying an image.
6. Configure bot token server-side; bot must be added to the internal group/chat. Keep all secrets away from browser bundles and git. If no env settings, mark bot flow not configured and use a truthful fallback.

Suggested status machine: `draft → ready_to_send → sending → sent`; error path `sending → failed` (retry only with idempotency protection). Do not send multiple copies on double-click. Preserve enough audit detail to diagnose provider/API errors without logging private assets or bot token.

## Storage and security
- Database/object store (Supabase is only a candidate) must have explicit policies; don't assume browser clients should use service-role permissions.
- Unpredictable IDs, server-side authorization per record, file size/type/dimension validation, signed or access-controlled preview links where possible, malware/active content avoidance, expiry/deletion strategy.
- Avoid storing phone/email unless submitted. Share the concept with sales only after an explicit CTA explaining the sharing.
- Rate limits: signed anonymous session + persistent quota, per-IP burst checks, one generation job per session, challenge suspicious traffic, daily hard limit, prompt/token caps, provider timeouts, idempotency and budget kill switch. IP alone must not be a hard identity due shared IPs/VPN.
- Use output moderation and prompt injection protections. Treat uploads and user text as untrusted; never let them change policy, model choice, price or quotas.
- Image provider calls never occur directly from browser; redact keys/tokens/errors.

## Resilience and speed
- Standard catalog/configurator/orders continue if the AI provider or Telegram bot is unavailable.
- Use async job states if generation latency requires it; never block initial page render on an AI API.
- Cache curated demos; avoid regenerating on every input keystroke.
- Use responsive images, lazy load below-the-fold media, compress video and provide poster fallback.
- Accessibility: keyboard access, focus states, contrast, semantic forms, localized units/numbers, `prefers-reduced-motion`.

## Environments (keys only on server)
- `NEXT_PUBLIC_SITE_URL`
- `GOOGLE_GEMINI_API_KEY` or other selected image provider secret
- `AI_TEXT_PROVIDER`, `AI_TEXT_MODEL`, `AI_IMAGE_PROVIDER`, `AI_IMAGE_MODEL`
- `AI_MAX_IMAGES_PER_SESSION=2`, `AI_MAX_CHAT_TURNS_PER_SESSION=24`, `AI_CHAT_REQUESTS_PER_MINUTE=8`, `AI_DAILY_IMAGE_LIMIT=100`, `AI_CONCEPT_TTL_HOURS=72`
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_MANAGER_CHAT_ID`, optional `TELEGRAM_CUSTOMER_CHAT_LINK`
- database/storage credentials if an approved provider is selected
- optional challenge/captcha keys if chosen after research

## Tests required
Unit tests for price tiers, totals, schema validation and caption truncation/localization; integration tests for image provider errors, quotas, double submit/idempotency, storage authorization and Telegram send success/failure. Browser tests across languages/mobile/desktop should verify the real flow. Use a mocked Telegram API in CI and one manual live test once credentials exist. Never put a live token in the repo/test snapshots.
