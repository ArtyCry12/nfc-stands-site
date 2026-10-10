import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CASE_NARRATIVES } from "@/lib/section-copy";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function CasesIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cases");
  const loc = locale as Locale;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6 md:pt-14">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--tf-body)]">{t("subtitle")}</p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {CASE_NARRATIVES.map((c) => (
          <Link
            key={c.slug}
            href={`/cases/${c.slug}`}
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition hover:shadow-[0_16px_40px_rgba(32,33,36,0.08)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.photo || "/media/refs/stands-desk.jpg"}
              alt=""
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="p-6">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
                {c.name}
              </h2>
              <p className="mt-3 text-sm text-[var(--tf-body)]">{c.hook[loc]}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
