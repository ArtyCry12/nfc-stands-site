import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");

  return (
    <footer className="mt-16 border-t border-white/10 bg-[var(--tf-ink)] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-end md:justify-between md:px-6">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl font-bold lowercase tracking-tight">
            touchform<span className="text-[var(--tf-accent)]">.md</span>
          </p>
          <p className="mt-2 text-sm text-white/60">{t("tagline")}</p>
          <p className="mt-1 text-xs text-white/40">{t("rights")}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-white/70">
          <Link href="/catalog" className="hover:text-white">
            {n("catalog")}
          </Link>
          <Link href="/consultant" className="hover:text-white">
            {n("consultant")}
          </Link>
          <Link href="/about" className="hover:text-white">
            {n("about")}
          </Link>
          <Link href="/contact" className="hover:text-white">
            {n("contact")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
