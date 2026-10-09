# Product Brief

## Brand and vision
Project name: **Touchform.md**. The founder has instructed the team to use this name. Do not replace it without approval. Because previous discussion may imply existing local market use of this name, perform a preliminary ownership/trademark/domain-conflict check before public launch and stop for founder review if there is a meaningful risk.

Build a premium NFC product-and-experience studio for Moldova, then Romania. The brand connects physical objects with useful digital moments. Visitors should understand the outcome even if they do not know what NFC is.

Positioning hypothesis: **We turn business goals into physical touchpoints and digital experiences.** This is working copy, not a locked tagline. Do not publish an unsubstantiated literal “#1 in Moldova” claim; demonstrate leadership through real cases, useful demos, breadth, product design and service.

## Markets and localization
- Moldova 75%, Romania 25% at launch. EU expansion only after evidence.
- Romanian, Russian, English. First visit browser-language preference when supported; Romanian fallback; persist manual override.
- Separate URLs `/ro/`, `/ru/`, `/en/`; localized copy, metadata and hreflang.

## Offers
1. **Standard review stands:** target destination configuration, NFC plus QR fallback, available model/size/color options, branded details, volume price.
2. **Custom physical NFC products:** locally produced bespoke shapes, dimensions, finishes, material and brand design; custom quote.
3. **Digital experiences:** Smart Menu and other pages or interaction flows opened by NFC/QR, within verified capabilities.
4. **Other NFC/QR touchpoints:** wall signs, stickers, tabletop objects and future products.

The sold product is a finished physical object plus its configured digital destination/experience, not a loose chip.

## Standard price tiers (per unit, MDL)
| Quantity | Price |
|---|---:|
| 1–2 | 450 |
| 3–6 | 400 |
| 7–10 | 350 |
| 11–19 | 300 |
| 20+ | 250 |

Show unit price and total dynamically. These tiers apply only to standard review stands; custom work is individually quoted. Do not invent delivery, VAT, production time, warranty or setup fees.

## Mandatory conversational AI consultant
A customer-facing consultant is a core product feature, not an optional chatbot. It must:
- Speak naturally in RO/RU/EN and behave like a capable business/product consultant.
- Discover the customer's business, audience, context/placement, friction or unmet need, desired customer action, quantity, brand style and constraints.
- Proactively suggest non-obvious but relevant ideas (at least two or three useful routes when sufficient context exists) rather than waiting for the customer to know what to ask for.
- Ask only the next most valuable follow-up question; avoid interrogation and long forms.
- Recommend a solution to the underlying business problem, which may combine physical product + digital experience.
- Build a written personalized offer: the inferred need, recommendation, why it fits, physical form, tap/scan experience, visual direction, known options, price or “custom quote”, assumptions, and next step.
- Clearly distinguish sourced catalog facts, inferred suggestions, and unknowns. Never invent dimensions, material availability, compatibility, production times, pricing or guaranteed outcomes.
- Produce a validated canonical JSON record that is the single source for the renderer, image generation, offer display and lead handoff. Do not let free-form model text independently define incompatible product facts.
- If the request is unsafe, abusive, outside scope or infeasible, explain limits and route to a human where useful.

High quality does **not** mean fine-tuning a model on day one. Start with a strong model, carefully authored product/production knowledge base, structured catalog and tool-backed pricing, schema validation, and an evaluation set of real-world scenarios. Consider fine-tuning only after enough consented, reviewed interaction data proves a gap.

## AI visual generation
- A maximum of **two image-generation calls per design session/visitor**. Explain the limit before generation; after the second call, the CTA becomes a manager handoff.
- Customer needs a clear front/three-quarter view of the stand/product, not a full lifestyle photo each time. Prioritize product clarity, color/material, brand/logo, shape, and readable layout. Keep the background quiet or neutral in configurator output.
- The hero may use a cinematic loop where the *same product stays visually invariant* while environments change (e.g., cafe, reception, office). If generating this asset proves unreliable, use a carefully matched short sequence/crossfade or real footage, not clips where the product changes shape.
- Every generated image is a concept mock-up, not a manufacturing file. Team confirms feasibility and final proof.

## Sales and Telegram
- No online payment at launch.
- Standard flow: configure product → live price → CTA → Telegram with prefilled summary; visitor sends it.
- AI/custom flow: click “Send concept to manager” → server persists a lead/concept reference → bot sends the generated image to a configured internal manager Telegram chat with a caption containing the personalized offer, product specification summary, quantity if known, language, consented contact info if any, and opaque lead ID → UI confirms delivery only if Telegram API confirms success. Then offer a direct Telegram conversation link if configured.
- This is a deliberate addition to the earlier simple-link design: normal Telegram share/deep links cannot pre-attach the generated image. The Bot API supports sending the photo directly.
- If bot credentials or delivery fail, say so honestly, preserve the preview, provide a copyable summary and a direct Telegram/share fallback containing a hosted preview link. Never state that an image was delivered unless success was confirmed.
- Avoid collecting a phone/email unless needed and explained. Make clear before CTA that the concept/brief will be sent to the team via Telegram.

## Cases
- **Cucurigo:** standard review stands adapted to venue scale, dimensions and placement needs.
- **Délice d’Ange:** bespoke branded stand and Smart Menu experience. Previously scoped features include categories/products, product photos/descriptions, AI-assisted choices, order preparation, booking, call waiter and feedback routes; verify actual live capabilities before presenting them as deployed.
- **Padel Point:** custom-designed stand; verify the exact three destinations before stating them publicly.
- Use authentic available photos/logos; never fabricate conversion lifts, sales outcomes or customer quotes.

## Non-goals for launch
No payment gateway, Canva-like freeform editor, automatic AI-to-manufacturing, fictional mass catalog, elaborate CRM, or unapproved production automation.
