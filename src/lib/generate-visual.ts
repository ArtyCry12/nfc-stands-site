import type { ConceptContract } from "@/lib/concept-schema";

export function imageConfigured() {
  return Boolean(process.env.IMAGE_API_KEY);
}

/** Deterministic SVG product stub — honest fallback when image keys are missing. */
export function buildProductSvg(concept: ConceptContract) {
  const title = concept.concept.title.replace(/[<>&]/g, "");
  const material = concept.physicalProduct.material ?? "material TBD";
  const color = concept.physicalProduct.color ?? "ink";
  const slug = concept.physicalProduct.catalogSlug ?? "custom";
  const fill =
    color.toLowerCase().includes("coral") || color.toLowerCase().includes("корал")
      ? "#FF7A45"
      : color.toLowerCase().includes("white") || color.toLowerCase().includes("alb")
        ? "#F4F4F4"
        : color.toLowerCase().includes("wood") ||
            color.toLowerCase().includes("ash") ||
            color.toLowerCase().includes("oak") ||
            color.toLowerCase().includes("natural") ||
            color.toLowerCase().includes("frasin") ||
            color.toLowerCase().includes("ясен")
          ? "#C4A574"
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
  <text x="64" y="72" fill="#FF7A45" font-family="Space Grotesk, Arial" font-size="22">touchform.md · concept stub</text>
  <text x="64" y="120" fill="#ffffff" font-family="Space Grotesk, Arial" font-size="36" font-weight="700">${title.slice(0, 48)}</text>
  <g transform="translate(360,260)">
    <polygon points="0,280 240,280 200,40 40,40" fill="${fill}" stroke="#FF7A45" stroke-width="3"/>
    <ellipse cx="120" cy="110" rx="34" ry="34" fill="#111" stroke="#fff" stroke-width="3"/>
    <circle cx="120" cy="110" r="10" fill="#FF7A45"/>
    <text x="120" y="320" text-anchor="middle" fill="#8A8A8A" font-family="DM Sans, Arial" font-size="18">${slug}</text>
  </g>
  <text x="64" y="820" fill="#5E5E5E" font-family="DM Sans, Arial" font-size="20">${material} · ${color}</text>
  <text x="64" y="860" fill="#8A8A8A" font-family="DM Sans, Arial" font-size="16">Visual concept ≠ production guarantee · id ${concept.conceptId.slice(0, 8)}</text>
</svg>`;

  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  return { dataUrl, mode: "svg_stub" as const };
}
