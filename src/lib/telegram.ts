export type TelegramHandoffInput = {
  text: string;
  imageDataUrl?: string | null;
};

export type TelegramHandoffResult =
  | { ok: true; mode: "bot"; messageId: number }
  | { ok: false; mode: "fallback"; reason: string; publicUrl: string; summary: string };

function publicTelegramUrl() {
  return process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/touchform_md";
}

export function telegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_MANAGER_CHAT_ID);
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
        return {
          ok: true,
          mode: "bot",
          messageId: data.result?.message_id ?? 0,
        };
      }
    }

    const params = new URLSearchParams({
      chat_id: chatId,
      text: summary,
    });
    const data = await sendTelegram("sendMessage", params);
    return {
      ok: true,
      mode: "bot",
      messageId: data.result?.message_id ?? 0,
    };
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

export function formatConceptSummary(payload: {
  name?: string;
  phone?: string;
  message?: string;
  conceptJson?: unknown;
  configSummary?: string;
}) {
  const lines = [
    "Touchform.md lead",
    payload.name ? `Name: ${payload.name}` : null,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.message ? `Message: ${payload.message}` : null,
    payload.configSummary ? `Config:\n${payload.configSummary}` : null,
    payload.conceptJson
      ? `Concept JSON:\n${JSON.stringify(payload.conceptJson, null, 2).slice(0, 2800)}`
      : null,
  ].filter(Boolean);
  return lines.join("\n");
}
