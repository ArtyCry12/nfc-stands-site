import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionLabel } from "@/components/section-label";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  catalog,
  formatStandardTierTable,
  standardStandUnitFrom,
} from "@/lib/catalog";

type Props = { params: Promise<{ locale: string }> };

export default async function CatalogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalog");
  const s = await getTranslations("studio");
  const n = await getTranslations("nav");
  const loc = locale as Locale;
  const tiers = formatStandardTierTable(loc);
  const fromPrice = standardStandUnitFrom(1);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6 md:pt-14">
      <SectionLabel index="02" label={s("catalogLabel")} />
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[var(--ps-ink)] md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-[var(--ps-body)]">{t("subtitle")}</p>
      <div className="mt-6 rounded-[var(--ps-radius)] border border-[var(--ps-line)] bg-[var(--ps-primary-soft)] px-5 py-4 text-sm">
        <p className="font-semibold text-[var(--ps-ink)]">{t("tiersTitle")}</p>
        <p className="mt-1 text-[var(--ps-body)]">{tiers.rows.join(" · ")}</p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.map((product) => (
          <article
            key={product.slug}
            className="overflow-hidden rounded-[var(--ps-radius-lg)] border border-[var(--ps-line)] bg-white"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                product.slug.includes("sticker")
                  ? "/media/refs/plaque-hand.jpg"
                  : "/media/refs/stands-desk.jpg"
              }
              alt=""
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="space-y-3 p-5">
              <h2 className="text-xl font-bold text-[var(--ps-ink)]">
                {product.name[loc]}
              </h2>
              <p className="text-sm text-[var(--ps-body)]">{product.summary[loc]}</p>
              <p className="text-sm font-semibold text-[var(--ps-primary)]">
                {product.pricing === "standard-tiers"
                  ? `${t("from")} ${fromPrice} MDL / ${t("unit")}`
                  : t("onRequest")}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href={`/catalog/${product.slug}`}
                  className="inline-flex h-11 items-center rounded-full border border-[var(--ps-line)] px-4 text-sm font-semibold"
                >
                  {t("view")}
                </Link>
                <Link
                  href={`/configure/${product.slug}`}
                  className="inline-flex h-11 items-center rounded-full bg-[var(--ps-primary)] px-4 text-sm font-semibold text-white"
                >
                  {n("configure")}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
