"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SiteVideo } from "@/components/site-video";
import { VIDEOS } from "@/lib/videos";

export function Hero() {
  const t = useTranslations("home");

  return (
    <section className="relative bg-white">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 md:px-6 md:pb-16 md:pt-14">
        <div className="mx-auto max-w-3xl text-center animate-tf-rise">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-[var(--tf-accent)]">
            {t("eyebrow")}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.6rem,7vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-[var(--tf-ink)]">
            {t("headline")}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--tf-body)] md:text-lg">
            {t("subhead")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/consultant"
              className="inline-flex h-12 items-center rounded-full bg-[var(--tf-ink)] px-6 font-[family-name:var(--font-display)] text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
            >
              {t("ctaPrimary")}
            </Link>
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center rounded-full border border-[var(--border)] bg-white px-6 font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--tf-ink)] transition hover:border-[var(--tf-ink)]"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
          <p className="mt-5 text-sm text-[var(--tf-meta)]">{t("proof")}</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--tf-photo)] shadow-[0_24px_60px_rgba(32,33,36,0.08)] animate-tf-fade md:mt-14">
          <SiteVideo
            src={VIDEOS.hero.src}
            poster={VIDEOS.hero.poster}
            autoPlay
            label={t("heroVideoLabel")}
            className="aspect-[16/9] w-full"
          />
        </div>
      </div>
    </section>
  );
}
