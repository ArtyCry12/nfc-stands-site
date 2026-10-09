"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildLayeredProductDataUrl,
  qrOverlayStyle,
} from "@/lib/product-layers";

type Props = {
  productType?: string;
  colorId?: string;
  material?: string | null;
  brandLabel?: string;
  label?: string;
  destinationUrl?: string;
  /** Pre-fetched QR data URL (skips internal fetch when provided). */
  qrSrc?: string | null;
  className?: string;
  caption?: string;
};

/**
 * Layered product photo (stand + material/color + branding + QR plate).
 * Replaces the old CSS silhouette stub. Geometry is shared with generate-visual.
 */
export function ProductVisual({
  productType = "standard-review-stand",
  colorId = "black",
  material = null,
  brandLabel = "touchform.md",
  label,
  destinationUrl = "",
  qrSrc: qrSrcProp = null,
  className = "",
  caption,
}: Props) {
  const [fetchedQr, setFetchedQr] = useState<string | null>(null);
  const overlay = qrOverlayStyle();

  const { dataUrl } = useMemo(
    () =>
      buildLayeredProductDataUrl({
        productType,
        colorId,
        material,
        brandLabel,
        showBrandMark: true,
        reserveQrPlate: true,
        caption: caption || label || `${productType} · ${colorId}`,
      }),
    [productType, colorId, material, brandLabel, caption, label],
  );

  useEffect(() => {
    if (qrSrcProp) {
      setFetchedQr(null);
      return;
    }
    let cancelled = false;
    setFetchedQr(null);
    const url = destinationUrl.trim();
    if (!url) return;

    fetch("/api/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "QR failed");
        if (!cancelled) setFetchedQr(data.pngDataUrl as string);
      })
      .catch(() => {
        if (!cancelled) setFetchedQr(null);
      });

    return () => {
      cancelled = true;
    };
  }, [destinationUrl, qrSrcProp]);

  const qrSrc = qrSrcProp || fetchedQr;

  return (
    <div
      className={`relative aspect-[4/3] overflow-hidden bg-[var(--tf-photo)] ${className}`}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      {qrSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={qrSrc}
          alt=""
          className="pointer-events-none absolute object-contain"
          style={{
            left: overlay.left,
            top: overlay.top,
            width: overlay.width,
            height: overlay.height,
          }}
        />
      )}
    </div>
  );
}
