import type { ConceptContract } from "@/lib/concept-schema";

export function imageConfigured() {
  return Boolean(
    process.env.GOOGLE_GEMINI_API_KEY ||
      process.env.IMAGE_API_KEY ||
      (process.env.AI_IMAGE_PROVIDER && process.env.AI_IMAGE_PROVIDER !== "none"),
  );
}

/** Deterministic SVG product stub — honest fallback when image keys are missing. */
export function buildProductSvg(concept: ConceptContract) {
  const title = concept.recommendation.concept_name.replace(/[<>&]/g, "");
  const material = concept.design.material;
  const color = concept.design.primary_color;
  const product = concept.recommendation.physical_product_type;
  const fill =
    color === "yellow"
      ? "#E6B800"
      : color === "blue"
        ? "#2B4C7E"
        : color === "wood" || color.includes("brown")
          ? "#C4A574"
          : color === "white"
            ? "#F4F4F4"
            : color === "brand"
              ? "#FF7A45"
              : "#1A1A1A";

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2a2a2a"/>
      <stop offset="100%" stop-color="#111111"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <text x="64" y="72" fill="#FF7A45" font-family="Space Grotesk, Arial" font-size="22">touchform.md · concept preview</text>
  <text x="64" y="120" fill="#ffffff" font-family="Space Grotesk, Arial" font-size="34" font-weight="700">${title.slice(0, 52)}</text>
  <g transform="translate(360,240)">
    <polygon points="0,300 240,300 200,40 40,40" fill="${fill}" stroke="#FF7A45" stroke-width="3"/>
    <ellipse cx="120" cy="120" rx="34" ry="34" fill="#111" stroke="#fff" stroke-width="3"/>
    <circle cx="120" cy="120" r="10" fill="#FF7A45"/>
    <text x="120" y="340" text-anchor="middle" fill="#8A8A8A" font-family="DM Sans, Arial" font-size="18">${product}</text>
  </g>
  <text x="64" y="800" fill="#5E5E5E" font-family="DM Sans, Arial" font-size="20">${material} · ${color} · front-three-quarter</text>
  <text x="64" y="840" fill="#8A8A8A" font-family="DM Sans, Arial" font-size="16">Concept mock-up — not a manufacturing file · ${concept.lead_id.slice(0, 8)}</text>
  <text x="64" y="870" fill="#FF7A45" font-family="DM Sans, Arial" font-size="14">Final materials, dimensions, quote and production confirmed by our team</text>
</svg>`;

  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  return { dataUrl, mode: "svg_stub" as const };
}
