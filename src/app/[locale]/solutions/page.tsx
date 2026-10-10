import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("solutions");
  const th = await getTranslations("home");
  const n = await getTranslations("nav");

  const items = ["reviews", "menu", "page", "custom"] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6 md:pt-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tf-accent)]">
        {th("solutionsLabel")}
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--tf-body)]">{t("subtitle")}</p>
      <p className="mt-2 max-w-2xl text-sm text-[var(--tf-meta)]">
        {th("solutionsLead")}
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {items.map((key) => (
          <div
            key={key}
            className="rounded-2xl border border-[var(--border)] bg-white p-6 md:p-8"
          >
            <div className="mb-4 flex h-1 w-16 overflow-hidden rounded-full">
              <span className="flex-1 bg-[var(--tf-g-blue)]" />
              <span className="flex-1 bg-[var(--tf-g-red)]" />
              <span className="flex-1 bg-[var(--tf-g-yellow)]" />
              <span className="flex-1 bg-[var(--tf-g-green)]" />
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
              {t(`${key}.title`)}
            </h2>
            <p className="mt-3 text-[var(--tf-body)]">{t(`${key}.body`)}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/catalog"
          className="inline-flex h-12 items-center rounded-full border border-[var(--border)] px-6 text-sm font-semibold"
        >
          {n("catalog")}
        </Link>
        <Link
          href="/consultant"
          className="inline-flex h-12 items-center rounded-full bg-[var(--tf-ink)] px-6 text-sm font-semibold text-white"
        >
          {n("consultant")}
        </Link>
      </div>
    </div>
  );
}
