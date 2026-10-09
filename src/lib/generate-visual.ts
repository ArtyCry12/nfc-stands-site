import QRCode from "qrcode";
import type { ConceptContract } from "@/lib/concept-schema";
import {
  buildLayeredProductDataUrl,
  type ProductLayerSpec,
} from "@/lib/product-layers";
import { validateDestinationUrl } from "@/lib/qr";

export function imageConfigured() {
  return Boolean(
    process.env.GOOGLE_GEMINI_API_KEY ||
      process.env.IMAGE_API_KEY ||
      (process.env.AI_IMAGE_PROVIDER && process.env.AI_IMAGE_PROVIDER !== "none"),
  );
}

async function qrModulesForDestination(url: string | null | undefined) {
  if (!url) return null;
  const check = validateDestinationUrl(url);
  if (!check.ok) return null;
  const created = QRCode.create(check.normalized, {
    errorCorrectionLevel: "M",
  });
  const size = created.modules.size;
  const data: number[] = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      data.push(created.modules.get(row, col) ? 1 : 0);
    }
  }
  return { size, data };
}

/** Deterministic layered product preview — no paid image API. */
export async function buildProductSvg(concept: ConceptContract) {
  const modules = await qrModulesForDestination(
    concept.design.qr_destination_url,
  );

  const spec: ProductLayerSpec = {
    productType: concept.recommendation.physical_product_type,
    colorId: concept.design.primary_color || "black",
    material: concept.design.material,
    brandLabel: "touchform.md",
    showBrandMark: true,
    qrModules: modules,
    reserveQrPlate: !modules,
    caption: concept.recommendation.concept_name.slice(0, 72),
    footer: `Concept mock-up · ${concept.lead_id.slice(0, 8)} · confirmed by team`,
  };

  const layered = buildLayeredProductDataUrl(spec);
  return {
    dataUrl: layered.dataUrl,
    mode: layered.mode,
    version: layered.version,
  };
}
