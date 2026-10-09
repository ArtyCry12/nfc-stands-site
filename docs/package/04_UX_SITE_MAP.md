# UX / Sitemap / Conversion Flows

## Global navigation
- Products
- What can you create? / Ideas
- AI Business Consultant
- Cases
- How it works
- Language switcher (RO/RU/EN)
- Primary CTA: “Find a solution” or “Create a product” depending on screen

## Main pages
- `/[locale]` — homepage
- `/[locale]/products` — catalog
- `/[locale]/products/standard-review-stand` — standard product configurator
- `/[locale]/solutions` — outcomes/use cases; avoid thin duplicate SEO pages
- `/[locale]/ai-studio` — conversational discovery + concept work
- `/[locale]/digital-experiences` — smart menus, lead/customer flows and configured digital destinations
- `/[locale]/cases/cucurigo`
- `/[locale]/cases/delice-dange`
- `/[locale]/cases/padel-point`
- `/[locale]/how-it-works`
- `/[locale]/faq`
- `/[locale]/privacy` and relevant legal/contact pages

## Homepage sequence
1. Cinematic hero with the same stand fixed while real-world context changes (cafe → reception → office/event). Static/reduced-motion fallback. Headline sells physical + digital outcome.
2. Conversational consultant preview: visitor can type their business problem or select a starter prompt. Show that the assistant proactively offers ideas.
3. Tap Demo with simulated phone-side response.
4. Three pathways: standard stand, browse solution ideas, build a custom concept with AI.
5. Catalog preview with standard pricing visible.
6. Real case studies with physical object and “what opens after tap” demo.
7. Process timeline: discuss → concept → human checks/quote → approve proof → production/configuration.
8. Trust/FAQ about NFC vs QR, design/color options, accuracy of AI previews, privacy, ordering, delivery terms only once verified.
9. Final CTA.

## Route A — standard review stand
1. Pick model/size/known available color.
2. Add brand/logo/text using deterministic rendering.
3. Select the destination/URL; validate and display it back to the customer. Produce QR via code.
4. Show preview, per-unit tier and total from shared pricing function.
5. CTA “Order via Telegram” opens a prefilled text draft; user presses Send. Include copy fallback.

Pricing: 1–2 @ 450 MDL/item; 3–6 @ 400; 7–10 @ 350; 11–19 @ 300; 20+ @ 250. No online payment; custom product prices must not use this table.

## Route B — AI consultant → personalized offer → concept image
1. Start with “What kind of business do you run, and what would you like customers to do more easily?” Offer quick-start examples without forcing industry categories.
2. Consultant understands business/context/audience/problem, gives useful early ideas and asks only the next high-value question.
3. Assistant suggests 2–3 distinct physical + digital solutions and explains why each could fit. It can recommend one, but the user selects or asks for changes.
4. Display a written personalized offer built from the selected option: desired outcome, suggested object, tap/scan experience, design choices, inclusions, assumptions/open questions, commercial status and next step.
5. Generate an isolated product-forward image from the canonical JSON. Show “Concept preview — final materials, dimensions, quote and production design confirmed by our team.”
6. The user may use at most two successful image generations per design session. Show `2 left`/`1 left`/`limit reached` with localized, accessible status.
7. CTA “Send concept to manager” calls server endpoint. Backend stores lead, then Telegram bot sends image + caption/offer + spec summary + opaque ID to the configured internal manager chat. UI displays actual send status.
8. Offer optional “Continue conversation in Telegram” via configured link after successful handoff; don't require user to reattach image. On bot failure, keep preview and show copy summary + direct Telegram/share link with preview URL. Explain that this fallback does not pre-attach the image.

## Route C — knows the object, needs customization
1. Choose a reference/product type or start with a photo/logo.
2. Select available colors/materials; ask the AI consultant to suggest a suitable shape/layout if wanted.
3. Generate up to two concepts. Show the personalized offer side-by-side.
4. Handoff to manager with visual and canonical summary.

## Route D — digital experience
1. Choose a sample destination (smart menu, information/contact, booking, call staff, feedback, custom link) or describe a goal.
2. View the simulated phone experience.
3. Attach that experience to a standard/custom physical touchpoint.
4. Send the combined brief to the manager.

## Design system and interaction rules
- Strong product-first typography and tactile material photography; distinct art direction.
- Desktop: large visual surface + structured side panel. Mobile: preview first, compact sticky CTA, controls in progressive disclosure. No horizontal overflow.
- Motion communicates causality, not decoration. Reduced-motion mode and low-bandwidth fallback mandatory.
- Do not show generated backgrounds instead of inspecting the product; product shape/color/brand are primary.
- Keep text chat readable and conversational, with typing/loading/error statuses; user must not wait for AI before seeing the rest of page.
- Don't collect personal phone/email just to generate an idea; make sharing/consent explicit at send time.
