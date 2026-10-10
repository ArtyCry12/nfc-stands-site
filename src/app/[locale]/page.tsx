import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/hero";
import { LeadForm } from "@/components/lead-form";
import { SectionLabel } from "@/components/section-label";
import { SiteVideo } from "@/components/site-video";
import { Link } from "@/i18n/navigation";
import {
  catalog,
  formatStandardTierTable,
  standardStandUnitFrom,
} from "@/lib/catalog";
import { STANDARD_REVIEW_STAND_TIERS } from "@/lib/pricing";
import { CASE_NARRATIVES } from "@/lib/section-copy";
import { VIDEOS } from "@/lib/videos";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("studio");
  const tc = await getTranslations("catalog");
  const ts = await getTranslations("solutions");
  const loc = locale as Locale;
  const tiers = formatStandardTierTable(loc);
  const fromPrice = standardStandUnitFrom(1);

  return (
    <>
      <Hero />

      {/* 02 Physical catalog */}
      <section className="border-t border-[var(--ps-line)] bg-[var(--ps-surface)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel index="02" label={t("catalogLabel")} />
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--ps-ink)] md:text-5xl">
                {t("catalogTitle")}
              </h2>
              <p className="mt-3 max-w-xl text-[var(--ps-body)]">
                {t("catalogBody")}
              </p>
            </div>
            <Link
              href="/catalog"
              className="text-sm font-semibold text-[var(--ps-primary)] hover:underline"
            >
              {t("catalogAll")} →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.map((product) => (
              <Link
                key={product.slug}
                href={`/catalog/${product.slug}`}
                className="group overflow-hidden rounded-[var(--ps-radius-lg)] border border-[var(--ps-line)] bg-white transition hover:shadow-[0_16px_40px_rgba(32,33,36,0.08)]"
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
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[var(--ps-ink)]">
                    {product.name[loc]}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--ps-body)]">
                    {product.summary[loc]}
                  </p>
                  <p className="mt-4 text-sm font-semibold text-[var(--ps-primary)]">
                    {product.pricing === "standard-tiers"
                      ? `${tc("from")} ${fromPrice} MDL`
                      : tc("onRequest")}{" "}
                    <span className="font-medium">→</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 03 Range VIDEO2 */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <SectionLabel index="03" label={t("rangeLabel")} />
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight md:text-5xl">
            {t("rangeTitle")}
          </h2>
          <p className="mt-3 max-w-xl text-[var(--ps-body)]">{t("rangeBody")}</p>
          <div className="mt-8 overflow-hidden rounded-[var(--ps-radius-lg)] border border-[var(--ps-line)]">
            <SiteVideo
              src={VIDEOS.catalogue.src}
              poster={VIDEOS.catalogue.poster}
              label={t("rangeVideoLabel")}
              className="aspect-[16/9] w-full"
            />
          </div>
        </div>
      </section>

      {/* 04 Personalize / configurator */}
      <section className="border-y border-[var(--ps-line)] bg-[var(--ps-surface)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <SectionLabel index="04" label={t("configLabel")} />
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
              {t("configTitle")}
            </h2>
            <p className="mt-4 text-[var(--ps-body)]">{t("configBody")}</p>
            <Link
              href="/configure/standard-review-stand"
              className="mt-8 inline-flex h-12 items-center rounded-full bg-[var(--ps-primary)] px-6 text-sm font-semibold text-white hover:bg-[#1557b0]"
            >
              {t("configCta")}
            </Link>
          </div>
          <div className="overflow-hidden rounded-[var(--ps-radius-lg)] border border-[var(--ps-line)] bg-white p-3 shadow-[0_16px_40px_rgba(32,33,36,0.06)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/refs/stands-desk.jpg"
              alt=""
              className="aspect-[4/3] w-full rounded-[var(--ps-radius)] object-cover"
            />
            <p className="mt-3 px-2 pb-1 text-sm text-[var(--ps-meta)]">
              {t("configNote")}
            </p>
          </div>
        </div>
      </section>

      {/* 05 AI consultant + VIDEO3 + real chat CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <SectionLabel index="05" label={t("aiLabel")} />
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
                {t("aiTitle")}
              </h2>
              <ul className="mt-6 space-y-3 text-[var(--ps-body)]">
                <li>· {t("aiPoint1")}</li>
                <li>· {t("aiPoint2")}</li>
                <li>· {t("aiPoint3")}</li>
              </ul>
              <Link
                href="/consultant"
                className="mt-8 inline-flex h-12 items-center rounded-full bg-[var(--ps-ink)] px-6 text-sm font-semibold text-white"
              >
                {t("aiCta")}
              </Link>
            </div>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[var(--ps-radius-lg)] border border-[var(--ps-line)]">
                <SiteVideo
                  src={VIDEOS.consultant.src}
                  poster={VIDEOS.consultant.poster}
                  label={t("aiVideoLabel")}
                  className="aspect-[16/10] w-full"
                />
              </div>
              <div className="rounded-[var(--ps-radius-lg)] border border-[var(--ps-line)] bg-[var(--ps-surface)] p-5">
                <p className="text-sm font-semibold text-[var(--ps-ink)]">
                  {t("aiChatNote")}
                </p>
                <p className="mt-2 text-sm text-[var(--ps-body)]">
                  {t("aiChatBody")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 How NFC + VIDEO4 */}
      <section className="border-y border-[var(--ps-line)] bg-[var(--ps-surface)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <SectionLabel index="06" label={t("nfcLabel")} />
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
              {t("nfcTitle")}
            </h2>
            <ol className="mt-8 space-y-5">
              {[1, 2, 3].map((n) => (
                <li key={n} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ps-primary-soft)] text-sm font-bold text-[var(--ps-primary)]">
                    {n}
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--ps-ink)]">
                      {t(`nfcStep${n}Title`)}
                    </p>
                    <p className="text-sm text-[var(--ps-body)]">
                      {t(`nfcStep${n}Body`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="overflow-hidden rounded-[var(--ps-radius-lg)] border border-[var(--ps-line)] bg-white">
            <SiteVideo
              src={VIDEOS.howNfc.src}
              poster={VIDEOS.howNfc.poster}
              label={t("nfcVideoLabel")}
              className="aspect-[4/3] w-full"
            />
          </div>
        </div>
      </section>

      {/* 07 Real demo VIDEO5 + Padel VIDEO6 */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <SectionLabel index="07" label={t("demosLabel")} />
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
            {t("demosTitle")}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="overflow-hidden rounded-[var(--ps-radius-lg)] border border-[var(--ps-line)]">
              <SiteVideo
                src={VIDEOS.nfcDemo.src}
                poster={VIDEOS.nfcDemo.poster}
                label={t("demoVideoLabel")}
                className="aspect-[16/10] w-full"
              />
              <div className="p-5">
                <h3 className="text-xl font-bold">{t("demoTitle")}</h3>
                <p className="mt-2 text-sm text-[var(--ps-body)]">
                  {t("demoBody")}
                </p>
              </div>
            </article>
            <article className="overflow-hidden rounded-[var(--ps-radius-lg)] border border-[var(--ps-line)]">
              <SiteVideo
                src={VIDEOS.padelPoint.src}
                poster={VIDEOS.padelPoint.poster}
                label={t("padelVideoLabel")}
                className="aspect-[16/10] w-full"
              />
              <div className="p-5">
                <h3 className="text-xl font-bold">Padel Point</h3>
                <p className="mt-2 text-sm text-[var(--ps-body)]">
                  {CASE_NARRATIVES.find((c) => c.slug === "padel-point")?.example[
                    loc
                  ]}
                </p>
                <Link
                  href="/cases/padel-point"
                  className="mt-3 inline-flex text-sm font-semibold text-[var(--ps-primary)] hover:underline"
                >
                  {t("padelCta")} →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 08 Use cases ≠ product categories */}
      <section className="border-y border-[var(--ps-line)] bg-[var(--ps-surface)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <SectionLabel index="08" label={t("useCasesLabel")} />
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight md:text-5xl">
            {t("useCasesTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--ps-body)]">
            {t("useCasesBody")}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(["reviews", "menu", "page", "custom"] as const).map((key) => (
              <div
                key={key}
                className="rounded-[var(--ps-radius)] border border-[var(--ps-line)] bg-white p-5"
              >
                <div className="mb-4 flex h-1 w-12 overflow-hidden rounded-full">
                  <span className="flex-1 bg-[var(--tf-g-blue)]" />
                  <span className="flex-1 bg-[var(--tf-g-red)]" />
                  <span className="flex-1 bg-[var(--tf-g-yellow)]" />
                  <span className="flex-1 bg-[var(--tf-g-green)]" />
                </div>
                <h3 className="font-bold text-[var(--ps-ink)]">
                  {ts(`${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-[var(--ps-body)]">
                  {ts(`${key}.body`)}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/solutions"
            className="mt-8 inline-flex text-sm font-semibold text-[var(--ps-primary)] hover:underline"
          >
            {t("useCasesCta")} →
          </Link>
        </div>
      </section>

      {/* 09 Exact pricing tiers */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <SectionLabel index="09" label={t("pricingLabel")} />
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
            {t("pricingTitle")}
          </h2>
          <p className="mt-3 max-w-xl text-[var(--ps-body)]">{t("pricingBody")}</p>
          <div className="mt-8 overflow-hidden rounded-[var(--ps-radius-lg)] border border-[var(--ps-line)]">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-[var(--ps-surface)] text-[var(--ps-meta)]">
                <tr>
                  <th className="px-5 py-3 font-semibold">{t("pricingQty")}</th>
                  <th className="px-5 py-3 font-semibold">{t("pricingUnit")}</th>
                </tr>
              </thead>
              <tbody>
                {STANDARD_REVIEW_STAND_TIERS.map((tier) => (
                  <tr
                    key={tier.minQty}
                    className="border-t border-[var(--ps-line)]"
                  >
                    <td className="px-5 py-3.5 font-medium text-[var(--ps-ink)]">
                      {tier.maxQty === Number.POSITIVE_INFINITY
                        ? `${tier.minQty}+`
                        : `${tier.minQty}–${tier.maxQty}`}
                    </td>
                    <td className="px-5 py-3.5 text-[var(--ps-body)]">
                      {tier.unitPriceMdl} MDL / {tc("unit")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-[var(--ps-meta)]">{tiers.header}</p>
          <p className="text-sm text-[var(--ps-meta)]">{t("pricingNote")}</p>
        </div>
      </section>

      {/* 10 Final CTA */}
      <section className="border-t border-[var(--ps-line)] bg-[var(--ps-ink)] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <SectionLabel
              index="10"
              label={t("ctaLabel")}
              className="!text-white/50 [&_span]:!text-[var(--ps-yellow)]"
            />
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
              {t("ctaTitle")}
            </h2>
            <p className="mt-4 text-white/70">{t("ctaBody")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/consultant"
                className="inline-flex h-12 items-center rounded-full bg-[var(--ps-primary)] px-6 text-sm font-semibold text-white"
              >
                {t("ctaPrimary")}
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center rounded-full border border-white/30 px-6 text-sm font-semibold text-white"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
          <div className="rounded-[var(--ps-radius-lg)] bg-white p-6 text-[var(--ps-ink)] md:p-8">
            <p className="text-sm font-semibold">{t("ctaFormTitle")}</p>
            <p className="mt-1 text-sm text-[var(--ps-body)]">{t("ctaFormBody")}</p>
            <div className="mt-5">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
