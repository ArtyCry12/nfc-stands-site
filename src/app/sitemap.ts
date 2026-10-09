import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog";
import { locales } from "@/i18n/routing";
import { CASES } from "@/lib/knowledge-base";

const paths = [
  "",
  "/catalog",
  "/products",
  "/solutions",
  "/consultant",
  "/ai-studio",
  "/concept",
  "/cases",
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
    for (const c of CASES) {
      const path = `/cases/${c.slug}`;
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
