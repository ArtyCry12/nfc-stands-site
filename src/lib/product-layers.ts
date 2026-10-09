/**
 * Deterministic layered product photo renderer.
 * Geometry constants are stable across iterations — only fills/overlays change.
 */

export const PRODUCT_LAYER_VIEW = {
  width: 1200,
  height: 900,
  /** Reserved QR plate on the stand face (viewBox coords). */
  qrPlate: { x: 668, y: 348, size: 168 },
  version: "layered-v1",
} as const;

export type ProductSurface = {
  id: string;
  body: string;
  bodyDeep: string;
  edge: string;
  text: string;
  accent: string;
  grain: boolean;
};

export type ProductLayerSpec = {
  productType?: string;
  colorId?: string;
  material?: string | null;
  brandLabel?: string | null;
  showBrandMark?: boolean;
  /** When set, QR modules are baked into the plate (server generate path). */
  qrModules?: { size: number; data: Uint8Array | number[] } | null;
  caption?: string | null;
  footer?: string | null;
  /** Leave the QR plate empty so a client can overlay a live QR image. */
  reserveQrPlate?: boolean;
};

const SURFACES: Record<string, ProductSurface> = {
  black: {
    id: "black",
    body: "#1C1C1C",
    bodyDeep: "#0E0E0E",
    edge: "#3A3A3A",
    text: "#F2F2F2",
    accent: "#FF7A45",
    grain: false,
  },
  white: {
    id: "white",
    body: "#F3F1ED",
    bodyDeep: "#DCD8D0",
    edge: "#B8B2A8",
    text: "#1A1A1A",
    accent: "#FF7A45",
    grain: false,
  },
  wood: {
    id: "wood",
    body: "#C4A574",
    bodyDeep: "#8E6A3E",
    edge: "#6E4F2C",
    text: "#2A1A0C",
    accent: "#FF7A45",
    grain: true,
  },
  blue: {
    id: "blue",
    body: "#2B4C7E",
    bodyDeep: "#1A2F52",
    edge: "#3F66A0",
    text: "#F5F7FA",
    accent: "#FF7A45",
    grain: false,
  },
  yellow: {
    id: "yellow",
    body: "#E6B800",
    bodyDeep: "#B88900",
    edge: "#8A6800",
    text: "#1A1400",
    accent: "#111111",
    grain: false,
  },
  brand: {
    id: "brand",
    body: "#FF7A45",
    bodyDeep: "#D85A28",
    edge: "#A84218",
    text: "#FFFFFF",
    accent: "#111111",
    grain: false,
  },
};

