import { z } from "zod";

export const ConceptContractSchema = z.object({
  version: z.literal("1"),
  conceptId: z.string().min(8),
  locale: z.enum(["ro", "ru", "en"]),
  business: z.object({
    type: z.string().min(1),
    audience: z.string().optional(),
    locationHint: z.string().optional(),
  }),
  problem: z.string().min(1),
  concept: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    whyItFits: z.array(z.string()).min(1),
  }),
  physicalProduct: z.object({
    catalogSlug: z.string().nullable(),
    type: z.string(),
    dimensions: z.string().nullable(),
    material: z.string().nullable(),
    color: z.string().nullable(),
    shape: z.string().nullable(),
    finish: z.string().nullable(),
  }),
  branding: z.object({
    brandColors: z.array(z.string()).default([]),
    logoRequired: z.boolean().default(true),
    text: z.string().nullable(),
    qrOptional: z.boolean().default(false),
  }),
  placement: z.string().nullable(),
  digitalScenario: z.object({
    id: z.string(),
    label: z.string(),
    targetAction: z.string(),
  }),
  offer: z.object({
    task: z.string(),
    solution: z.string(),
    composition: z.array(z.string()),
    expectedOutcome: z.string(),
    nextSteps: z.array(z.string()),
  }),
  constraints: z.array(z.string()).default([]),
  unknowns: z.array(z.string()).default([]),
  approvalStatus: z.enum(["draft", "ready_for_manager", "needs_confirmation"]),
  resultUrl: z.string().url().nullable().optional(),
  priceHint: z
    .object({
      currency: z.literal("MDL"),
      from: z.number().nullable(),
      note: z.string(),
    })
    .optional(),
});

export type ConceptContract = z.infer<typeof ConceptContractSchema>;

export const ConsultRequestSchema = z.object({
  locale: z.enum(["ro", "ru", "en"]),
  business: z.string().min(2).max(200),
  goal: z.string().min(2).max(500),
  context: z.string().max(300).optional(),
});

export type ConsultRequest = z.infer<typeof ConsultRequestSchema>;
