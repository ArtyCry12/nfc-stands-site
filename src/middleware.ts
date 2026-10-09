import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales, routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALE_COOKIE = "NEXT_LOCALE";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    const header = request.headers.get("accept-language") || "";
    const preferred = locales.find((l) => header.toLowerCase().includes(l));
    const locale =
      cookieLocale && locales.includes(cookieLocale as (typeof locales)[number])
        ? cookieLocale
        : preferred || defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    const res = NextResponse.redirect(url);
    res.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  const response = intlMiddleware(request);
  const match = pathname.match(/^\/(ro|ru|en)(\/|$)/);
  if (match) {
    response.cookies.set(LOCALE_COOKIE, match[1], {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}

export const config = {
  matcher: ["/", "/(ro|ru|en)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
