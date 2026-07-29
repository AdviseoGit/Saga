"use client";

import React, { useState } from 'react';

export default function LeadForm({ resultData, toolName, calculationData }: { resultData?: any, toolName?: string, calculationData?: any }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<"standard" | "match">("standard");

  const category = toolName ? toolName : "fasadrenovering";
  const lowValue = calculationData ? calculationData.estimated_price_min : (resultData?.costs?.afterRot?.low || resultData?.costs?.beforeRot?.low || 0);
  const highValue = calculationData ? calculationData.estimated_price_max : (resultData?.costs?.afterRot?.high || resultData?.costs?.beforeRot?.high || 0);
  const region = calculationData ? calculationData.region || "Sverige" : resultData?.region;
  const priceRangeString = `${new Intl.NumberFormat('sv-SE').format(lowValue)} - ${new Intl.NumberFormat('sv-SE').format(highValue)} kr`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (mode === "match" && !consent) {
        setError("Du behöver godkänna att vi får kontakta dig.");
        return;
    }

    setLoading(true);
    setError('');

    try {
      if (mode === "standard") {
        const payload = {
            email,
            quoteCategory: category,
            quoteRegion: region,
            analysisVerdict: "KALKYL",
            analysisSummary: {
            company: "Kalkylator",
            total: lowValue,
            verdict: `Beräknat pris (ca): ${priceRangeString}`
            }
        };

        const res = await fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error("Kunde inte skicka rapporten");
        }
      } else {
        const payload = {
            intent: "match_verified",
            outcome: "kalkyl",
            name,
            email,
            phone,
            consent,
            category: category,
            region: region,
            total: lowValue,
            verdict: `Kalkyl: ${priceRangeString}`,
            marketLow: lowValue,
            marketHigh: highValue,
            overMarketPct: 0,
            companyName: "Kalkylator",
            companyOrgNr: "",
            redFlags: []
        };
        const res = await fetch("/api/partner-leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error("Kunde inte skicka förfrågan");
        }
      }
      setSubmitted(true);
    } catch (err) {
      setError('Ett fel uppstod. Försök igen.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    if (mode === "standard") {
        return (
            <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/30 mt-8 text-center">
                <h3 className="text-lg font-bold text-emerald-700 mb-2">✓ Rapporten är skickad!</h3>
                <p className="text-emerald-700/80 text-sm">Kolla din inkorg för den fullständiga sammanställningen och våra bästa tips för att undvika fuskbyggare.</p>
            </div>
        );
    }
    return (
      <div className="bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/30 mt-8 text-center">
        <h3 className="text-lg font-bold text-emerald-700 mb-2">✓ Tack! Din förfrågan är skickad.</h3>
        <p className="text-emerald-700/80 text-sm">Vi hör av oss till dig inom kort. Kolla gärna skräpposten om du inte ser vår bekräftelse.</p>
      </div>
    );
  }

  if (mode === "match") {
    return (
        <div className="bg-amber-500/10 p-6 rounded-2xl border border-amber-500/30 mt-8">
            <h3 className="text-lg font-bold text-[#0f172a] mb-1">Få offerter från kvalitetskontrollerade företag</h3>
            <p className="text-slate-600 mb-4 text-sm">
                Saga hjälper dig att ta in offerter från företag i ditt område som är kontrollerade mot Bolagsverket och Skatteverket. Kostnadsfritt och utan bindning.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Namn"
                    className="w-full rounded-xl bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-slate-400 border border-slate-200 outline-none focus:ring-2 focus:ring-[#0f766e]/30 focus:border-[#0f766e]"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-postadress (för offert och bekräftelse)"
                    required
                    className="w-full rounded-xl bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-slate-400 border border-slate-200 outline-none focus:ring-2 focus:ring-[#0f766e]/30 focus:border-[#0f766e]"
                />
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Telefonnummer (frivilligt, snabbast svar)"
                    className="w-full rounded-xl bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-slate-400 border border-slate-200 outline-none focus:ring-2 focus:ring-[#0f766e]/30 focus:border-[#0f766e]"
                />
                
                <label className="mt-2 flex cursor-pointer items-start gap-2 text-xs leading-snug text-slate-500">
                    <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-amber-500 rounded border-slate-300"
                    />
                    <span>Jag godkänner att Fråga Saga delar mina uppgifter med max 3 kvalitetssäkrade företag för att få in offerter.</span>
                </label>
                
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                
                <div className="flex gap-2 mt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-[#0f172a] font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 text-sm shadow-sm"
                    >
                        {loading ? 'Skickar...' : 'Ja, hjälp mig få in bra offerter →'}
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => setMode("standard")}
                    className="mt-1 w-full text-xs text-slate-400 hover:text-slate-500"
                >
                    ← Avbryt och spara bara kalkylen
                </button>
            </form>
        </div>
    );
  }

  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mt-8">
      <h3 className="text-xl font-bold text-slate-800 mb-2">Spara kalkylen & få tips</h3>
      <p className="text-slate-600 mb-4 text-sm">
        Ange din e-postadress för att få en sammanställning av beräkningen, plus våra 5 bästa tips för att undvika fuskbyggare när du begär in offerter.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Din e-postadress"
          required
          className="flex-grow rounded-xl bg-white px-4 py-3 text-sm text-[#0f172a] placeholder:text-slate-400 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap disabled:opacity-50 text-sm shadow-sm"
        >
          {loading ? 'Skickar...' : 'Skicka till mig'}
        </button>
      </form>
      
      <div className="mt-6 pt-5 border-t border-slate-200/60 text-center">
        <p className="text-sm font-medium text-slate-700 mb-3">Redo att gå vidare med projektet?</p>
        <button
            type="button"
            onClick={() => setMode("match")}
            className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-500/30 font-bold py-3 px-6 rounded-xl transition-colors text-sm"
        >
            Få offerter från kvalitetskontrollerade företag →
        </button>
      </div>
      
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      <p className="text-xs text-slate-400 mt-4 text-center">
        Vi delar aldrig din e-postadress utan ditt godkännande. Helt gratis.
      </p>
    </div>
  );
}
