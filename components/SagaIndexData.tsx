"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface StatCard {
  category: string;
  icon: string;
  bgColor: string;
  unit: string;
  averagePrice: number;
  count: number;
  link: string;
  displayName: string;
}

interface ApiResponse {
  totalAnalyzed: number;
  stats: { category: string; averagePrice: number; count: number }[];
}

const CATEGORY_CONFIG: Record<string, { icon: string; bgColor: string; unit: string; link: string; displayName: string }> = {
  "Badrumsrenovering": { icon: "🛁", bgColor: "bg-blue-50", unit: "/ kvm", link: "/verktyg/badrumsrenovering-kalkylator", displayName: "Badrumsrenovering" },
  "Takbyte": { icon: "🏠", bgColor: "bg-orange-50", unit: "/ kvm", link: "/verktyg/takbyte-kalkylator", displayName: "Takbyte" },
  "Solceller": { icon: "☀️", bgColor: "bg-yellow-50", unit: "/ kW", link: "/verktyg/solcells-kalkylator", displayName: "Solceller" },
  "Bergvärme": { icon: "🔥", bgColor: "bg-red-50", unit: "totalt", link: "/verktyg/bergvarme-kalkylator", displayName: "Bergvärme" },
  "Fasadrenovering": { icon: "🧱", bgColor: "bg-purple-50", unit: "/ kvm", link: "/verktyg/fasadrenovering-kalkylator", displayName: "Fasadrenovering" },
  "VVS-arbete": { icon: "🚰", bgColor: "bg-cyan-50", unit: "/ tim", link: "/verktyg/vvs-kalkylator", displayName: "VVS-arbete" },
};

export default function SagaIndexData() {
  const [stats, setStats] = useState<StatCard[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAnalyzed, setTotalAnalyzed] = useState<number>(3841); // Fallback

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/saga-index');
        
        if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        const enrichedStats: StatCard[] = data.stats.map(stat => {
            const config = CATEGORY_CONFIG[stat.category] || { 
                icon: "📊", 
                bgColor: "bg-slate-50", 
                unit: "kr", 
                link: "/", 
                displayName: stat.category 
            };
            return {
                ...stat,
                ...config
            };
        });

        // Ensure default categories are present if API returns empty/filtered list, for demo UI purposes
        const defaultCats = Object.keys(CATEGORY_CONFIG);
        const finalStats = enrichedStats;
        
        for (const defaultCat of defaultCats) {
             if (!finalStats.some(s => s.category === defaultCat)) {
                 // Push a fallback zeroed state if not in DB yet
                 finalStats.push({
                     category: defaultCat,
                     averagePrice: 0,
                     count: 0,
                     ...CATEGORY_CONFIG[defaultCat]
                 });
             }
        }

        setStats(finalStats.filter(s => CATEGORY_CONFIG[s.category])); // Filter out unknown categories for clean UI
        setTotalAnalyzed(data.totalAnalyzed);
        setLoading(false);

      } catch (err) {
        console.error("Failed to fetch saga-index data:", err);
        setError("Kunde inte hämta prisdata.");
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6366f1] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
        <p>{error || "Kunde inte ladda data."}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} text-2xl`}>
              {stat.icon}
            </div>
            <div className="flex justify-between items-start">
               <h3 className="text-xl font-bold text-slate-900">{stat.displayName}</h3>
               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{stat.count} analyser</span>
            </div>
            <div className="mt-6">
              <div className="text-3xl font-black tracking-tight text-slate-900">
                {stat.averagePrice.toLocaleString("sv-SE")} kr <span className="text-sm font-medium text-slate-500">{stat.unit}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                 <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Live data</span>
              </div>
            </div>
            <Link href={stat.link} className="mt-6 inline-block text-sm font-bold text-[#6366f1] hover:underline">
              Gör en egen kalkyl →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl bg-slate-900 p-8 text-center text-white sm:p-12">
        <h2 className="text-2xl font-bold sm:text-3xl">Så samlar vi vår data</h2>
        <p className="mt-4 mx-auto max-w-2xl text-slate-300 leading-relaxed">
          Fråga Sagas prispunkter bygger inte på gissningar eller enkäter, utan på tusentals riktiga offerter och fakturor som laddas upp och analyseras i våra verktyg varje månad. Genom att anonymisera och aggregera datan kan vi visa de faktiska marknadspriserna – inte vad branschorganisationerna vill att det ska kosta.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="rounded-xl bg-slate-800 px-6 py-4">
            <div className="text-2xl font-black text-[#6366f1]">{totalAnalyzed.toLocaleString("sv-SE")}+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Offertanalyser</div>
          </div>
          <div className="rounded-xl bg-slate-800 px-6 py-4">
            <div className="text-2xl font-black text-[#6366f1]">10+</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Datapunkter per analys</div>
          </div>
          <div className="rounded-xl bg-slate-800 px-6 py-4">
            <div className="text-2xl font-black text-[#6366f1]">100%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Anonymiserad Data</div>
          </div>
        </div>
      </div>
    </>
  );
}
