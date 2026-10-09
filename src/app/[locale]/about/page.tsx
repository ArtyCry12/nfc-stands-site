import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-28 md:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold lowercase tracking-tight">
        {t("title")}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-[var(--tf-body)]">{t("body")}</p>
      <div className="mt-10 h-px w-full bg-[var(--tf-accent)]" />
      <p className="mt-6 font-[family-name:var(--font-display)] text-xl lowercase text-[var(--tf-ink)]">
        touchform.md · chișinău
      </p>
    </div>
  );
}
