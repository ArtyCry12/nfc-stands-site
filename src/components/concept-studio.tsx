"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ConceptContract } from "@/lib/concept-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LeadForm } from "@/components/lead-form";
import { ProductVisual } from "@/components/product-visual";
import { QrPreview } from "@/components/qr-preview";

const STORAGE_KEY = "tf_concept_v1";

export function ConceptStudio() {
  const t = useTranslations("concept");
  const [concept, setConcept] = useState<ConceptContract | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitHit, setLimitHit] = useState(false);
  const [destUrl, setDestUrl] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ConceptContract;
        setConcept(parsed);
        if (parsed.design?.qr_destination_url) {
          setDestUrl(parsed.design.qr_destination_url);
        }
      }
    } catch {
      /* ignore */
    }
    fetch("/api/generate")
      .then((r) => r.json())
      .then((d) => setRemaining(d.remaining))
      .catch(() => setRemaining(null));
  }, []);

  async function generate() {
    if (!concept) {
      setError(t("needConcept"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setLimitHit(true);
        setRemaining(0);
        setError(t("limitHit"));
        return;
      }
      if (!res.ok) throw new Error(data.error || "fail");
      setImage(data.imageDataUrl);
      setMode(data.mode);
      setRemaining(data.remaining);
      if (data.concept) {
        setConcept(data.concept);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data.concept));
      }
      if (data.remaining === 0) setLimitHit(true);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="overflow-hidden rounded-[1.75rem] bg-[var(--tf-photo)] shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={concept?.recommendation.concept_name || "concept"}
            className="h-full w-full object-cover"
          />
        ) : concept ? (
          <ProductVisual
            productType={concept.recommendation.physical_product_type}
            colorId={concept.design.primary_color || "black"}
            material={concept.design.material}
            brandLabel="touchform.md"
            destinationUrl={destUrl || concept.design.qr_destination_url || ""}
            caption={concept.recommendation.concept_name}
            className="min-h-[320px]"
          />
        ) : (
          <div className="flex min-h-[320px] items-center justify-center p-8 text-center text-white/60">
            {t("needConcept")}
          </div>
        )}
      </div>
      <div className="space-y-4 rounded-[1.75rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-7">
        <p className="text-sm text-[var(--tf-body)]">{t("subtitle")}</p>
        {remaining !== null && (
          <p className="text-sm font-medium text-[var(--tf-ink)]">
            {t("remaining")}: {remaining}
          </p>
        )}
        {!concept && (
          <Link href="/consultant" className="text-sm underline">
            {t("needConcept")}
          </Link>
        )}
        {concept && (
          <div className="space-y-2">
            <Label htmlFor="concept-url">{t("destination")}</Label>
            <Input
              id="concept-url"
              type="url"
              placeholder="https://"
              value={destUrl}
              onChange={(e) => {
                const next = e.target.value;
                setDestUrl(next);
                setConcept((prev) => {
                  if (!prev) return prev;
                  const updated = {
                    ...prev,
                    design: {
                      ...prev.design,
                      qr_enabled: true,
                      qr_destination_url: next.trim() || null,
                    },
                  };
                  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                  return updated;
                });
              }}
              className="h-12 rounded-full"
            />
            <QrPreview url={destUrl} label="QR" />
          </div>
        )}
        <Button
          type="button"
          disabled={loading || !concept || remaining === 0}
          onClick={generate}
          className="h-12 w-full rounded-full bg-[var(--tf-ink)] text-white"
        >
          {loading ? t("loading") : t("generate")}
        </Button>
        {mode?.includes("svg") && (
          <p className="text-xs text-[var(--tf-meta)]">{t("fallbackNotice")}</p>
        )}
        <p className="text-xs text-[var(--tf-meta)]">{t("visualNote")}</p>
        {error && (
          <p className="text-sm text-[var(--tf-error)]" role="alert">
            {error}
          </p>
        )}
        {(limitHit || image) && concept && (
          <div className="border-t pt-4">
            <p className="mb-3 text-xs text-[var(--tf-meta)]">{t("consent")}</p>
            <LeadForm concept={concept} imageDataUrl={image} />
          </div>
        )}
      </div>
    </div>
  );
}
