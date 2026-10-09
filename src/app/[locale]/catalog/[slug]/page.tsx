import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProductVisual } from "@/components/product-visual";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  catalog,
  formatStandardTierTable,
  getProduct,
  standardStandUnitFrom,
} from "@/lib/catalog";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return catalog.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = getProduct(slug);
  if (!product) notFound();
  const t = await getTranslations("catalog");
  const n = await getTranslations("nav");
  const loc = locale as Locale;
  const tiers = formatStandardTierTable(loc);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 pt-28 md:grid-cols-2 md:px-6">
      <div className="overflow-hidden rounded-[1.75rem] bg-white p-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <ProductVisual
          productType={product.slug}
          colorId={product.colors[0]?.id ?? "black"}
          label={product.slug}
          className="rounded-[1.25rem]"
        />
      </div>
      <div className="space-y-4">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold lowercase tracking-tight">
          {product.name[loc]}
        </h1>
        <p className="text-[var(--tf-body)]">{product.summary[loc]}</p>
        {product.dimensionsConfirmed ? (
          <p className="text-sm text-[var(--tf-meta)]">{product.dimensionsConfirmed}</p>
        ) : (
          <p className="text-sm text-[var(--tf-meta)]">{t("unknownPrice")}</p>
        )}
        <p className="font-[family-name:var(--font-display)] text-2xl font-bold">
          {product.pricing === "standard-tiers"
            ? `${t("from")} ${standardStandUnitFrom(1)} MDL / ${t("unit")}`
            : t("onRequest")}
        </p>
        {product.pricing === "standard-tiers" && (
          <ul className="text-sm text-[var(--tf-body)]">
            {tiers.rows.map((row) => (
              <li key={row}>{row}</li>
            ))}
          </ul>
        )}
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--tf-meta)]">
            {t("scenarios")}
          </p>
          <p className="mt-1 text-sm">
            {product.experiences.map((m) => m.label[loc]).join(" · ")}
          </p>
        </div>
        <Link
          href={`/configure/${product.slug}`}
          className="inline-flex h-12 items-center rounded-full bg-[var(--tf-ink)] px-6 text-sm font-semibold text-white"
        >
          {n("configure")}
        </Link>
      </div>
    </div>
  );
}