export function resolveSurface(colorId?: string | null): ProductSurface {
  if (colorId && SURFACES[colorId]) return SURFACES[colorId];
  if (colorId && /wood|brown/i.test(colorId)) return SURFACES.wood;
  if (colorId && /white|cream/i.test(colorId)) return SURFACES.white;
  if (colorId && /blue/i.test(colorId)) return SURFACES.blue;
  if (colorId && /yellow|gold/i.test(colorId)) return SURFACES.yellow;
  if (colorId && /brand|coral|orange/i.test(colorId)) return SURFACES.brand;
  return SURFACES.black;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function productSilhouette(
  productType: string,
  surface: ProductSurface,
): string {
  const type = productType || "standard-review-stand";

  if (type === "nfc-stickers-signs") {
    return `
      <g id="layer-stand" transform="translate(340,250)">
        <rect x="40" y="40" width="480" height="320" rx="28" fill="${surface.body}" stroke="${surface.edge}" stroke-width="3"/>
        <rect x="70" y="70" width="420" height="260" rx="18" fill="${surface.bodyDeep}" opacity="0.35"/>
        <circle cx="280" cy="200" r="54" fill="none" stroke="${surface.text}" stroke-width="4" opacity="0.85"/>
        <circle cx="280" cy="200" r="14" fill="${surface.accent}"/>
      </g>`;
  }

  if (type === "smart-menu-kit") {
    return `
      <g id="layer-stand" transform="translate(300,180)">
        <polygon points="80,520 520,520 470,80 130,80" fill="${surface.body}" stroke="${surface.edge}" stroke-width="3"/>
        <polygon points="160,120 440,120 410,300 190,300" fill="${surface.bodyDeep}" opacity="0.28"/>
        <rect x="190" y="150" width="220" height="280" rx="10" fill="#FAFAFA" stroke="${surface.edge}" stroke-width="2"/>
        <rect x="214" y="178" width="172" height="14" rx="4" fill="${surface.accent}" opacity="0.9"/>
        <rect x="214" y="210" width="140" height="10" rx="3" fill="#CFCFCF"/>
        <rect x="214" y="232" width="160" height="10" rx="3" fill="#CFCFCF"/>
        <rect x="214" y="254" width="120" height="10" rx="3" fill="#CFCFCF"/>
        <ellipse cx="300" cy="470" rx="36" ry="36" fill="#111111" stroke="#FFFFFF" stroke-width="3"/>
        <circle cx="300" cy="470" r="11" fill="${surface.accent}"/>
      </g>`;
  }

  if (type === "custom-nfc-product") {
    return `
      <g id="layer-stand" transform="translate(320,160)">
        <path d="M120 80 C220 40 380 40 480 90 L520 500 L80 500 Z" fill="${surface.body}" stroke="${surface.edge}" stroke-width="3"/>
        <path d="M160 140 C250 110 360 110 440 150 L460 300 L140 300 Z" fill="${surface.bodyDeep}" opacity="0.25"/>
        <ellipse cx="300" cy="240" rx="42" ry="42" fill="#111111" stroke="#FFFFFF" stroke-width="3"/>
        <circle cx="300" cy="240" r="12" fill="${surface.accent}"/>
        <ellipse cx="300" cy="520" rx="210" ry="18" fill="#000000" opacity="0.28"/>
      </g>`;
  }

  // standard-review-stand (default identity)
  return `
    <g id="layer-stand" transform="translate(310,150)">
      <ellipse cx="290" cy="560" rx="230" ry="22" fill="#000000" opacity="0.32"/>
      <polygon points="90,540 490,540 430,70 150,70" fill="${surface.body}" stroke="${surface.edge}" stroke-width="3"/>
      <polygon points="150,70 430,70 400,40 180,40" fill="${surface.bodyDeep}" stroke="${surface.edge}" stroke-width="2"/>
      <polygon points="180,110 400,110 380,320 200,320" fill="${surface.bodyDeep}" opacity="0.22"/>
      <ellipse cx="290" cy="210" rx="46" ry="46" fill="#111111" stroke="#FFFFFF" stroke-width="3.5"/>
      <circle cx="290" cy="210" r="13" fill="${surface.accent}"/>
      <path d="M250 210 A40 40 0 0 1 330 210" fill="none" stroke="${surface.text}" stroke-width="2" opacity="0.35"/>
    </g>`;
}

function brandLayer(surface: ProductSurface, label?: string | null): string {
  const safe = escapeXml((label || "touchform.md").slice(0, 28));
  return `
    <g id="layer-branding" transform="translate(360,430)">
      <!-- Threshold mark (stable chrome identity) -->
      <g transform="translate(0,0) scale(0.55)">
        <rect x="18" y="28" width="40" height="72" rx="6" fill="${surface.text === "#F2F2F2" || surface.text === "#F5F7FA" || surface.text === "#FFFFFF" ? "#111111" : surface.text}"/>
        <path d="M58 40 H86 C98 40 106 52 106 64 C106 76 98 88 86 88 H58" stroke="${surface.accent}" stroke-width="8" stroke-linecap="round" fill="none"/>
        <circle cx="96" cy="64" r="7" fill="${surface.accent}"/>
        <rect x="28" y="48" width="18" height="4" rx="2" fill="#FFFFFF" opacity="0.85"/>
        <rect x="28" y="58" width="12" height="4" rx="2" fill="#FFFFFF" opacity="0.55"/>
      </g>
      <text x="86" y="48" fill="${surface.text}" font-family="Space Grotesk, Arial, sans-serif" font-size="28" font-weight="700">${safe}</text>
    </g>`;
}

function qrPlateLayer(
  modules: ProductLayerSpec["qrModules"],
  reserve: boolean,
): string {
  const { x, y, size } = PRODUCT_LAYER_VIEW.qrPlate;
  const plate = `
    <g id="layer-qr">
      <rect x="${x - 8}" y="${y - 8}" width="${size + 16}" height="${size + 16}" rx="10" fill="#FFFFFF" stroke="#D0D0D0" stroke-width="2"/>
      <rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#FFFFFF"/>`;

  if (modules && modules.size > 0) {
    const n = modules.size;
    const cell = size / n;
    const rects: string[] = [];
    for (let row = 0; row < n; row += 1) {
      for (let col = 0; col < n; col += 1) {
        const bit = modules.data[row * n + col];
        if (bit) {
          rects.push(
            `<rect x="${(x + col * cell).toFixed(2)}" y="${(y + row * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" fill="#111111"/>`,
          );
        }
      }
    }
    return `${plate}${rects.join("")}</g>`;
  }

  if (reserve) {
    return `${plate}
      <text x="${x + size / 2}" y="${y + size / 2 + 4}" text-anchor="middle" fill="#B0B0B0" font-family="DM Sans, Arial, sans-serif" font-size="14">QR</text>
    </g>`;
  }

  // Placeholder hash pattern (not a real QR) when no destination yet
  return `${plate}
    <g opacity="0.18" fill="#111111">
      <rect x="${x + 16}" y="${y + 16}" width="28" height="28"/>
      <rect x="${x + size - 44}" y="${y + 16}" width="28" height="28"/>
      <rect x="${x + 16}" y="${y + size - 44}" width="28" height="28"/>
      <rect x="${x + 56}" y="${y + 56}" width="12" height="12"/>
      <rect x="${x + 80}" y="${y + 72}" width="12" height="12"/>
      <rect x="${x + 104}" y="${y + 56}" width="12" height="12"/>
    </g>
  </g>`;
}

function grainLayer(surface: ProductSurface): string {
  if (!surface.grain) return "";
  return `
    <g id="layer-material" opacity="0.18" fill="none" stroke="${surface.edge}" stroke-width="1.5">
      <path d="M380 220 C420 260, 460 300, 500 360"/>
      <path d="M420 200 C460 250, 500 300, 540 380"/>
      <path d="M460 190 C500 240, 540 300, 580 400"/>
      <path d="M500 210 C540 270, 580 330, 620 420"/>
    </g>`;
}

/**
 * Build the layered product SVG string. Same inputs → same output.
 */
export function buildLayeredProductSvg(spec: ProductLayerSpec = {}): string {
  const surface = resolveSurface(spec.colorId);
  const productType = spec.productType || "standard-review-stand";
  const { width, height, version } = PRODUCT_LAYER_VIEW;
  const caption = escapeXml(
    (spec.caption || `${productType} · ${surface.id}`).slice(0, 80),
  );
  const footer = escapeXml(
    (
      spec.footer ||
      "Layered concept preview — not a manufacturing file · materials confirmed by team"
    ).slice(0, 120),
  );
  const material = escapeXml((spec.material || "standard-catalog-option").slice(0, 40));
  const reserve = spec.reserveQrPlate ?? !spec.qrModules;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" data-renderer="${version}">
  <defs>
    <linearGradient id="stage" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#242424"/>
      <stop offset="55%" stop-color="#141414"/>
      <stop offset="100%" stop-color="#0A0A0A"/>
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="35%" r="45%">
      <stop offset="0%" stop-color="#FF7A45" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#FF7A45" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <g id="layer-stage">
    <rect width="${width}" height="${height}" fill="url(#stage)"/>
    <rect width="${width}" height="${height}" fill="url(#glow)"/>
    <text x="56" y="64" fill="#FF7A45" font-family="Space Grotesk, Arial, sans-serif" font-size="22" font-weight="600">touchform.md</text>
    <text x="56" y="96" fill="#8A8A8A" font-family="DM Sans, Arial, sans-serif" font-size="16">${version} · front-three-quarter</text>
  </g>
  ${productSilhouette(productType, surface)}
  ${grainLayer(surface)}
  ${spec.showBrandMark === false ? "" : brandLayer(surface, spec.brandLabel)}
  ${qrPlateLayer(spec.qrModules ?? null, reserve)}
  <g id="layer-meta">
    <text x="56" y="820" fill="#CFCFCF" font-family="Space Grotesk, Arial, sans-serif" font-size="22" font-weight="600">${caption}</text>
    <text x="56" y="852" fill="#7A7A7A" font-family="DM Sans, Arial, sans-serif" font-size="16">${material} · ${surface.id}</text>
    <text x="56" y="878" fill="#FF7A45" font-family="DM Sans, Arial, sans-serif" font-size="14">${footer}</text>
  </g>
</svg>`;
}

/** Encode SVG as data URL. Browser uses btoa; Node uses Buffer. */
export function encodeSvgDataUrl(svg: string) {
  if (typeof window !== "undefined") {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export function buildLayeredProductDataUrl(spec: ProductLayerSpec = {}) {
  const svg = buildLayeredProductSvg(spec);
  return {
    svg,
    dataUrl: encodeSvgDataUrl(svg),
    mode: "layered_svg" as const,
    version: PRODUCT_LAYER_VIEW.version,
  };
}

/** Percentage box for aligning a live QR <img> over the reserved plate. */
export function qrOverlayStyle(): {
  left: string;
  top: string;
  width: string;
  height: string;
} {
  const { width, height, qrPlate } = PRODUCT_LAYER_VIEW;
  return {
    left: `${(qrPlate.x / width) * 100}%`,
    top: `${(qrPlate.y / height) * 100}%`,
    width: `${(qrPlate.size / width) * 100}%`,
    height: `${(qrPlate.size / height) * 100}%`,
  };
}
