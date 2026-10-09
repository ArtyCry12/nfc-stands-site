# Decisions Register

## Founder-directed / accepted
- Project brand name to use in this project: `Touchform.md`; do not silently rename. The user states the name is approved. Before public launch, check rights/domain/trademark and existing local market use; any meaningful collision is a pause-and-review gate.
- Market focus: Moldova 75%, Romania 25%; wider EU expansion only after Romanian traction.
- Languages: Romanian, Russian, English; first-visit browser preference if supported, Romanian fallback, persistent manual selection and separate routes.
- Standard review stand tiers per unit: 1–2 @ 450 MDL; 3–6 @ 400; 7–10 @ 350; 11–19 @ 300; 20+ @ 250.
- No online payment at launch.
- Customer-facing conversational AI consultant is mandatory. It identifies underlying business needs, proactively suggests ideas, recommends a tailored physical + digital solution, and builds a personalized written offer.
- One validated canonical JSON record must drive the offer, visual prompt, design preview and manager handoff.
- Two successful image-generation calls per design session; after the cap, hand off to manager. Add multilayer protection against chat/image API abuse and a configurable daily hard limit.
- Image concept should foreground the stand/product; product colors and branding are variable. Hero concept uses one visually identical stand while environments change.
- AI concept CTA should send image and offer to the internal manager Telegram chat through a Bot API integration; standard product ordering still uses a prefilled Telegram draft.
- Cases: Cucurigo, Délice d’Ange, Padel Point; no fabricated results.

## Must not be inferred or fabricated
- Product material/color/size options or production capability not in a confirmed catalog.
- Delivery time, shipping, warranty, taxes/setup fees, performance uplift, reviews/testimonials or literal #1 ranking.
- Any public claim that `Touchform.md` name/domain is legally available before review.

## Decisions delegated to research/implementation agent
- Verify brand/domain/trademark/market-use status, then flag evidence to founder; do not substitute a new name.
- Benchmark current text/image model APIs, accuracy on the same test prompts, latency, commercial terms, privacy and current prices; select only after documenting recommendation. Do not commit spend over approved limits.
- Choose database/storage only if needed; document policies and retention. Need persistent state for generation quota, concepts and Telegram handoff.
- Pick a defensible abuse-control design; test session resets, parallel requests, IP burst, invalid uploads and daily cap.
- Set up Telegram Bot API integration with placeholders and mocked tests. Live test awaits founder-provided bot token and manager chat ID.
- Compare three visual directions; founder approves final logo and public identity.
- Confirm exact production facts and Padel Point links against real assets.

## Approval required
- Production deploy/DNS/domain change.
- Paid API plans or meaningful monthly spend ceiling.
- Final logo release and public use of brand identity.
- Any real bot message flow must be tested with credentials before claiming live delivery.
