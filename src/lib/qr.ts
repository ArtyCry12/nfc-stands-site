import QRCode from "qrcode";

const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "[::1]"]);

export type QrValidation =
  | { ok: true; url: string; normalized: string }
  | { ok: false; error: string };

/** Validate destination URLs used for NFC/QR — http(s) only, no javascript: etc. */
export function validateDestinationUrl(raw: string): QrValidation {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: "URL is required" };
  if (trimmed.length > 2048) return { ok: false, error: "URL too long" };

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: "Invalid URL" };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, error: "Only http(s) URLs are allowed" };
  }

  if (BLOCKED_HOSTS.has(parsed.hostname.toLowerCase())) {
    // Allow localhost in development for demos/tests
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "Localhost destinations are not allowed" };
    }
  }

  return { ok: true, url: trimmed, normalized: parsed.toString() };
}

export async function generateQrSvg(destination: string, size = 256) {
  const check = validateDestinationUrl(destination);
  if (!check.ok) throw new Error(check.error);

  const svg = await QRCode.toString(check.normalized, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    width: size,
    color: { dark: "#111111", light: "#FFFFFF" },
  });

  return { svg, url: check.normalized };
}

export async function generateQrPngDataUrl(destination: string, size = 256) {
  const check = validateDestinationUrl(destination);
  if (!check.ok) throw new Error(check.error);

  const dataUrl = await QRCode.toDataURL(check.normalized, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: size,
    color: { dark: "#111111", light: "#FFFFFF" },
  });

  return { dataUrl, url: check.normalized };
}

export async function generateQrPngBuffer(destination: string, size = 256) {
  const check = validateDestinationUrl(destination);
  if (!check.ok) throw new Error(check.error);

  const buffer = await QRCode.toBuffer(check.normalized, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 2,
    width: size,
    color: { dark: "#111111", light: "#FFFFFF" },
  });

  return { buffer, url: check.normalized };
}
