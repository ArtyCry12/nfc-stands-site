"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ConceptContract } from "@/lib/concept-schema";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/lead-form";

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

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setConcept(JSON.parse(raw) as ConceptContract);
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
          <img src={image} alt={concept?.concept.title || "concept"} className="h-full w-full object-cover" />
        ) : (
          <div className="flex min-h-[320px] items-center justify-center p-8 text-center text-white/60">
            {concept ? concept.concept.title : t("needConcept")}
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
            <LeadForm concept={concept} imageDataUrl={image} />
          </div>
        )}
      </div>
    </div>
  );
}
