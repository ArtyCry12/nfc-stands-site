import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductVisual } from "@/components/product-visual";
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
  const n = await getTranslations("nav");
  const loc = locale as Locale;
  const tiers = formatStandardTierTable(loc);
  const fromPrice = standardStandUnitFrom(1);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 md:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold lowercase tracking-tight">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--tf-body)]">{t("subtitle")}</p>
      <div className="mt-4 rounded-2xl bg-white p-4 text-sm shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <p className="font-medium">{t("tiersTitle")}</p>
        <p className="mt-1 text-[var(--tf-body)]">
          {tiers.rows.join(" · ")}
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.map((product) => (
          <article
            key={product.slug}
            className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            <ProductVisual
              productType={product.slug}
              colorId={product.colors[0]?.id ?? "black"}
              label={product.slug}
              className="rounded-none"
            />
            <div className="space-y-3 p-5">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold lowercase">
                {product.name[loc]}
              </h2>
              <p className="text-sm text-[var(--tf-body)]">{product.summary[loc]}</p>
              <p className="text-sm font-medium">
                {product.pricing === "standard-tiers"
                  ? `${t("from")} ${fromPrice} MDL / ${t("unit")}`
                  : t("onRequest")}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/catalog/${product.slug}`}
                  className="inline-flex h-11 items-center rounded-full border border-[var(--tf-ink)] px-4 text-sm font-semibold"
                >
                  {t("view")}
                </Link>
                <Link
                  href={`/configure/${product.slug}`}
                  className="inline-flex h-11 items-center rounded-full bg-[var(--tf-ink)] px-4 text-sm font-semibold text-white"
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
