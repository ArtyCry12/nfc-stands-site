import { NextResponse } from "next/server";
import { getConcept } from "@/lib/concept-store";
import { readSession } from "@/lib/session";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { id } = await params;
  const record = await getConcept(id);
  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await readSession();
  if (record.sessionId !== session.sid) {
    // Opaque IDs alone are not enough for cross-session reads in this slice.
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    id: record.id,
    status: record.status,
    createdAt: record.createdAt,
    expiresAt: record.expiresAt,
    concept: record.concept,
    hasPreview: Boolean(record.previewDataUrl),
  });
}
