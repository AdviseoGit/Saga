"use client";

import React, { useState, useMemo } from 'react';
import LeadForm from "@/components/Calculators/LeadForm";

type PaintType = "indoor" | "outdoor";
type Condition = "good" | "average" | "poor";
type Region = "stockholm" | "goteborg" | "malmo" | "other";

export default function MaleriarbeteCalculator() {
  const [paintType, setPaintType] = useState<PaintType>("indoor");
  const [sqm, setSqm] = useState<number>(50);
  const [condition, setCondition] = useState<Condition>("average");
  const [region, setRegion] = useState<Region>("other");
  const [hasCalculated, setHasCalculated] = useState(false);

  // Baspriser per m2 arbetsyta 2026
  const BASE_PRICE = {
    indoor: 180,  // Inomhusmålning
    outdoor: 280, // Fasadmålning (kräver ofta byggställning/stege, mer utrustning)
  };

  // Hur mycket extra underarbete krävs?
  const CONDITION_MULT = {
    good: 1.0,    // Bara tvätt/lätt slipning
    average: 1.3, // Normal spackling/skrapning
    poor: 1.8,    // Omfattande bredspackling eller renskrapning av fasad
  };

  const REGION_MULT = {
    stockholm: 1.20,
    goteborg: 1.10,
    malmo: 1.05,
    other: 1.0
  };

  // Materialkostnad per m2 i snitt (färg, tejp, papp)
  const MATERIAL_PRICE = {
    indoor: 60,
    outdoor: 90,
  };

  const calculatePrice = useMemo(() => {
    const baseLabor = BASE_PRICE[paintType] * sqm;
    const laborConditionAdj = baseLabor * CONDITION_MULT[condition];
    const finalLabor = laborConditionAdj * REGION_MULT[region];
    
    const materialCost = MATERIAL_PRICE[paintType] * sqm;
    
    // Pris innan rot
    const totalBeforeRot = finalLabor + materialCost;
    
    // ROT-avdrag (30% av arbetskostnaden)
    const rotDeduction = finalLabor * 0.30;
    const totalAfterRot = totalBeforeRot - rotDeduction;
    
    // Vi lägger på en min/max range för att det är ett estimat
    const minPrice = totalAfterRot * 0.85;
    const maxPrice = totalAfterRot * 1.15;

    return {
      min: Math.round(minPrice),
      max: Math.round(maxPrice),
      rot: Math.round(rotDeduction),
      type: paintType === 'indoor' ? 'Inomhusmålning' : 'Fasadmålning',
    };
  }, [paintType, sqm, condition, region]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasCalculated(true);
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
      {/* Formulär */}
      <form onSubmit={handleCalculate} className="space-y-6">
        
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Typ av målning</label>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setPaintType('indoor')}
              className={`flex-1 py-3 px-4 text-sm font-bold rounded-lg transition-all ${
                paintType === 'indoor' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Inomhus (Vägg/Tak)
            </button>
            <button
              type="button"
              onClick={() => setPaintType('outdoor')}
              className={`flex-1 py-3 px-4 text-sm font-bold rounded-lg transition-all ${
                paintType === 'outdoor' ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Fasadmålning
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Yta att måla (kvadratmeter)</label>
          <div className="relative">
            <input
              type="number"
              min="5"
              step="5"
              value={sqm}
              onChange={(e) => setSqm(Number(e.target.value))}
              className="block w-full rounded-xl border-slate-300 bg-slate-50 border-2 py-4 px-4 pr-12 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 font-bold text-lg outline-none transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">m²</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {paintType === 'indoor' ? 'Räkna väggarnas + takets yta (inte golvytan).' : 'Fasadens totala yta minus stora fönster och dörrar.'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Underlagets skick</label>
          <div className="flex flex-col gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setCondition('good')}
              className={`py-3 px-4 text-sm font-medium rounded-lg transition-all text-left ${
                condition === 'good' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'
              }`}
            >
              <strong>Bra skick</strong> - Kräver bara lätt tvätt och minimal spackling/skrapning.
            </button>
            <button
              type="button"
              onClick={() => setCondition('average')}
              className={`py-3 px-4 text-sm font-medium rounded-lg transition-all text-left ${
                condition === 'average' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'
              }`}
            >
              <strong>Normalskick</strong> - Normalt behov av spackling, slipning eller skrapning.
            </button>
            <button
              type="button"
              onClick={() => setCondition('poor')}
              className={`py-3 px-4 text-sm font-medium rounded-lg transition-all text-left ${
                condition === 'poor' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'
              }`}
            >
              <strong>Dåligt skick</strong> - Omfattande skrapning av lös färg eller mycket bredspackling krävs.
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Var i Sverige bor du?</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
            className="w-full p-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-0 outline-none transition-colors font-medium text-slate-700"
          >
            <option value="other">Övriga Sverige</option>
            <option value="stockholm">Stockholm (ca 20% dyrare)</option>
            <option value="goteborg">Göteborg (ca 10% dyrare)</option>
            <option value="malmo">Malmö (ca 5% dyrare)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0f172a] text-white font-extrabold text-lg py-5 rounded-xl hover:bg-[#1e293b] transition-all shadow-lg shadow-slate-900/20 active:scale-[0.98]"
        >
          Beräkna riktpris
        </button>
      </form>

      {/* Resultat */}
      <div>
        {hasCalculated ? (
          <div className="bg-white border-2 border-indigo-500 rounded-2xl p-6 sm:p-8 shadow-xl shadow-indigo-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-indigo-600 font-black text-sm uppercase tracking-widest mb-3">Estimerat riktpris 2026</h2>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl sm:text-5xl font-black text-slate-900">
                {new Intl.NumberFormat('sv-SE').format(calculatePrice.min)}
              </span>
              <span className="text-2xl text-slate-400 font-medium">–</span>
              <span className="text-4xl sm:text-5xl font-black text-slate-900">
                {new Intl.NumberFormat('sv-SE').format(calculatePrice.max)}
              </span>
              <span className="text-lg font-bold text-slate-600">kr</span>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-6 pb-6 border-b border-slate-100">
              Inklusive material, arbete & moms, <strong>efter ROT-avdrag</strong>.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm bg-slate-50 p-3 rounded-lg">
                <span className="text-slate-600 font-medium">Typ av arbete:</span>
                <span className="font-bold text-slate-900">{calculatePrice.type}</span>
              </div>
              <div className="flex justify-between text-sm bg-slate-50 p-3 rounded-lg">
                <span className="text-slate-600 font-medium">Uppskattat ROT-avdrag:</span>
                <span className="font-bold text-green-600">-{new Intl.NumberFormat('sv-SE').format(calculatePrice.rot)} kr</span>
              </div>
            </div>

            <LeadForm 
              toolName="maleriarbete-kalkylator" 
              calculationData={{
                estimated_price_min: calculatePrice.min,
                estimated_price_max: calculatePrice.max,
                region: region === 'stockholm' ? 'Stockholm' : region === 'goteborg' ? 'Göteborg' : region === 'malmo' ? 'Malmö' : 'Sverige',
              }}
            />
          </div>
        ) : (
          <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🎨</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Få ett pris direkt</h3>
            <p className="text-slate-500 font-medium max-w-sm">
              Fyll i uppgifterna och klicka på beräkna för att se vad måleriarbetet borde kosta 2026.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
