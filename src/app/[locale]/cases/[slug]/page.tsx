import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { SiteVideo } from "@/components/site-video";
import { CASE_NARRATIVES, getCaseNarrative } from "@/lib/section-copy";
import { VIDEOS } from "@/lib/videos";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return CASE_NARRATIVES.map((c) => ({ slug: c.slug }));
}

export default async function CasePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const c = getCaseNarrative(slug);
  if (!c) notFound();
  const t = await getTranslations("cases");
  const n = await getTranslations("nav");
  const loc = locale as Locale;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 md:px-6 md:pt-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--tf-accent)]">
        {t("title")}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight md:text-5xl">
        {c.name}
      </h1>

      {c.videoKey === "padelPoint" ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)]">
          <SiteVideo
            src={VIDEOS.padelPoint.src}
            poster={VIDEOS.padelPoint.poster}
            label={`${c.name} video`}
            className="aspect-[16/9] w-full"
          />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={c.photo || "/media/refs/stands-desk.jpg"}
          alt=""
          className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
        />
      )}

      <dl className="mt-10 space-y-6">
        {(
          [
            ["hook", c.hook[loc]],
            ["insight", c.insight[loc]],
            ["example", c.example[loc]],
            ["benefit", c.benefit[loc]],
            ["next", c.next[loc]],
          ] as const
        ).map(([key, body]) => (
          <div key={key}>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--tf-accent)]">
              {t(key)}
            </dt>
            <dd className="mt-2 text-lg leading-relaxed text-[var(--tf-ink)]">
              {body}
            </dd>
          </div>
        ))}
      </dl>

      {c.verified !== true && (
        <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          {t("partial")}
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
