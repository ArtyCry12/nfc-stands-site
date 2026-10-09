import { NextResponse } from "next/server";
import { z } from "zod";
import { saveConcept, persistSessionQuota } from "@/lib/concept-store";
import { runConsultantTurn } from "@/lib/consult-dialog";
import {
  chatRequestsPerMinute,
  checkBurstLimit,
  maxChatTurns,
} from "@/lib/rate-limit";
import { readSession, writeSession } from "@/lib/session";

export const runtime = "nodejs";

const BodySchema = z.object({
  locale: z.enum(["ro", "ru", "en"]),
  message: z.string().min(1).max(1000),
  quantity: z.number().int().positive().max(10_000).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      }),
    )
    .max(40)
    .default([]),
});

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const burst = checkBurstLimit(
    `consult-turn:${ip}`,
    chatRequestsPerMinute(),
    60_000,
  );
  if (!burst.ok) {
    return NextResponse.json(
      { error: "Chat rate limit", code: "BURST", retryAfterMs: burst.retryAfterMs },
      { status: 429 },
    );
  }

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

  const session = await readSession();
  if (session.chatTurns >= maxChatTurns()) {
    return NextResponse.json(
      { error: "Session chat turn limit", code: "CHAT_TURNS" },
      { status: 429 },
    );
  }

  const result = runConsultantTurn({
    locale: parsed.data.locale,
    history: parsed.data.history,
    message: parsed.data.message,
    quantity: parsed.data.quantity,
  });

  session.chatTurns += 1;
  await writeSession(session);
  await persistSessionQuota({
    sessionId: session.sid,
    generations: session.generations,
    chatTurns: session.chatTurns,
  });

  if (result.concept) {
    await saveConcept({
      sessionId: session.sid,
      concept: result.concept,
      status: "draft",
    });
  }

  return NextResponse.json({
    ...result,
    chatTurns: session.chatTurns,
    chatTurnsMax: maxChatTurns(),
  });
}
