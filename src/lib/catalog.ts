export type ProductOption = {
  id: string;
  label: Record<"ro" | "ru" | "en", string>;
  priceDelta: number;
};

export type CatalogProduct = {
  slug: string;
  name: Record<"ro" | "ru" | "en", string>;
  summary: Record<"ro" | "ru" | "en", string>;
  basePriceFrom: number | null;
  currency: "MDL";
  materials: ProductOption[];
  colors: ProductOption[];
  finishes: ProductOption[];
  branding: ProductOption[];
  scenarios: ProductOption[];
  dimensions: string;
  category: "stand" | "plaque" | "sticker" | "kit";
};

export const catalog: CatalogProduct[] = [
  {
    slug: "review-stand-classic",
    name: {
      ro: "Stand recenzii Classic",
      ru: "Стенд отзывов Classic",
      en: "Classic review stand",
    },
    summary: {
      ro: "Stand de masă pentru Google / Maps. Formă stabilă, branding pe față.",
      ru: "Настольный стенд для Google / Maps. Устойчивая форма, брендинг на лице.",
      en: "Table stand for Google / Maps. Stable form, front branding.",
    },
    basePriceFrom: 390,
    currency: "MDL",
    dimensions: "≈ 90 × 120 × 40 mm",
    category: "stand",
    materials: [
      {
        id: "acrylic",
        label: { ro: "Acril", ru: "Акрил", en: "Acrylic" },
        priceDelta: 0,
      },
      {
        id: "composite",
        label: { ro: "Compozit", ru: "Композит", en: "Composite" },
        priceDelta: 80,
      },
    ],
    colors: [
      {
        id: "ink",
        label: { ro: "Ink negru", ru: "Ink чёрный", en: "Ink black" },
        priceDelta: 0,
      },
      {
        id: "coral",
        label: { ro: "Coral", ru: "Коралл", en: "Coral" },
        priceDelta: 40,
      },
      {
        id: "white",
        label: { ro: "Alb mat", ru: "Белый мат", en: "Matte white" },
        priceDelta: 0,
      },
    ],
    finishes: [
      {
        id: "matte",
        label: { ro: "Mat", ru: "Мат", en: "Matte" },
        priceDelta: 0,
      },
      {
        id: "soft-touch",
        label: { ro: "Soft-touch", ru: "Soft-touch", en: "Soft-touch" },
        priceDelta: 60,
      },
    ],
    branding: [
      {
        id: "laser",
        label: { ro: "Gravură laser", ru: "Лазерная гравировка", en: "Laser engraving" },
        priceDelta: 50,
      },
      {
        id: "print",
        label: { ro: "Print UV", ru: "УФ-печать", en: "UV print" },
        priceDelta: 90,
      },
    ],
    scenarios: [
      {
        id: "reviews",
        label: {
          ro: "Recenzii Google",
          ru: "Отзывы Google",
          en: "Google reviews",
        },
        priceDelta: 0,
      },
      {
        id: "page",
        label: {
          ro: "Pagină interactivă",
          ru: "Интерактивная страница",
          en: "Interactive page",
        },
        priceDelta: 120,
      },
    ],
  },
  {
    slug: "review-stand-wood",
    name: {
      ro: "Stand recenzii Wood",
      ru: "Стенд отзывов Wood",
      en: "Wood review stand",
    },
    summary: {
      ro: "Lemn natural + insert NFC. Pentru spații premium HoReCa.",
      ru: "Натуральное дерево + NFC-вставка. Для премиум HoReCa.",
      en: "Natural wood + NFC insert. For premium hospitality spaces.",
    },
    basePriceFrom: 690,
    currency: "MDL",
    dimensions: "≈ 100 × 130 × 45 mm",
    category: "stand",
    materials: [
      {
        id: "ash",
        label: { ro: "Frasin", ru: "Ясень", en: "Ash" },
        priceDelta: 0,
      },
      {
        id: "oak",
        label: { ro: "Stejar", ru: "Дуб", en: "Oak" },
        priceDelta: 120,
      },
    ],
    colors: [
      {
        id: "natural",
        label: { ro: "Natural", ru: "Натуральный", en: "Natural" },
        priceDelta: 0,
      },
      {
        id: "walnut-stain",
        label: { ro: "Nuc", ru: "Орех", en: "Walnut stain" },
        priceDelta: 40,
      },
    ],
    finishes: [
      {
        id: "oil",
        label: { ro: "Ulei", ru: "Масло", en: "Oil" },
        priceDelta: 0,
      },
      {
        id: "matte-lacquer",
        label: { ro: "Lac mat", ru: "Матовый лак", en: "Matte lacquer" },
        priceDelta: 70,
      },
    ],
    branding: [
      {
        id: "laser",
        label: { ro: "Gravură laser", ru: "Лазерная гравировка", en: "Laser engraving" },
        priceDelta: 70,
      },
      {
        id: "inlay",
        label: { ro: "Inlay metal", ru: "Металл inlay", en: "Metal inlay" },
        priceDelta: 180,
      },
    ],
    scenarios: [
      {
        id: "reviews",
        label: {
          ro: "Recenzii Google",
          ru: "Отзывы Google",
          en: "Google reviews",
        },
        priceDelta: 0,
      },
      {
        id: "menu",
        label: { ro: "Smart Menu", ru: "Smart Menu", en: "Smart Menu" },
        priceDelta: 150,
      },
    ],
  },
  {
    slug: "nfc-plaque",
    name: {
      ro: "Placă NFC",
      ru: "NFC-таблица",
      en: "NFC plaque",
    },
    summary: {
      ro: "Placă de perete / recepție. Text și logo personalizate.",
      ru: "Настенная / ресепшн табличка. Текст и логотип.",
      en: "Wall / reception plaque. Custom text and logo.",
    },
    basePriceFrom: 520,
    currency: "MDL",
    dimensions: "≈ 150 × 100 × 6 mm",
    category: "plaque",
    materials: [
      {
        id: "acrylic",
        label: { ro: "Acril", ru: "Акрил", en: "Acrylic" },
        priceDelta: 0,
      },
      {
        id: "alu-dibond",
        label: { ro: "Alu-dibond", ru: "Alu-dibond", en: "Alu-dibond" },
        priceDelta: 110,
      },
    ],
    colors: [
      {
        id: "ink",
        label: { ro: "Ink", ru: "Ink", en: "Ink" },
        priceDelta: 0,
      },
      {
        id: "brass",
        label: { ro: "Brass tone", ru: "Латунь", en: "Brass tone" },
        priceDelta: 90,
      },
    ],
    finishes: [
      {
        id: "matte",
        label: { ro: "Mat", ru: "Мат", en: "Matte" },
        priceDelta: 0,
      },
    ],
    branding: [
      {
        id: "print",
        label: { ro: "Print UV", ru: "УФ-печать", en: "UV print" },
        priceDelta: 80,
      },
    ],
    scenarios: [
      {
        id: "page",
        label: {
          ro: "Pagină interactivă",
          ru: "Интерактивная страница",
          en: "Interactive page",
        },
        priceDelta: 0,
      },
      {
        id: "wifi",
        label: { ro: "Wi‑Fi / check-in", ru: "Wi‑Fi / check-in", en: "Wi‑Fi / check-in" },
        priceDelta: 40,
      },
    ],
  },
  {
    slug: "nfc-sticker-pack",
    name: {
      ro: "Pachet stickere NFC",
      ru: "Набор NFC-стикеров",
      en: "NFC sticker pack",
    },
    summary: {
      ro: "Stickere discrete pentru ambalaj, meniuri sau vitrine. Tiraj de la 10.",
      ru: "Дискретные стикеры для упаковки, меню или витрин. Тираж от 10.",
      en: "Discrete stickers for packaging, menus, or windows. From 10 pcs.",
    },
    basePriceFrom: 180,
    currency: "MDL",
    dimensions: "Ø 25–40 mm",
    category: "sticker",
    materials: [
      {
        id: "pet",
        label: { ro: "PET", ru: "PET", en: "PET" },
        priceDelta: 0,
      },
      {
        id: "epoxy-dome",
        label: { ro: "Epoxy dome", ru: "Epoxy dome", en: "Epoxy dome" },
        priceDelta: 70,
      },
    ],
    colors: [
      {
        id: "clear",
        label: { ro: "Transparent", ru: "Прозрачный", en: "Clear" },
        priceDelta: 0,
      },
      {
        id: "brand",
        label: { ro: "Culori brand", ru: "Цвета бренда", en: "Brand colors" },
        priceDelta: 50,
      },
    ],
    finishes: [
      {
        id: "matte",
        label: { ro: "Mat", ru: "Мат", en: "Matte" },
        priceDelta: 0,
      },
      {
        id: "gloss",
        label: { ro: "Lucios", ru: "Глянец", en: "Gloss" },
        priceDelta: 20,
      },
    ],
    branding: [
      {
        id: "print",
        label: { ro: "Print", ru: "Печать", en: "Print" },
        priceDelta: 0,
      },
    ],
    scenarios: [
      {
        id: "reviews",
        label: {
          ro: "Recenzii",
          ru: "Отзывы",
          en: "Reviews",
        },
        priceDelta: 0,
      },
      {
        id: "page",
        label: {
          ro: "Pagină / lead",
          ru: "Страница / лид",
          en: "Page / lead",
        },
        priceDelta: 60,
      },
    ],
  },
  {
    slug: "smart-menu-kit",
    name: {
      ro: "Kit Smart Menu",
      ru: "Комплект Smart Menu",
      en: "Smart Menu kit",
    },
    summary: {
      ro: "Stand + pagină meniu actualizabilă. Ideal HoReCa.",
      ru: "Стенд + обновляемая страница меню. Для HoReCa.",
      en: "Stand + updatable menu page. Built for hospitality.",
    },
    basePriceFrom: 980,
    currency: "MDL",
    dimensions: "stand + digital setup",
    category: "kit",
    materials: [
      {
        id: "acrylic",
        label: { ro: "Acril", ru: "Акрил", en: "Acrylic" },
        priceDelta: 0,
      },
      {
        id: "wood",
        label: { ro: "Lemn", ru: "Дерево", en: "Wood" },
        priceDelta: 200,
      },
    ],
    colors: [
      {
        id: "ink",
        label: { ro: "Ink", ru: "Ink", en: "Ink" },
        priceDelta: 0,
      },
      {
        id: "coral",
        label: { ro: "Coral", ru: "Коралл", en: "Coral" },
        priceDelta: 40,
      },
    ],
    finishes: [
      {
        id: "matte",
        label: { ro: "Mat", ru: "Мат", en: "Matte" },
        priceDelta: 0,
      },
    ],
    branding: [
      {
        id: "print",
        label: { ro: "Print UV", ru: "УФ-печать", en: "UV print" },
        priceDelta: 100,
      },
    ],
    scenarios: [
      {
        id: "menu",
        label: { ro: "Smart Menu", ru: "Smart Menu", en: "Smart Menu" },
        priceDelta: 0,
      },
    ],
  },
];

export function getProduct(slug: string) {
  return catalog.find((p) => p.slug === slug);
}

export function estimatePrice(
  product: CatalogProduct,
  selected: {
    material: string;
    color: string;
    finish: string;
    branding: string;
    scenario: string;
  },
) {
  if (product.basePriceFrom == null) return null;
  const pick = (list: ProductOption[], id: string) =>
    list.find((o) => o.id === id)?.priceDelta ?? 0;
  return (
    product.basePriceFrom +
    pick(product.materials, selected.material) +
    pick(product.colors, selected.color) +
    pick(product.finishes, selected.finish) +
    pick(product.branding, selected.branding) +
    pick(product.scenarios, selected.scenario)
  );
}
