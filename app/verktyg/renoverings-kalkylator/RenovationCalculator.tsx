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
      vardagsrum: { min: 2000, max: 4000 },
      sovrum: { min: 1500, max: 3500 },
      kok: { min: 8000, max: 15000 },
      hall: { min: 2500, max: 5000 },
      kallare: { min: 4000, max: 8000 },
    };

    const materialMultiplier: Record<string, number> = {
      budget: 0.8,
      standard: 1.0,
      premium: 1.5,
    };
    
    const basePrice = roomPrices[formData.roomType];
    const multiplier = materialMultiplier[formData.material];
    
    const minBeforeRot = formData.area * basePrice.min * multiplier;
    const maxBeforeRot = formData.area * basePrice.max * multiplier;
    
    // ROT avdrag (30% på arbetskostnaden). 
    // Schablon för inre renovering: Arbetskostnaden är ofta runt 50%.
    const rotDeductionMin = (minBeforeRot * 0.5) * 0.3;
    const rotDeductionMax = (maxBeforeRot * 0.5) * 0.3;
    
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
              <span className="text-sm font-bold text-slate-700">Rummets yta (m²)</span>
              <div className="mt-1 flex items-center">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                  className="block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 px-4 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Typ av rum</span>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                className="mt-1 block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 px-4 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium"
              >
                <option value="vardagsrum">Vardagsrum / Allrum</option>
                <option value="sovrum">Sovrum</option>
                <option value="kok">Kök (helrenovering)</option>
                <option value="hall">Hall</option>
                <option value="kallare">Källare (inredning)</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Materialstandard</span>
              <select
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="mt-1 block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 px-4 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium"
              >
                <option value="budget">Budget (Enkla material, laminat/plastmatta)</option>
                <option value="standard">Standard (Mellanklass, parkett, målat)</option>
                <option value="premium">Premium (Massiva golv, exklusiva ytskikt)</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-extrabold text-white bg-[#0f172a] hover:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f172a] transition-all"
          >
            Beräkna renoveringskostnad
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-slate-50 border-t border-slate-200 p-6 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-black text-slate-900 mb-6 text-center">Prisuppskattning för din renovering</h3>
          
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
        </div>
      )}
    </div>
  );
}
