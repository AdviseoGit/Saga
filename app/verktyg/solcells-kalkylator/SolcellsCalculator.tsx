"use client";

import React, { useState, useMemo } from "react";
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
    
    // Antaganden (Sverige 2026 baslinje)
    // - En standardpanel idag är ca 420W och mäter ca 2 kvm (0.21 kW per kvm)
    // - Pris per kW installerat innan avdrag är grovt ca 14 000 - 18 000 kr (vi använder 16 000 kr för en realistisk uppskattning)
    // - Grön teknik avdraget är 20% på kostnaden
    // - En kW installerad effekt producerar ca 900-1000 kWh per år (vi räknar med 950 kWh)
    
    const kWpPerSqm = 0.21;
    const pricePerKWp = 16000;
    const productionPerKWp = 950;
    
    const maxSystemSizeKWp = formData.roofArea * kWpPerSqm;
    
    // Vi begränsar inte systemets storlek utifrån förbrukning i denna enkla kalkyl,
    // men i verkligheten vill man ogärna sälja mycket mer än man köper pga skatteregler.
    
    const systemSizeKWp = Math.round(maxSystemSizeKWp * 10) / 10;
    const estimatedProduction = Math.round(systemSizeKWp * productionPerKWp);
    
    const priceBeforeDeduction = systemSizeKWp * pricePerKWp;
    
    // Grön teknik-avdraget är 20%. I praktiken räknas det via en schablon.
    // Vi använder en förenklad schablon på exakt 20% i denna kalkyl.
    const priceAfterDeduction = priceBeforeDeduction * 0.80;

    setResult({
      systemSizeKWp,
      estimatedProduction,
      priceBeforeDeduction,
      priceAfterDeduction,
    });
  };

  return (
    <>
      <form onSubmit={calculatePrice} className="rounded-[22px] border border-[#e2e8f0] bg-white p-6 sm:p-8 shadow-sm space-y-8 relative overflow-hidden">
        {/* Ribbon */}
        <div className="absolute top-6 right-[-35px] bg-[#6366f1] text-white text-xs font-bold px-10 py-1 rotate-45 transform origin-center z-10">
          GRATIS
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#0f172a] mb-2">
                Årlig Elförbrukning (kWh)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={formData.electricityUsage}
                onChange={(e) => setFormData({ ...formData, electricityUsage: parseInt(e.target.value) || 0 })}
                className="w-full rounded-xl border-2 border-[#e2e8f0] bg-slate-50 px-4 py-3 text-lg font-bold text-[#0f172a] transition focus:border-[#6366f1] focus:bg-white focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-500">Normal villa: ca 15 000 - 20 000 kWh/år.</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#0f172a] mb-2">
                Ledig takyta mot Söder/Öst/Väst (kvm)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                step="5"
                value={formData.roofArea}
                onChange={(e) => setFormData({ ...formData, roofArea: parseInt(e.target.value) || 0 })}
                className="w-full rounded-xl border-2 border-[#e2e8f0] bg-slate-50 px-4 py-3 text-lg font-bold text-[#0f172a] transition focus:border-[#6366f1] focus:bg-white focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-500">Ungefärlig ledig yta utan fönster och skorstenar.</p>
            </div>
          </div>

          <div className="bg-[#f8fafc] rounded-xl p-6 border border-[#e2e8f0] flex flex-col justify-center">
            <h3 className="text-sm font-bold uppercase text-slate-500 mb-4">Summering av din inmatning</h3>
            <ul className="space-y-3 text-sm font-medium text-[#0f172a]">
              <li className="flex justify-between">
                <span className="text-slate-500">Tak att fylla:</span>
                <span>{formData.roofArea} kvm</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-500">Din förbrukning:</span>
                <span>{formData.electricityUsage.toLocaleString('sv-SE')} kWh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-[#e2e8f0]">
          <button
            type="submit"
            className="w-full rounded-2xl bg-[#6366f1] px-8 py-4 text-lg font-black text-white shadow-lg shadow-[#6366f1]/30 transition hover:bg-[#4f46e5]"
          >
            Beräkna Kalkyl
          </button>
        </div>
      </form>

      {/* Result Section */}
      {result && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="rounded-t-2xl bg-[#0f172a] p-6 sm:p-8 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.758a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            </div>
            
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#cbd5e1]">
              Uppskattat totalpris (med Grön Teknik)
            </h3>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-4xl sm:text-6xl font-black">
                {Math.round(result.priceAfterDeduction).toLocaleString("sv-SE")}
              </span>
              <span className="text-xl font-bold ml-2">kr</span>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/20 pt-6 text-left max-w-lg mx-auto">
                <div>
                    <p className="text-xs text-[#94a3b8] uppercase font-bold tracking-wider">Systemstorlek</p>
                    <p className="text-xl font-bold">{result.systemSizeKWp} kWp</p>
                </div>
                <div>
                    <p className="text-xs text-[#94a3b8] uppercase font-bold tracking-wider">Årlig Produktion (ca)</p>
                    <p className="text-xl font-bold text-[#22c55e]">{result.estimatedProduction.toLocaleString("sv-SE")} kWh</p>
                </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-8 bg-slate-50 border-x border-b border-[#e2e8f0] rounded-b-2xl">
            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Pris utan Grönt Avdrag:</span>
              <span className="font-bold text-slate-900">
                {Math.round(result.priceBeforeDeduction).toLocaleString("sv-SE")} kr
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-slate-600 font-medium">Uppskattat Skatteavdrag:</span>
              <span className="font-bold text-[#16a34a]">
                -{Math.round(result.priceBeforeDeduction - result.priceAfterDeduction).toLocaleString("sv-SE")} kr
              </span>
            </div>
          </div>
          
          {/* Lead Capture Form Integration */}
          <LeadForm 
            toolName="Solcellskalkylator"
            calculationData={{
              electricityUsage: formData.electricityUsage,
              roofArea: formData.roofArea,
              estimated_price_min: Math.round(result.priceAfterDeduction * 0.9), // Ge ett spann i rapporten
              estimated_price_max: Math.round(result.priceAfterDeduction * 1.1)
            }}
          />
        </div>
      )}
    </>
  );
}
