"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductVisual } from "@/components/product-visual";

const CONTEXTS = ["contextCafe", "contextHotel", "contextDesk"] as const;

export function Hero() {
  const t = useTranslations("home");
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    if (mq.matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % CONTEXTS.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[var(--tf-ink)] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-700"
        style={{
          background: [
            "radial-gradient(ellipse 80% 50% at 70% 40%, rgba(255,122,69,0.22), transparent 55%)",
            "linear-gradient(180deg, #111 0%, #171717 45%, #0c0c0c 100%)",
          ].join(","),
        }}
      />
      <div className="relative mx-auto grid min-h-[100svh] max-w-6xl items-end gap-8 px-4 pb-16 pt-28 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-6 md:pb-20">
        <div className="animate-tf-rise">
          <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[var(--tf-accent)]">
            {t("eyebrow")}
          </p>
          <h1 className="max-w-xl font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,4.4rem)] font-extrabold leading-[0.95] tracking-[-0.04em] lowercase">
            {t("headline")}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/70 md:text-lg">
            {t("subhead")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/consultant"
              className="inline-flex h-12 items-center rounded-full bg-white px-6 font-[family-name:var(--font-display)] text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center rounded-full border border-white/40 px-6 font-[family-name:var(--font-display)] text-sm font-semibold text-white transition hover:border-white hover:bg-white/5"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/45">
            <span className="text-[var(--tf-accent)]">·</span> {t("proof")}
          </p>
        </div>

        <div className="relative animate-tf-fade">
          <div className="overflow-hidden rounded-[2px]">
            <ProductVisual
              productType="standard-review-stand"
              colorId="black"
              brandLabel="touchform.md"
              label="touchform"
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/45">
            <span>{t(CONTEXTS[index])}</span>
            <span className="flex gap-1">
              {CONTEXTS.map((c, i) => (
                <span
                  key={c}
                  className={`h-1 w-6 rounded-full transition ${
                    i === index ? "bg-[var(--tf-accent)]" : "bg-white/20"
                  } ${reduceMotion ? "" : ""}`}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--tf-accent)]" />
    </section>
  );
}
