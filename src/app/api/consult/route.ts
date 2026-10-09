import { NextResponse } from "next/server";
import { buildMockConcept, llmConfigured } from "@/lib/consult";
import {
  ConceptContractSchema,
  ConsultRequestSchema,
} from "@/lib/concept-schema";
import { catalog } from "@/lib/catalog";

export const runtime = "nodejs";

export async function POST(request: Request) {
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

  const useLlm = llmConfigured();
  let concept = buildMockConcept(parsed.data);
  let mode: "mock" | "llm" = "mock";

  if (useLlm) {
    try {
      const { generateText } = await import("ai");
      const { createOpenAI } = await import("@ai-sdk/openai");
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL || undefined,
      });
      const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
      const catalogBrief = catalog.map((p) => ({
        slug: p.slug,
        name: p.name[parsed.data.locale],
        basePriceFrom: p.basePriceFrom,
        category: p.category,
        scenarios: p.scenarios.map((s) => s.id),
        dimensions: p.dimensions,
      }));

      const { text } = await generateText({
        model: openai(model),
        prompt: [
          "You are the Touchform.md product consultant for Moldova/Romania.",
          "Return ONLY a JSON object for ConceptContract v1.",
          "Required keys: version(=\"1\"), conceptId(uuid), locale, business{type,audience?,locationHint?}, problem, concept{title,summary,whyItFits[]}, physicalProduct{catalogSlug,type,dimensions,material,color,shape,finish}, branding{brandColors[],logoRequired,text,qrOptional}, placement, digitalScenario{id,label,targetAction}, offer{task,solution,composition[],expectedOutcome,nextSteps[]}, constraints[], unknowns[], approvalStatus(draft|ready_for_manager|needs_confirmation), resultUrl, priceHint?{currency:\"MDL\",from,note}.",
          `Use only catalog slugs from: ${JSON.stringify(catalogBrief)}`,
          "Do not invent SKUs or firm prices; put unknowns in unknowns[].",
          `locale=${parsed.data.locale}`,
          `business=${parsed.data.business}`,
          `goal=${parsed.data.goal}`,
          `context=${parsed.data.context || ""}`,
        ].join("\n"),
      });

      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const candidate = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
        const validated = ConceptContractSchema.safeParse(candidate);
        if (validated.success) {
          concept = validated.data;
          mode = "llm";
        }
      }
    } catch {
      mode = "mock";
    }
  }

  const validated = ConceptContractSchema.parse(concept);
  return NextResponse.json({
    concept: validated,
    mode,
    llmConfigured: useLlm,
  });
}
