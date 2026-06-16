"use client";

import React, { useState, useMemo } from 'react';

// Pricing model (2026 baseline estimates in SEK)
const BASE_COST = 30000; // Setup, planning, basic logistics
const COST_PER_SQM = 15000; // Base labor & structural materials per sqm

const MULTIPLIERS = {
  standard: {
    budget: 0.8,
    standard: 1.0,
    premium: 1.4,
  },
  region: {
    stockholm: 1.2,
    goteborg: 1.1,
    malmo: 1.05,
    other: 1.0,
  },
};

const EXTRAS = {
  floorHeating: 1200, // per sqm
  spotlights: 1500, // per sqm (rough est for ceiling work + spots)
  window: 8000, // fixed add-on if window manipulation
  movingPipes: 15000, // fixed add-on
};

import LeadForm from "./components/LeadForm";

export default function BathroomCalculator() {
  const [sqm, setSqm] = useState<number>(5);
  const [standard, setStandard] = useState<'budget' | 'standard' | 'premium'>('standard');
  const [region, setRegion] = useState<'stockholm' | 'goteborg' | 'malmo' | 'other'>('other');
  const [floorHeating, setFloorHeating] = useState(false);
  const [spotlights, setSpotlights] = useState(false);
  const [movingPipes, setMovingPipes] = useState(false);

  const [hasCalculated, setHasCalculated] = useState(false);

  const costs = useMemo(() => {
    // Basic structural & labor
    let base = BASE_COST + (sqm * COST_PER_SQM);
    
    // Apply standard multiplier
    base = base * MULTIPLIERS.standard[standard];
    
    // Add extras
    if (floorHeating) base += (sqm * EXTRAS.floorHeating);
    if (spotlights) base += (sqm * EXTRAS.spotlights);
    if (movingPipes) base += EXTRAS.movingPipes;

    // Apply regional multiplier
    const totalBeforeRot = base * MULTIPLIERS.region[region];

    // Rough ROT deduction estimate (approx 30% of total cost is usually eligible labor)
    // Max 50,000 SEK per person, we assume 1 person maxed out if high enough
    const estimatedLabor = totalBeforeRot * 0.65; // Labor is roughly 65% of a bathroom reno
    let rotDeduction = estimatedLabor * 0.30;
    if (rotDeduction > 50000) rotDeduction = 50000;

    const totalAfterRot = totalBeforeRot - rotDeduction;

    // Create a range (+/- 15%)
    return {
      beforeRot: {
        low: Math.round((totalBeforeRot * 0.85) / 1000) * 1000,
        high: Math.round((totalBeforeRot * 1.15) / 1000) * 1000,
      },
      afterRot: {
        low: Math.round((totalAfterRot * 0.85) / 1000) * 1000,
        high: Math.round((totalAfterRot * 1.15) / 1000) * 1000,
      }
    };
  }, [sqm, standard, region, floorHeating, spotlights, movingPipes]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasCalculated(true);
    // Optional: Log to analytics/database here in the future
  };

  return (
    <div className="rounded-[22px] border border-[#e2e8f0] bg-white p-6 sm:p-8 shadow-sm">
      <form onSubmit={handleCalculate} className="space-y-8">
        
        {/* Storlek & Standard */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-bold text-[#0f172a] mb-2">
              Storlek (kvadratmeter)
            </label>
            <input
              type="number"
              min="1"
              max="40"
              value={sqm}
              onChange={(e) => setSqm(Number(e.target.value))}
              className="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 font-medium text-[#0f172a] focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0f172a] mb-2">
              Materialstandard
            </label>
            <select
              value={standard}
              onChange={(e) => setStandard(e.target.value as any)}
              className="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 font-medium text-[#0f172a] focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 appearance-none bg-white"
            >
              <option value="budget">Budget (Standardkakel, enklare inredning)</option>
              <option value="standard">Mellan (Bra kvalitet, känt märke)</option>
              <option value="premium">Premium (Sten, exklusiv inredning)</option>
            </select>
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-bold text-[#0f172a] mb-2">
            Region
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { id: 'stockholm', label: 'Stockholm' },
              { id: 'goteborg', label: 'Göteborg' },
              { id: 'malmo', label: 'Malmö/Skåne' },
              { id: 'other', label: 'Övriga landet' },
            ].map((r) => (
              <label
                key={r.id}
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
                  region === r.id
                    ? 'border-[#6366f1] bg-[#6366f1]/10 text-[#6366f1]'
                    : 'border-[#cbd5e1] bg-white text-slate-600 hover:border-[#94a3b8]'
                }`}
              >
                <input
                  type="radio"
                  name="region"
                  value={r.id}
                  checked={region === r.id}
                  onChange={(e) => setRegion(e.target.value as any)}
                  className="sr-only"
                />
                {r.label}
              </label>
            ))}
          </div>
        </div>

        {/* Tillval */}
        <div>
          <label className="block text-sm font-bold text-[#0f172a] mb-3">
            Tillval & Extra arbeten
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-3 rounded-xl border border-[#cbd5e1] p-4 cursor-pointer hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={floorHeating}
                onChange={(e) => setFloorHeating(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-[#6366f1] focus:ring-[#6366f1]"
              />
              <span className="text-sm font-bold text-[#0f172a]">Golvvärme</span>
            </label>
            
            <label className="flex items-center gap-3 rounded-xl border border-[#cbd5e1] p-4 cursor-pointer hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={spotlights}
                onChange={(e) => setSpotlights(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-[#6366f1] focus:ring-[#6366f1]"
              />
              <span className="text-sm font-bold text-[#0f172a]">Spotlights (Sänkt tak)</span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-[#cbd5e1] p-4 cursor-pointer hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={movingPipes}
                onChange={(e) => setMovingPipes(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-[#6366f1] focus:ring-[#6366f1]"
              />
              <span className="text-sm font-bold text-[#0f172a]">Flytta avlopp/rör</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-[#e2e8f0]">
          <button
            type="submit"
            className="w-full rounded-2xl bg-[#6366f1] px-8 py-4 text-lg font-black text-white shadow-lg shadow-[#6366f1]/30 transition hover:bg-[#4f46e5]"
          >
            Beräkna Pris
          </button>
        </div>
      </form>

      {/* Result Section */}
      {hasCalculated && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="rounded-2xl bg-[#0f172a] p-6 sm:p-8 text-center text-white">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#cbd5e1]">
              Uppskattat totalpris (efter ROT)
            </h3>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-4xl sm:text-5xl font-black">
                {new Intl.NumberFormat('sv-SE').format(costs.afterRot.low)}
              </span>
              <span className="text-2xl text-[#94a3b8] font-medium">–</span>
              <span className="text-4xl sm:text-5xl font-black">
                {new Intl.NumberFormat('sv-SE').format(costs.afterRot.high)}
              </span>
              <span className="text-2xl font-bold ml-2">kr</span>
            </div>
            
            <p className="mt-4 text-sm font-medium text-[#94a3b8]">
              Pris innan ROT-avdrag: {new Intl.NumberFormat('sv-SE').format(costs.beforeRot.low)} – {new Intl.NumberFormat('sv-SE').format(costs.beforeRot.high)} kr
            </p>
          </div>
          
          <LeadForm resultData={{ sqm, standard, region, floorHeating, spotlights, movingPipes, costs }} />

          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <p className="text-sm font-bold text-slate-600">Har du redan fått en offert?</p>
            <a 
              href="/"
              className="rounded-xl bg-white border-2 border-[#e2e8f0] px-5 py-2 text-sm font-bold text-[#0f172a] transition hover:border-[#6366f1] hover:text-[#6366f1]"
            >
              Granska din offert här gratis →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}