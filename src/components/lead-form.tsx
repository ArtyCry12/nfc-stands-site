"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  concept?: unknown;
  configSummary?: string;
  imageDataUrl?: string | null;
};

export function LeadForm({ concept, configSummary, imageDataUrl }: Props) {
  const t = useTranslations("contact");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "fallback" | "error">(
    "idle",
  );
  const [fallbackSummary, setFallbackSummary] = useState("");
  const [publicUrl, setPublicUrl] = useState(
    process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/touchform_md",
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message,
          concept,
          configSummary,
          imageDataUrl: imageDataUrl || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("ok");
        return;
      }
      setFallbackSummary(data.summary || "");
      setPublicUrl(data.publicUrl || publicUrl);
      setStatus("fallback");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-12 rounded-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">{t("phone")}</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+373 …"
          required
          className="h-12 rounded-full"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-24 rounded-2xl"
        />
      </div>
      <Button
        type="submit"
        disabled={status === "loading"}
        className="h-12 w-full rounded-full bg-[var(--tf-ink)] text-white hover:bg-black"
      >
        {status === "loading" ? "…" : t("send")}
      </Button>
      <a
        href={publicUrl}
        target="_blank"
        rel="noreferrer"
        className="block text-center text-sm text-[var(--tf-body)] underline-offset-4 hover:underline"
      >
        {t("telegram")}
      </a>
      {status === "ok" && (
        <p className="text-sm text-green-700" role="status">
          {t("success")}
        </p>
      )}
      {status === "fallback" && (
        <div className="space-y-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-950" role="status">
          <p>{t("fallback")}</p>
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-xl bg-white/80 p-3 text-xs">
            {fallbackSummary || t("copySummary")}
          </pre>
        </div>
      )}
      {status === "error" && (
        <p className="text-sm text-[var(--tf-error)]" role="alert">
          Error
        </p>
      )}
    </form>
  );
}
