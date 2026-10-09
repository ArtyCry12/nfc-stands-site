import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog";
import { locales } from "@/i18n/routing";

const paths = [
  "",
  "/catalog",
  "/solutions",
  "/consultant",
  "/concept",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:4317";
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${base}/${l}${path}`]),
          ),
        },
      });
    }
    for (const product of catalog) {
      const path = `/catalog/${product.slug}`;
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${base}/${l}${path}`]),
          ),
        },
      });
    }
  }

  return entries;
}
