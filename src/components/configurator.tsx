"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { CatalogProduct } from "@/lib/catalog";
import { priceStandardReviewStand } from "@/lib/pricing";
import { buildTelegramShareUrl } from "@/lib/telegram";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadForm } from "@/components/lead-form";
import { ProductVisual } from "@/components/product-visual";
import { QrPreview } from "@/components/qr-preview";

export function Configurator({ product }: { product: CatalogProduct }) {
  const t = useTranslations("configure");
  const tc = useTranslations("catalog");
  const locale = useLocale() as "ro" | "ru" | "en";
  const [color, setColor] = useState(product.colors[0]?.id ?? "black");
  const [experience, setExperience] = useState(
    product.experiences[0]?.id ?? "google-reviews",
  );
  const [quantity, setQuantity] = useState(2);
  const [destination, setDestination] = useState("");

  const isStandard = product.pricing === "standard-tiers";
  const priced = useMemo(() => {
    if (!isStandard) return null;
    try {
      return priceStandardReviewStand(quantity);
    } catch {
      return null;
    }
  }, [isStandard, quantity]);

  const colorLabel =
    product.colors.find((c) => c.id === color)?.label[locale] ?? color;
  const expLabel =
    product.experiences.find((e) => e.id === experience)?.label[locale] ??
    experience;

  const summary = [
    product.name[locale],
    `${t("color")}: ${colorLabel}`,
    `${t("scenario")}: ${expLabel}`,
    destination ? `URL: ${destination}` : null,
    isStandard && priced
      ? `${t("estimate")}: ${priced.unitPriceMdl} MDL/u × ${priced.quantity} = ${priced.totalPriceMdl} MDL (${priced.priceSource})`
      : tc("onRequest"),
    "QR will be code-generated from the validated URL (not AI-drawn).",
  ]
    .filter(Boolean)
    .join("\n");

  const shareUrl = buildTelegramShareUrl(
    `Touchform.md order\n${summary}\n(Please send this message to complete the enquiry.)`,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="overflow-hidden rounded-[1.75rem] bg-white p-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <ProductVisual
          productType={product.slug}
          colorId={color}
          brandLabel="touchform.md"
          label={product.slug}
          destinationUrl={destination}
          className="rounded-[1.25rem]"
          caption={`${product.name[locale]} · ${colorLabel}`}
        />
      </div>
      <div className="space-y-4 rounded-[1.75rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-7">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold lowercase tracking-tight">
          {product.name[locale]}
        </h1>
        <p className="text-[var(--tf-body)]">{product.summary[locale]}</p>

        <div className="space-y-2">
          <Label>{t("color")}</Label>
          <Select
            value={color}
            onValueChange={(next) => {
              if (typeof next === "string") setColor(next);
            }}
          >
            <SelectTrigger className="h-12 w-full rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {product.colors.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.label[locale]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-[var(--tf-meta)]">{t("colorNote")}</p>
        </div>

        <div className="space-y-2">
          <Label>{t("scenario")}</Label>
          <Select
            value={experience}
            onValueChange={(next) => {
              if (typeof next === "string") setExperience(next);
            }}
          >
            <SelectTrigger className="h-12 w-full rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {product.experiences.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.label[locale]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dest">{t("destination")}</Label>
          <Input
            id="dest"
            type="url"
            placeholder="https://"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="h-12 rounded-full"
          />
          <p className="text-xs text-[var(--tf-meta)]">{t("qrNote")}</p>
          <QrPreview url={destination} label="QR" />
        </div>

        {isStandard && (
          <div className="space-y-2">
            <Label htmlFor="qty">{t("quantity")}</Label>
            <Input
              id="qty"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="h-12 rounded-full"
            />
          </div>
        )}

        <div className="rounded-2xl bg-[var(--tf-stage-soft)] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--tf-meta)]">
            {t("estimate")}
          </p>
          {isStandard && priced ? (
            <>
              <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold">
                {priced.unitPriceMdl} MDL / {tc("unit")}
              </p>
              <p className="text-sm text-[var(--tf-ink)]">
                {t("total")}: {priced.totalPriceMdl} MDL ({priced.quantity} ×{" "}
                {priced.unitPriceMdl})
              </p>
            </>
          ) : (
            <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold">
              {tc("onRequest")}
            </p>
          )}
          <p className="mt-1 text-xs text-[var(--tf-meta)]">{t("estimateNote")}</p>
        </div>

        {isStandard ? (
          <div className="space-y-3">
            <a
              href={shareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--tf-ink)] text-sm font-semibold text-white"
            >
              {t("orderTelegram")}
            </a>
            <p className="text-xs text-[var(--tf-meta)]">{t("orderTelegramNote")}</p>
            <details className="text-sm">
              <summary className="cursor-pointer font-medium">{t("summary")}</summary>
              <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-[var(--background)] p-3 text-xs">
                {summary}
              </pre>
            </details>
          </div>
        ) : (
          <div>
            <p className="mb-2 text-sm font-medium">{t("summary")}</p>
            <LeadForm configSummary={summary} />
          </div>
        )}
      </div>
    </div>
  );
}
