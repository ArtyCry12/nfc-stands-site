import { NextResponse } from "next/server";
import { ConceptContractSchema } from "@/lib/concept-schema";
import { buildProductSvg, imageConfigured } from "@/lib/generate-visual";
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

    return NextResponse.json({
      ok: true,
      imageDataUrl: visual.dataUrl,
      mode: configured ? "svg_stub_pending_provider" : visual.mode,
      imageConfigured: configured,
      generations: current.generations,
      remaining: Math.max(0, max - current.generations),
      max,
      concept: updatedConcept,
      note: "Concept preview — final materials, dimensions, quote and production design confirmed by our team.",
    });
  });
}
