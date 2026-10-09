import { z } from "zod";

/** Founder pack schema (03_AI_CONCEPT_STUDIO) — single source for offer / image / Telegram. */
export const ConceptContractSchema = z.object({
  schema_version: z.literal("1.0"),
  language: z.enum(["ro", "ru", "en"]),
  lead_id: z.string().min(8),
  business: z.object({
    industry: z.string().nullable(),
    business_description: z.string().nullable(),
    audience: z.string().nullable(),
    location_context: z.string().nullable(),
    pain_point: z.string().min(1),
    desired_outcome: z.string().min(1),
    constraints: z.array(z.string()).default([]),
  }),
  recommendation: z.object({
    concept_name: z.string().min(1),
    why_it_fits: z.string().min(1),
    physical_product_type: z.string().min(1),
    customer_action_after_tap: z.string().min(1),
    digital_experience_type: z.string().min(1),
    offer_title: z.string().min(1),
    offer_summary: z.string().min(1),
    offer_includes: z.array(z.string()).default([]),
    assumptions: z.array(z.string()).default([]),
    human_review_required: z.boolean(),
    /** Proactive alternatives (2–3 when context allows). */
    alternative_ideas: z
      .array(
        z.object({
          title: z.string(),
          why: z.string(),
        }),
      )
      .default([]),
  }),
  design: z.object({
    geometry: z.string(),
    view: z.literal("front-three-quarter").default("front-three-quarter"),
    primary_color: z.string(),
    secondary_color: z.string().nullable(),
    material: z.string(),
    finish: z.string().nullable(),
    text: z.string().nullable(),
    logo_asset_id: z.string().nullable(),
    qr_enabled: z.boolean(),
    qr_destination_url: z.union([z.string().url(), z.null()]),
    quantity: z.number().int().positive().nullable(),
    reference_image_ids: z.array(z.string()).default([]),
    image_prompt_constraints: z.array(z.string()).default([]),
  }),
  commercial: z.object({
    price_type: z.enum(["fixed-tier", "custom-quote", "not-yet-known"]),
    unit_price_mdl: z.number().nullable(),
    total_price_mdl: z.number().nullable(),
    price_source: z.string().nullable(),
  }),
  production: z.object({
    feasibility: z.enum(["known-option", "needs-human-review", "unknown"]),
    known_catalog_facts: z.array(z.string()).default([]),
    open_questions: z.array(z.string()).default([]),
  }),
  generation: z.object({
    attempt_number: z.number().int().min(0).max(2),
    max_attempts: z.literal(2),
    status: z.enum(["queued", "running", "succeeded", "failed", "idle"]),
    provider_model: z.string().nullable(),
    preview_asset_id: z.string().nullable(),
  }),
});

export type ConceptContract = z.infer<typeof ConceptContractSchema>;

export const ConsultRequestSchema = z.object({
  locale: z.enum(["ro", "ru", "en"]),
  business: z.string().min(2).max(200),
  goal: z.string().min(2).max(500),
  context: z.string().max(300).optional(),
  quantity: z.number().int().positive().max(10_000).optional(),
  destinationUrl: z.string().url().optional(),
});

export type ConsultRequest = z.infer<typeof ConsultRequestSchema>;
