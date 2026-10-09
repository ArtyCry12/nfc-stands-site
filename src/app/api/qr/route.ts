import { NextResponse } from "next/server";
import {
  generateQrPngBuffer,
  generateQrPngDataUrl,
  generateQrSvg,
  validateDestinationUrl,
} from "@/lib/qr";
import { checkBurstLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") || "";
  const format = (searchParams.get("format") || "svg").toLowerCase();
  const size = Math.min(
    1024,
    Math.max(128, Number(searchParams.get("size") || 256)),
  );

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  const burst = checkBurstLimit(`qr:${ip}`, 30, 60_000);
  if (!burst.ok) {
    return NextResponse.json(
      { error: "Rate limit exceeded", retryAfterMs: burst.retryAfterMs },
      { status: 429 },
    );
  }

  const check = validateDestinationUrl(url);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  try {
    if (format === "png") {
      const { buffer, url: normalized } = await generateQrPngBuffer(
        check.normalized,
        size,
      );
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=3600",
          "X-QR-URL": normalized,
        },
      });
    }

    const { svg, url: normalized } = await generateQrSvg(check.normalized, size);
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "X-QR-URL": normalized,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "QR generation failed",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const url =
    typeof body === "object" && body && "url" in body
      ? String((body as { url: unknown }).url || "")
      : "";

  const check = validateDestinationUrl(url);
  if (!check.ok) {
    return NextResponse.json({ error: check.error, ok: false }, { status: 400 });
  }

  const { dataUrl, url: normalized } = await generateQrPngDataUrl(
    check.normalized,
    256,
  );

  return NextResponse.json({
    ok: true,
    url: normalized,
    pngDataUrl: dataUrl,
    apiSvg: `/api/qr?format=svg&url=${encodeURIComponent(normalized)}`,
    apiPng: `/api/qr?format=png&url=${encodeURIComponent(normalized)}`,
  });
}
