"use client";

import React, { useState } from 'react';
import LeadForm from '../../../components/Calculators/LeadForm';

export default function VVSCalculator() {
  const [projectType, setProjectType] = useState('blandare');
  const [points, setPoints] = useState(1);
  const [complexity, setComplexity] = useState('standard');
  const [includeMaterial, setIncludeMaterial] = useState(true);
  const [rotEligible, setRotEligible] = useState(true);
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState<any>(null);

  const calculatePrice = () => {
    // Base time estimates (hours per unit/point)
    let hoursPerUnit = 0;
    let materialCostPerUnit = 0;

    switch (projectType) {
      case 'blandare':
        hoursPerUnit = 2; // Byt blandare
        materialCostPerUnit = 2500; // Snittpris för en vettig blandare
        break;
      case 'wc':
        hoursPerUnit = 3; // Byt WC-stol
        materialCostPerUnit = 3500; // Snittpris WC-stol
        break;
      case 'ror-dragning-kall-varm':
        hoursPerUnit = 4; // Rördragning per anslutningspunkt (vatten)
        materialCostPerUnit = 1200; // Rör och kopplingar per punkt
        break;
      case 'avlopp':
        hoursPerUnit = 5; // Avloppsrördragning per punkt
        materialCostPerUnit = 1500; // Avloppsrör/delar
        break;
      case 'varmvattenberedare':
        hoursPerUnit = 6; // Byt VVB
        materialCostPerUnit = 12000; // Snitt VVB
        break;
      case 'felsokning':
        hoursPerUnit = 2; // Felsökning / mindre läcka
        materialCostPerUnit = 500; // Diverse smådelar
        break;
      default:
        hoursPerUnit = 3;
        materialCostPerUnit = 2000;
    }

    // Complexity multiplier
    let timeMultiplier = 1;
    if (complexity === 'easy') timeMultiplier = 0.8;
    if (complexity === 'hard') timeMultiplier = 1.5;

    // Calculate totals
    const totalHours = (hoursPerUnit * points) * timeMultiplier;
    
    // Hourly rate (SEK, incl VAT)
    const hourlyRateLow = 650;
    const hourlyRateHigh = 850;

    // Labor cost
    const laborLow = totalHours * hourlyRateLow;
    const laborHigh = totalHours * hourlyRateHigh;

    // Material cost (only if included)
    const totalMaterial = includeMaterial ? (materialCostPerUnit * points) : 0;
    const materialLow = totalMaterial * 0.85; // lite variation i materialval
    const materialHigh = totalMaterial * 1.3;

    // Servicebil (schablon)
    const serviceCar = 500;

    // ROT deduction (30% on labor only)
    const rotDeductionLow = rotEligible ? laborLow * 0.3 : 0;
    const rotDeductionHigh = rotEligible ? laborHigh * 0.3 : 0;

    // Final prices before ROT
    const beforeRotLow = laborLow + materialLow + serviceCar;
    const beforeRotHigh = laborHigh + materialHigh + serviceCar;

    // Final prices after ROT
    const afterRotLow = beforeRotLow - rotDeductionLow;
    const afterRotHigh = beforeRotHigh - rotDeductionHigh;

    setResults({
      laborLow, laborHigh,
      materialLow, materialHigh,
      rotDeductionLow, rotDeductionHigh,
      beforeRotLow, beforeRotHigh,
      afterRotLow, afterRotHigh,
      totalHours,
      serviceCar
    });
    
    setCalculated(true);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm w-full">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Gör din VVS-kalkyl</h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Typ av arbete</label>
          <select 
            value={projectType} 
            onChange={(e) => setProjectType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent bg-slate-50"
          >
            <option value="blandare">Byta/installera blandare (kök eller badrum)</option>
            <option value="wc">Byta/installera WC-stol</option>
            <option value="ror-dragning-kall-varm">Dra nya vattenrör (kallt/varmt)</option>
            <option value="avlopp">Dra/ändra avloppsrör</option>
            <option value="varmvattenberedare">Byta varmvattenberedare</option>
            <option value="felsokning">Felsökning / reparera mindre läcka</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Antal enheter / anslutningspunkter</label>
          <p className="text-xs text-slate-500 mb-2">Hur många blandare, WC eller rum ska få nya rör?</p>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="1" max="10" step="1" 
              value={points} 
              onChange={(e) => setPoints(Number(e.target.value))}
              className="flex-grow h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
            />
            <span className="font-bold text-xl text-[#6366f1] w-8 text-center">{points}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Hur komplicerat är arbetet?</label>
          <select 
            value={complexity} 
            onChange={(e) => setComplexity(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent bg-slate-50"
          >
            <option value="easy">Enkelt (öppet och lättåtkomligt)</option>
            <option value="standard">Normalt (standardinstallation)</option>
            <option value="hard">Svårt (trångt, dolda rör eller asbestrisk)</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="block text-sm font-bold text-slate-700">Köper rörmokaren in materialet?</span>
            <span className="text-xs text-slate-500">Om du köpt material själv, bocka ur.</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={includeMaterial} onChange={() => setIncludeMaterial(!includeMaterial)} />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6366f1]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="block text-sm font-bold text-slate-700">Har du rätt till ROT-avdrag?</span>
            <span className="text-xs text-slate-500">-30% på arbetskostnaden.</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={rotEligible} onChange={() => setRotEligible(!rotEligible)} />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6366f1]"></div>
          </label>
        </div>

        <button 
          onClick={calculatePrice}
          className="w-full mt-6 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-black text-lg py-4 rounded-xl transition-all shadow-lg shadow-[#6366f1]/30 hover:shadow-[#6366f1]/50 hover:-translate-y-1"
        >
          Räkna ut VVS-pris
        </button>
      </div>

      {calculated && results && (
        <div className="mt-8 pt-8 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Uppskattad totalkostnad</h3>
          
          <div className="bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0] mb-6">
            <div className="text-4xl font-black text-[#0f172a] text-center mb-2">
              {new Intl.NumberFormat('sv-SE').format(Math.round(results.afterRotLow))} - {new Intl.NumberFormat('sv-SE').format(Math.round(results.afterRotHigh))} kr
            </div>
            {rotEligible && (
              <div className="text-center text-sm font-medium text-green-600 bg-green-50 py-1 px-3 rounded-full inline-block mx-auto w-full">
                Pris efter ROT-avdrag
              </div>
            )}
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Arbetskostnad (ca {results.totalHours.toFixed(1)}h)</span>
              <span className="font-bold">{new Intl.NumberFormat('sv-SE').format(Math.round(results.laborLow))} - {new Intl.NumberFormat('sv-SE').format(Math.round(results.laborHigh))} kr</span>
            </div>
            {includeMaterial && (
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Material & delar</span>
                <span className="font-bold">{new Intl.NumberFormat('sv-SE').format(Math.round(results.materialLow))} - {new Intl.NumberFormat('sv-SE').format(Math.round(results.materialHigh))} kr</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">Servicebil / etablering</span>
              <span className="font-bold">{new Intl.NumberFormat('sv-SE').format(Math.round(results.serviceCar))} kr</span>
            </div>
            {rotEligible && (
              <div className="flex justify-between items-center py-2 text-green-600">
                <span>ROT-avdrag (-30% på arbete)</span>
                <span className="font-bold">-{new Intl.NumberFormat('sv-SE').format(Math.round(results.rotDeductionLow))} till -{new Intl.NumberFormat('sv-SE').format(Math.round(results.rotDeductionHigh))} kr</span>
              </div>
            )}
          </div>

          <LeadForm toolName="vvs-kalkylator" calculationData={{ estimated_price_min: results.afterRotLow, estimated_price_max: results.afterRotHigh }} />
        </div>
      )}
    </div>
  );
}
