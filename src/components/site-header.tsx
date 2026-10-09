"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const links = [
    { href: "/catalog", label: t("catalog") },
    { href: "/solutions", label: t("solutions") },
    { href: "/consultant", label: t("consultant") },
    { href: "/concept", label: t("concept") },
  ] as const;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6">
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full bg-[var(--tf-ink)] px-4 py-2.5 text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        <Link href="/" className="font-[family-name:var(--font-display)] text-base font-bold tracking-tight lowercase">
          touchform<span className="text-[var(--tf-accent)]">.md</span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-white/70 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition hover:text-white",
                pathname.startsWith(link.href) && "text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs">
            {locales.map((l) => (
              <Link
                key={l}
                href={pathname || "/"}
                locale={l}
                className={cn(
                  "rounded-full px-1.5 py-0.5 uppercase",
                  l === locale ? "bg-white text-black" : "text-white/70 hover:text-white",
                )}
              >
                {l === "ro" ? tc("localeRo") : l === "ru" ? tc("localeRu") : tc("localeEn")}
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            className="hidden h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90 sm:inline-flex"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </header>
  );
}
