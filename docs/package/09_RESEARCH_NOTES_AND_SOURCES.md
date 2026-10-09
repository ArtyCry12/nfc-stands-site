# Research Notes and Sources

Research snapshot: 2026-10-10. The implementation agent must re-check current docs, model IDs, licensing and prices before integration.

## Product customization and UX
- Kickflip ecommerce configurator: real-time product option changes, visual preview and live price: https://gokickflip.com/ecommerce-product-configurator
- Kickflip visual customizer: product customization patterns and FAQ: https://gokickflip.com/visual-product-customizer
- Baymard ecommerce UX benchmark: https://baymard.com/ux-benchmark
- Baymard cart and checkout research; high abandonment makes friction reduction important (their observed global average is frequently updated, so re-check before quoting): https://baymard.com/research/checkout-usability

Principle: don't copy surface visuals. Borrow clear option hierarchies, stateful previews and price transparency. Our differentiation is consultative idea discovery + the paired physical/digital experience + actual image handoff to sales.

## Official image-generation pricing / behavior
- Google Gemini API current pricing: https://ai.google.dev/gemini-api/docs/pricing
  - At the 2026-10-10 research snapshot: `gemini-3.1-flash-lite-image` image output equivalent approximately $0.0336 per 1K image at standard rates; `gemini-3.1-flash-image` approximately $0.067 per 1K; `gemini-3-pro-image` approximately $0.134 per 1K/2K. Verify exact model IDs and current numbers during implementation.
- Google image generation docs: https://ai.google.dev/gemini-api/docs/image-generation
- OpenAI current image API model page to recheck before any use: https://developers.openai.com/api/docs/models/gpt-image-1
- Replicate FLUX 1.1 Pro page for possible comparison: https://replicate.com/black-forest-labs/flux-1.1-pro

Image cost estimate with two successful 1K image outputs/session, output-only:
- Low-cost Google candidate at $0.0336/output: $0.0672/session; 100 sessions ≈ $6.72; 1,000 ≈ $67.20.
- Google Flash Image at $0.067/output: $0.134/session; 100 ≈ $13.40; 1,000 ≈ $134.
- Google Pro Image at $0.134/output: $0.268/session; 100 ≈ $26.80; 1,000 ≈ $268.
These are estimates, not a full operating budget. Exclude chat tokens, reference image inputs, storage/bandwidth, retries, logging, taxes and separate search/grounding calls. Measure actual provider invoices/usage.

## Telegram image handoff (official documentation)
- `sendPhoto` Bot API: https://core.telegram.org/bots/api#sendphoto
- Deep linking and `start` payloads: https://core.telegram.org/bots/features#deep-linking
- Sharing widget sends a URL and optional text to a user-selected chat; it is not a mechanism to pre-attach local image bytes: https://core.telegram.org/widgets/share

Implementation consequence: a standard share URL is suitable for the standard product summary + link; the AI concept CTA uses a backend + Bot API `sendPhoto` to send actual image to the manager's configured internal chat. It requires a bot token, chat ID, bot access to that chat, image accessible/streamed server-side, and explicit CTA consent.

## Localization and SEO
- Google localized versions / hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions
- Google product structured data: https://developers.google.com/search/docs/appearance/structured-data/product

## Review policy guardrail
- Google Maps user-contributed content policy, prohibited/restricted content and rating manipulation: https://support.google.com/contributionpolicy/answer/7400114
No incentives, no biased review collection and no happy-customer-only routing.

## Current limitations
- No production AI provider, database, storage or Telegram bot credentials were supplied in this pack.
- Prices, terms and model names can change; research is a dated snapshot, not a warranty.
- Brand name was instructed as `Touchform.md`, but the earlier conversation may indicate this string is already associated with local NFC market activity; name/domain/trademark conflict check is therefore required before public launch.
