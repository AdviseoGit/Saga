"use client";

import React, { useState } from "react";
import LeadForm from "../badrumsrenovering-kalkylator/components/LeadForm";

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
    min: number;
    max: number;
    withRotMin: number;
    withRotMax: number;
  } | null>(null);

  const calculatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Base prices per sqm (Material + Labor total)
    const basePrices: Record<string, { min: number; max: number }> = {
      vardagsrum: { min: 1500, max: 3000 },
      sovrum: { min: 1200, max: 2500 },
      kok: { min: 12000, max: 25000 },
      badrum: { min: 20000, max: 35000 },
      kallare: { min: 5000, max: 12000 },
    };

    const materialMultipliers: Record<string, number> = {
      budget: 0.8,
      standard: 1.0,
      premium: 1.5,
    };

    const baseMin = basePrices[formData.roomType].min * formData.area;
    const baseMax = basePrices[formData.roomType].max * formData.area;

    const mult = materialMultipliers[formData.material];
    
    let totalMin = baseMin * mult;
    let totalMax = baseMax * mult;

    // Roughly estimate labor as 50% of the total cost
    const laborMin = totalMin * 0.5;
    const laborMax = totalMax * 0.5;

    // ROT deduction is 30% of labor cost
    const rotMin = laborMin * 0.3;
    const rotMax = laborMax * 0.3;

    // Cap ROT at 50,000 SEK (per person)
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
                Rumstyp
              </label>
              <select
                className="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 font-medium text-[#0f172a] focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 appearance-none bg-white"
                value={formData.roomType}
                onChange={(e) =>
                  setFormData({ ...formData, roomType: e.target.value })
                }
              >
                <option value="vardagsrum">Vardagsrum / Allrum</option>
                <option value="sovrum">Sovrum</option>
                <option value="kok">Kök</option>
                <option value="badrum">Badrum</option>
                <option value="kallare">Källare (inkl dräneringsrisk)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0f172a] mb-2">
                Yta (kvadratmeter)
              </label>
              <input
                type="number"
                min="1"
                max="500"
                className="w-full rounded-xl border border-[#cbd5e1] px-4 py-3 font-medium text-[#0f172a] focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0f172a] mb-2">
              Materialstandard
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
                  formData.material === "budget"
                    ? "border-[#6366f1] bg-[#6366f1]/10 text-[#6366f1]"
                    : "border-[#cbd5e1] bg-white text-slate-600 hover:border-[#94a3b8]"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="material"
                  value="budget"
                  checked={formData.material === "budget"}
                  onChange={() => setFormData({ ...formData, material: "budget" })}
                />
                Budget
              </label>
              
              <label
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
                  formData.material === "standard"
                    ? "border-[#6366f1] bg-[#6366f1]/10 text-[#6366f1]"
                    : "border-[#cbd5e1] bg-white text-slate-600 hover:border-[#94a3b8]"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="material"
                  value="standard"
                  checked={formData.material === "standard"}
                  onChange={() => setFormData({ ...formData, material: "standard" })}
                />
                Standard
              </label>
              
              <label
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
                  formData.material === "premium"
                    ? "border-[#6366f1] bg-[#6366f1]/10 text-[#6366f1]"
                    : "border-[#cbd5e1] bg-white text-slate-600 hover:border-[#94a3b8]"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="material"
                  value="premium"
                  checked={formData.material === "premium"}
                  onChange={() => setFormData({ ...formData, material: "premium" })}
                />
                Premium
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
            toolName="Renoveringskalkylator"
            calculationData={{
              area: formData.area,
              roomType: formData.roomType,
              material: formData.material,
              estimated_price_min: result.withRotMin,
              estimated_price_max: result.withRotMax
            }}
          />
        </div>
      )}
    </>
  );
}
