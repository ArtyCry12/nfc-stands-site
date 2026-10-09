import { getProduct } from "@/lib/catalog";
import type { ConceptContract, ConsultRequest } from "@/lib/concept-schema";
import {
  DIGITAL_EXPERIENCES,
  STANDARD_REVIEW_STAND_ID,
  knowledgeBrief,
} from "@/lib/knowledge-base";
import { priceStandardReviewStand } from "@/lib/pricing";

function pickDirection(goal: string, business: string) {
  const g = `${goal} ${business}`.toLowerCase();
  if (g.includes("menu") || g.includes("meniu") || g.includes("меню")) {
    return {
      product: "smart-menu-kit",
      experience: "smart-menu",
      custom: true,
    };
  }
  if (
    g.includes("sticker") ||
    g.includes("наклей") ||
    g.includes("stickere") ||
    g.includes("plac") ||
    g.includes("таблич") ||
    g.includes("sign")
  ) {
    return {
      product: "nfc-stickers-signs",
      experience: "custom-link",
      custom: true,
    };
  }
  if (
    g.includes("custom") ||
    g.includes("personalizat") ||
    g.includes("кастом") ||
    g.includes("bespoke") ||
    g.includes("formă") ||
    g.includes("unique")
  ) {
    return {
      product: "custom-nfc-product",
      experience: "info-contact",
      custom: true,
    };
  }
  return {
    product: STANDARD_REVIEW_STAND_ID,
    experience: "google-reviews",
    custom: false,
  };
}

export function buildMockConcept(input: ConsultRequest): ConceptContract {
  const locale = input.locale;
  const direction = pickDirection(input.goal, input.business);
  const product = getProduct(direction.product)!;
  const experience =
    DIGITAL_EXPERIENCES.find((d) => d.id === direction.experience) ??
    DIGITAL_EXPERIENCES[0];
  const qty = input.quantity ?? (direction.custom ? null : 2);

  const commercial = direction.custom
    ? {
        price_type: "custom-quote" as const,
        unit_price_mdl: null,
        total_price_mdl: null,
        price_source: null,
      }
    : (() => {
        const priced = priceStandardReviewStand(qty ?? 2);
        return {
          price_type: "fixed-tier" as const,
          unit_price_mdl: priced.unitPriceMdl,
          total_price_mdl: priced.totalPriceMdl,
          price_source: priced.priceSource,
        };
      })();

  const alternatives = [
    {
      title: product.name[locale],
      why: product.summary[locale],
    },
    {
      title:
        locale === "ru"
          ? "Кастомная форма + цифровой сценарий"
          : locale === "ro"
            ? "Formă custom + scenariu digital"
            : "Custom form + digital scenario",
      why:
        locale === "ru"
          ? "Если стандартный стенд не подходит по материалу или брендингу — индивидуальная смета."
          : locale === "ro"
            ? "Dacă standul standard nu se potrivește ca material sau branding — ofertă individuală."
            : "If the standard stand does not fit material or branding — individual quote.",
    },
    {
      title: experience.label[locale],
      why: experience.note[locale],
    },
  ];

  return {
    schema_version: "1.0",
    language: locale,
    lead_id: crypto.randomUUID(),
    business: {
      industry: input.business,
      business_description: input.business,
      audience: null,
      location_context: input.context ?? null,
      pain_point: input.goal,
      desired_outcome: input.goal,
      constraints: [],
    },
    recommendation: {
      concept_name: `${product.name[locale]} · ${experience.label[locale]}`,
      why_it_fits: product.summary[locale],
      physical_product_type: product.slug,
      customer_action_after_tap: input.goal,
      digital_experience_type: experience.id,
      offer_title:
        locale === "ru"
          ? "Персональное предложение Touchform.md"
          : locale === "ro"
            ? "Ofertă personalizată Touchform.md"
            : "Personalized Touchform.md offer",
      offer_summary:
        locale === "ru"
          ? `Для «${input.business}»: физический touchpoint + ${experience.label.ru}, чтобы клиент сделал «${input.goal}».`
          : locale === "ro"
            ? `Pentru „${input.business}”: touchpoint fizic + ${experience.label.ro}, ca clientul să facă „${input.goal}”.`
            : `For “${input.business}”: physical touchpoint + ${experience.label.en} so customers can “${input.goal}”.`,
      offer_includes: [
        product.name[locale],
        experience.label[locale],
        "NFC + QR fallback",
        direction.custom
          ? locale === "ru"
            ? "Индивидуальная смета"
            : locale === "ro"
              ? "Ofertă individuală"
              : "Individual quote"
          : `Tier pricing · qty ${qty}`,
      ],
      assumptions: [
        locale === "ru"
          ? "Цвет/материал/логотип подтверждаются командой"
          : locale === "ro"
            ? "Culoarea/materialul/logo se confirmă cu echipa"
            : "Color/material/logo confirmed with the team",
      ],
      human_review_required: true,
      alternative_ideas: alternatives,
    },
    design: {
      geometry: direction.custom ? "custom-request" : STANDARD_REVIEW_STAND_ID,
      view: "front-three-quarter",
      primary_color: "black",
      secondary_color: null,
      material: direction.custom
        ? "needs-human-review"
        : "standard-catalog-option",
      finish: null,
      text: null,
      logo_asset_id: null,
      qr_enabled: true,
      qr_destination_url: input.destinationUrl ?? null,
      quantity: qty,
      reference_image_ids: [],
      image_prompt_constraints: [
        "front-three-quarter product-only view",
        "quiet neutral background",
        "concept mock-up — not manufacturing file",
      ],
    },
    commercial,
    production: {
      feasibility: direction.custom ? "needs-human-review" : "known-option",
      known_catalog_facts: [
        `catalog:${product.slug}`,
        `experience:${experience.id}`,
        ...(direction.custom
          ? []
          : ["pricing:standard-review-stand-tiers-v1"]),
      ],
      open_questions: [
        locale === "ru"
          ? "Точный тираж и дедлайн"
          : locale === "ro"
            ? "Tirajul exact și termenul"
            : "Exact quantity and deadline",
        locale === "ru"
          ? "Файл логотипа и бренд-цвета"
          : locale === "ro"
            ? "Fișier logo și culori brand"
            : "Logo file and brand colors",
        ...(product.dimensionsConfirmed
          ? []
          : [
              locale === "ru"
                ? "Финальные размеры — подтверждение производства"
                : locale === "ro"
                  ? "Dimensiuni finale — confirmare producție"
                  : "Final dimensions — production confirmation",
            ]),
      ],
    },
    generation: {
      attempt_number: 0,
      max_attempts: 2,
      status: "idle",
      provider_model: null,
      preview_asset_id: null,
    },
  };
}

export function llmConfigured() {
  return Boolean(
    process.env.OPENAI_API_KEY ||
      process.env.GOOGLE_GEMINI_API_KEY ||
      process.env.AI_TEXT_PROVIDER,
  );
}

export function consultSystemContext(locale: ConsultRequest["locale"]) {
  return {
    knowledge: knowledgeBrief(locale),
    rules: [
      "Never invent prices, materials, sizes, lead times or outcomes.",
      "Use standard-review-stand-tiers-v1 only for standard-review-stand.",
      "Custom products → price_type custom-quote.",
      "Offer 2–3 distinct ideas when context allows.",
      "Mark unknowns in production.open_questions.",
      "schema_version must be 1.0",
    ],
  };
}
