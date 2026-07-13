"use client";

import React, { useState, useMemo } from 'react';
import LeadForm from "@/components/Calculators/LeadForm";

// Prismodell jordvärme 2026 (SEK, inkl. moms, innan rotavdrag)
// Jordvärme delas upp i Pump & Grävning/Installation
const PUMP_SIZES = {
  small: { min: 80000, max: 100000, name: "Mindre villa (upp till 120 kvm)" },
  medium: { min: 95000, max: 120000, name: "Mellanstor villa (120-180 kvm)" },
  large: { min: 110000, max: 140000, name: "Stor villa (över 180 kvm)" }
};

// Grävning av kollektorslang (ca 300-500 meter)
const DIGGING_COSTS = {
  small: { min: 25000, max: 35000, name: "Mindre tomt (ca 300m slang)" },
  medium: { min: 35000, max: 45000, name: "Mellanstor tomt (ca 400m slang)" },
  large: { min: 45000, max: 55000, name: "Stor tomt (ca 500m slang)" }
};

const SOIL_TYPE_MULT = {
  easy: 1.0, // Lerjord/vanlig jord
  standard: 1.15, // Mycket sten/rötter
  hard: 1.3 // Svårgrävt, ev maskinkrävande eller trångt
};

const REGION_MULT = {
  stockholm: 1.15,
  goteborg: 1.08,
  malmo: 1.05,
  other: 1.0
};

export default function JordvarmeCalculator() {
  const [houseSize, setHouseSize] = useState<keyof typeof PUMP_SIZES>('medium');
  const [soilType, setSoilType] = useState<keyof typeof SOIL_TYPE_MULT>('easy');
  const [region, setRegion] = useState<keyof typeof REGION_MULT>('other');
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculatePrice = useMemo(() => {
    const basePump = PUMP_SIZES[houseSize];
    const baseDigging = DIGGING_COSTS[houseSize];
    const soilMult = SOIL_TYPE_MULT[soilType];
    const regMult = REGION_MULT[region];
    
    // Grundkostnad material (Pump)
    const pumpMin = basePump.min;
    const pumpMax = basePump.max;

    // Arbetskostnad och maskin (Grävning + Installation)
    // Grävning och installation multipliceras med marktyp och region
    const laborMin = baseDigging.min * soilMult * regMult;
    const laborMax = baseDigging.max * soilMult * regMult;
    
    // ROT avdrag (35% schablon för värmepump på totalbeloppet är vanligt)
    // 30% ROT-avdrag på dessa 35%
    const rotDeductionMin = (pumpMin + laborMin) * 0.35 * 0.30;
    const rotDeductionMax = (pumpMax + laborMax) * 0.35 * 0.30;

    const totalMinAfterRot = (pumpMin + laborMin) - rotDeductionMin;
    const totalMaxAfterRot = (pumpMax + laborMax) - rotDeductionMax;
    
    return {
      min: Math.round(totalMinAfterRot),
      max: Math.round(totalMaxAfterRot),
      houseName: basePump.name
    };
  }, [houseSize, soilType, region]);

  const handleCalculate = () => {
    setHasCalculated(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Formulär */}
        <div className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Storlek på huset</label>
            <div className="flex flex-col gap-3">
              {Object.entries(PUMP_SIZES).map(([key, data]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setHouseSize(key as keyof typeof PUMP_SIZES)}
                  className={`p-3 text-sm font-medium rounded-xl border-2 transition-all text-left ${
                    houseSize === key
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
            <label className="block text-sm font-bold text-slate-700 mb-2">Markförhållanden (Tomt)</label>
            <div className="flex flex-col gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSoilType('easy')}
                className={`py-2 px-3 text-sm font-medium rounded-lg transition-colors text-left ${
                  soilType === 'easy' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Lättgrävt (Lerjord/Mjuk mark)
              </button>
              <button
                type="button"
                onClick={() => setSoilType('standard')}
                className={`py-2 px-3 text-sm font-medium rounded-lg transition-colors text-left ${
                  soilType === 'standard' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Normalt (Blandad mark/Stenig jord)
              </button>
              <button
                type="button"
                onClick={() => setSoilType('hard')}
                className={`py-2 px-3 text-sm font-medium rounded-lg transition-colors text-left ${
                  soilType === 'hard' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Svårgrävt (Sten/Rötter/Trångt)
              </button>
            </div>
            {soilType === 'hard' && (
               <p className="text-xs text-amber-600 mt-2">Svåra markförhållanden som kräver extra maskinell bearbetning driver upp arbetskostnaden markant.</p>
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
              <p className="text-sm text-slate-500 mb-6">Totalkostnad efter ROT-avdrag (inkl. grävning, pump & moms).</p>
              
              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Baserat på:</span>
                  <span className="font-bold text-slate-900">{calculatePrice.houseName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">ROT-avdrag:</span>
                  <span className="font-bold text-green-700">Inräknat (Schablon)</span>
                </div>
              </div>

              <LeadForm 
                toolName="jordvarme-kalkylator" 
                calculationData={{
                  estimated_price_min: calculatePrice.min,
                  estimated_price_max: calculatePrice.max,
                  region: region === 'stockholm' ? 'Stockholm' : region === 'goteborg' ? 'Göteborg' : region === 'malmo' ? 'Malmö' : 'Sverige',
                }}
              />
            </div>
          ) : (
            <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <span className="text-4xl mb-4">🌱</span>
              <p className="font-medium">Fyll i uppgifterna och klicka på beräkna för att se vad din jordvärmeanläggning borde kosta 2026.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Content SEO Section below calculator */}
      <div className="mt-20 max-w-3xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Att tänka på när du granskar offerter för jordvärme</h2>
        <div className="prose prose-slate">
          <p>
            Att installera jordvärme är ofta billigare än bergvärme eftersom man slipper borra, men det kräver istället att du har tillräckligt med yta på tomten för att gräva ner kollektorslangen (ofta 300–500 meter). Det är viktigt att jämföra vad som faktiskt ingår i offerterna.
          </p>
          <ul className="space-y-2 mt-4 text-slate-700">
            <li><strong>Grävning och återställning:</strong> Ingår grovåterställning av tomten efter grävning? Vem sår nytt gräs? (Ofta ingår enbart grovåterställning).</li>
            <li><strong>Tomtens storlek och form:</strong> Har du ytan som krävs? Finns hinder som stenmurar eller asfalterade ytor som påverkar dragningen?</li>
            <li><strong>ROT-avdrag schablon:</strong> För jordvärme, precis som bergvärme, tillämpar Skatteverket ofta en schablon där 35% av totalkostnaden anses vara arbetskostnad. Du får dra av 30% av den summan.</li>
            <li><strong>Demontering av gammal panna:</strong> Ingår det att de forslar bort din gamla värmepanna?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
