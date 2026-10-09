# SEO and Localization Requirements

## Localized URLs and language logic
- Use distinct routes: `/ro/`, `/ru/`, `/en/`.
- On first visit, detect a supported browser-preferred language; fallback to Romanian. Do not repeatedly override a user-selected language.
- Persist the user's language choice (cookie/local storage as appropriate) and provide an always-visible manual language switch.
- Make each language version genuinely localized, not machine-translated copy pasted unchanged.
- Generate reciprocal hreflang annotations for equivalent pages, self-references where appropriate, canonical URLs, localized metadata, and correct language attributes. Verify every route and alternate mapping in tests.

## Page clusters
Commercial core:
- NFC review stands
- Custom NFC products
- NFC/QR signs and stickers
- Smart Menu / NFC digital experiences
- AI/custom product design flow
- Product-specific landing pages for actual standard products

Use-case pages:
- Reviews and feedback
- Menus and hospitality
- Contact/links/lead capture
- Events and visitor touchpoints
- Custom use cases
Only publish when there is real useful content and a clear path to the relevant offer. Avoid dozens of near-identical industry pages.

Case studies:
- Cucurigo
- Délice d’Ange
- Padel Point
Use authentic original photos/assets, precise known facts and custom page titles/descriptions. Do not fabricate business outcomes.

## Structured data
- Organization/LocalBusiness where accurate.
- Product/Offer on individual standard product pages with price in MDL and true pricing conditions. Implement quantity tiers correctly; do not mark one price as universally available if tier rules differ.
- BreadcrumbList as appropriate.
- FAQPage only where visible FAQ content complies with current Google guidance.
- Validate structured data in official testing tools. Google notes product rich results are based on page-specific product markup; use markup that matches visible content.

## Search content principles
- Write for actual customer questions, not keyword stuffing.
- Use Romanian as Moldova-first primary content; support Russian and English user intents.
- Create genuinely useful answers: how NFC and QR coexist, where stands are placed, how custom products are approved, what happens after tapping, and how digital destinations can be updated if supported.
- Do not promise improved review scores or fake review results. Never use review gating or incentives for Google reviews.
- Prioritize technical hygiene: sitemaps per canonical localized site, robots, indexable rendered content, good internal linking, clean redirects, image alt text, local business info and page speed.

## Official references
- Google localized versions / hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions
- Google product structured data: https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- Google helpful content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google review policies: https://support.google.com/business/answer/7400114
