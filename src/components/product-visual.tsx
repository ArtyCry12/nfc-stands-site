type Props = {
  accent?: string;
  label?: string;
  className?: string;
};

/** CSS-only NFC stand silhouette for hero / catalog without stock photos. */
export function ProductVisual({
  accent = "#FF7A45",
  label = "nfc stand",
  className = "",
}: Props) {
  return (
    <div
      className={`relative flex aspect-[4/3] items-end justify-center overflow-hidden bg-[var(--tf-photo)] ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(255,122,69,0.35), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08), transparent 40%)",
        }}
      />
      <div className="relative mb-[12%] w-[46%] max-w-[220px]">
        <div
          className="mx-auto h-3 w-[70%] rounded-t-sm"
          style={{ background: accent }}
        />
        <div
          className="relative mx-auto aspect-[3/4] w-full rounded-sm shadow-2xl"
          style={{
            background: `linear-gradient(160deg, #2a2a2a 0%, #111 55%, ${accent}22 100%)`,
            border: `1px solid ${accent}`,
          }}
        >
          <div className="absolute left-1/2 top-[28%] h-14 w-14 -translate-x-1/2 rounded-full border-2 border-white/80">
            <div
              className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: accent }}
            />
          </div>
          <p className="absolute bottom-4 left-0 right-0 text-center font-[family-name:var(--font-display)] text-[10px] uppercase tracking-[0.2em] text-white/50">
            {label}
          </p>
        </div>
        <div className="mx-auto h-2 w-[85%] rounded-b-md bg-black/60" />
      </div>
    </div>
  );
}
