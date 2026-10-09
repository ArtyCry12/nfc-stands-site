"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { CatalogProduct } from "@/lib/catalog";
import { estimatePrice } from "@/lib/catalog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeadForm } from "@/components/lead-form";
import { ProductVisual } from "@/components/product-visual";

export function Configurator({ product }: { product: CatalogProduct }) {
  const t = useTranslations("configure");
  const tc = useTranslations("catalog");
  const locale = useLocale() as "ro" | "ru" | "en";
  const [material, setMaterial] = useState(product.materials[0].id);
  const [color, setColor] = useState(product.colors[0].id);
  const [finish, setFinish] = useState(product.finishes[0].id);
  const [branding, setBranding] = useState(product.branding[0].id);
  const [scenario, setScenario] = useState(product.scenarios[0].id);

  const price = useMemo(
    () => estimatePrice(product, { material, color, finish, branding, scenario }),
    [product, material, color, finish, branding, scenario],
  );

  const labelOf = (
    list: CatalogProduct["materials"],
    id: string,
  ) => list.find((o) => o.id === id)?.label[locale] ?? id;

  const summary = [
    product.name[locale],
    `${t("material")}: ${labelOf(product.materials, material)}`,
    `${t("color")}: ${labelOf(product.colors, color)}`,
    `${t("finish")}: ${labelOf(product.finishes, finish)}`,
    `${t("branding")}: ${labelOf(product.branding, branding)}`,
    `${t("scenario")}: ${labelOf(product.scenarios, scenario)}`,
    price != null
      ? `${t("estimate")}: ${tc("from")} ${price} ${tc("currency")}`
      : tc("onRequest"),
  ].join("\n");

  const accent =
    color.includes("coral") ? "#FF7A45" : color.includes("white") ? "#F4F4F4" : "#FF7A45";

  function Field({
    label,
    value,
    onChange,
    options,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: CatalogProduct["materials"];
  }) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Select
          value={value}
          onValueChange={(next) => {
            if (typeof next === "string") onChange(next);
          }}
        >
          <SelectTrigger className="h-12 w-full rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.label[locale]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="overflow-hidden rounded-[1.75rem] bg-white p-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <ProductVisual accent={accent} label={product.slug} className="rounded-[1.25rem]" />
      </div>
      <div className="space-y-4 rounded-[1.75rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-7">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold lowercase tracking-tight">
          {product.name[locale]}
        </h1>
        <p className="text-[var(--tf-body)]">{product.summary[locale]}</p>
        <Field label={t("material")} value={material} onChange={setMaterial} options={product.materials} />
        <Field label={t("color")} value={color} onChange={setColor} options={product.colors} />
        <Field label={t("finish")} value={finish} onChange={setFinish} options={product.finishes} />
        <Field label={t("branding")} value={branding} onChange={setBranding} options={product.branding} />
        <Field label={t("scenario")} value={scenario} onChange={setScenario} options={product.scenarios} />
        <div className="rounded-2xl bg-[var(--tf-stage-soft)] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--tf-meta)]">
            {t("estimate")}
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold">
            {price != null
              ? `${tc("from")} ${price} ${tc("currency")}`
              : tc("onRequest")}
          </p>
          <p className="mt-1 text-xs text-[var(--tf-meta)]">{t("estimateNote")}</p>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">{t("summary")}</p>
          <LeadForm configSummary={summary} />
        </div>
      </div>
    </div>
  );
}
