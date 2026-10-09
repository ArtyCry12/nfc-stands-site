import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CASES } from "@/lib/knowledge-base";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function CasesIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cases");
  const loc = locale as Locale;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 md:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold lowercase tracking-tight">
        {t("title")}
      </h1>
      <p className="mt-3 text-[var(--tf-body)]">{t("subtitle")}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {CASES.map((c) => (
          <Link
            key={c.slug}
            href={`/cases/${c.slug}`}
            className="rounded-[1.75rem] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold">
              {c.name}
            </h2>
            <p className="mt-3 text-sm text-[var(--tf-body)]">{c.summary[loc]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
