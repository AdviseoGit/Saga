"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Stat {
  category: string;
  averagePrice: number;
  medianPrice: number;
  count: number;
}

interface StatCard extends Stat {
  icon: string;
  bgColor: string;
  unit: string;
  link: string;
  displayName: string;
}

interface ApiResponse {
  totalAnalyzed: number;
  minSamples: number;
  stats: Stat[];
}

const CATEGORY_CONFIG: Record<string, { icon: string; bgColor: string; unit: string; link: string; displayName: string }> = {
  "Badrumsrenovering": { icon: "🛁", bgColor: "bg-blue-50", unit: "/ kvm", link: "/verktyg/badrumsrenovering-kalkylator", displayName: "Badrumsrenovering" },
  "Takbyte": { icon: "🏠", bgColor: "bg-orange-50", unit: "/ kvm", link: "/verktyg/takbyte-kalkylator", displayName: "Takbyte" },
  "Solceller": { icon: "☀️", bgColor: "bg-yellow-50", unit: "/ kW", link: "/verktyg/solcells-kalkylator", displayName: "Solceller" },
  "Bergvärme": { icon: "🔥", bgColor: "bg-red-50", unit: "totalt", link: "/verktyg/bergvarme-kalkylator", displayName: "Bergvärme" },
  "Fasadrenovering": { icon: "🧱", bgColor: "bg-purple-50", unit: "/ kvm", link: "/verktyg/fasadrenovering-kalkylator", displayName: "Fasadrenovering" },
  "VVS-arbete": { icon: "🚰", bgColor: "bg-cyan-50", unit: "/ tim", link: "/verktyg/vvs-kalkylator", displayName: "VVS-arbete" },
};

// Kategorierna lagras gemena i `analyses` ("badrumsrenovering"), så slå upp
// skiftlägesokänsligt. Okända kategorier får en neutral kortstil och ingen
// kalkylatorlänk — det finns ingen kalkylator att skicka läsaren till.
const CONFIG_BY_KEY = new Map(
  Object.entries(CATEGORY_CONFIG).map(([key, config]) => [key.toLowerCase(), config])
);

const sentenceCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function configFor(category: string) {
  return (
    CONFIG_BY_KEY.get(category.toLowerCase()) ?? {
      icon: "📊",
      bgColor: "bg-slate-50",
      unit: "",
      link: "",
      displayName: sentenceCase(category),
    }
  );
}

export default function SagaIndexData() {
  const [stats, setStats] = useState<StatCard[] | null>(null);
  const [totalAnalyzed, setTotalAnalyzed] = useState<number | null>(null);
  const [minSamples, setMinSamples] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/saga-index');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data: ApiResponse = await response.json();

        // Bara kategorier vi faktiskt har mätt — inga utfyllda nollkort.
        setStats(data.stats.map((stat) => ({ ...stat, ...configFor(stat.category) })));
        setTotalAnalyzed(data.totalAnalyzed);
        setMinSamples(data.minSamples ?? 5);
      } catch (err) {
        console.error("Failed to fetch saga-index data:", err);
        setError("Kunde inte hämta prisdata just nu.");
      } finally {
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
      {stats.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center sm:p-12">
          <h2 className="text-xl font-bold text-slate-900">Saga Index byggs upp just nu</h2>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-slate-600">
            Vi publicerar snittpriser först när vi har tillräckligt många analyserade offerter
            i en kategori — hellre ingen siffra än en osäker siffra. Ladda upp din egen offert
            så växer underlaget.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-[#6366f1] px-6 py-3 text-sm font-bold text-white hover:bg-[#4f46e5]"
          >
            Analysera din offert →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const enough = stat.count >= minSamples;
            return (
              <div key={stat.category} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${stat.bgColor} text-2xl`}>
                  {stat.icon}
                </div>
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-slate-900">{stat.displayName}</h3>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {stat.count} {stat.count === 1 ? "analys" : "analyser"}
                  </span>
                </div>
                <div className="mt-6">
                  {enough ? (
                    <>
                      <div className="text-3xl font-black tracking-tight text-slate-900">
                        {stat.medianPrice.toLocaleString("sv-SE")} kr{" "}
                        <span className="text-sm font-medium text-slate-500">{stat.unit}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Median · snitt {stat.averagePrice.toLocaleString("sv-SE")} kr
                      </div>
                    </>
                  ) : (
                    <div className="text-sm leading-relaxed text-slate-500">
                      För få analyser för ett tillförlitligt snittpris — vi visar en prisnivå
                      vid {minSamples} analyser.
                    </div>
                  )}
                </div>
                {stat.link && (
                  <Link href={stat.link} className="mt-6 inline-block text-sm font-bold text-[#6366f1] hover:underline">
                    Gör en egen kalkyl →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-16 rounded-3xl bg-slate-900 p-8 text-center text-white sm:p-12">
        <h2 className="text-2xl font-bold sm:text-3xl">Så samlar vi vår data</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-300">
          Saga Index bygger på riktiga offerter som laddas upp och analyseras i våra verktyg.
          Datan anonymiseras och aggregeras, och vi redovisar alltid hur många analyser varje
          prispunkt vilar på. Är underlaget för tunt visar vi ingen prisnivå — hellre ingen
          siffra än en osäker siffra.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <div className="rounded-xl bg-slate-800 px-6 py-4">
            <div className="text-2xl font-black text-[#6366f1]">
              {(totalAnalyzed ?? 0).toLocaleString("sv-SE")}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Offertanalyser</div>
          </div>
          <div className="rounded-xl bg-slate-800 px-6 py-4">
            <div className="text-2xl font-black text-[#6366f1]">100%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Anonymiserad data</div>
          </div>
        </div>
      </div>
    </>
  );
}
