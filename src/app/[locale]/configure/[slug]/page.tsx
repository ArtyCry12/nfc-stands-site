import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Configurator } from "@/components/configurator";
import { catalog, getProduct } from "@/lib/catalog";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return catalog.map((p) => ({ slug: p.slug }));
}

export default async function ConfigurePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = getProduct(slug);
  if (!product) notFound();
  const t = await getTranslations("configure");

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:pt-14 md:px-6">
      <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--tf-meta)]">
        {t("title")}
      </p>
      <Configurator product={product} />
    </div>
  );
}
