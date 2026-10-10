import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionLabel } from "@/components/section-label";

type Props = { params: Promise<{ locale: string }> };

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("solutions");
  const s = await getTranslations("studio");
  const n = await getTranslations("nav");

  const items = ["reviews", "menu", "page", "custom"] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6 md:pt-14">
      <SectionLabel index="08" label={s("useCasesLabel")} />
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--ps-body)]">{t("subtitle")}</p>
      <p className="mt-2 max-w-2xl text-sm text-[var(--ps-meta)]">{s("useCasesBody")}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {items.map((key) => (
          <div
            key={key}
            className="rounded-[var(--ps-radius-lg)] border border-[var(--ps-line)] bg-white p-6 md:p-8"
          >
            <div className="mb-4 flex h-1 w-14 overflow-hidden rounded-full">
              <span className="flex-1 bg-[var(--tf-g-blue)]" />
              <span className="flex-1 bg-[var(--tf-g-red)]" />
              <span className="flex-1 bg-[var(--tf-g-yellow)]" />
              <span className="flex-1 bg-[var(--tf-g-green)]" />
            </div>
            <h2 className="text-2xl font-bold">{t(`${key}.title`)}</h2>
            <p className="mt-3 text-[var(--ps-body)]">{t(`${key}.body`)}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/catalog"
          className="inline-flex h-12 items-center rounded-full border border-[var(--ps-line)] px-6 text-sm font-semibold"
        >
          {n("catalog")}
        </Link>
        <Link
          href="/consultant"
          className="inline-flex h-12 items-center rounded-full bg-[var(--ps-primary)] px-6 text-sm font-semibold text-white"
        >
          {n("consultant")}
        </Link>
      </div>
    </div>
  );
}
