"use client";

import React, { useState } from "react";
import LeadForm from "../badrumsrenovering-kalkylator/components/LeadForm";

interface FormData {
  area: number;
  material: string;
  complexity: string;
}

export default function RoofCalculator() {
  const [formData, setFormData] = useState<FormData>({
    area: 100,
    material: "betongpannor", // default
    complexity: "standard",
  });
  
  const [result, setResult] = useState<{
    min: number;
    max: number;
    withRotMin: number;
    withRotMax: number;
  } | null>(null);

  const calculatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Base prices per sqm (Material + Labor total) based on typical 2025/2026 Swedish market rates
    const materialPrices: Record<string, { min: number; max: number }> = {
      papptak: { min: 400, max: 700 }, // Ytpapp/tjärpapp
      betongpannor: { min: 800, max: 1300 }, // Standard betong
      tegelpannor: { min: 1000, max: 1600 }, // Lertegel
      klickplat: { min: 900, max: 1400 }, // Klickplåt / tp20
      bandtackning: { min: 1500, max: 2500 }, // Bandtäckt plåt
    };

    const complexityMultipliers: Record<string, number> = {
      enkel: 0.9,    // Enkelt sadeltak, inga kupor
      standard: 1.0, // Normalt, kanske en skorsten
      avancerad: 1.3 // Valmat tak, många kupor/vinklar, brant
    };

    const baseMin = materialPrices[formData.material].min * formData.area;
    const baseMax = materialPrices[formData.material].max * formData.area;

    const mult = complexityMultipliers[formData.complexity];
    
    let totalMin = baseMin * mult;
    let totalMax = baseMax * mult;

    // Roughly estimate labor as 50% of the total cost
    const laborMin = totalMin * 0.5;
    const laborMax = totalMax * 0.5;

    // ROT deduction is 30% of labor cost
    const rotMin = laborMin * 0.3;
    const rotMax = laborMax * 0.3;

    // Cap ROT at 50,000 SEK (per person, assuming 1 person here for simplicity)
    const cappedRotMin = Math.min(rotMin, 50000);
    const cappedRotMax = Math.min(rotMax, 50000);

    setResult({
      min: Math.round(totalMin),
      max: Math.round(totalMax),
      withRotMin: Math.round(totalMin - cappedRotMin),
      withRotMax: Math.round(totalMax - cappedRotMax),
    });
  };

  return (
    <>
      <div className="rounded-[22px] border border-[#e2e8f0] bg-white p-6 sm:p-8 shadow-sm">
        <form onSubmit={calculatePrice} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-[#0f172a] mb-2">
                Takets yta (kvadratmeter)
              </label>
              <input
                type="number"
                min="10"
                max="1000"
                className="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 font-medium text-[#0f172a] focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: parseInt(e.target.value) || 0 })
                }
              />
              <p className="text-xs text-slate-500 mt-2">Takytan är ofta ca 1.3-1.5x husets bottenyta.</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#0f172a] mb-2">
                Materialval
              </label>
              <select
                className="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 font-medium text-[#0f172a] focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 appearance-none bg-white"
                value={formData.material}
                onChange={(e) =>
                  setFormData({ ...formData, material: e.target.value })
                }
              >
                <option value="papptak">Papptak (Ytpapp/Tjärpapp)</option>
                <option value="betongpannor">Betongpannor (Vanligast)</option>
                <option value="tegelpannor">Klassiskt Lertegel</option>
                <option value="klickplat">Plåttak (Klickplåt/Profilplåt)</option>
                <option value="bandtackning">Bandtäckt plåt (Exklusivt)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0f172a] mb-2">
              Takets komplexitet
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
                  formData.complexity === "enkel"
                    ? "border-[#6366f1] bg-[#6366f1]/10 text-[#6366f1]"
                    : "border-[#cbd5e1] bg-white text-slate-600 hover:border-[#94a3b8]"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="complexity"
                  value="enkel"
                  checked={formData.complexity === "enkel"}
                  onChange={() => setFormData({ ...formData, complexity: "enkel" })}
                />
                Enkelt sadeltak
              </label>
              
              <label
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
                  formData.complexity === "standard"
                    ? "border-[#6366f1] bg-[#6366f1]/10 text-[#6366f1]"
                    : "border-[#cbd5e1] bg-white text-slate-600 hover:border-[#94a3b8]"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="complexity"
                  value="standard"
                  checked={formData.complexity === "standard"}
                  onChange={() => setFormData({ ...formData, complexity: "standard" })}
                />
                Standard (t.ex. 1 skorsten)
              </label>
              
              <label
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
                  formData.complexity === "avancerad"
                    ? "border-[#6366f1] bg-[#6366f1]/10 text-[#6366f1]"
                    : "border-[#cbd5e1] bg-white text-slate-600 hover:border-[#94a3b8]"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="complexity"
                  value="avancerad"
                  checked={formData.complexity === "avancerad"}
                  onChange={() => setFormData({ ...formData, complexity: "avancerad" })}
                />
                Avancerat (Kupor, vinklar)
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
      </div>

      {result && (
        <div className="mt-8 overflow-hidden rounded-[22px] border border-[#e2e8f0] bg-white shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-r from-[#6366f1] to-[#4f46e5] px-6 py-8 text-center text-white">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">
              Uppskattat totalpris (Inkl. moms)
            </h3>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-4xl sm:text-6xl font-black">
                {result.withRotMin.toLocaleString("sv-SE")}
              </span>
              <span className="text-2xl font-medium text-white/80">—</span>
              <span className="text-4xl sm:text-6xl font-black">
                {result.withRotMax.toLocaleString("sv-SE")}
              </span>
              <span className="text-xl font-bold ml-2">kr</span>
            </div>
            <p className="mt-3 text-sm font-medium text-white/90 bg-white/20 inline-block px-3 py-1 rounded-full">
              Priset ovan är med ROT-avdrag
            </p>
          </div>
          
          <div className="p-6 sm:p-8 bg-slate-50">
            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Pris utan ROT-avdrag:</span>
              <span className="font-bold text-slate-900">
                {result.min.toLocaleString("sv-SE")} – {result.max.toLocaleString("sv-SE")} kr
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Uppskattat ROT-avdrag:</span>
              <span className="font-bold text-[#16a34a]">
                -{(result.min - result.withRotMin).toLocaleString("sv-SE")} – -{(result.max - result.withRotMax).toLocaleString("sv-SE")} kr
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-600 font-medium">Material & Arbete:</span>
              <span className="font-bold text-slate-900">Ingår i priset</span>
            </div>
          </div>
          
          {/* Lead Capture Form Integration */}
          <LeadForm 
            toolName="Takbyte Kalkylator"
            calculationData={{
              area: formData.area,
              material: formData.material,
              complexity: formData.complexity,
              estimated_price_min: result.withRotMin,
              estimated_price_max: result.withRotMax
            }}
          />
        </div>
      )}
    </>
  );
}
