import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConsultantPanel } from "@/components/consultant-panel";
import { SiteVideo } from "@/components/site-video";
import { VIDEOS } from "@/lib/videos";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function ConsultantPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("consultant");
  const th = await getTranslations("home");

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6 md:pt-14">
      <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tf-accent)]">
            {th("aiLabel")}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-xl text-[var(--tf-body)]">{t("subtitle")}</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
          <SiteVideo
            src={VIDEOS.consultant.src}
            poster={VIDEOS.consultant.poster}
            label={th("aiVideoLabel")}
            className="aspect-[16/10] w-full"
          />
        </div>
      </div>
      <div className="mt-10">
        <ConsultantPanel locale={locale as Locale} />
      </div>
    </div>
  );
}
