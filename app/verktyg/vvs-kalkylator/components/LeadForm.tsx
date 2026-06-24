"use client";

import React, { useState } from 'react';

export default function LeadForm({ questions, toolName }: { questions: any[], toolName: string }) {
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Vänligen fyll i din e-postadress');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          tool: toolName,
          data: formData
        }),
      });

      if (!response.ok) {
        throw new Error('Något gick fel vid inskickandet');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Ett oväntat fel uppstod. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-3xl text-center">
        <h3 className="text-xl font-bold mb-2">Tack för din förfrågan!</h3>
        <p>Vi skickar en kalkyl baserad på dina val till din e-post inom kort.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mt-8">
      <h3 className="text-xl font-bold mb-4">Få en exakt prisuppskattning</h3>
      <p className="text-sm text-slate-600 mb-6">Fyll i detaljerna så skickar vi en kalkyl.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map((q, idx) => (
          <div key={idx}>
            <label className="block text-sm font-bold text-slate-700 mb-1">{q.label}</label>
            <select
              name={q.id}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white"
              required
            >
              <option value="">Välj ett alternativ</option>
              {q.options.map((opt: string, i: number) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Din e-postadress</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="din.epost@exempel.se"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors mt-2"
        >
          {loading ? 'Skickar...' : 'Skicka kalkyl'}
        </button>
      </form>
    </div>
  );
}
