import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConsultantPanel } from "@/components/consultant-panel";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function ConsultantPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("consultant");

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 md:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold lowercase tracking-tight">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--tf-body)]">{t("subtitle")}</p>
      <div className="mt-8">
        <ConsultantPanel locale={locale as Locale} />
      </div>
    </div>
  );
}
