"use client";

import React, { useState } from "react";
import LeadForm from "@/components/Calculators/LeadForm";

interface FormData {
  area: number;
  roomType: string;
  material: string;
}

export default function RenovationCalculator() {
  const [formData, setFormData] = useState<FormData>({
    area: 20,
    roomType: "vardagsrum",
    material: "standard",
  });
  
  const [result, setResult] = useState<{
    minBeforeRot: number;
    maxBeforeRot: number;
    minAfterRot: number;
    maxAfterRot: number;
  } | null>(null);

  const calculatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Priser per kvm för olika rumstyper
    const roomPrices: Record<string, { min: number, max: number }> = {
      "vardagsrum": { min: 2000, max: 4000 },
      "sovrum": { min: 1500, max: 3500 },
      "hall": { min: 2500, max: 5000 },
      "kok": { min: 8000, max: 15000 },
    };

    const materialMultipliers: Record<string, number> = {
      "budget": 0.8,
      "standard": 1.0,
      "premium": 1.5,
    };

    const baseMin = roomPrices[formData.roomType].min * formData.area * materialMultipliers[formData.material];
    const baseMax = roomPrices[formData.roomType].max * formData.area * materialMultipliers[formData.material];

    // ROT deduction assumption (30% on labor, assuming labor is roughly 40% of total)
    const rotFactor = 0.88; // simplified 12% total deduction

    setResult({
      minBeforeRot: baseMin,
      maxBeforeRot: baseMax,
      minAfterRot: baseMin * rotFactor,
      maxAfterRot: baseMax * rotFactor,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <form onSubmit={calculatePrice} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Vad ska du renovera?</label>
          <select 
            className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-[#0f766e] focus:ring-0 outline-none transition-colors"
            value={formData.roomType}
            onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
          >
            <option value="vardagsrum">Vardagsrum / Allrum</option>
            <option value="sovrum">Sovrum</option>
            <option value="hall">Hall / Entré</option>
            <option value="kok">Kök (ytskikt & montering)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Yta ({formData.area} m²)
          </label>
          <input 
            type="range" 
            min="5" 
            max="100" 
            step="1" 
            className="w-full accent-[#0f766e]"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: parseInt(e.target.value) })}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Standard & Material</label>
          <div className="grid grid-cols-3 gap-2">
            <button 
              type="button"
              className={`p-2 text-sm font-medium rounded-lg border-2 transition-all ${
                formData.material === 'budget' 
                  ? 'border-[#0f766e] bg-[#0f766e]/5 text-[#0f766e]' 
                  : 'border-slate-200 text-slate-600 hover:border-[#0f766e]/30'
              }`}
              onClick={() => setFormData({ ...formData, material: 'budget' })}
            >
              Budget
            </button>
            <button 
              type="button"
              className={`p-2 text-sm font-medium rounded-lg border-2 transition-all ${
                formData.material === 'standard' 
                  ? 'border-[#0f766e] bg-[#0f766e]/5 text-[#0f766e]' 
                  : 'border-slate-200 text-slate-600 hover:border-[#0f766e]/30'
              }`}
              onClick={() => setFormData({ ...formData, material: 'standard' })}
            >
              Standard
            </button>
            <button 
              type="button"
              className={`p-2 text-sm font-medium rounded-lg border-2 transition-all ${
                formData.material === 'premium' 
                  ? 'border-[#0f766e] bg-[#0f766e]/5 text-[#0f766e]' 
                  : 'border-slate-200 text-slate-600 hover:border-[#0f766e]/30'
              }`}
              onClick={() => setFormData({ ...formData, material: 'premium' })}
            >
              Premium
            </button>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#0f172a] text-white font-bold text-lg py-4 rounded-xl hover:bg-[#1e293b] transition-colors shadow-lg shadow-[#0f172a]/20 mt-4"
        >
          Beräkna riktpris
        </button>
      </form>

      {result && (
        <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-bold text-[#0f172a] mb-4 text-center">Uppskattat Prisintervall</h3>
          
          <div className="bg-[#f8fafc] rounded-xl p-6 border border-slate-200 mb-6 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10 text-4xl">🛠️</div>
            
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Efter ROT-avdrag</p>
            <p className="text-3xl md:text-4xl font-black text-[#0f766e] tabular-nums tracking-tight">
              {result.minAfterRot.toLocaleString('sv-SE')} – {result.maxAfterRot.toLocaleString('sv-SE')} kr
            </p>
            
            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-center gap-6">
              <div>
                <span className="block text-xs text-slate-500 font-bold mb-1">INNAN ROT:</span>
                <span className="text-slate-700 font-medium">{result.minBeforeRot.toLocaleString('sv-SE')} – {result.maxBeforeRot.toLocaleString('sv-SE')} kr</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 mb-8">
            <p className="font-semibold mb-1">Vad ingår i priset?</p>
            <p>I kalkylen ingår normal förarbetning, ytskikt (golv, väggar, tak) och listverk. För kök ingår skåp, bänkskivor och vitvaror i motsvarande klass. El och VVS-dragningar är schablonberäknade.</p>
          </div>

          <LeadForm 
            toolName="renoverings-kalkylator"
            calculationData={{
              estimated_price_min: Math.round(result.minAfterRot),
              estimated_price_max: Math.round(result.maxAfterRot),
              region: "Sverige"
            }}
          />

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
