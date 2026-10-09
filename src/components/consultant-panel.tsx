"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ConceptContract } from "@/lib/concept-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LeadForm } from "@/components/lead-form";

const STORAGE_KEY = "tf_concept_v1";

export function ConsultantPanel({ locale }: { locale: "ro" | "ru" | "en" }) {
  const t = useTranslations("consultant");
  const [business, setBusiness] = useState("");
  const [goal, setGoal] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [concept, setConcept] = useState<ConceptContract | null>(null);
  const [showHandoff, setShowHandoff] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, business, goal, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "fail");
      setConcept(data.concept);
      setMode(data.mode);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data.concept));
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <form onSubmit={onSubmit} className="space-y-4 rounded-[1.75rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-7">
        <div className="space-y-2">
          <Label htmlFor="business">{t("business")}</Label>
          <Input
            id="business"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder={t("businessPlaceholder")}
            required
            className="h-12 rounded-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goal">{t("goal")}</Label>
          <Textarea
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder={t("goalPlaceholder")}
            required
            className="min-h-24 rounded-2xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="context">{t("context")}</Label>
          <Input
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder={t("contextPlaceholder")}
            className="h-12 rounded-full"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-full bg-[var(--tf-ink)] text-white"
        >
          {loading ? t("loading") : t("ask")}
        </Button>
        {error && (
          <p className="text-sm text-[var(--tf-error)]" role="alert">
            {error}
          </p>
        )}
        {mode === "mock" && (
          <p className="text-xs text-[var(--tf-meta)]">{t("mockNotice")}</p>
        )}
      </form>

      <div className="space-y-4 rounded-[1.75rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-7">
        {!concept && (
          <p className="text-[var(--tf-body)]">{t("subtitle")}</p>
        )}
        {concept && (
          <>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--tf-meta)]">
                {t("ideas")}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold lowercase tracking-tight">
                {concept.concept.title}
              </h2>
              <p className="mt-2 text-[var(--tf-body)]">{concept.concept.summary}</p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[var(--tf-body)]">
                {concept.concept.whyItFits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--tf-meta)]">
                {t("offer")}
              </p>
              <p className="mt-2 text-sm text-[var(--tf-ink)]">{concept.offer.solution}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--tf-body)]">
                {concept.offer.composition.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {concept.unknowns.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--tf-meta)]">
                  {t("unknowns")}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--tf-body)]">
                  {concept.unknowns.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/concept"
                className="inline-flex h-12 items-center rounded-full bg-[var(--tf-ink)] px-5 text-sm font-semibold text-white"
              >
                {t("toConcept")}
              </Link>
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-full"
                onClick={() => setShowHandoff((v) => !v)}
              >
                {t("toTelegram")}
              </Button>
            </div>
            {showHandoff && (
              <div className="border-t pt-4">
                <LeadForm concept={concept} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
