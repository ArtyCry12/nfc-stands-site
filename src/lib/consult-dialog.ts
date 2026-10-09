import type { ConsultRequest } from "@/lib/concept-schema";
import { buildMockConcept } from "@/lib/consult";
import { validateDestinationUrl } from "@/lib/qr";

export type DialogTurn = {
  role: "user" | "assistant";
  content: string;
};

export type DialogResult = {
  reply: string;
  followUpQuestion: string | null;
  readyForOffer: boolean;
  concept: ReturnType<typeof buildMockConcept> | null;
  ideas: { title: string; why: string }[];
};

/**
 * Lightweight multi-turn discovery loop (mock, deterministic).
 * Asks at most one high-value clarifier before producing an offer.
 */
export function runConsultantTurn(input: {
  locale: ConsultRequest["locale"];
  history: DialogTurn[];
  message: string;
  quantity?: number;
}): DialogResult {
  const history = [...input.history, { role: "user" as const, content: input.message }];
  const joined = history
    .filter((t) => t.role === "user")
    .map((t) => t.content)
    .join(" \n ");

  const business =
    extractBusiness(joined) ||
    (input.locale === "ru"
      ? "бизнес"
      : input.locale === "ro"
        ? "afacere"
        : "business");
  const goal = extractGoal(joined) || input.message;
  const hasPlacement = /mas[aă]|table|reception|ресеп|recep|vitrin|window|бар|bar/i.test(
    joined,
  );
  const hasQuantity =
    input.quantity != null || /\b\d+\b/.test(joined) || /tiraj|qty|количество|buc/i.test(joined);

  if (!hasPlacement && history.filter((t) => t.role === "user").length < 2) {
    const followUp =
      input.locale === "ru"
        ? "Где обычно стоит гость в момент решения — стол, ресепшн или витрина?"
        : input.locale === "ro"
          ? "Unde e clientul în momentul deciziei — masă, recepție sau vitrină?"
          : "Where is the customer at decision time — table, reception, or window?";
    const ideas = earlyIdeas(input.locale, business, goal);
    return {
      reply:
        input.locale === "ru"
          ? `Понял контекст «${business}» и цель «${goal}». Уже вижу несколько направлений.`
          : input.locale === "ro"
            ? `Am înțeles contextul „${business}” și obiectivul „${goal}”. Văd deja câteva direcții.`
            : `Got “${business}” and the goal “${goal}”. I already see a few directions.`,
      followUpQuestion: followUp,
      readyForOffer: false,
      concept: null,
      ideas,
    };
  }

  const context = hasPlacement
    ? joined.match(/mas[aă]|table|reception|ресеп|recep|vitrin|window|бар|bar/i)?.[0] ||
      "placement"
    : undefined;

  const destinationUrl = extractDestinationUrl(joined) ?? undefined;

  const concept = buildMockConcept({
    locale: input.locale,
    business,
    goal,
    context,
    quantity: input.quantity ?? (hasQuantity ? 2 : undefined),
    destinationUrl,
  });

  return {
    reply: concept.recommendation.offer_summary,
    followUpQuestion: null,
    readyForOffer: true,
    concept,
    ideas: concept.recommendation.alternative_ideas,
  };
}

function extractBusiness(text: string) {
  const m = text.match(
    /(cafenea|cafe|кафе|hotel|клиника|clinic[ăa]|ресторан|restaurant|salon|gym|зал|магазин|shop|retail|padel)/i,
  );
  return m?.[1] || null;
}

function extractGoal(text: string) {
  if (/review|recenz|отзыв/i.test(text)) {
    return text.match(/.{0,40}(review|recenz|отзыв).{0,40}/i)?.[0] || text;
  }
  if (/menu|meniu|меню/i.test(text)) {
    return text.match(/.{0,40}(menu|meniu|меню).{0,40}/i)?.[0] || text;
  }
  return text.slice(0, 160);
}

function extractDestinationUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s<>"')\]]+/i);
  if (!match) return null;
  const candidate = match[0].replace(/[.,;:!?]+$/, "");
  const check = validateDestinationUrl(candidate);
  return check.ok ? check.normalized : null;
}

function earlyIdeas(
  locale: ConsultRequest["locale"],
  business: string,
  goal: string,
) {
  if (locale === "ru") {
    return [
      {
        title: "Стандартный стенд для отзывов",
        why: `Быстрый путь для «${business}»: NFC + QR к отзыву.`,
      },
      {
        title: "Smart Menu / инфо-страница",
        why: `Если цель шире, чем «${goal}», можно открыть меню или контакт.`,
      },
      {
        title: "Кастомная форма",
        why: "Если нужен сильный бренд-объект — индивидуальная смета.",
      },
    ];
  }
  if (locale === "ro") {
    return [
      {
        title: "Stand standard pentru recenzii",
        why: `Calea rapidă pentru „${business}”: NFC + QR către recenzie.`,
      },
      {
        title: "Smart Menu / pagină info",
        why: `Dacă obiectivul e mai larg decât „${goal}”, putem deschide meniul sau contactul.`,
      },
      {
        title: "Formă custom",
        why: "Pentru un obiect de brand puternic — ofertă individuală.",
      },
    ];
  }
  return [
    {
      title: "Standard review stand",
      why: `Fast path for “${business}”: NFC + QR to the review.`,
    },
    {
      title: "Smart Menu / info page",
      why: `If the goal is broader than “${goal}”, open a menu or contact page.`,
    },
    {
      title: "Custom form",
      why: "For a stronger brand object — individually quoted.",
    },
  ];
}
