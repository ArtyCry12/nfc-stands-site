import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("solutions");
  const n = await getTranslations("nav");

  const items = ["reviews", "menu", "page", "custom"] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 md:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold lowercase tracking-tight">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--tf-body)]">{t("subtitle")}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((key) => (
          <div
            key={key}
            className="rounded-[1.75rem] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="mb-4 h-1 w-12 bg-[var(--tf-accent)]" />
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold lowercase">
              {t(`${key}.title`)}
            </h2>
            <p className="mt-2 text-[var(--tf-body)]">{t(`${key}.body`)}</p>
          </div>
        ))}
      </div>
      <Link
        href="/consultant"
        className="mt-8 inline-flex h-12 items-center rounded-full bg-[var(--tf-ink)] px-6 text-sm font-semibold text-white"
      >
        {n("consultant")}
      </Link>
    </div>
  );
}
