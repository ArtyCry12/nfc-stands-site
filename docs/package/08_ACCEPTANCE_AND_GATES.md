# Definition of Done, QA and Approval Gates

## Brand and product
- Site uses the founder-directed name `Touchform.md`; no silent rename. Preliminary name/domain/trademark/market-use check completed before production launch; collision risks reported to founder.
- Website works as both credible brand presentation and conversion system, not merely static brochure.
- Standard tiers and totals exactly match approved thresholds. No online payments. Custom products shown as individually quoted.

## AI business consultant
- Consultant communicates naturally in RO/RU/EN, discovers the business problem, proactively suggests distinct ideas, asks concise follow-up questions and outputs a personalized written offer.
- Catalog facts, pricing and capabilities are grounded in structured data/tools; no hallucinated prices, materials, sizes, lead times or business outcomes.
- Canonical JSON validates and drives both design rendering and offer/Telegram payload. Invalid model output safely retries/falls back.
- Include an evaluation suite across varied business types and ambiguous/unusual prompts; final report must show relevance, factuality, language quality and schema compliance results.
- Fine-tuning is not mandatory. Start with knowledge base, tools, examples and evals; make any later training decision evidence-based.

## Image generation and abuse prevention
- Maximum two successful image outputs per design session; server-side persisted enforcement tested on reload, repeated requests and parallel requests. Failures do not create unlimited retries.
- Session limits alone not relied upon: include IP burst limit, prompt/token limits, one active job, suspicious-traffic challenge or defensible equivalent, daily hard cap and cost kill switch.
- Standard renderer's QR is generated from validated input URL and actually scannable. Do not rely on generated QR marks.
- Custom product image is a front/three-quarter concept focused on the object, colors/material/branding; clearly labeled non-production. AI output never marks manufacturing feasibility as verified.
- Failure/quota fallback keeps site usable and offers manager handoff.

## Telegram handoff
- With valid configured credentials, CTA persists a lead and the actual image is delivered by Bot API to configured sales chat with concise offer/spec caption and lead ID.
- The interface confirms delivery only after successful API response. Double-clicks/retries do not create duplicate messages. Failure leaves the lead/preview intact and shows a truthful fallback.
- Credentials stay server-side. `.env.example` has placeholders only. Manual live test evidence documented when credentials are supplied.
- Standard stand flow opens a prefilled Telegram message and makes clear the user must send it.

## Design / motion / conversion
- Three distinct visual directions documented and compared; logo/wordmark/symbol/mono/favicon options shown at real size and on product-like surfaces. Founder approval still required for final identity before production.
- Hero tests the “one object, many worlds” idea: same physical product stays visually consistent while context changes. Video has a poster/static and reduced-motion fallback.
- CTA hierarchy, real product evidence, Tap Demo, consultant, custom concepts and case evidence create a clear funnel. No dark patterns, fake scarcity or unverified #1 claim.
- Browser screenshots manually inspected at phone/tablet/desktop; responsive overflow, image issues, keyboard/focus, contrast, reduced-motion and core performance checked.

## Localization and SEO
- RO/RU/EN routes and key flows work; browser detection happens only on first visit and never overrides persisted manual choice.
- Reciprocal hreflang, intentional canonical tags, localized metadata, sitemap/robots/404, alt text, correct language labels and supported product structured data validated.
- Site doesn't rely on language detection alone; every language has an indexable URL.

## Safety, privacy and factual claims
- Sharing consent appears before AI concept and brief are sent to sales chat. Upload policies, expiry/deletion and privacy details documented.
- Google review requests are neutral, without incentives or selectively routing positive feedback.
- No fabricated testimonials, metrics, production promises or unsupported features.

## Engineering and approval boundaries
- Type check, lint, tests, build, browser flows and preview deployment pass, or every failure is plainly listed.
- No secrets in source control; environment variables documented; rollback steps included.
- Agent may research, implement, test and prepare preview. It must pause before production deployment/DNS changes, paid service commitments or spend limit approval, destructive data/schema changes, final logo approval, and material scope changes.

## Required final report
What was built, preview URL, screenshots, actual tests/results, known failures, chatbot/image cost per session from real usage or official current pricing, safety-limit results, Telegram send test/status, items blocked by missing credentials, risks and exact founder approvals still needed.
