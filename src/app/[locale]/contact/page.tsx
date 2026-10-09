import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/lead-form";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-xl px-4 pb-16 pt-28 md:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold lowercase tracking-tight">
        {t("title")}
      </h1>
      <p className="mt-3 text-[var(--tf-body)]">{t("subtitle")}</p>
      <div className="mt-8 rounded-[1.75rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-7">
        <LeadForm />
      </div>
    </div>
  );
}
