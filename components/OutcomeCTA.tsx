"use client";

import React, { useState } from "react";
import type { SagaAnalysis, CompanyVerification } from "@/app/page";
import { marketPosition, resolveOutcome, type Outcome, type OutcomeAction } from "@/lib/outcomes";

const TONE = {
  red: {
    panel: "border-red-500/30 bg-red-500/10",
    eyebrow: "text-red-400",
    button: "bg-red-500 hover:bg-red-600 text-white",
  },
  amber: {
    panel: "border-amber-500/30 bg-amber-500/10",
    eyebrow: "text-amber-400",
    button: "bg-amber-500 hover:bg-amber-600 text-[#0f172a]",
  },
  emerald: {
    panel: "border-emerald-500/30 bg-emerald-500/10",
    eyebrow: "text-emerald-400",
    button: "bg-emerald-500 hover:bg-emerald-600 text-[#0f172a]",
  },
} as const;

/** GA4-event så att konverteringen per utfall går att mäta. */
function track(event: string, params: Record<string, unknown>) {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") gtag("event", event, params);
}

export default function OutcomeCTA(props: {
  analysis: SagaAnalysis;
  verification: CompanyVerification | null;
  verificationError: string | null;
}) {
  const { analysis, verification, verificationError } = props;
  const outcome: Outcome = resolveOutcome(analysis, verification, verificationError);
  const tone = TONE[outcome.tone];

  const [action, setAction] = useState<OutcomeAction | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function openForm(next: OutcomeAction) {
    setAction(next);
    setStatus("idle");
    setErrorMsg(null);
    setConsent(false);
    track("saga_cta_click", { outcome: outcome.id, intent: next.intent, verdict: analysis.verdict });
  }

  async function submit() {
    if (!action) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Ange en giltig e-postadress.");
      return;
    }
    if (!consent) {
      setErrorMsg("Du behöver godkänna att vi får kontakta dig.");
      return;
    }
    setStatus("loading");
    setErrorMsg(null);
    const { pct } = marketPosition(analysis);
    try {
      const r = await fetch("/api/partner-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: action.intent,
          outcome: outcome.id,
          name,
          email,
          phone,
          consent,
          category: analysis.quote?.category,
          region: analysis.quote?.region_guess,
          total: analysis.quote?.total_amount,
          verdict: analysis.verdict,
          marketLow: analysis.market_range?.low,
          marketHigh: analysis.market_range?.high,
          overMarketPct: pct,
          companyName: analysis.company?.name,
          companyOrgNr: analysis.company?.org_nr,
          redFlags: [...outcome.reasons, ...(analysis.red_flags ?? [])],
        }),
      });
      if (!r.ok) throw new Error("request failed");
      track("saga_lead_submit", {
        outcome: outcome.id,
        intent: action.intent,
        category: analysis.quote?.category,
        value: analysis.quote?.total_amount,
      });
      setStatus("done");
    } catch {
      setStatus("error");
      setErrorMsg("Något gick fel. Prova igen om en stund.");
    }
  }

  if (status === "done") {
    return (
      <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
        <p className="text-sm font-bold text-emerald-300">✓ Tack! Din förfrågan är skickad.</p>
        <p className="mt-1 text-sm text-slate-300">
          Vi hör av oss till {email} inom kort. Kolla gärna skräpposten om du inte ser vår bekräftelse.
        </p>
      </div>
    );
  }

  if (action) {
    return (
      <div className={`mt-4 rounded-2xl border p-4 ${tone.panel}`}>
        <p className="text-sm font-bold text-white">{action.formTitle}</p>
        <div className="mt-3 space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Namn (valfritt)"
            className="w-full rounded-xl bg-black/25 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-white/40"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@epost.se"
            required
            className="w-full rounded-xl bg-black/25 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-white/40"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Telefon (snabbast svar)"
            className="w-full rounded-xl bg-black/25 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-1 focus:ring-white/40"
          />
        </div>
        <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs leading-snug text-slate-300">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#6366f1]"
          />
          <span>{action.consentText}</span>
        </label>
        {errorMsg && <p className="mt-2 text-xs font-medium text-red-300">{errorMsg}</p>}
        <button
          type="button"
          onClick={submit}
          disabled={status === "loading"}
          className={`mt-3 w-full rounded-xl py-2.5 text-sm font-bold transition disabled:opacity-50 ${tone.button}`}
        >
          {status === "loading" ? "Skickar..." : "Skicka förfrågan →"}
        </button>
        <button
          type="button"
          onClick={() => setAction(null)}
          className="mt-2 w-full text-xs text-slate-400 hover:text-slate-300"
        >
          ← Tillbaka
        </button>
      </div>
    );
  }

  return (
    <div className={`mt-4 rounded-2xl border p-4 ${tone.panel}`}>
      <p className={`text-xs font-bold uppercase tracking-[0.2em] ${tone.eyebrow}`}>{outcome.eyebrow}</p>
      <p className="mt-1.5 text-base font-black text-white">{outcome.headline}</p>
      <p className="mt-1.5 text-sm leading-snug text-slate-300">{outcome.body}</p>
      {outcome.reasons.length > 0 && (
        <ul className="mt-2.5 space-y-1 text-sm text-slate-200">
          {outcome.reasons.map((r) => (
            <li key={r} className="flex gap-2">
              <span className="shrink-0 font-bold text-red-400">✗</span>
              {r}
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => openForm(outcome.primary)}
        className={`mt-3.5 w-full rounded-xl px-4 py-3 text-sm font-bold transition ${tone.button}`}
      >
        {outcome.primary.label}
      </button>
      {outcome.secondary && (
        <button
          type="button"
          onClick={() => openForm(outcome.secondary!)}
          className="mt-2 w-full rounded-xl bg-white/10 py-2.5 text-sm font-bold text-slate-200 transition hover:bg-white/20"
        >
          {outcome.secondary.label}
        </button>
      )}
      <p className="mt-2.5 text-[11px] text-slate-400">
        Kostnadsfritt och utan bindning. Vi säljer aldrig dina uppgifter vidare utan ditt godkännande.
      </p>
    </div>
  );
}
