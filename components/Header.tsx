import React from 'react';
import Link from 'next/link';
import Navbar from './Navbar';

/* Räknaren visade tidigare hårdkodat "3 841 offerter analyserade" på varje sida.
   Nu hämtas det verkliga antalet ur `analyses`. Under MIN_TO_SHOW visas ingen
   räknare alls — att utelämna siffran är inget påstående, att hitta på den är
   det. Anropet är cachat i en timme och får aldrig fälla renderingen. */
const MIN_TO_SHOW = 25;

async function analysisCount(): Promise<number | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  try {
    const res = await fetch(`${url}/rest/v1/analyses?select=count`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const rows = await res.json();
    const count = Array.isArray(rows) ? Number(rows[0]?.count) : NaN;
    return Number.isFinite(count) ? count : null;
  } catch {
    return null;
  }
}

export default async function Header() {
  const count = await analysisCount();

  return (
    <header className="sticky top-0 z-40 border-b border-[#e2e8f0] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-black tracking-tight text-[#0f172a] sm:text-2xl">
            Saga
          </span>
          <span className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-[#6366f1] sm:inline">
            Fråga Saga
          </span>
        </Link>
        <Navbar />
        {count !== null && count >= MIN_TO_SHOW ? (
          <div className="text-right">
            <div className="font-bold tabular-nums text-[#0f172a]">
              {count.toLocaleString('sv-SE')}
            </div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-[#64748b]">
              offerter analyserade
            </div>
          </div>
        ) : (
          <div aria-hidden />
        )}
      </div>
    </header>
  );
}
