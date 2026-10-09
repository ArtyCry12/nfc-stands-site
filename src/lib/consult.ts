import { catalog, getProduct } from "@/lib/catalog";
import type { ConceptContract, ConsultRequest } from "@/lib/concept-schema";

function pickSlug(goal: string, business: string) {
  const g = `${goal} ${business}`.toLowerCase();
  if (g.includes("menu") || g.includes("meniu") || g.includes("меню")) {
    return "smart-menu-kit";
  }
  if (g.includes("sticker") || g.includes("наклей") || g.includes("stickere")) {
    return "nfc-sticker-pack";
  }
  if (
    g.includes("hotel") ||
    g.includes("premium") ||
    g.includes("wood") ||
    g.includes("lemn") ||
    g.includes("дерев")
  ) {
    return "review-stand-wood";
  }
  if (g.includes("plaque") || g.includes("plac") || g.includes("таблич") || g.includes("wifi")) {
    return "nfc-plaque";
  }
  return "review-stand-classic";
}

export function buildMockConcept(input: ConsultRequest): ConceptContract {
  const slug = pickSlug(input.goal, input.business);
  const product = getProduct(slug) ?? catalog[0];
  const locale = input.locale;
  const scenario = product.scenarios[0];
  const material = product.materials[0];
  const color = product.colors[0];
  const finish = product.finishes[0];

  const titles = {
    ro: `${product.name.ro} pentru ${input.business}`,
    ru: `${product.name.ru} для ${input.business}`,
    en: `${product.name.en} for ${input.business}`,
  };

  const summaries = {
    ro: `Propunem ${product.name.ro} legat de „${input.goal}”, plasat ${input.context || "în zona clientului"}.`,
    ru: `Предлагаем ${product.name.ru} под задачу «${input.goal}», размещение: ${input.context || "в зоне клиента"}.`,
    en: `We propose ${product.name.en} for “${input.goal}”, placed ${input.context || "in the customer zone"}.`,
  };

  return {
    version: "1",
    conceptId: crypto.randomUUID(),
    locale,
    business: {
      type: input.business,
      audience: undefined,
      locationHint: input.context,
    },
    problem: input.goal,
    concept: {
      title: titles[locale],
      summary: summaries[locale],
      whyItFits: [
        product.summary[locale],
        `${scenario.label[locale]} → clear customer action`,
        "Physical object and digital scenario designed as one system",
      ],
    },
    physicalProduct: {
      catalogSlug: product.slug,
      type: product.category,
      dimensions: product.dimensions,
      material: material.label[locale],
      color: color.label[locale],
      shape: product.category === "sticker" ? "disc" : "table-tent",
      finish: finish.label[locale],
    },
    branding: {
      brandColors: [],
      logoRequired: true,
      text: null,
      qrOptional: scenario.id === "reviews",
    },
    placement: input.context || null,
    digitalScenario: {
      id: scenario.id,
      label: scenario.label[locale],
      targetAction: input.goal,
    },
    offer: {
      task: input.goal,
      solution: titles[locale],
      composition: [
        product.name[locale],
        material.label[locale],
        color.label[locale],
        scenario.label[locale],
      ],
      expectedOutcome:
        locale === "ru"
          ? "Клиент совершает целевое действие одним тапом"
          : locale === "ro"
            ? "Clientul face acțiunea dorită dintr-un tap"
            : "Customer completes the target action in one tap",
      nextSteps: [
        locale === "ru"
          ? "Сгенерировать визуал концепта"
          : locale === "ro"
            ? "Generează vizualul conceptului"
            : "Generate a concept visual",
        locale === "ru"
          ? "Передать менеджеру в Telegram"
          : locale === "ro"
            ? "Trimite managerului în Telegram"
            : "Hand off to manager on Telegram",
      ],
    },
    constraints: [
      "Catalog SKUs only — no invented products",
      "Visual concept ≠ production guarantee",
    ],
    unknowns: [
      locale === "ru"
        ? "Точный тираж и дедлайн"
        : locale === "ro"
          ? "Tirajul exact și termenul"
          : "Exact quantity and deadline",
      locale === "ru"
        ? "Финальные бренд-цвета и файл логотипа"
        : locale === "ro"
          ? "Culorile brand și fișierul logo"
          : "Final brand colors and logo file",
    ],
    approvalStatus: "needs_confirmation",
    resultUrl: null,
    priceHint: {
      currency: "MDL",
      from: product.basePriceFrom,
      note:
        locale === "ru"
          ? "Ориентир «от» до подтверждения менеджером"
          : locale === "ro"
            ? "Orientativ „de la” până la confirmarea managerului"
            : "Provisional “from” until manager confirmation",
    },
  };
}

export function llmConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}
