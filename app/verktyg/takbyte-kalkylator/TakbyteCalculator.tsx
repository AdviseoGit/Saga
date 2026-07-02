"use client";

import React, { useState } from "react";
import LeadForm from "@/components/Calculators/LeadForm";

interface FormData {
  roofArea: number;
  material: string;
}

export default function TakbyteCalculator() {
  const [formData, setFormData] = useState<FormData>({
    roofArea: 120,
    material: "betong",
  });
  
  const [result, setResult] = useState<{
    minBeforeRot: number;
    maxBeforeRot: number;
    minAfterRot: number;
    maxAfterRot: number;
  } | null>(null);

  const calculatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Priser per kvm (arbete + material)
    const prices: Record<string, { min: number, max: number }> = {
      betong: { min: 900, max: 1300 },
      tegel: { min: 1200, max: 1800 },
      plat_band: { min: 1400, max: 2200 },
      plat_profil: { min: 700, max: 1100 },
      papp: { min: 400, max: 800 }
    };
    
    const basePrice = prices[formData.material];
    
    const minBeforeRot = formData.roofArea * basePrice.min;
    const maxBeforeRot = formData.roofArea * basePrice.max;
    
    // ROT avdrag (30% på arbetskostnaden). 
    // Schablon: Arbetskostnaden utgör ca 40% av totala kostnaden.
    const rotDeductionMin = (minBeforeRot * 0.4) * 0.3;
    const rotDeductionMax = (maxBeforeRot * 0.4) * 0.3;
    
    const minAfterRot = minBeforeRot - rotDeductionMin;
    const maxAfterRot = maxBeforeRot - rotDeductionMax;

    setResult({
      minBeforeRot,
      maxBeforeRot,
      minAfterRot,
      maxAfterRot
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
      <div className="p-6 sm:p-10">
        <form onSubmit={calculatePrice} className="space-y-6">
          
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Takets area (m²)</span>
              <div className="mt-1 flex items-center">
                <input
                  type="number"
                  min="20"
                  step="10"
                  value={formData.roofArea}
                  onChange={(e) => setFormData({ ...formData, roofArea: Number(e.target.value) })}
                  className="block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 px-4 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Takmaterial</span>
              <select
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="mt-1 block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 px-4 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium"
              >
                <option value="betong">Betongpannor</option>
                <option value="tegel">Lertegel</option>
                <option value="plat_band">Bandtäckt plåt</option>
                <option value="plat_profil">Profilplåt (Tegelprofil/Klickfals)</option>
                <option value="papp">Takpapp/Ytpapp</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-extrabold text-white bg-[#0f172a] hover:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f172a] transition-all"
          >
            Beräkna pris för takbyte
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-slate-50 border-t border-slate-200 p-6 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-black text-slate-900 mb-6 text-center">Prisuppskattning för ditt nya tak</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Pris innan ROT-avdrag</p>
              <p className="text-2xl font-black text-slate-900">
                {Math.round(result.minBeforeRot).toLocaleString("sv-SE")} - {Math.round(result.maxBeforeRot).toLocaleString("sv-SE")} <span className="text-base font-semibold text-slate-500">kr</span>
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border-2 border-indigo-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">MED ROT-AVDRAG</div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Pris efter ROT-avdrag</p>
              <p className="text-2xl font-black text-indigo-600">
                {Math.round(result.minAfterRot).toLocaleString("sv-SE")} - {Math.round(result.maxAfterRot).toLocaleString("sv-SE")} <span className="text-base font-semibold text-slate-500">kr</span>
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 mb-8">
            <p className="font-semibold mb-1">Vad ingår i priset?</p>
            <p>Rivning av befintligt tak, underlagspapp, läkt, nytt ytskikt, plåtarbeten (vindskivor, ränndalar), takavvattning (hängrännor, stuprör) och taksäkerhet (snörasskydd, takbrygga vid behov), samt byggställning och avfallshantering.</p>
          </div>

          <LeadForm 
            toolName="takbyte-kalkylator"
            calculationData={{
              estimated_price_min: Math.round(result.minAfterRot),
              estimated_price_max: Math.round(result.maxAfterRot),
              region: "Sverige"
            }}
          />
        </div>
      )}
    </div>
  );
}
