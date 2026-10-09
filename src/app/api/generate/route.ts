import { NextResponse } from "next/server";
import { ConceptContractSchema } from "@/lib/concept-schema";
import {
  getDailyImageCount,
  persistSessionQuota,
  saveConcept,
} from "@/lib/concept-store";
import { buildProductSvg, imageConfigured } from "@/lib/generate-visual";
import {
  checkBurstLimit,
  dailyImageLimit,
} from "@/lib/rate-limit";
import {
  readSession,
  withSessionLock,
  writeSession,
} from "@/lib/session";

export const runtime = "nodejs";

function maxImages() {
  const n = Number(process.env.AI_MAX_IMAGES_PER_SESSION || 2);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 2;
}

export async function GET() {
  const session = await readSession();
  await writeSession(session);
  const max = maxImages();
  return NextResponse.json({
    generations: session.generations,
    remaining: Math.max(0, max - session.generations),
    max,
    dailyImages: await getDailyImageCount(),
    dailyLimit: dailyImageLimit(),
  });
}

export async function POST(request: Request) {
  if (process.env.AI_GENERATION_KILL_SWITCH === "true") {
    return NextResponse.json(
      {
        error: "Image generation temporarily disabled",
        code: "KILL_SWITCH",
        handoff: true,
      },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const burst = checkBurstLimit(`gen:${ip}`, 6, 60_000);
  if (!burst.ok) {
    return NextResponse.json(
      { error: "IP burst limit", code: "BURST", retryAfterMs: burst.retryAfterMs },
      { status: 429 },
    );
  }

  const daily = await getDailyImageCount();
  if (daily >= dailyImageLimit()) {
    return NextResponse.json(
      {
        error: "Daily image hard cap reached",
        code: "DAILY_CAP",
        handoff: true,
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const conceptParsed = ConceptContractSchema.safeParse(
    (body as { concept?: unknown })?.concept ?? body,
  );
  if (!conceptParsed.success) {
    return NextResponse.json(
      {
        error: "Invalid concept contract",
        details: conceptParsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const max = maxImages();
  const session = await readSession();

  return withSessionLock(session.sid, async () => {
    const current = await readSession();
    if (current.generations >= max) {
      return NextResponse.json(
        {
          error: "Generation limit reached",
          code: "LIMIT",
          generations: current.generations,
          remaining: 0,
          max,
          handoff: true,
        },
        { status: 429 },
      );
    }

    const configured = imageConfigured();
    const visual = buildProductSvg(conceptParsed.data);

    current.generations += 1;
    await writeSession(current);
    await persistSessionQuota({
      sessionId: current.sid,
      generations: current.generations,
      chatTurns: current.chatTurns,
      incrementDailyImage: true,
    });

    const updatedConcept = {
      ...conceptParsed.data,
      generation: {
        ...conceptParsed.data.generation,
        attempt_number: current.generations,
        max_attempts: 2 as const,
        status: "succeeded" as const,
        provider_model: configured ? "pending-provider" : "svg_stub",
        preview_asset_id: `svg:${conceptParsed.data.lead_id}:${current.generations}`,
      },
    };

    await saveConcept({
      sessionId: current.sid,
      concept: updatedConcept,
      previewDataUrl: visual.dataUrl,
      status: "draft",
    });

    return NextResponse.json({
      ok: true,
      imageDataUrl: visual.dataUrl,
      mode: configured ? "svg_stub_pending_provider" : visual.mode,
      imageConfigured: configured,
      generations: current.generations,
      remaining: Math.max(0, max - current.generations),
      max,
      concept: updatedConcept,
      stored: true,
      note: "Concept preview — final materials, dimensions, quote and production design confirmed by our team.",
    });
  });
}
