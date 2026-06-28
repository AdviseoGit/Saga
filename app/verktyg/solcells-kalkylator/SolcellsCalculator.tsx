"use client";

import React, { useState } from "react";
import LeadForm from "../badrumsrenovering-kalkylator/components/LeadForm";

interface FormData {
  electricityUsage: number;
  roofArea: number;
}

export default function SolcellsCalculator() {
  const [formData, setFormData] = useState<FormData>({
    electricityUsage: 15000,
    roofArea: 50,
  });
  
  const [result, setResult] = useState<{
    systemSizeKWp: number;
    estimatedProduction: number;
    priceBeforeDeduction: number;
    priceAfterDeduction: number;
  } | null>(null);

  const calculatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    
    const kWpPerSqm = 0.21;
    const pricePerKWp = 16000;
    const productionPerKWp = 950;
    
    const maxSystemSizeKWp = formData.roofArea * kWpPerSqm;
    const systemSizeKWp = Math.round(maxSystemSizeKWp * 10) / 10;
    const estimatedProduction = Math.round(systemSizeKWp * productionPerKWp);
    const priceBeforeDeduction = systemSizeKWp * pricePerKWp;
    const priceAfterDeduction = priceBeforeDeduction * 0.80;
    
    setResult({
      systemSizeKWp,
      estimatedProduction,
      priceBeforeDeduction,
      priceAfterDeduction
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
      <div className="p-6 sm:p-10">
        <form onSubmit={calculatePrice} className="space-y-6">
          
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Årlig elförbrukning (kWh)</span>
              <div className="mt-1 flex items-center">
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={formData.electricityUsage}
                  onChange={(e) => setFormData({ ...formData, electricityUsage: Number(e.target.value) })}
                  className="block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 px-4 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">Påverkar inte takytan, men används för att bedöma hur stor del av din el du kan täcka.</p>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Tillgänglig takyta för solceller (m²)</span>
              <div className="mt-1 flex items-center">
                <input
                  type="number"
                  min="10"
                  step="5"
                  value={formData.roofArea}
                  onChange={(e) => setFormData({ ...formData, roofArea: Number(e.target.value) })}
                  className="block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 px-4 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium"
                />
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-extrabold text-white bg-[#0f172a] hover:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f172a] transition-all"
          >
            Beräkna pris & effekt
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-slate-50 border-t border-slate-200 p-6 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-black text-slate-900 mb-6 text-center">Uppskattad kalkyl för din solcellsanläggning</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Systemets storlek</p>
              <p className="text-2xl font-black text-slate-900">{result.systemSizeKWp.toLocaleString("sv-SE")} <span className="text-base font-semibold text-slate-500">kWp</span></p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Årlig produktion (uppskattning)</p>
              <p className="text-2xl font-black text-indigo-600">{result.estimatedProduction.toLocaleString("sv-SE")} <span className="text-base font-semibold text-slate-500">kWh/år</span></p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Pris innan avdrag</p>
              <p className="text-xl font-bold text-slate-700">{Math.round(result.priceBeforeDeduction).toLocaleString("sv-SE")} <span className="text-sm font-medium">kr</span></p>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border-2 border-indigo-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg">MED GRÖN TEKNIK</div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Pris efter grönt avdrag (20%)</p>
              <p className="text-2xl font-black text-slate-900">{Math.round(result.priceAfterDeduction).toLocaleString("sv-SE")} <span className="text-base font-semibold text-slate-500">kr</span></p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 mb-8">
            <p className="font-semibold mb-1">Bra att veta om kalkylen:</p>
            <p>Beräkningen bygger på schablonvärden (16 000 kr/kWp och 950 kWh/kWp). Det faktiska priset beror på takets lutning, väderstreck, val av paneler och växelriktare, samt elnätsavgifter.</p>
          </div>

          <LeadForm 
            toolName="solcells-kalkylator"
            calculationData={{
              estimated_price_min: Math.round(result.priceAfterDeduction * 0.9),
              estimated_price_max: Math.round(result.priceAfterDeduction * 1.1),
              region: "Sverige"
            }}
          />
        </div>
      )}
    </div>
  );
}
