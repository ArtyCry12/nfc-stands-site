import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GoogleStripe } from "@/components/google-stripe";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");

  return (
    <footer className="mt-8 border-t border-[var(--ps-line)] bg-[var(--ps-surface)]">
      <GoogleStripe />
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <p className="text-3xl font-extrabold tracking-tight text-[var(--ps-ink)] md:text-5xl">
            Touchform<span className="text-[var(--ps-primary)]">.md</span>
          </p>
          <p className="mt-3 text-sm text-[var(--ps-body)]">{t("tagline")}</p>
          <p className="mt-1 text-xs text-[var(--ps-meta)]">{t("rights")}</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-[var(--ps-body)]">
          <Link href="/catalog" className="hover:text-[var(--ps-ink)]">
            {n("catalog")}
          </Link>
          <Link href="/solutions" className="hover:text-[var(--ps-ink)]">
            {n("solutions")}
          </Link>
          <Link href="/consultant" className="hover:text-[var(--ps-ink)]">
            {n("consultant")}
          </Link>
          <Link href="/cases" className="hover:text-[var(--ps-ink)]">
            {n("cases")}
          </Link>
          <Link href="/contact" className="hover:text-[var(--ps-ink)]">
            {n("contact")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
