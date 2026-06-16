"use client";

import React, { useState } from 'react';

export default function LeadForm({ resultData }: { resultData: any }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        email,
        quoteCategory: "badrumsrenovering",
        quoteRegion: resultData.region,
        analysisVerdict: "KALKYL",
        analysisSummary: {
          company: "Kalkylator",
          total: resultData.costs?.afterRot?.low || resultData.costs?.beforeRot?.low || 0,
          verdict: `Beräknat pris (ca): ${new Intl.NumberFormat('sv-SE').format(resultData.costs?.afterRot?.low || 0)} - ${new Intl.NumberFormat('sv-SE').format(resultData.costs?.afterRot?.high || 0)} kr`
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

      setSubmitted(true);
    } catch (err) {
      setError('Ett fel uppstod. Försök igen.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 p-6 rounded-xl border border-green-200 mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h3 className="text-xl font-bold text-green-800 mb-2">Rapporten är skickad!</h3>
        <p className="text-green-700">Kolla din inkorg för den fullständiga sammanställningen och våra bästa tips för att undvika fuskbyggare.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-xl font-bold text-slate-800 mb-2">Spara kalkylen & få tips</h3>
      <p className="text-slate-600 mb-4 text-sm">
        Ange din e-postadress för att få en sammanställning av beräkningen, plus våra 5 bästa tips för att undvika fuskbyggare när du begär in offerter för badrumsrenoveringen.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Din e-postadress"
          required
          className="flex-grow px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0f766e] focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0f766e] hover:bg-[#0d645e] text-white font-bold py-3 px-6 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {loading ? 'Skickar...' : 'Skicka till mig'}
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <p className="text-xs text-slate-400 mt-3">
        Vi delar aldrig din e-postadress. Helt gratis. Genom att klicka godkänner du att vi sparar din e-post för att skicka analysen.
      </p>
    </div>
  );
}
