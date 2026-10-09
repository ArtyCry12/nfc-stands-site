import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { CASES } from "@/lib/knowledge-base";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export default async function CasePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const c = CASES.find((x) => x.slug === slug);
  if (!c) notFound();
  const t = await getTranslations("cases");
  const n = await getTranslations("nav");
  const loc = locale as Locale;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-28 md:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--tf-meta)]">
        {t("title")}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight">
        {c.name}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-[var(--tf-body)]">
        {c.summary[loc]}
      </p>
      {c.verified !== true && (
        <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-950">
          {loc === "ru"
            ? "Детали live-возможностей уточняются — без выдуманных метрик."
            : loc === "ro"
              ? "Detaliile capabilităților live se confirmă — fără metrici inventate."
              : "Live capability details are still being verified — no invented metrics."}
        </p>
      )}
      <Link
        href="/consultant"
        className="mt-8 inline-flex h-12 items-center rounded-full bg-[var(--tf-ink)] px-6 text-sm font-semibold text-white"
      >
        {n("consultant")}
      </Link>
    </div>
  );
}
