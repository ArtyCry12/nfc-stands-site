import type { ConceptContract } from "@/lib/concept-schema";

export type TelegramHandoffInput = {
  text: string;
  imageDataUrl?: string | null;
  idempotencyKey?: string;
};

export type TelegramHandoffResult =
  | { ok: true; mode: "bot"; messageId: number }
  | {
      ok: false;
      mode: "fallback";
      reason: string;
      publicUrl: string;
      summary: string;
    };

const sentKeys = new Map<string, number>();

function publicTelegramUrl() {
  return (
    process.env.TELEGRAM_CUSTOMER_CHAT_LINK ||
    process.env.NEXT_PUBLIC_TELEGRAM_URL ||
    "https://t.me/touchform_md"
  );
}

export function telegramConfigured() {
  return Boolean(
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_MANAGER_CHAT_ID,
  );
}

async function sendTelegram(method: string, body: FormData | URLSearchParams) {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    body,
  });
  const data = (await res.json()) as {
    ok: boolean;
    result?: { message_id?: number };
    description?: string;
  };
  if (!data.ok) {
    throw new Error(data.description || "Telegram API error");
  }
  return data;
}

export async function handoffToTelegram(
  input: TelegramHandoffInput,
): Promise<TelegramHandoffResult> {
  const summary = input.text.slice(0, 3500);

  if (input.idempotencyKey && sentKeys.has(input.idempotencyKey)) {
    return {
      ok: true,
      mode: "bot",
      messageId: sentKeys.get(input.idempotencyKey)!,
    };
  }

  if (!telegramConfigured()) {
    return {
      ok: false,
      mode: "fallback",
      reason: "TELEGRAM_BOT_TOKEN or TELEGRAM_MANAGER_CHAT_ID missing",
      publicUrl: publicTelegramUrl(),
      summary,
    };
  }

  const chatId = process.env.TELEGRAM_MANAGER_CHAT_ID!;

  try {
    if (input.imageDataUrl?.startsWith("data:")) {
      const match = /^data:(.+?);base64,(.+)$/.exec(input.imageDataUrl);
      if (match) {
        const [, mime, b64] = match;
        const bytes = Buffer.from(b64, "base64");
        const form = new FormData();
        form.set("chat_id", chatId);
        form.set("caption", summary.slice(0, 1024));
        form.set(
          "photo",
          new Blob([bytes], { type: mime }),
          mime.includes("svg") ? "concept.svg" : "concept.png",
        );
        const data = await sendTelegram("sendPhoto", form);
        const messageId = data.result?.message_id ?? 0;
        if (input.idempotencyKey) sentKeys.set(input.idempotencyKey, messageId);
        return { ok: true, mode: "bot", messageId };
      }
    }

    const params = new URLSearchParams({
      chat_id: chatId,
      text: summary,
    });
    const data = await sendTelegram("sendMessage", params);
    const messageId = data.result?.message_id ?? 0;
    if (input.idempotencyKey) sentKeys.set(input.idempotencyKey, messageId);
    return { ok: true, mode: "bot", messageId };
  } catch (error) {
    return {
      ok: false,
      mode: "fallback",
      reason: error instanceof Error ? error.message : "Telegram send failed",
      publicUrl: publicTelegramUrl(),
      summary,
    };
  }
}

export function formatManagerCaption(concept: ConceptContract, previewUrl?: string) {
  const c = concept;
  const priceLine =
    c.commercial.price_type === "fixed-tier" &&
    c.commercial.unit_price_mdl != null
      ? `qty ${c.design.quantity ?? "?"} · ${c.commercial.unit_price_mdl} MDL/u · total ${c.commercial.total_price_mdl} MDL (${c.commercial.price_source})`
      : c.commercial.price_type === "custom-quote"
        ? "custom quote — human confirmation"
        : "pricing not yet known";

  return [
    `New Touchform.md concept inquiry · ID: ${c.lead_id}`,
    `Business: ${c.business.industry || c.business.business_description || "—"}`,
    `Goal: ${c.business.desired_outcome}`,
    `Recommendation: ${c.recommendation.concept_name}`,
    `Physical product/design: ${c.recommendation.physical_product_type} · ${c.design.primary_color} · ${c.design.material}`,
    `Digital experience: ${c.recommendation.digital_experience_type} → ${c.recommendation.customer_action_after_tap}`,
    `Personalized offer: ${c.recommendation.offer_summary}`,
    `Quantity / pricing: ${priceLine}`,
    `Needs human confirmation: ${c.production.open_questions.join("; ") || "—"}`,
    `Language: ${c.language}`,
    previewUrl ? `Preview: ${previewUrl}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatConceptSummary(payload: {
  name?: string;
  phone?: string;
  message?: string;
  concept?: ConceptContract | unknown;
  configSummary?: string;
}) {
  if (payload.concept && typeof payload.concept === "object") {
    const maybe = payload.concept as ConceptContract;
    if (maybe.schema_version === "1.0" && maybe.lead_id) {
      const base = formatManagerCaption(maybe);
      const contact = [
        payload.name ? `Contact name: ${payload.name}` : null,
        payload.phone ? `Phone: ${payload.phone}` : null,
        payload.message ? `Message: ${payload.message}` : null,
      ]
        .filter(Boolean)
        .join("\n");
      return contact ? `${base}\n${contact}` : base;
    }
  }

  const lines = [
    "Touchform.md lead",
    payload.name ? `Name: ${payload.name}` : null,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.message ? `Message: ${payload.message}` : null,
    payload.configSummary ? `Config:\n${payload.configSummary}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

/** Prefill-only share URL for standard catalog orders (no image attachment). */
export function buildTelegramShareUrl(text: string) {
  const base = "https://t.me/share/url";
  const url = new URL(base);
  url.searchParams.set("url", process.env.NEXT_PUBLIC_SITE_URL || "https://touchform.md");
  url.searchParams.set("text", text.slice(0, 1500));
  return url.toString();
}
