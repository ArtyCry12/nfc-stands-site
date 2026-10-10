import type { Locale } from "@/i18n/routing";

/** Structured case narratives — facts only; partial verification flagged. */
export type CaseNarrative = {
  slug: string;
  name: string;
  verified: true | "partial";
  videoKey?: "padelPoint";
  photo?: string;
  hook: Record<Locale, string>;
  insight: Record<Locale, string>;
  example: Record<Locale, string>;
  benefit: Record<Locale, string>;
  next: Record<Locale, string>;
};

export const CASE_NARRATIVES: CaseNarrative[] = [
  {
    slug: "cucurigo",
    name: "Cucurigo",
    verified: true,
    photo: "/media/refs/stands-desk.jpg",
    hook: {
      en: "A hospitality venue needed a review path guests would actually use.",
      ro: "Un local hospitality avea nevoie de un drum spre recenzie pe care oaspeții îl folosesc.",
      ru: "Заведению нужен был путь к отзыву, которым гости реально пользуются.",
    },
    insight: {
      en: "Standard review stands work when scale, placement and destination stay simple.",
      ro: "Standurile standard pentru recenzii funcționează când scara, plasarea și destinația rămân simple.",
      ru: "Стандартные стенды для отзывов работают, когда масштаб, размещение и цель просты.",
    },
    example: {
      en: "Cucurigo uses standard review stands adapted to venue scale, dimensions and placement.",
      ro: "Cucurigo folosește standuri standard pentru recenzii, adaptate la scara locației, dimensiuni și plasare.",
      ru: "Cucurigo использует стандартные стенды для отзывов под масштаб, размеры и размещение.",
    },
    benefit: {
      en: "One familiar object, one tap, one clear Google / Maps action — without inventing conversion lifts.",
      ro: "Un obiect familiar, un gest, o acțiune clară Google / Maps — fără lift-uri inventate.",
      ru: "Знакомый объект, один жест, ясное действие Google / Maps — без выдуманных lift’ов.",
    },
    next: {
      en: "Configure a standard stand or ask the AI consultant for your floor plan.",
      ro: "Configurează un stand standard sau întreabă consultantul AI despre planul tău.",
      ru: "Настройте стандартный стенд или спросите AI-консультанта про ваш зал.",
    },
  },
  {
    slug: "delice-dange",
    name: "Délice d’Ange",
    verified: "partial",
    photo: "/media/refs/plaque-hand.jpg",
    hook: {
      en: "Hospitality brands often want a menu path that updates without reprints.",
      ro: "Brandurile hospitality vor adesea un meniu care se actualizează fără retipăriri.",
      ru: "HoReCa часто нужен путь к меню без перепечаток.",
    },
    insight: {
      en: "Custom physical form + Smart Menu digital flow must stay honest about what is live today.",
      ro: "Forma custom + fluxul Smart Menu trebuie să rămână oneste despre ce e live azi.",
      ru: "Кастомная форма + Smart Menu должны честно отражать, что уже live.",
    },
    example: {
      en: "Délice d’Ange uses a bespoke branded stand with a Smart Menu experience. Live capabilities (categories, orders, booking, etc.) are verified per project before detailed public claims.",
      ro: "Délice d’Ange folosește un stand personalizat cu experiență Smart Menu. Capabilitățile live (categorii, comenzi, rezervări etc.) se verifică pe proiect înainte de prezentări detaliate.",
      ru: "Délice d’Ange — кастомный стенд и Smart Menu. Живые возможности (категории, заказы, брони и т.д.) проверяются по проекту до детальных публичных заявлений.",
    },
    benefit: {
      en: "Physical branding and digital menu stay one system — with unknowns marked for the team.",
      ro: "Brandingul fizic și meniul digital rămân un singur sistem — necunoscutele marcate pentru echipă.",
      ru: "Физический брендинг и цифровое меню — одна система, неизвестное отмечено для команды.",
    },
    next: {
      en: "Start the consultant with “Smart Menu” if your goal is broader than reviews.",
      ro: "Pornește consultantul cu „Smart Menu” dacă obiectivul e mai larg decât recenziile.",
      ru: "Запустите консультанта с «Smart Menu», если цель шире отзывов.",
    },
  },
  {
    slug: "padel-point",
    name: "Padel Point",
    verified: "partial",
    videoKey: "padelPoint",
    photo: "/media/posters/padel-point.jpg",
    hook: {
      en: "Sports venues need a branded touchpoint that fits the court — not a generic tag.",
      ro: "Locațiile sportive au nevoie de un touchpoint de brand pe teren — nu un tag generic.",
      ru: "Спортивным площадкам нужен брендированный touchpoint на корте — не generic tag.",
    },
    insight: {
      en: "Custom stands can carry venue identity; exact post-tap destinations stay project-specific.",
      ro: "Standurile custom pot purta identitatea locației; destinațiile exacte după tap rămân pe proiect.",
      ru: "Кастомные стенды несут идентичность площадки; точные цели после тапа — по проекту.",
    },
    example: {
      en: "Padel Point uses a custom-designed stand. Exact post-tap destinations are confirmed before detailed public claims. Real venue footage below.",
      ro: "Padel Point folosește un stand proiectat custom. Destinațiile exacte după tap se confirmă înainte de publicare detaliată. Filmări reale mai jos.",
      ru: "Padel Point — кастомный стенд. Точные назначения после тапа подтверждаются до детальной публикации. Ниже — реальное видео.",
    },
    benefit: {
      en: "Guests meet the brand in the physical space, then continue digitally when the destination is ready.",
      ro: "Oaspeții întâlnesc brandul în spațiul fizic, apoi continuă digital când destinația e pregătită.",
      ru: "Гости встречают бренд в физическом пространстве и продолжают digital, когда цель готова.",
    },
    next: {
      en: "Ask for a custom quote — standard tiers do not apply to bespoke forms.",
      ro: "Cere ofertă individuală — treptele standard nu se aplică formelor custom.",
      ru: "Запросите индивидуальную смету — стандартные ступени не для custom-форм.",
    },
  },
];

export function getCaseNarrative(slug: string) {
  return CASE_NARRATIVES.find((c) => c.slug === slug);
}
