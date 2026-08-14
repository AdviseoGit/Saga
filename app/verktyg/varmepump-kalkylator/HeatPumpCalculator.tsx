"use client";

import React, { useState, useMemo } from 'react';
import LeadForm from "@/components/Calculators/LeadForm";

const SYSTEM_TYPES = {
  bergvarme: { min: 140000, max: 210000, name: "Bergvärme (Borrhål)", link: "/verktyg/bergvarme-kalkylator", eff: "Mycket hög (SCOP ~5.0)" },
  luftvatten: { min: 100000, max: 140000, name: "Luft/Vatten", link: "", eff: "Hög (SCOP ~4.0)" },
  franluft: { min: 80000, max: 115000, name: "Frånluftsvärme", link: "/verktyg/franluftvarme-kalkylator", eff: "Medel (SCOP ~3.5)" },
  luftluft: { min: 180000, max: 30000, name: "Luft/Luft (Enbart luftvärme)", link: "", eff: "Medel (SCOP ~4.0, ger ej varmvatten)" }
};

const HOUSE_SIZE_MULT = {
  small: { mult: 0.9, name: "< 100 m²" },
  medium: { mult: 1.0, name: "100 - 150 m²" },
  large: { mult: 1.15, name: "150 - 200 m²" },
  xlarge: { mult: 1.3, name: "> 200 m²" }
};

export default function HeatPumpCalculator() {
  const [systemType, setSystemType] = useState<keyof typeof SYSTEM_TYPES>('luftvatten');
  const [houseSize, setHouseSize] = useState<keyof typeof HOUSE_SIZE_MULT>('medium');
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculatePrice = useMemo(() => {
    const base = SYSTEM_TYPES[systemType];
    const size = HOUSE_SIZE_MULT[houseSize];
    
    // Luft/luft påverkas mindre av husets storlek procentuellt gällande installation, 
    // men man kanske behöver fler innedelar. För enkelhetens skull kör vi samma multiplikator.
    // Frånluft har snävare intervall.
    
    let minPrice = base.min * size.mult;
    let maxPrice = base.max * size.mult;
    
    // Justera för orimligheter i luft/luft (om det blev 30000 -> fix typo i max)
    if(systemType === 'luftluft') {
        minPrice = 18000 * size.mult;
        maxPrice = 30000 * size.mult;
    }

    return {
      min: Math.round(minPrice),
      max: Math.round(maxPrice),
      name: base.name,
      eff: base.eff,
      link: base.link
    };
  }, [systemType, houseSize]);

  const handleCalculate = () => {
    setHasCalculated(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Formulär */}
        <div className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Vilken typ av system funderar du på?</label>
            <div className="flex flex-col gap-3">
              {Object.entries(SYSTEM_TYPES).map(([key, data]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSystemType(key as keyof typeof SYSTEM_TYPES)}
                  className={`p-3 text-sm font-medium rounded-xl border-2 transition-all text-left ${
                    systemType === key
                      ? 'border-[#0f766e] bg-[#0f766e]/5 text-[#0f766e]'
                      : 'border-slate-200 text-slate-600 hover:border-[#0f766e]/30'
                  }`}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Hur stort är huset (uppvärmd yta)?</label>
            <select
              value={houseSize}
              onChange={(e) => setHouseSize(e.target.value as keyof typeof HOUSE_SIZE_MULT)}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-[#0f766e] focus:ring-0 outline-none transition-colors"
            >
              {Object.entries(HOUSE_SIZE_MULT).map(([key, data]) => (
                <option key={key} value={key}>{data.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-[#0f172a] text-white font-bold text-lg py-4 rounded-xl hover:bg-[#1e293b] transition-colors shadow-lg shadow-[#0f172a]/20"
          >
            Beräkna riktpris
          </button>
        </div>

        {/* Resultat */}
        <div>
          {hasCalculated ? (
            <div className="bg-white border-2 border-[#0f766e] rounded-2xl p-6 shadow-xl shadow-[#0f766e]/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-[#0f766e] font-bold text-sm uppercase tracking-wider mb-2">Ditt riktpris 2026</h2>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl sm:text-5xl font-black text-slate-900">
                  {new Intl.NumberFormat('sv-SE').format(calculatePrice.min)}
                </span>
                <span className="text-xl text-slate-500 font-medium">–</span>
                <span className="text-4xl sm:text-5xl font-black text-slate-900">
                  {new Intl.NumberFormat('sv-SE').format(calculatePrice.max)}
                </span>
                <span className="text-lg font-bold text-slate-600">kr</span>
              </div>
              <p className="text-sm text-slate-500 mb-6">Totalkostnad efter ROT-avdrag (inkl. installation & moms).</p>
              
              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">System:</span>
                  <span className="font-bold text-slate-900">{calculatePrice.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Effektivitet (Besparing):</span>
                  <span className="font-bold text-slate-900">{calculatePrice.eff}</span>
                </div>
              </div>
              
              {calculatePrice.link && (
                 <a href={calculatePrice.link} className="block mt-4 text-center w-full bg-slate-200 text-slate-800 font-medium py-3 rounded-xl hover:bg-slate-300 transition-colors">
                   Gå till specifik kalkylator för {calculatePrice.name.split(' ')[0]}
                 </a>
              )}

              <div className="mt-4">
                  <LeadForm 
                    toolName="varmepump-kalkylator" 
                    calculationData={{
                      estimated_price_min: calculatePrice.min,
                      estimated_price_max: calculatePrice.max,
                      system_type: systemType
                    }}
                  />
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <span className="text-4xl mb-4">🏠</span>
              <p className="font-medium">Välj system och storlek på huset för att se vad installationen borde kosta 2026.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
