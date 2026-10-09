import { NextResponse } from "next/server";
import { catalog } from "@/lib/catalog";
import {
  ConceptContractSchema,
  ConsultRequestSchema,
} from "@/lib/concept-schema";
import { persistSessionQuota, saveConcept } from "@/lib/concept-store";
import {
  buildMockConcept,
  consultSystemContext,
  llmConfigured,
} from "@/lib/consult";
import { priceStandardReviewStand } from "@/lib/pricing";
import {
  chatRequestsPerMinute,
  checkBurstLimit,
  maxChatTurns,
} from "@/lib/rate-limit";
import { readSession, writeSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  const burst = checkBurstLimit(
    `consult:${ip}`,
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

  const parsed = ConsultRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const session = await readSession();
  if (session.chatTurns >= maxChatTurns()) {
    return NextResponse.json(
      {
        error: "Session chat turn limit reached",
        code: "CHAT_TURNS",
        max: maxChatTurns(),
      },
      { status: 429 },
    );
  }

  const useLlm = llmConfigured();
  let concept = buildMockConcept(parsed.data);
  let mode: "mock" | "llm" = "mock";

  if (useLlm) {
    try {
      const { generateText } = await import("ai");
      const { createOpenAI } = await import("@ai-sdk/openai");
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL || undefined,
      });
      const model =
        process.env.AI_TEXT_MODEL ||
        process.env.OPENAI_MODEL ||
        "gpt-4o-mini";
      const ctx = consultSystemContext(parsed.data.locale);
      const samplePrice = priceStandardReviewStand(parsed.data.quantity ?? 2);

      const { text } = await generateText({
        model: openai(model),
        prompt: [
          "You are the Touchform.md product consultant (Moldova/Romania).",
          "Return ONLY JSON matching ConceptContract schema_version 1.0.",
          `Knowledge: ${JSON.stringify(ctx)}`,
          `Catalog slugs: ${catalog.map((p) => p.slug).join(", ")}`,
          `Sample standard pricing for qty ${samplePrice.quantity}: unit ${samplePrice.unitPriceMdl} total ${samplePrice.totalPriceMdl} source ${samplePrice.priceSource}`,
          "Offer 2–3 alternative_ideas. Never invent firm custom prices or dimensions.",
          `locale=${parsed.data.locale}`,
          `business=${parsed.data.business}`,
          `goal=${parsed.data.goal}`,
          `context=${parsed.data.context || ""}`,
          `quantity=${parsed.data.quantity ?? ""}`,
        ].join("\n"),
      });

      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const candidate = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
        const validated = ConceptContractSchema.safeParse(candidate);
        if (validated.success) {
          if (
            validated.data.recommendation.physical_product_type ===
              "standard-review-stand" &&
            validated.data.commercial.price_type === "fixed-tier"
          ) {
            const qty = validated.data.design.quantity ?? 2;
            const priced = priceStandardReviewStand(qty);
            concept = {
              ...validated.data,
              commercial: {
                price_type: "fixed-tier",
                unit_price_mdl: priced.unitPriceMdl,
                total_price_mdl: priced.totalPriceMdl,
                price_source: priced.priceSource,
              },
            };
          } else {
            concept = {
              ...validated.data,
              commercial:
                validated.data.commercial.price_type === "fixed-tier"
                  ? {
                      price_type: "custom-quote",
                      unit_price_mdl: null,
                      total_price_mdl: null,
                      price_source: null,
                    }
                  : validated.data.commercial,
            };
          }
          mode = "llm";
        }
      }
    } catch {
      mode = "mock";
    }
  }

  const validated = ConceptContractSchema.parse(concept);
  session.chatTurns += 1;
  await writeSession(session);
  await persistSessionQuota({
    sessionId: session.sid,
    generations: session.generations,
    chatTurns: session.chatTurns,
  });
  await saveConcept({
    sessionId: session.sid,
    concept: validated,
    status: "draft",
  });

  return NextResponse.json({
    concept: validated,
    mode,
    llmConfigured: useLlm,
    chatTurns: session.chatTurns,
    chatTurnsMax: maxChatTurns(),
    stored: true,
  });
}
