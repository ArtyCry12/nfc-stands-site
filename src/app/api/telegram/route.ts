import { NextResponse } from "next/server";
import { z } from "zod";
import { updateConceptStatus } from "@/lib/concept-store";
import {
  formatConceptSummary,
  handoffToTelegram,
  telegramConfigured,
} from "@/lib/telegram";

export const runtime = "nodejs";

const BodySchema = z.object({
  name: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
  message: z.string().max(2000).optional(),
  configSummary: z.string().max(2000).optional(),
  concept: z.unknown().optional(),
  imageDataUrl: z.string().max(2_500_000).optional(),
  idempotencyKey: z.string().max(120).optional(),
});

export async function GET() {
  return NextResponse.json({
    configured: telegramConfigured(),
    publicUrl: process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/touchform_md",
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const text = formatConceptSummary({
    name: parsed.data.name,
    phone: parsed.data.phone,
    message: parsed.data.message,
    configSummary: parsed.data.configSummary,
    concept: parsed.data.concept,
  });

  const leadId =
    parsed.data.concept &&
    typeof parsed.data.concept === "object" &&
    "lead_id" in (parsed.data.concept as object)
      ? String((parsed.data.concept as { lead_id?: string }).lead_id || "")
      : "";

  if (leadId) {
    await updateConceptStatus(leadId, "sending", {
      previewDataUrl: parsed.data.imageDataUrl || undefined,
    });
  }

  const result = await handoffToTelegram({
    text,
    imageDataUrl: parsed.data.imageDataUrl,
    idempotencyKey:
      parsed.data.idempotencyKey || (leadId ? `lead:${leadId}` : undefined),
  });

  if (result.ok) {
    if (leadId) {
      await updateConceptStatus(leadId, "sent", {
        telegramMessageId: result.messageId,
      });
    }
    return NextResponse.json({
      ok: true,
      mode: result.mode,
      messageId: result.messageId,
    });
  }

  if (leadId) {
    await updateConceptStatus(leadId, "failed");
  }

  return NextResponse.json(
    {
      ok: false,
      mode: result.mode,
      reason: result.reason,
      publicUrl: result.publicUrl,
      summary: result.summary,
    },
    { status: 503 },
  );
}
