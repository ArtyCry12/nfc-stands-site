import {
  DIGITAL_EXPERIENCES,
  STANDARD_REVIEW_STAND_ID,
  VISUAL_COLOR_OPTIONS,
} from "@/lib/knowledge-base";
import { priceStandardReviewStand } from "@/lib/pricing";

export type Locale = "ro" | "ru" | "en";

export type CatalogProduct = {
  slug: string;
  name: Record<Locale, string>;
  summary: Record<Locale, string>;
  /** Only standard review stand uses quantity tiers; others are custom-quote. */
  pricing: "standard-tiers" | "custom-quote";
  category: "standard-stand" | "custom" | "digital" | "touchpoint";
  colors: { id: string; label: Record<Locale, string> }[];
  experiences: { id: string; label: Record<Locale, string> }[];
  /** Dimensions only when confirmed — otherwise null (do not invent). */
  dimensionsConfirmed: string | null;
};

export const catalog: CatalogProduct[] = [
  {
    slug: STANDARD_REVIEW_STAND_ID,
    name: {
      ro: "Stand standard pentru recenzii",
      ru: "Стандартный стенд для отзывов",
      en: "Standard review stand",
    },
    summary: {
      ro: "Stand fizic cu NFC + QR fallback, branding și destinație configurabilă. Preț pe tiraj conform treptelor aprobate.",
      ru: "Физический стенд с NFC + QR fallback, брендингом и настраиваемой целью. Цена по утверждённым тиражным ступеням.",
      en: "Physical stand with NFC + QR fallback, branding and configurable destination. Volume pricing per approved tiers.",
    },
    pricing: "standard-tiers",
    category: "standard-stand",
    colors: VISUAL_COLOR_OPTIONS.map((c) => ({ id: c.id, label: { ...c.label } })),
    experiences: DIGITAL_EXPERIENCES.filter((d) =>
      ["google-reviews", "info-contact", "custom-link"].includes(d.id),
    ).map((d) => ({ id: d.id, label: { ...d.label } })),
    dimensionsConfirmed: null,
  },
  {
    slug: "custom-nfc-product",
    name: {
      ro: "Produs NFC personalizat",
      ru: "Кастомный NFC-продукт",
      en: "Custom NFC product",
    },
    summary: {
      ro: "Forme, materiale și finisaje locale pe comandă. Ofertă individuală — fără treptele standard.",
      ru: "Локальные формы, материалы и отделка под заказ. Индивидуальная смета — без стандартных ступеней.",
      en: "Locally produced bespoke shapes, materials and finishes. Individually quoted — not standard tiers.",
    },
    pricing: "custom-quote",
    category: "custom",
    colors: VISUAL_COLOR_OPTIONS.map((c) => ({ id: c.id, label: { ...c.label } })),
    experiences: DIGITAL_EXPERIENCES.map((d) => ({
      id: d.id,
      label: { ...d.label },
    })),
    dimensionsConfirmed: null,
  },
  {
    slug: "nfc-stickers-signs",
    name: {
      ro: "Stickere și plăci NFC/QR",
      ru: "Стикеры и таблички NFC/QR",
      en: "NFC/QR stickers and signs",
    },
    summary: {
      ro: "Touchpoint-uri pe ambalaj, masă sau perete. Specificația și prețul se confirmă cu echipa.",
      ru: "Точки касания на упаковке, столе или стене. Спека и цена — с командой.",
      en: "Touchpoints for packaging, tables or walls. Spec and price confirmed with the team.",
    },
    pricing: "custom-quote",
    category: "touchpoint",
    colors: VISUAL_COLOR_OPTIONS.filter((c) =>
      ["white", "black", "brand"].includes(c.id),
    ).map((c) => ({ id: c.id, label: { ...c.label } })),
    experiences: DIGITAL_EXPERIENCES.map((d) => ({
      id: d.id,
      label: { ...d.label },
    })),
    dimensionsConfirmed: null,
  },
  {
    slug: "smart-menu-kit",
    name: {
      ro: "Experiență Smart Menu",
      ru: "Опыт Smart Menu",
      en: "Smart Menu experience",
    },
    summary: {
      ro: "Obiect fizic + meniu/digital flow. Capabilitățile exacte se verifică pe proiect (vezi Délice d’Ange).",
      ru: "Физический объект + меню/цифровой поток. Точные возможности проверяются по проекту (см. Délice d’Ange).",
      en: "Physical object + menu/digital flow. Exact capabilities verified per project (see Délice d’Ange).",
    },
    pricing: "custom-quote",
    category: "digital",
    colors: VISUAL_COLOR_OPTIONS.map((c) => ({ id: c.id, label: { ...c.label } })),
    experiences: DIGITAL_EXPERIENCES.filter((d) =>
      ["smart-menu", "booking", "info-contact"].includes(d.id),
    ).map((d) => ({ id: d.id, label: { ...d.label } })),
    dimensionsConfirmed: null,
  },
];

export function getProduct(slug: string) {
  return catalog.find((p) => p.slug === slug);
}

export function standardStandUnitFrom(quantity = 1) {
  return priceStandardReviewStand(quantity).unitPriceMdl;
}

export function formatStandardTierTable(locale: Locale) {
  const header =
    locale === "ru"
      ? "Количество · цена за шт."
      : locale === "ro"
        ? "Cantitate · preț / buc."
        : "Quantity · unit price";
  const rows = [
    "1–2 → 450 MDL",
    "3–6 → 400 MDL",
    "7–10 → 350 MDL",
    "11–19 → 300 MDL",
    "20+ → 250 MDL",
  ];
  return { header, rows };
}
