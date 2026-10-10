"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SectionLabel } from "@/components/section-label";
import { SiteVideo } from "@/components/site-video";
import { VIDEOS } from "@/lib/videos";

export function Hero() {
  const t = useTranslations("studio");

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:gap-12 md:px-6 md:py-20">
        <div className="animate-ps-rise">
          <SectionLabel index="01" label={t("heroLabel")} />
          <h1 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[var(--ps-ink)]">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-7 text-[var(--ps-body)]">
            {t("heroBody")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex h-12 items-center rounded-full bg-[var(--ps-primary)] px-6 text-sm font-semibold text-white transition hover:bg-[#1557b0]"
            >
              {t("heroCtaPrimary")}
            </Link>
            <Link
              href="/consultant"
              className="inline-flex h-12 items-center rounded-full border border-[var(--ps-line)] bg-white px-6 text-sm font-semibold text-[var(--ps-ink)] transition hover:border-[var(--ps-ink)]"
            >
              {t("heroCtaSecondary")}
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--ps-meta)]">
            <li>{t("heroProof1")}</li>
            <li>{t("heroProof2")}</li>
            <li>{t("heroProof3")}</li>
          </ul>
        </div>
        <div className="overflow-hidden rounded-[var(--ps-radius-lg)] border border-[var(--ps-line)] bg-[var(--tf-photo)] shadow-[0_20px_50px_rgba(32,33,36,0.08)] animate-tf-fade">
          <SiteVideo
            src={VIDEOS.hero.src}
            poster={VIDEOS.hero.poster}
            autoPlay
            label={t("heroVideoLabel")}
            className="aspect-[4/3] w-full md:aspect-[5/4]"
          />
        </div>
      </div>
    </section>
  );
}
