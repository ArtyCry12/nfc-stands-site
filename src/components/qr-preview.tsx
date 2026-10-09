"use client";

import { useEffect, useState } from "react";

type Props = {
  url: string;
  label?: string;
  className?: string;
};

export function QrPreview({ url, label = "QR", className = "" }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [normalized, setNormalized] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSrc(null);
    setError(null);
    setNormalized(null);

    if (!url.trim()) return;

    fetch("/api/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "QR failed");
        if (!cancelled) {
          setSrc(data.pngDataUrl);
          setNormalized(data.url);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!url.trim()) return null;

  return (
    <div
      className={`rounded-2xl border border-[var(--tf-ink)]/10 bg-white p-4 ${className}`}
    >
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--tf-meta)]">
        {label}
      </p>
      {error && (
        <p className="mt-2 text-sm text-[var(--tf-error)]" role="alert">
          {error}
        </p>
      )}
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`QR code for ${normalized || url}`}
          width={180}
          height={180}
          className="mt-3 mx-auto"
        />
      )}
      {normalized && (
        <p className="mt-2 break-all text-center text-xs text-[var(--tf-meta)]">
          {normalized}
        </p>
      )}
      <p className="mt-1 text-center text-[10px] text-[var(--tf-meta)]">
        Code-generated · scannable · not AI-drawn
      </p>
    </div>
  );
}
