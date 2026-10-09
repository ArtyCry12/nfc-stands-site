# Touchform.md — Cursor Project Pack

## Goal
Build a premium, conversion-oriented multilingual website for a Moldova-first NFC product and digital-experience studio. This is not a static brochure or a narrow stand shop: the site helps visitors discover solutions to business problems, visualize a physical product, and send a sales-ready brief to the team.

## Founder-directed baseline
- Brand name to use in the project: **Touchform.md**. Do not silently replace it. Before public launch, verify rights, domain ownership, and potential confusion with existing market use; treat any conflict as a founder approval gate.
- Markets: Moldova first (75% of effort), Romania second (25%); wider EU expansion only after Romanian-market evidence.
- Languages: Romanian, Russian, English. On first visit, choose a supported browser language; fallback Romanian. Manual choice persists. Separate `/ro/`, `/ru/`, `/en/` routes and correct localized metadata/hreflang.
- Standard review-stand price per unit: 1–2 = 450 MDL; 3–6 = 400 MDL; 7–10 = 350 MDL; 11–19 = 300 MDL; 20+ = 250 MDL. Custom items are individually quoted.
- No online payment at launch.
- The live site contains a conversational AI business consultant, structured personalized offer builder, deterministic standard product configurator, and a custom-product concept image generator.
- Each visitor/design session gets **two image-generation attempts**. The consultant can continue within defensible per-session, per-IP burst, token, and daily-budget limits. Show a manager handoff after the visual attempts are used.
- Sales handoff must actually deliver generated preview image + caption/brief to a configured manager Telegram chat through a server-side Telegram Bot API integration. A normal `t.me/share/url` link cannot pre-attach an image. If bot settings are unavailable, disclose the fallback and do not claim an image was delivered.
- Website style: premium, tactile, clear and interactive; an intentionally balanced hybrid of cinematic motion and fast, usable interface. Avoid both static template blandness and heavy motion that harms performance.
- Cases: Cucurigo, Délice d’Ange, Padel Point. Use available authentic assets; no invented results, testimonials, certifications or metrics.

## Central product idea
**Sell a solution to a business problem, not an NFC chip.** The AI consultant listens, asks targeted follow-up questions, proactively suggests ideas, recommends a relevant physical + digital solution, explains why, and creates a personalized written offer. The image model only visualizes a canonical product specification; it does not set price or production feasibility.

## How to start in Cursor
1. Read `AGENTS.md`, `DECISIONS.md`, `01_PRODUCT_BRIEF.md`, and `10_AI_CONSULTANT_AND_TELEGRAM_HANDOFF.md`.
2. Inventory the repository, assets, existing stack, and available tools before changing anything.
3. Research and compare current official docs, costs, licenses, and real visual references. Record decisions and source URLs.
4. Create and evaluate three genuinely different visual directions before selecting one; then build a clickable design prototype.
5. Implement the core site, consultant, configurator, generation limits, and real Telegram image handoff. Keep standard purchase/enquiry usable if AI is unavailable.
6. Run full tests and deploy a preview if available. Do not deploy to production, change DNS, start paid plans, or commit to spend without explicit founder approval.

## What counts as done
A functioning, responsive, localized website that has passed browser testing—not only mockups or a written plan. The final report must include a preview URL, screenshots, acceptance test results, actual/potential API costs, what is blocked by missing credentials, and remaining risks.
