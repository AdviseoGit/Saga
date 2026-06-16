"use client";

import React, { useState } from 'react';

export default function LeadForm({ resultData }: { resultData: any }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Since we don't have a specific API endpoint configured for this yet,
    // we'll simulate a successful submission for now and log the data capture intent.
    // In a real scenario, this would POST to our Supabase or an API route.
    setTimeout(() => {
      console.log("Captured lead data:", { email, resultData });
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 p-6 rounded-xl border border-green-200 mt-8 text-center">
        <h3 className="text-xl font-bold text-green-800 mb-2">Rapporten är skickad!</h3>
        <p className="text-green-700">Kolla din inkorg för den fullständiga sammanställningen och nästa steg.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
      <h3 className="text-xl font-bold text-slate-800 mb-2">Få hela beräkningen som PDF</h3>
      <p className="text-slate-600 mb-4 text-sm">
        Ange din e-postadress för att få en detaljerad PDF-rapport av beräkningen, plus våra 5 bästa tips för att undvika fuskbyggare när du begär in offerter.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Din e-postadress"
          required
          className="flex-grow px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {loading ? 'Skickar...' : 'Skicka rapport'}
        </button>
      </form>
      <p className="text-xs text-slate-400 mt-3">
        Vi delar aldrig din e-postadress med någon annan. Helt gratis.
      </p>
    </div>
  );
}
