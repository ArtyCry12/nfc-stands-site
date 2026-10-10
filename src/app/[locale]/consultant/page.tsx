import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConsultantPanel } from "@/components/consultant-panel";
import { SectionLabel } from "@/components/section-label";
import { SiteVideo } from "@/components/site-video";
import { VIDEOS } from "@/lib/videos";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function ConsultantPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("consultant");
  const s = await getTranslations("studio");

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6 md:pt-14">
      <div className="grid items-end gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SectionLabel index="05" label={s("aiLabel")} />
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[var(--ps-ink)] md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--ps-body)]">
            {t("subtitle")}
          </p>
        </div>
        <div className="overflow-hidden rounded-[var(--ps-radius-lg)] border border-[var(--ps-line)]">
          <SiteVideo
            src={VIDEOS.consultant.src}
            poster={VIDEOS.consultant.poster}
            label={s("aiVideoLabel")}
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
