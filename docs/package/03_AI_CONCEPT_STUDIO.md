# AI Concept Studio — Feasibility, Architecture and Cost

## Verdict
Feasible and strategically central. Build it as a controlled pipeline, not a single all-purpose prompt.

## Two visual modes
1. **Precision configurator for standard products.** Use deterministic product photography/render layers or a proven 2D/3D configurator. Color/material/text/logo and QR have controlled positions. QR is generated from the exact destination URL in code and verified; never ask an image model to draw a functional QR. Price derives from a shared, tested pricing function and canonical options.
2. **AI concept mode for bespoke products.** The consultant first identifies the customer problem and proposes ideas in text. Once the user chooses a direction, an image model generates a clear, front/three-quarter product-only concept. Background is secondary; the primary purpose is to inspect stand shape, color, surface and branding. It is a mock-up, not a production drawing.

## Canonical pipeline
Conversation → structured discovery state → product/catalog and feasibility tools → validated canonical JSON → personalized offer renderer → image-generation prompt built from the JSON → result associated with one opaque concept ID → Telegram manager handoff.

The image provider must receive one canonical configuration object, never a separately improvised prompt that can contradict the conversation. Use JSON Schema (or equivalent typed schema validation) for both input and output. Reject/fix invalid model output before rendering. Persist schema version so future changes can be migrated.

## Canonical concept schema (minimum)
```json
{
  "schema_version": "1.0",
  "language": "ro|ru|en",
  "lead_id": "opaque-random-id",
  "business": {
    "industry": "string|null",
    "business_description": "string|null",
    "audience": "string|null",
    "location_context": "string|null",
    "pain_point": "string",
    "desired_outcome": "string",
    "constraints": ["string"]
  },
  "recommendation": {
    "concept_name": "string",
    "why_it_fits": "string",
    "physical_product_type": "catalog-id-or-custom",
    "customer_action_after_tap": "string",
    "digital_experience_type": "catalog-id-or-custom",
    "offer_title": "string",
    "offer_summary": "string",
    "offer_includes": ["string"],
    "assumptions": ["string"],
    "human_review_required": true
  },
  "design": {
    "geometry": "catalog-id-or-custom-description",
    "view": "front-three-quarter",
    "primary_color": "controlled value or hex",
    "secondary_color": "controlled value or null",
    "material": "catalog-id-or-custom-request",
    "finish": "string|null",
    "text": "string|null",
    "logo_asset_id": "opaque-id|null",
    "qr_enabled": true,
    "qr_destination_url": "https://...|null",
    "quantity": "integer|null",
    "reference_image_ids": ["opaque-id"],
    "image_prompt_constraints": ["string"]
  },
  "commercial": {
    "price_type": "fixed-tier|custom-quote|not-yet-known",
    "unit_price_mdl": "number|null",
    "total_price_mdl": "number|null",
    "price_source": "standard-price-rule-id|null"
  },
  "production": {
    "feasibility": "known-option|needs-human-review|unknown",
    "known_catalog_facts": ["string"],
    "open_questions": ["string"]
  },
  "generation": {
    "attempt_number": 1,
    "max_attempts": 2,
    "status": "queued|running|succeeded|failed",
    "provider_model": "string|null",
    "preview_asset_id": "opaque-id|null"
  }
}
```

Implementation can adjust field names after validating the schema design, but must preserve a single source of truth for offer, render and lead handoff. Model output cannot create arbitrary product IDs, prices or material claims.

## Consultant quality — how to achieve it
- Create a maintained product/solution knowledge base from confirmed catalog options, case capabilities, production options, material/size/color availability, QR/NFC behavior, known constraints, pricing, setup boundaries and questions requiring human approval.
- Start with structured local data, backed by retrieval/tools where the set becomes large. Retrieval responses must have sources/IDs and known timestamps; use tool-backed pricing and availability, not model memory.
- Let the consultant suggest options proactively. Prefer 2–3 meaningfully different ideas with short rationale rather than listing generic categories. Ask one targeted clarifying question when needed; do not force a long questionnaire before helping.
- Use few-shot examples in RO/RU/EN showing good discovery, product matching, commercial honesty and useful offers. Build automated eval cases for diverse businesses: cafe, hotel, clinic, retail, gym, event, service firm and unusual/custom requests.
- Evaluate: relevance of chosen solution, helpful originality, follow-up efficiency, fact accuracy, schema validity, offer clarity, language naturalness, safe failure and escalation rate.
- Do not train/fine-tune a bespoke model initially. Reconsider after reviewed conversations reveal repeatable quality gaps and sufficient lawful training data exists.

