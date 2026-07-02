"use client";

import React, { useState, useMemo } from 'react';
import LeadForm from "@/components/Calculators/LeadForm";

// Prismodell värmepumpar 2026 (SEK, inkl. moms, efter rotavdrag)
const PUMP_PRICES = {
  luftluft: { min: 18000, max: 28000, name: "Luft/Luftvärmepump", rotBase: 0.3 },
  luftvatten: { min: 90000, max: 130000, name: "Luft/Vattenvärmepump", rotBase: 0.3 },
  bergvarme: { min: 140000, max: 190000, name: "Bergvärmepump", rotBase: 0.35 },
  franluft: { min: 60000, max: 90000, name: "Frånluftsvärmepump", rotBase: 0.3 }
};

const INSTALL_DIFFICULTY_MULT = {
  easy: 1.0,
  standard: 1.1,
  hard: 1.25
};

const REGION_MULT = {
  stockholm: 1.15,
  goteborg: 1.08,
  malmo: 1.05,
  other: 1.0
};

export default function HeatPumpCalculator() {
  const [pumpType, setPumpType] = useState<keyof typeof PUMP_PRICES>('luftluft');
  const [difficulty, setDifficulty] = useState<keyof typeof INSTALL_DIFFICULTY_MULT>('standard');
  const [region, setRegion] = useState<keyof typeof REGION_MULT>('other');
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculatePrice = useMemo(() => {
    const basePump = PUMP_PRICES[pumpType];
    const diffMult = INSTALL_DIFFICULTY_MULT[difficulty];
    const regMult = REGION_MULT[region];
    
    // Grundkostnad material och installation innan rot
    const minCost = basePump.min * diffMult * regMult;
    const maxCost = basePump.max * diffMult * regMult;
    
    return {
      min: Math.round(minCost),
      max: Math.round(maxCost),
      pumpName: basePump.name
    };
  }, [pumpType, difficulty, region]);

  const handleCalculate = () => {
    setHasCalculated(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Formulär */}
        <div className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Typ av värmepump</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(PUMP_PRICES).map(([key, data]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPumpType(key as keyof typeof PUMP_PRICES)}
                  className={`p-3 text-sm font-medium rounded-xl border-2 transition-all ${
                    pumpType === key
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
            <label className="block text-sm font-bold text-slate-700 mb-2">Installation & Förutsättningar</label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setDifficulty('easy')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  difficulty === 'easy' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Enkelt (standard)
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('standard')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  difficulty === 'standard' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('hard')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  difficulty === 'hard' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Komplicerad
              </button>
            </div>
            {pumpType === 'bergvarme' && difficulty === 'hard' && (
               <p className="text-xs text-amber-600 mt-2">Komplicerad borrning (djupt till berg eller trångt) kan driva upp priset avsevärt.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Var i Sverige bor du?</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as keyof typeof REGION_MULT)}
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-[#0f766e] focus:ring-0 outline-none transition-colors"
            >
              <option value="other">Övriga Sverige</option>
              <option value="stockholm">Stockholm (ca 15% dyrare)</option>
              <option value="goteborg">Göteborg (ca 8% dyrare)</option>
              <option value="malmo">Malmö (ca 5% dyrare)</option>
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
                  <span className="text-slate-600">Vald system:</span>
                  <span className="font-bold text-slate-900">{calculatePrice.pumpName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">ROT-avdrag:</span>
                  <span className="font-bold text-green-700">Inräknat</span>
                </div>
              </div>

              <LeadForm 
                toolName="varmepump-kalkylator" 
                calculationData={{
                  estimated_price_min: calculatePrice.min,
                  estimated_price_max: calculatePrice.max,
                  region: region === 'stockholm' ? 'Stockholm' : region === 'goteborg' ? 'Göteborg' : region === 'malmo' ? 'Malmö' : 'Sverige',
                }}
              />
            </div>
          ) : (
            <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <span className="text-4xl mb-4">🌡️</span>
              <p className="font-medium">Fyll i uppgifterna och klicka på beräkna för att se vad din värmepump borde kosta 2026.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Content SEO Section below calculator */}
      <div className="mt-20 max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Att tänka på när du granskar offerter för värmepumpar</h2>
        <div className="prose prose-slate">
          <p>
            En ny värmepump är en av de största investeringarna du kan göra i din bostad. Priserna varierar kraftigt 
            beroende på typ av pump och dina lokala förutsättningar. För bergvärme kan kostnaden för själva borrningen 
            utgöra en betydande del av totalpriset.
          </p>
          <ul className="space-y-2 mt-4 text-slate-700">
            <li><strong>Ingår demontering?</strong> Kolla om bortforsling av den gamla pannan/pumpen ingår i offerten.</li>
            <li><strong>Arbetskostnad vs Material:</strong> Skatteverket har schablonregler för värmepumpar (ofta utgör arbetskostnaden 30-35% av totalbeloppet som ROT kan dras på).</li>
            <li><strong>Märke och garanti:</strong> Ett premiummärke (som NIBE, Thermia, Daikin) är oftast dyrare men kan ge längre garanti.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}