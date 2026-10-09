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

type Turn = { role: "user" | "assistant"; content: string };
type Idea = { title: string; why: string };

export function ConsultantPanel({ locale }: { locale: "ro" | "ru" | "en" }) {
  const t = useTranslations("consultant");
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [history, setHistory] = useState<Turn[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [concept, setConcept] = useState<ConceptContract | null>(null);
  const [showHandoff, setShowHandoff] = useState(false);

  async function sendTurn(userText: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/consult/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          message: userText,
          history,
          quantity: quantity === "" ? undefined : Number(quantity),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "fail");

      const nextHistory: Turn[] = [
        ...history,
        { role: "user", content: userText },
        {
          role: "assistant",
          content: [data.reply, data.followUpQuestion].filter(Boolean).join("\n\n"),
        },
      ];
      setHistory(nextHistory);
      setIdeas(data.ideas || []);
      setFollowUp(data.followUpQuestion || null);
      if (data.concept) {
        setConcept(data.concept);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data.concept));
      }
      setMessage("");
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    await sendTurn(message.trim());
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-4 rounded-[1.75rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-7">
        <div className="max-h-80 space-y-3 overflow-y-auto rounded-2xl bg-[var(--background)] p-3">
          {history.length === 0 && (
            <p className="text-sm text-[var(--tf-body)]">{t("subtitle")}</p>
          )}
          {history.map((turn, i) => (
            <div
              key={`${turn.role}-${i}`}
              className={`rounded-2xl px-3 py-2 text-sm ${
                turn.role === "user"
                  ? "ml-8 bg-[var(--tf-ink)] text-white"
                  : "mr-8 bg-white text-[var(--tf-ink)] shadow-sm"
              }`}
            >
              {turn.content}
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="msg">{t("goal")}</Label>
            <Textarea
              id="msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                followUp || t("goalPlaceholder")
              }
              required
              className="min-h-24 rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="qty">{t("quantity")}</Label>
            <Input
              id="qty"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="2"
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
          <p className="text-xs text-[var(--tf-meta)]">{t("mockNotice")}</p>
        </form>
      </div>

      <div className="space-y-4 rounded-[1.75rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-7">
        {ideas.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--tf-meta)]">
              {t("ideas")}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--tf-body)]">
              {ideas.map((idea) => (
                <li key={idea.title}>
                  <strong>{idea.title}</strong> — {idea.why}
                </li>
              ))}
            </ul>
          </div>
        )}

        {concept && (
          <>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--tf-meta)]">
                {t("offer")}
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold lowercase tracking-tight">
                {concept.recommendation.concept_name}
              </h2>
              <p className="mt-2 text-sm text-[var(--tf-body)]">
                {concept.recommendation.offer_summary}
              </p>
              <p className="mt-3 text-sm text-[var(--tf-ink)]">
                {concept.commercial.price_type === "fixed-tier" &&
                concept.commercial.unit_price_mdl != null
                  ? `${concept.commercial.unit_price_mdl} MDL/u · total ${concept.commercial.total_price_mdl} MDL`
                  : t("customQuote")}
              </p>
            </div>
            {concept.production.open_questions.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--tf-meta)]">
                  {t("unknowns")}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--tf-body)]">
                  {concept.production.open_questions.map((item) => (
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
                <p className="mb-3 text-xs text-[var(--tf-meta)]">{t("consent")}</p>
                <LeadForm concept={concept} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
