import { promises as fs } from "node:fs";
import path from "node:path";
import type { ConceptContract } from "@/lib/concept-schema";

const ROOT = path.join(process.cwd(), ".data");
const CONCEPTS = path.join(ROOT, "concepts");
const QUOTAS = path.join(ROOT, "quotas.json");

export type StoredConcept = {
  id: string;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  status: "draft" | "ready_to_send" | "sending" | "sent" | "failed";
  concept: ConceptContract;
  previewDataUrl?: string | null;
  telegramMessageId?: number | null;
};

type QuotaFile = {
  dailyImages: Record<string, { date: string; count: number }>;
  sessions: Record<
    string,
    { generations: number; chatTurns: number; updatedAt: string }
  >;
};

function ttlHours() {
  const n = Number(process.env.AI_CONCEPT_TTL_HOURS || 72);
  return Number.isFinite(n) && n > 0 ? n : 72;
}

async function ensureDirs() {
  await fs.mkdir(CONCEPTS, { recursive: true });
}

async function readQuotas(): Promise<QuotaFile> {
  try {
    const raw = await fs.readFile(QUOTAS, "utf8");
    return JSON.parse(raw) as QuotaFile;
  } catch {
    return { dailyImages: {}, sessions: {} };
  }
}

async function writeQuotas(data: QuotaFile) {
  await ensureDirs();
  await fs.writeFile(QUOTAS, JSON.stringify(data, null, 2), "utf8");
}

export async function saveConcept(input: {
  sessionId: string;
  concept: ConceptContract;
  previewDataUrl?: string | null;
  status?: StoredConcept["status"];
}): Promise<StoredConcept> {
  await ensureDirs();
  const id = input.concept.lead_id;
  const now = new Date();
  const expires = new Date(now.getTime() + ttlHours() * 3600_000);
  const existing = await getConcept(id);
  const record: StoredConcept = {
    id,
    sessionId: input.sessionId,
    createdAt: existing?.createdAt || now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    status: input.status || existing?.status || "draft",
    concept: input.concept,
    previewDataUrl:
      input.previewDataUrl !== undefined
        ? input.previewDataUrl
        : existing?.previewDataUrl ?? null,
    telegramMessageId: existing?.telegramMessageId ?? null,
  };
  await fs.writeFile(
    path.join(CONCEPTS, `${id}.json`),
    JSON.stringify(record, null, 2),
    "utf8",
  );
  return record;
}

export async function getConcept(id: string): Promise<StoredConcept | null> {
  try {
    const raw = await fs.readFile(path.join(CONCEPTS, `${id}.json`), "utf8");
    const record = JSON.parse(raw) as StoredConcept;
    if (new Date(record.expiresAt).getTime() < Date.now()) {
      return null;
    }
    return record;
  } catch {
    return null;
  }
}

export async function updateConceptStatus(
  id: string,
  status: StoredConcept["status"],
  extra?: Partial<Pick<StoredConcept, "telegramMessageId" | "previewDataUrl">>,
) {
  const existing = await getConcept(id);
  if (!existing) return null;
  const next: StoredConcept = {
    ...existing,
    ...extra,
    status,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(
    path.join(CONCEPTS, `${id}.json`),
    JSON.stringify(next, null, 2),
    "utf8",
  );
  return next;
}

export async function persistSessionQuota(input: {
  sessionId: string;
  generations?: number;
  chatTurns?: number;
  incrementDailyImage?: boolean;
}) {
  const quotas = await readQuotas();
  const today = new Date().toISOString().slice(0, 10);
  const prev = quotas.sessions[input.sessionId] || {
    generations: 0,
    chatTurns: 0,
    updatedAt: today,
  };
  quotas.sessions[input.sessionId] = {
    generations:
      input.generations !== undefined ? input.generations : prev.generations,
    chatTurns: input.chatTurns !== undefined ? input.chatTurns : prev.chatTurns,
    updatedAt: new Date().toISOString(),
  };

  if (input.incrementDailyImage) {
    const day = quotas.dailyImages.global || { date: today, count: 0 };
    if (day.date !== today) {
      quotas.dailyImages.global = { date: today, count: 1 };
    } else {
      quotas.dailyImages.global = { date: today, count: day.count + 1 };
    }
  }

  await writeQuotas(quotas);
  return quotas;
}

export async function getDailyImageCount() {
  const quotas = await readQuotas();
  const today = new Date().toISOString().slice(0, 10);
  const day = quotas.dailyImages.global;
  if (!day || day.date !== today) return 0;
  return day.count;
}

export async function getPersistedSession(sessionId: string) {
  const quotas = await readQuotas();
  return quotas.sessions[sessionId] || null;
}
