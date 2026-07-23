import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  title: 'Saga Index – Svenska Hantverkspriser 2026',
  description: 'Unik data från Fråga Sagas analyser: snittpriser för badrum, takbyte, VVS och solceller. Baserat på tusentals granskade offerter.',
  alternates: {
    canonical: 'https://fragasaga.se/saga-index',
  },
  openGraph: {
    title: 'Saga Index – Svenska Hantverkspriser 2026',
    description: 'Unik data från Fråga Sagas analyser: snittpriser för badrum, takbyte, VVS och solceller.',
    url: 'https://fragasaga.se/saga-index',
  }
};

export default function SagaIndexPage() {
  return (
    <main className="bg-[#f8fafc] text-[#0f172a] min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[#e2e8f0] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-xl font-black tracking-tight text-[#0f172a] sm:text-2xl">Saga</span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-[#6366f1] sm:inline">Fråga Saga</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <Link href="/verktyg/renoverings-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Renovering</Link>
            <Link href="/verktyg/badrumsrenovering-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Badrum</Link>
            <Link href="/verktyg/takbyte-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Tak</Link>
            <Link href="/verktyg/solcells-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Solceller</Link>
          </nav>
          <div className="text-right">
            <div className="font-bold tabular-nums text-[#0f172a]">3 841</div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-[#64748b]">offerter analyserade</div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div className="absolute inset-0 bg-[#0f172a]"></div>
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#6366f1]/20 blur-[100px]"></div>
        <div className="relative mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            Saga Index 2026
          </h1>
          <p className="mt-6 text-lg font-medium text-slate-300">
            Sveriges mest transparenta rapport om hantverkspriser. Baserad på Fråga Sagas analyser och användarinskickade kalkyler och offerter. Uppdateras kontinuerligt med ny marknadsdata.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              🛁
            </div>
            <h3 className="text-xl font-bold text-slate-900">Badrumsrenovering</h3>
            <p className="mt-2 text-sm text-slate-600">
              Snittpris per kvm. Baserat på material (mellanklass) och arbete.
            </p>
            <div className="mt-6">
              <div className="text-3xl font-black tracking-tight text-slate-900">
                19 500 kr <span className="text-sm font-medium text-slate-500">/ kvm</span>
              </div>
              <div className="mt-1 text-sm font-medium text-green-600">+2.4% sedan 2025</div>
            </div>
            <Link href="/verktyg/badrumsrenovering-kalkylator" className="mt-6 inline-block text-sm font-bold text-[#6366f1] hover:underline">
              Gör en egen kalkyl →
            </Link>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
              🏠
            </div>
            <h3 className="text-xl font-bold text-slate-900">Takbyte (Betongtegel)</h3>
            <p className="mt-2 text-sm text-slate-600">
              Snittpris för en komplett omläggning, inklusive material, ställning och arbete.
            </p>
            <div className="mt-6">
              <div className="text-3xl font-black tracking-tight text-slate-900">
                1 450 kr <span className="text-sm font-medium text-slate-500">/ kvm</span>
              </div>
              <div className="mt-1 text-sm font-medium text-slate-500">Oförändrat sedan 2025</div>
            </div>
            <Link href="/verktyg/takbyte-kalkylator" className="mt-6 inline-block text-sm font-bold text-[#6366f1] hover:underline">
              Gör en egen kalkyl →
            </Link>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-2xl">
              ☀️
            </div>
            <h3 className="text-xl font-bold text-slate-900">Solceller</h3>
            <p className="mt-2 text-sm text-slate-600">
              Snittpris per installerad kW, exklusive batteri, efter grönt teknik-avdrag.
            </p>
            <div className="mt-6">
              <div className="text-3xl font-black tracking-tight text-slate-900">
                14 200 kr <span className="text-sm font-medium text-slate-500">/ kW</span>
              </div>
              <div className="mt-1 text-sm font-medium text-red-600">-8.5% sedan 2025</div>
            </div>
            <Link href="/verktyg/solcells-kalkylator" className="mt-6 inline-block text-sm font-bold text-[#6366f1] hover:underline">
              Gör en egen kalkyl →
            </Link>
          </div>
          
          {/* Card 4 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl">
              🔥
            </div>
            <h3 className="text-xl font-bold text-slate-900">Bergvärme</h3>
            <p className="mt-2 text-sm text-slate-600">
              Snittpris för pump (10-12 kW) och borrning (150-200m).
            </p>
            <div className="mt-6">
              <div className="text-3xl font-black tracking-tight text-slate-900">
                185 000 kr <span className="text-sm font-medium text-slate-500">totalt</span>
              </div>
              <div className="mt-1 text-sm font-medium text-green-600">+4.1% sedan 2025</div>
            </div>
            <Link href="/verktyg/bergvarme-kalkylator" className="mt-6 inline-block text-sm font-bold text-[#6366f1] hover:underline">
              Gör en egen kalkyl →
            </Link>
          </div>

          {/* Card 5 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl">
              🧱
            </div>
            <h3 className="text-xl font-bold text-slate-900">Fasadrenovering (Trä)</h3>
            <p className="mt-2 text-sm text-slate-600">
              Snittpris för byte av panel, målning och isolering.
            </p>
            <div className="mt-6">
              <div className="text-3xl font-black tracking-tight text-slate-900">
                1 850 kr <span className="text-sm font-medium text-slate-500">/ kvm</span>
              </div>
              <div className="mt-1 text-sm font-medium text-green-600">+1.5% sedan 2025</div>
            </div>
            <Link href="/verktyg/fasadrenovering-kalkylator" className="mt-6 inline-block text-sm font-bold text-[#6366f1] hover:underline">
              Gör en egen kalkyl →
            </Link>
          </div>

          {/* Card 6 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-2xl">
              🚰
            </div>
            <h3 className="text-xl font-bold text-slate-900">VVS-Arbete</h3>
            <p className="mt-2 text-sm text-slate-600">
              Snittpris per timme för licensierad rörmokare.
            </p>
            <div className="mt-6">
              <div className="text-3xl font-black tracking-tight text-slate-900">
                850 kr <span className="text-sm font-medium text-slate-500">/ tim</span>
              </div>
              <div className="mt-1 text-sm font-medium text-green-600">+3.2% sedan 2025</div>
            </div>
            <Link href="/verktyg/vvs-kalkylator" className="mt-6 inline-block text-sm font-bold text-[#6366f1] hover:underline">
              Gör en egen kalkyl →
            </Link>
          </div>
        </div>

        <div className="mt-16 rounded-3xl bg-slate-900 p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Så samlar vi vår data</h2>
          <p className="mt-4 mx-auto max-w-2xl text-slate-300 leading-relaxed">
            Fråga Sagas prispunkter bygger inte på gissningar eller enkäter, utan på tusentals riktiga offerter och fakturor som laddas upp och analyseras i våra verktyg varje månad. Genom att anonymisera och aggregera datan kan vi visa de faktiska marknadspriserna – inte vad branschorganisationerna vill att det ska kosta.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="rounded-xl bg-slate-800 px-6 py-4">
              <div className="text-2xl font-black text-[#6366f1]">3 841+</div>
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
      </section>

    </main>
  );
}
