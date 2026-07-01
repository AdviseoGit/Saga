"use client";

import React, { useState } from "react";
import LeadForm from "@/components/Calculators/LeadForm";

interface FormData {
  area: number;
  facadeType: string;
  action: string;
}

export default function FacadeCalculator() {
  const [formData, setFormData] = useState<FormData>({
    area: 120,
    facadeType: "tra",
    action: "mala",
  });
  
  const [result, setResult] = useState<{
    minBeforeRot: number;
    maxBeforeRot: number;
    minAfterRot: number;
    maxAfterRot: number;
  } | null>(null);

  const calculatePrice = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Priser per kvm beroende på kombination av fasadtyp och åtgärd
    let basePriceMin = 0;
    let basePriceMax = 0;
    let laborShare = 0.5; // Hur stor del som är arbetskostnad (för ROT)

    if (formData.facadeType === "tra") {
      if (formData.action === "mala") {
        basePriceMin = 250;
        basePriceMax = 450;
        laborShare = 0.8; // Mycket arbete, lite material
      } else if (formData.action === "byta") {
        basePriceMin = 1200;
        basePriceMax = 1800;
        laborShare = 0.5;
      } else if (formData.action === "tillaggsisolera") {
        basePriceMin = 1800;
        basePriceMax = 2500;
        laborShare = 0.5;
      }
    } else if (formData.facadeType === "puts") {
      if (formData.action === "mala") {
        basePriceMin = 300;
        basePriceMax = 500;
        laborShare = 0.8;
      } else if (formData.action === "byta") {
        // Puts om - knacka ner och putsa nytt
        basePriceMin = 1500;
        basePriceMax = 2500;
        laborShare = 0.6;
      } else if (formData.action === "tillaggsisolera") {
        basePriceMin = 2200;
        basePriceMax = 3200;
        laborShare = 0.5;
      }
    } else if (formData.facadeType === "tegel") {
      if (formData.action === "mala") {
        basePriceMin = 300;
        basePriceMax = 550;
        laborShare = 0.8;
      } else if (formData.action === "byta") {
        // Omfogning
        basePriceMin = 1000;
        basePriceMax = 1500;
        laborShare = 0.8;
      } else if (formData.action === "tillaggsisolera") {
        // Ofta innebär det ny fasadbeklädnad över teglet
        basePriceMin = 2500;
        basePriceMax = 3500;
        laborShare = 0.5;
      }
    }
    
    const minBeforeRot = formData.area * basePriceMin;
    const maxBeforeRot = formData.area * basePriceMax;
    
    const rotDeductionMin = (minBeforeRot * laborShare) * 0.3;
    const rotDeductionMax = (maxBeforeRot * laborShare) * 0.3;
    
    const minAfterRot = minBeforeRot - rotDeductionMin;
    const maxAfterRot = maxBeforeRot - rotDeductionMax;

    setResult({
      minBeforeRot,
      maxBeforeRot,
      minAfterRot,
      maxAfterRot
    });
  };

  // Logik för att visa relevanta åtgärder baserat på fasadtyp
  const getActionOptions = () => {
    if (formData.facadeType === "tegel") {
      return (
        <>
          <option value="mala">Tvätta och måla</option>
          <option value="byta">Omfogning (kratsa ur och foga om)</option>
          <option value="tillaggsisolera">Tilläggsisolera (med ny panel/puts utanpå)</option>
        </>
      );
    }
    return (
      <>
        <option value="mala">Tvätta, skrapa och måla om</option>
        <option value="byta">Byta fasad / Putsa om helt</option>
        <option value="tillaggsisolera">Byta fasad + Tilläggsisolera</option>
      </>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
      <div className="p-6 sm:p-10">
        <form onSubmit={calculatePrice} className="space-y-6">
          
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Fasadens yta (m²)</span>
              <p className="text-xs text-slate-500 mb-1">Räkna bort stora fönster och dörrar</p>
              <div className="mt-1 flex items-center">
                <input
                  type="number"
                  min="10"
                  step="1"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                  className="block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 px-4 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Nuvarande Fasadtyp</span>
              <select
                value={formData.facadeType}
                onChange={(e) => {
                  setFormData({ ...formData, facadeType: e.target.value, action: "mala" });
                }}
                className="mt-1 block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 px-4 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium"
              >
                <option value="tra">Träpanel</option>
                <option value="puts">Puts</option>
                <option value="tegel">Tegel</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Vilken åtgärd vill du göra?</span>
              <select
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                className="mt-1 block w-full rounded-xl border-slate-300 bg-slate-50 border py-3 px-4 text-slate-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-medium"
              >
                {getActionOptions()}
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-extrabold text-white bg-[#0f172a] hover:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f172a] transition-all"
          >
            Beräkna fasadkostnad
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-slate-50 border-t border-slate-200 p-6 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-black text-slate-900 mb-6 text-center">Prisuppskattning för din fasad</h3>
          
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
            <p>I kalkylen ingår normala arbetskostnader för din angivna åtgärd, material (färg/puts/panel), samt uppskattad kostnad för ställningshyra och etablering (vilket är standard vid fasadarbeten).</p>
          </div>

          <LeadForm 
            toolName="fasadrenovering-kalkylator"
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
