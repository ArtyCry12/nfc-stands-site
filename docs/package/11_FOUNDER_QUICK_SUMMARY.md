# Founder quick summary — Touchform.md project

## What gets built
A conversion-focused premium multilingual site combining:
1. Cinematic “one object, many worlds” hero.
2. Tap Demo showing the digital experience on a phone.
3. Standard stand visual configurator with approved tier pricing.
4. Conversational AI consultant that discovers a business problem, proactively proposes useful ideas, recommends a physical + digital solution and writes a personalized offer.
5. Canonical JSON schema used by offer UI, renderer, image prompt and sales handoff.
6. Two image generations per design session plus server-side abuse/cost controls.
7. CTA that sends actual concept image + offer caption to manager Telegram via bot; truthful fallback if not configured or send fails.
8. Cases, RO/RU/EN, SEO, real-browser QA and preview deployment.

## Technical decisions to preserve
- AI is not allowed to invent price, catalog options or production feasibility.
- Two successful images/session; configure a daily cap and kill switch.
- Standard-product QR is code-generated.
- Image mock-up is not a production drawing.
- Telegram links don't carry pre-attached image files; use server-side Bot API `sendPhoto` for actual manager delivery.
- No online payment at launch.
- Use `Touchform.md` as directed. Preliminary name/domain/trademark/market-use check before public launch is mandatory because of potential conflict noted in previous discussion.

## Only items needing owner credentials/approval later
- Bot token and manager chat ID to enable live image delivery.
- AI provider budget and production secrets.
- Final logo/identity approval and domain/public launch.
- Production deployment approval.
