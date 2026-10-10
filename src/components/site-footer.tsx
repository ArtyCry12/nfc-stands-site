import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GoogleStripe } from "@/components/google-stripe";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");

  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[var(--tf-stage-soft)]">
      <GoogleStripe />
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-[var(--tf-ink)] md:text-5xl">
            touchform<span className="text-[var(--tf-accent)]">.md</span>
          </p>
          <p className="mt-3 text-sm text-[var(--tf-body)]">{t("tagline")}</p>
          <p className="mt-1 text-xs text-[var(--tf-meta)]">{t("rights")}</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-[var(--tf-body)]">
          <Link href="/catalog" className="hover:text-[var(--tf-ink)]">
            {n("catalog")}
          </Link>
          <Link href="/solutions" className="hover:text-[var(--tf-ink)]">
            {n("solutions")}
          </Link>
          <Link href="/consultant" className="hover:text-[var(--tf-ink)]">
            {n("consultant")}
          </Link>
          <Link href="/cases" className="hover:text-[var(--tf-ink)]">
            {n("cases")}
          </Link>
          <Link href="/contact" className="hover:text-[var(--tf-ink)]">
            {n("contact")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
