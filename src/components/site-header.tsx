"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { GoogleStripe } from "@/components/google-stripe";

export function SiteHeader() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const links = [
    { href: "/catalog", label: t("catalog") },
    { href: "/solutions", label: t("solutions") },
    { href: "/consultant", label: t("consultant") },
    { href: "/cases", label: t("cases") },
    { href: "/concept", label: t("concept") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-md">
      <GoogleStripe />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-display)] text-base font-bold tracking-tight"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/mark.svg"
            alt=""
            width={22}
            height={22}
            className="rounded-sm"
          />
          touchform<span className="text-[var(--tf-accent)]">.md</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-[var(--tf-body)] md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition hover:text-[var(--tf-ink)]",
                pathname.startsWith(link.href) &&
                  "font-medium text-[var(--tf-ink)]",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-full bg-[var(--tf-stage-soft)] px-1.5 py-1 text-xs">
            {locales.map((l) => (
              <Link
                key={l}
                href={pathname || "/"}
                locale={l}
                className={cn(
                  "rounded-full px-2 py-0.5 uppercase",
                  l === locale
                    ? "bg-[var(--tf-ink)] text-white"
                    : "text-[var(--tf-body)] hover:text-[var(--tf-ink)]",
                )}
              >
                {l === "ro"
                  ? tc("localeRo")
                  : l === "ru"
                    ? tc("localeRu")
                    : tc("localeEn")}
              </Link>
            ))}
          </div>
          <Link
            href="/contact"
            className="hidden h-10 items-center rounded-full bg-[var(--tf-ink)] px-4 text-sm font-semibold text-white transition hover:bg-black sm:inline-flex"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </header>
  );
}
