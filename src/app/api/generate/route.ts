import { NextResponse } from "next/server";
import { ConceptContractSchema } from "@/lib/concept-schema";
import {
  MAX_GENERATIONS,
  readSession,
  withSessionLock,
  writeSession,
} from "@/lib/session";
import { buildProductSvg, imageConfigured } from "@/lib/generate-visual";

export const runtime = "nodejs";

export async function GET() {
  const session = await readSession();
  await writeSession(session);
  return NextResponse.json({
    generations: session.generations,
    remaining: Math.max(0, MAX_GENERATIONS - session.generations),
    max: MAX_GENERATIONS,
  });
}

export async function POST(request: Request) {
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
      { error: "Invalid concept contract", details: conceptParsed.error.flatten() },
      { status: 400 },
    );
  }

  const session = await readSession();

  return withSessionLock(session.sid, async () => {
    const fresh = await readSession();
    if (fresh.sid !== session.sid) {
      // rare cookie race — prefer cookie sid
    }
    const current = await readSession();
    if (current.generations >= MAX_GENERATIONS) {
      return NextResponse.json(
        {
          error: "Generation limit reached",
          code: "LIMIT",
          generations: current.generations,
          remaining: 0,
          max: MAX_GENERATIONS,
          handoff: true,
        },
        { status: 429 },
      );
    }

    const configured = imageConfigured();
    // Image provider hooks reserved; always ship SVG stub unless key present
    // (no paid calls without founder spend approval).
    const visual = buildProductSvg(conceptParsed.data);

    current.generations += 1;
    await writeSession(current);

    return NextResponse.json({
      ok: true,
      imageDataUrl: visual.dataUrl,
      mode: configured ? "svg_stub_pending_provider" : visual.mode,
      imageConfigured: configured,
      generations: current.generations,
      remaining: Math.max(0, MAX_GENERATIONS - current.generations),
      max: MAX_GENERATIONS,
      conceptId: conceptParsed.data.conceptId,
      note: "Visual concept is not a production guarantee.",
    });
  });
}