## Two-generation cap and abuse defense
- Product requirement: **2 image-generation attempts per design session**. The UI shows attempts remaining; after attempt 2, generation controls are disabled and the manager CTA becomes primary. A failed provider call should not automatically consume a credit if the server confirms no successful output; define retry policy carefully so failures cannot be exploited into infinite calls.
- A browser-only counter is insufficient. Track signed anonymous visitor/session IDs server-side; enforce generation counters in persistent storage; add per-IP burst throttling, per-session request limits, bot challenge for suspicious activity, one active image job per session, request size/timeouts, and an operator-controlled daily hard cap.
- Recommended initial configurable limits: 2 successful image outputs per design session; 24 consultant turns per session; 8 chat requests/minute per session with tighter server-side IP burst rules; 100 image outputs/day as a conservative hard stop until live costs/traffic are understood. All values must be configurable, not compiled into UI only.
- IP is a supporting anti-abuse signal, not an identity: shared networks/VPNs mean it must not be the only lifetime block. No expensive identity verification at launch. Log rate-limit events without retaining full private prompt data unnecessarily.
- Limit prompt and reference-image sizes; validate MIME/type and dimensions on the server; do not accept active SVG/HTML as arbitrary files. Apply input/output moderation, token limits, timeouts, duplicate-submit protection, and idempotency keys. Never expose API keys or provider errors to the client.
- Add a server-side daily/monthly budget ceiling and a kill switch; when reached, keep the advisor and catalog working, switch image generation off, show curated examples and manager handoff. Alert/log without leaking secrets.

## API provider and cost benchmark (prices checked 2026-10-10)
Starting candidates from official published pricing; the implementation agent must re-check model availability/terms before selection:
- Google `gemini-3.1-flash-lite-image`: about **$0.0336 per 1K image** standard tier; batch pricing about $0.0168/image where appropriate. Official: https://ai.google.dev/gemini-api/docs/pricing
- Google `gemini-3.1-flash-image` / Nano Banana 2: about **$0.067 per 1K image** standard; 2K about $0.101; 4K about $0.151. Official: https://ai.google.dev/gemini-api/docs/pricing
- Google `gemini-3-pro-image` / Nano Banana Pro: approximately **$0.134 per 1K/2K image** standard; benchmark only if visual fidelity justifies price. Official: https://ai.google.dev/gemini-api/docs/pricing
- OpenAI GPT Image 1 page currently marks that model as deprecated; don't hard-code it as default. Check current models and official image pricing before a final choice: https://developers.openai.com/api/docs/models/gpt-image-1
- FLUX may be included in a quality benchmark if it supports the required product-reference editing and commercial use on acceptable terms: https://replicate.com/black-forest-labs/flux-1.1-pro

### Image-output-only scenario cost (using standard 1K prices)
| Completed design sessions | 2 images/session at $0.0336 | 2 at $0.067 | 2 at $0.134 |
|---:|---:|---:|---:|
| 100 | $6.72 | $13.40 | $26.80 |
| 1,000 | $67.20 | $134.00 | $268.00 |
| 5,000 | $336.00 | $670.00 | $1,340.00 |

Excludes the LLM consultant, image-input tokens, storage, bandwidth, observability, retries, taxes and any separate grounding/search charges. These are scenario estimates, not a traffic forecast. Measure actual spend from provider usage. First compare product fidelity/color/logo handling and latency across a small sample of the same prompts, then select the cheapest model that passes quality gates.

## Telegram handoff for image + offer
- A normal Telegram share link only opens a chat chooser and prefills text plus a URL; it does not embed an image binary as an already attached item. Official: https://core.telegram.org/widgets/share
- Use server-side Bot API `sendPhoto` to send the concept image to a configured internal manager group/private sales chat with a concise caption. Official: https://core.telegram.org/bots/api#sendphoto
- CTA: “Send concept to manager” (localized). Clicking it explicitly consents to sharing the concept/brief with the team. API persists the lead first, then bot sends photo + caption. Include offer summary, concept ID, preview URL, product/configuration summary, target scenario, quantity if known, language and known vs. unknowns. Only report success after Telegram API confirms.
- Return actual delivery status. Idempotency prevents duplicate leads/messages from double-clicks. Store Telegram `message_id` and sent timestamp if available.
- If send fails or bot is not configured: keep the record, show a clear failed/pending status, allow copying the summary and open a direct Telegram/share fallback with a hosted preview URL. Never claim that the direct-link fallback attached an image.
- Bot token stays server-only; only the manager chat ID and bot link should be configured in server environment. The bot must be added to the selected group and granted appropriate posting rights. Do not create the bot account or incur paid services without founder action.

## Privacy and human approval
- Explain that a selected concept/logo is shared with the sales team when the visitor clicks the handoff CTA.
- Store only necessary data. Use random unguessable IDs, check authorization on every record/asset route, keep uploaded assets private, use short-lived signed URLs or controlled public previews, and delete abandoned concepts after a documented retention period (default target: 72 hours unless the founder approves another policy).
- Strip image metadata when practical; ask customers to upload only assets they have rights to use.
- Human reviews physical feasibility, price for custom items and production proof. No autonomous manufacturing order or guarantee from an AI image.

## Acceptance checks
- Two successful outputs max per design session, server-enforced and tested across reloads/retries.
- Canonical JSON validates; renderer/image prompt/offer/Telegram caption share the same selected values.
- Color variants (white, black, brown/wood, blue, yellow and brand-specific colors) do not contradict the text specification; use controlled sample prompts/test fixtures.
- QR is exact and machine-readable because it is code-generated.
- Malformed JSON, slow API, blocked model, rate limit, invalid upload and Telegram failure all produce good fallbacks.
- Telegram manager chat receives actual photo plus useful caption when credentials are configured; screenshot/API evidence is part of final report.
