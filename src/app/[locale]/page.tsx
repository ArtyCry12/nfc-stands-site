import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Hero } from "@/components/hero";
import { LeadForm } from "@/components/lead-form";
import { SiteVideo } from "@/components/site-video";
import { Link } from "@/i18n/navigation";
import {
  catalog,
  formatStandardTierTable,
  standardStandUnitFrom,
} from "@/lib/catalog";
import { CASE_NARRATIVES } from "@/lib/section-copy";
import { VIDEOS } from "@/lib/videos";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("catalog");
  const tf = await getTranslations("faq");
  const ts = await getTranslations("solutions");
  const loc = locale as Locale;
  const tiers = formatStandardTierTable(loc);
  const fromPrice = standardStandUnitFrom(1);

  return (
    <>
      <Hero />

      {/* Hook → Insight strip */}
      <section className="border-y border-[var(--border)] bg-[var(--tf-stage-soft)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-2 md:px-6 md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tf-accent)]">
              {t("hookLabel")}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-[var(--tf-ink)] md:text-4xl">
              {t("hookTitle")}
            </h2>
          </div>
          <div className="space-y-4 text-[var(--tf-body)]">
            <p>{t("insightBody")}</p>
            <p className="text-sm text-[var(--tf-meta)]">{t("insightNote")}</p>
          </div>
        </div>
      </section>

      {/* Products (physical) + catalogue video */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tf-accent)]">
              {t("productsLabel")}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight md:text-4xl">
              {t("catalogTitle")}
            </h2>
            <p className="mt-3 text-[var(--tf-body)]">{t("catalogLead")}</p>
          </div>
          <Link
            href="/catalog"
            className="inline-flex h-11 items-center rounded-full border border-[var(--border)] px-5 text-sm font-semibold hover:border-[var(--tf-ink)]"
          >
            {tc("title")} →
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--tf-photo)]">
          <SiteVideo
            src={VIDEOS.catalogue.src}
            poster={VIDEOS.catalogue.poster}
            label={t("catalogueVideoLabel")}
            className="aspect-[16/9] w-full"
          />
        </div>

        <div className="mt-6 rounded-2xl bg-[var(--tf-accent-soft)] px-5 py-4 text-sm text-[var(--tf-ink)]">
          <p className="font-semibold">{tiers.header}</p>
          <p className="mt-1 text-[var(--tf-body)]">{tiers.rows.join(" · ")}</p>
          <p className="mt-2 text-xs text-[var(--tf-meta)]">{t("catalogNote")}</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.slice(0, 3).map((product) => (
            <Link
              key={product.slug}
              href={`/catalog/${product.slug}`}
              className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition hover:shadow-[0_16px_40px_rgba(32,33,36,0.08)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  product.slug === "standard-review-stand"
                    ? "/media/refs/stands-desk.jpg"
                    : "/media/refs/plaque-hand.jpg"
                }
                alt=""
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                  {product.name[loc]}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--tf-body)]">
                  {product.summary[loc]}
                </p>
                <p className="mt-3 text-sm font-semibold text-[var(--tf-accent)]">
                  {product.pricing === "standard-tiers"
                    ? `${tc("from")} ${fromPrice} MDL`
                    : tc("onRequest")}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--tf-meta)]">
          <span className="font-medium text-[var(--tf-ink)]">{t("benefitProducts")}</span>{" "}
          {t("nextProducts")}
        </p>
      </section>

      {/* Solutions (use cases) — distinct from products */}
      <section className="border-y border-[var(--border)] bg-[var(--tf-stage-soft)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tf-accent)]">
            {t("solutionsLabel")}
          </p>
          <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight md:text-4xl">
            {ts("title")}
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--tf-body)]">{t("solutionsLead")}</p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {(["reviews", "menu", "page", "custom"] as const).map((key) => (
              <div
                key={key}
                className="rounded-2xl border border-[var(--border)] bg-white p-6"
              >
                <div className="mb-4 h-1 w-14 overflow-hidden rounded-full">
                  <div className="flex h-full w-full">
                    <span className="flex-1 bg-[var(--tf-g-blue)]" />
                    <span className="flex-1 bg-[var(--tf-g-red)]" />
                    <span className="flex-1 bg-[var(--tf-g-yellow)]" />
                    <span className="flex-1 bg-[var(--tf-g-green)]" />
                  </div>
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
                  {ts(`${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-[var(--tf-body)]">
                  {ts(`${key}.body`)}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/solutions"
            className="mt-8 inline-flex h-11 items-center text-sm font-semibold text-[var(--tf-accent)] hover:underline"
          >
            {t("nextSolutions")} →
          </Link>
        </div>
      </section>

      {/* How NFC works */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tf-accent)]">
            {t("nfcLabel")}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight md:text-4xl">
            {t("nfcTitle")}
          </h2>
          <p className="mt-4 text-[var(--tf-body)]">{t("nfcInsight")}</p>
          <p className="mt-3 text-sm text-[var(--tf-meta)]">{t("nfcBenefit")}</p>
          <Link
            href="/configure/standard-review-stand"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-[var(--tf-ink)] px-5 text-sm font-semibold text-white"
          >
            {t("nfcNext")}
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          <SiteVideo
            src={VIDEOS.howNfc.src}
            poster={VIDEOS.howNfc.poster}
            label={t("nfcVideoLabel")}
            className="aspect-[4/3] w-full"
          />
        </div>
      </section>

      {/* Real NFC demo */}
      <section className="bg-[var(--tf-ink)] text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div className="overflow-hidden rounded-2xl order-2 md:order-1">
            <SiteVideo
              src={VIDEOS.nfcDemo.src}
              poster={VIDEOS.nfcDemo.poster}
              label={t("demoVideoLabel")}
              className="aspect-[4/3] w-full"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tf-g-yellow)]">
              {t("demoLabel")}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight md:text-4xl">
              {t("demoTitle")}
            </h2>
            <p className="mt-4 text-white/75">{t("demoBody")}</p>
            <Link
              href="/cases"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-semibold text-[var(--tf-ink)]"
            >
              {t("demoNext")}
            </Link>
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tf-accent)]">
          {t("casesLabel")}
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight md:text-4xl">
          {t("casesTitle")}
        </h2>
        <p className="mt-3 max-w-2xl text-[var(--tf-body)]">{t("casesLead")}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CASE_NARRATIVES.map((c) => (
            <Link
              key={c.slug}
              href={`/cases/${c.slug}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition hover:shadow-[0_16px_40px_rgba(32,33,36,0.08)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.photo || "/media/refs/stands-desk.jpg"}
                alt=""
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
                  {c.name}
                </h3>
                <p className="mt-2 flex-1 text-sm text-[var(--tf-body)]">
                  {c.example[loc]}
                </p>
                {c.verified !== true && (
                  <p className="mt-3 text-xs text-amber-700">{t("partialNote")}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI consultant teaser */}
      <section className="border-t border-[var(--border)] bg-[var(--tf-stage-soft)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tf-accent)]">
              {t("aiLabel")}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight md:text-4xl">
              {t("aiTitle")}
            </h2>
            <p className="mt-4 text-[var(--tf-body)]">{t("aiBody")}</p>
            <Link
              href="/consultant"
              className="mt-6 inline-flex h-11 items-center rounded-full bg-[var(--tf-ink)] px-5 text-sm font-semibold text-white"
            >
              {t("ctaPrimary")}
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
            <SiteVideo
              src={VIDEOS.consultant.src}
              poster={VIDEOS.consultant.poster}
              label={t("aiVideoLabel")}
              className="aspect-[16/10] w-full"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-16 md:px-6 md:py-24">
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight">
            {t("faqTitle")}
          </h2>
          <Accordion className="mt-6">
            {[1, 2, 3, 4].map((n) => (
              <AccordionItem key={n} value={`q${n}`}>
                <AccordionTrigger>{tf(`q${n}`)}</AccordionTrigger>
                <AccordionContent>{tf(`a${n}`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-white p-6 md:p-10">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight">
            {t("leadTitle")}
          </h2>
          <p className="mt-2 text-[var(--tf-body)]">{t("leadSub")}</p>
          <div className="mt-6 max-w-lg">
            <LeadForm />
          </div>
        </section>
      </div>
    </>
  );
}
