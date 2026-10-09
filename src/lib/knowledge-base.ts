/**
 * Curated product/solution knowledge — only confirmed founder facts.
 * Unknown production details stay marked for human confirmation.
 */

export type Localized = Record<"ro" | "ru" | "en", string>;

export const STANDARD_REVIEW_STAND_ID = "standard-review-stand";

export const VISUAL_COLOR_OPTIONS = [
  { id: "white", label: { ro: "Alb", ru: "Белый", en: "White" } },
  { id: "black", label: { ro: "Negru", ru: "Чёрный", en: "Black" } },
  { id: "wood", label: { ro: "Lemn / maro", ru: "Дерево / коричневый", en: "Wood / brown" } },
  { id: "blue", label: { ro: "Albastru", ru: "Синий", en: "Blue" } },
  { id: "yellow", label: { ro: "Galben", ru: "Жёлтый", en: "Yellow" } },
  { id: "brand", label: { ro: "Culori brand", ru: "Цвета бренда", en: "Brand colors" } },
] as const;

export const DIGITAL_EXPERIENCES = [
  {
    id: "google-reviews",
    label: {
      ro: "Recenzii Google / Maps",
      ru: "Отзывы Google / Maps",
      en: "Google / Maps reviews",
    },
    note: {
      ro: "Destinație neutră — fără stimulente pentru recenzii.",
      ru: "Нейтральный переход — без стимулов за отзывы.",
      en: "Neutral destination — no review incentives.",
    },
  },
  {
    id: "smart-menu",
    label: { ro: "Smart Menu", ru: "Smart Menu", en: "Smart Menu" },
    note: {
      ro: "Capabilitățile live se confirmă pe caz (ex. Délice d’Ange).",
      ru: "Живые возможности подтверждаются по кейсу (напр. Délice d’Ange).",
      en: "Live capabilities confirmed per case (e.g. Délice d’Ange).",
    },
  },
  {
    id: "info-contact",
    label: {
      ro: "Informații / contact",
      ru: "Информация / контакт",
      en: "Information / contact",
    },
    note: {
      ro: "Pagină scurtă cu detalii și CTA.",
      ru: "Короткая страница с деталями и CTA.",
      en: "Short page with details and CTA.",
    },
  },
  {
    id: "booking",
    label: { ro: "Rezervare", ru: "Бронирование", en: "Booking" },
    note: {
      ro: "Flux de rezervare — detalii după confirmare umană.",
      ru: "Поток бронирования — детали после подтверждения.",
      en: "Booking flow — details after human confirmation.",
    },
  },
  {
    id: "custom-link",
    label: { ro: "Link personalizat", ru: "Своя ссылка", en: "Custom link" },
    note: {
      ro: "URL validat de client; QR generat din cod.",
      ru: "URL проверяется клиентом; QR генерируется кодом.",
      en: "Customer-validated URL; QR generated in code.",
    },
  },
] as const;

export const CASES = [
  {
    slug: "cucurigo",
    name: "Cucurigo",
    summary: {
      ro: "Standuri standard pentru recenzii, adaptate la scara locației, dimensiuni și plasare.",
      ru: "Стандартные стенды для отзывов, адаптированные под масштаб заведения, размеры и размещение.",
      en: "Standard review stands adapted to venue scale, dimensions and placement.",
    },
    verified: true as const,
  },
  {
    slug: "delice-dange",
    name: "Délice d’Ange",
    summary: {
      ro: "Stand personalizat și experiență Smart Menu. Capabilitățile live (categorii, comenzi, rezervări etc.) se verifică înainte de prezentare publică detaliată.",
      ru: "Кастомный стенд и Smart Menu. Живые возможности (категории, заказы, брони и т.д.) проверяются до детальной публичной презентации.",
      en: "Bespoke branded stand and Smart Menu experience. Live capabilities (categories, orders, booking, etc.) must be verified before detailed public claims.",
    },
    verified: "partial" as const,
  },
  {
    slug: "padel-point",
    name: "Padel Point",
    summary: {
      ro: "Stand proiectat custom. Destinațiile exacte după tap se confirmă înainte de publicare detaliată.",
      ru: "Кастомный стенд. Точные назначения после тапа подтверждаются до детальной публикации.",
      en: "Custom-designed stand. Exact post-tap destinations to be verified before detailed public claims.",
    },
    verified: "partial" as const,
  },
] as const;

export const PRODUCTION_LIMITS = [
  "AI mock-ups are concept previews, not manufacturing drawings.",
  "Standard review-stand quantity tiers apply only to the standard product.",
  "Custom shapes, materials, finishes and sizes are individually quoted.",
  "Do not invent delivery times, VAT, warranty, setup fees or conversion lifts.",
  "Google review destinations must stay neutral — no incentives or selective routing.",
];

export function knowledgeBrief(locale: "ro" | "ru" | "en") {
  return {
    standardProductId: STANDARD_REVIEW_STAND_ID,
    colors: VISUAL_COLOR_OPTIONS.map((c) => ({
      id: c.id,
      label: c.label[locale],
      productionStatus: "needs-human-review" as const,
    })),
    digitalExperiences: DIGITAL_EXPERIENCES.map((d) => ({
      id: d.id,
      label: d.label[locale],
      note: d.note[locale],
    })),
    cases: CASES.map((c) => ({
      slug: c.slug,
      name: c.name,
      summary: c.summary[locale],
      verified: c.verified,
    })),
    productionLimits: PRODUCTION_LIMITS,
    pricingRule: "standard-review-stand-tiers-v1",
  };
}
