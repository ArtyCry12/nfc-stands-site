import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "tf_session";

type SessionPayload = {
  sid: string;
  generations: number;
  chatTurns: number;
};

function secretKey() {
  const secret =
    process.env.SESSION_SECRET || "touchform-dev-session-secret-change-me";
  return new TextEncoder().encode(secret);
}

function maxImages() {
  const n = Number(process.env.AI_MAX_IMAGES_PER_SESSION || 2);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 2;
}

export function newSessionId() {
  return crypto.randomUUID();
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function readSession(): Promise<SessionPayload> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const max = maxImages();
  if (!token) {
    return { sid: newSessionId(), generations: 0, chatTurns: 0 };
  }
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const sid = typeof payload.sid === "string" ? payload.sid : newSessionId();
    const generations =
      typeof payload.generations === "number" ? payload.generations : 0;
    const chatTurns =
      typeof payload.chatTurns === "number" ? payload.chatTurns : 0;
    return {
      sid,
      generations: Math.max(0, Math.min(generations, max)),
      chatTurns: Math.max(0, chatTurns),
    };
  } catch {
    return { sid: newSessionId(), generations: 0, chatTurns: 0 };
  }
}

export async function writeSession(payload: SessionPayload) {
  const jar = await cookies();
  const token = await signSession(payload);
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

const locks = new Map<string, Promise<void>>();

export async function withSessionLock<T>(
  sid: string,
  fn: () => Promise<T>,
): Promise<T> {
  const prev = locks.get(sid) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  locks.set(
    sid,
    prev.then(() => gate),
  );
  await prev;
  try {
    return await fn();
  } finally {
    release();
    if (locks.get(sid) === gate) locks.delete(sid);
  }
}

export { maxImages as getMaxImagesPerSession };
