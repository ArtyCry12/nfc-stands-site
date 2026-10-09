import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Hero } from "@/components/hero";
import { LeadForm } from "@/components/lead-form";
import { ProductVisual } from "@/components/product-visual";
import { Link } from "@/i18n/navigation";
import {
  catalog,
  formatStandardTierTable,
  standardStandUnitFrom,
} from "@/lib/catalog";
import { CASES } from "@/lib/knowledge-base";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("catalog");
  const tf = await getTranslations("faq");
  const tcases = await getTranslations("cases");
  const loc = locale as Locale;
  const tiers = formatStandardTierTable(loc);
  const fromPrice = standardStandUnitFrom(1);

  return (
    <>
      <Hero />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 md:px-6">
        <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold lowercase tracking-tight">
            {t("whyTitle")}
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              [t("why1Title"), t("why1Body")],
              [t("why2Title"), t("why2Body")],
              [t("why3Title"), t("why3Body")],
            ].map(([title, body]) => (
              <div key={title} className="border-l-2 border-[var(--tf-accent)] pl-4">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold lowercase">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-[var(--tf-body)]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold lowercase tracking-tight">
                {t("catalogTitle")}
              </h2>
              <p className="mt-2 text-sm text-[var(--tf-meta)]">{t("catalogNote")}</p>
            </div>
            <Link
              href="/catalog"
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              {tc("title")} →
            </Link>
          </div>
          <div className="mt-4 rounded-2xl bg-[var(--tf-stage-soft)] p-4 text-sm">
            <p className="font-medium">{tiers.header}</p>
            <p className="mt-1 text-[var(--tf-body)]">{tiers.rows.join(" · ")}</p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.slice(0, 3).map((product) => (
              <Link
                key={product.slug}
                href={`/catalog/${product.slug}`}
                className="group overflow-hidden rounded-[1.25rem] border border-transparent bg-[var(--background)] transition hover:border-[var(--tf-ink)]/10"
              >
                <ProductVisual
                  productType={product.slug}
                  colorId={product.colors[0]?.id ?? "black"}
                  label={product.slug}
                  className="rounded-none"
                />
                <div className="p-4">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold lowercase">
                    {product.name[loc]}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--tf-meta)]">
                    {product.pricing === "standard-tiers"
                      ? `${tc("from")} ${fromPrice} MDL`
                      : tc("onRequest")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold lowercase tracking-tight">
            {tcases("title")}
          </h2>
          <p className="mt-2 text-sm text-[var(--tf-meta)]">{tcases("subtitle")}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {CASES.map((c) => (
              <Link
                key={c.slug}
                href={`/cases/${c.slug}`}
                className="rounded-2xl border border-[var(--tf-ink)]/10 p-4 transition hover:border-[var(--tf-accent)]"
              >
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">
                  {c.name}
                </h3>
                <p className="mt-2 text-sm text-[var(--tf-body)]">{c.summary[loc]}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold lowercase tracking-tight">
            {t("faqTitle")}
          </h2>
          <Accordion className="mt-4">
            {[1, 2, 3, 4].map((n) => (
              <AccordionItem key={n} value={`q${n}`}>
                <AccordionTrigger>{tf(`q${n}`)}</AccordionTrigger>
                <AccordionContent>{tf(`a${n}`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="rounded-[1.75rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold lowercase tracking-tight">
            {t("leadTitle")}
          </h2>
          <p className="mt-2 text-sm text-[var(--tf-body)]">{t("leadSub")}</p>
          <div className="mt-6 max-w-lg">
            <LeadForm />
          </div>
        </section>
      </div>
    </>
  );
}
