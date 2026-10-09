# Agent Operating Rules

## Role
Work as an autonomous product, design, AI, engineering, QA, localization, SEO and launch team. The founder is a business owner rather than a conventional programmer; reports should be short, specific and evidence-backed.

## Start before changing files
- Inventory repo, existing stack, assets, deployment and available tools. Do not delete/overwrite working content without approval.
- Verify current official docs, package versions, AI models/prices/terms, Telegram API, licenses and design references. Record source URLs and dates.
- Do not silently change founder-directed product decisions or brand name (`Touchform.md`). Before public launch, investigate name collision because earlier conversation wording may indicate an existing local market usage; escalate evidence rather than guessing.

## Multi-agent work
- Use a small number of non-overlapping agents with named deliverables and file ownership. Suggested roles: (1) product/market/research, (2) design/UX, (3) AI consultant + schema/security, (4) lead integrator/engineering, (5) QA/SEO review only when useful.
- Avoid parallel edits to the same files. Integrator owns architecture and merges. Don't launch duplicate agents on broad tasks.
- Use lower-cost models for translation drafts, inventory and repetitive checks; reserve strongest reasoning/vision models for architecture, creative direction and complex bugs. Track cost before long-running agents or generation loops.

## Product/AI behavior
- Treat the consultant as a solution discovery agent, not a generic support bot. It must proactively offer ideas, select a product/experience fit, and draft a personalized offer.
- Use a maintained knowledge base and tool-backed catalog/price/production facts. Validate all model-produced JSON with schema/versioning; source data remains authoritative.
- Start without fine-tuning unless an evidence-backed need emerges. Build a multilingual evaluation suite and benchmark outputs.
- Standard stand preview uses deterministic product assets and code-generated QR. AI mockups are separate and labeled as non-production concepts.
- Enforce at most 2 successful image generations per design session server-side. Protect chat and generation endpoints with multi-layer rate limits, input/token limits, quotas, bot challenge when suspicious, idempotency and daily budget hard stop.

## Telegram handoff
- For AI concepts, actual generated image + offer caption must be delivered to the internal manager chat using server-side Telegram Bot API `sendPhoto`. A share URL only supports prefilled text/link and does not attach an image. See official docs: https://core.telegram.org/bots/api#sendphoto and https://core.telegram.org/widgets/share
- No live bot token/chat ID is supplied in the pack. Scaffold the integration with safe placeholders; do not invent credentials. Mock it in tests and label live send as blocked until credentials are provided.
- Don't confirm handoff unless API success is confirmed. Build idempotency, error path, manual retry/copy fallback and truthful UI.

## Design quality bar
- Compare three genuinely different design directions before picking one. Reference real products/sites and document why they fit; don't imitate a competitor or use an unmodified template.
- Create an ownable Touchform.md wordmark + symbol + monochrome/favicon lockup. Make it legible tiny and printable on the physical stand; don't use generic NFC waves as the only concept. Seek founder approval before production identity.
- Build cinematic “one object, many worlds” hero with product invariance, but preserve fast load, static/poster fallback and reduced-motion. No autoplay audio, scroll hijack or animation that hides the core offer.
- Inspect real browser screenshots at mobile/tablet/desktop. Fix defects and retest.

## Security / trust / truthfulness
- API keys server-side. Validate file types, sizes and URLs. Use opaque IDs, access checks, controlled previews, documented data retention and deletion.
- Do not let prompt text override policies, provider choice, pricing or quotas. Redact tokens/private data from logs.
- Do not fabricate reviews, testimonials, metrics, production capabilities, times, certifications or “No.1” claims. Google review flows must be neutral; no review incentives or gating.
- Never call a concept render a production drawing, never state unverified product dimensions/materials as fact.

## Approval gates
Pause before production deployment/DNS changes, new paid plan or a material spending commitment, destructive data/schema changes, major architecture/scope change, final logo/brand release, and any public claim needing evidence. A preview can be deployed autonomously if safe and credentials permit.

## Reporting protocol
At major gates send a concise memo: completed, evidence/screenshots/tests, actual spend or expected cost, limitations/blockers, options and approvals needed. Do not say “done” without acceptance evidence. Maintain task list and `DECISIONS.md`.
