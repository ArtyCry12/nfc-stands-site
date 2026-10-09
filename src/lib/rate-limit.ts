type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** In-memory sliding window burst limiter (per process). */
export function checkBurstLimit(
  key: string,
  max: number,
  windowMs: number,
): { ok: true; remaining: number } | { ok: false; retryAfterMs: number } {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || now >= current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }
  if (current.count >= max) {
    return { ok: false, retryAfterMs: Math.max(0, current.resetAt - now) };
  }
  current.count += 1;
  return { ok: true, remaining: max - current.count };
}

export function chatRequestsPerMinute() {
  const n = Number(process.env.AI_CHAT_REQUESTS_PER_MINUTE || 8);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 8;
}

export function maxChatTurns() {
  const n = Number(process.env.AI_MAX_CHAT_TURNS_PER_SESSION || 24);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 24;
}

export function dailyImageLimit() {
  const n = Number(process.env.AI_DAILY_IMAGE_LIMIT || 100);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 100;
}
