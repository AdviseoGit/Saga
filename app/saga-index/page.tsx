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
            <Link href="/verktyg/fasadrenovering-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Fasad</Link>
            <Link href="/verktyg/maleriarbete-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Måleri</Link>
            <Link href="/verktyg/solcells-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Solceller</Link>
            <Link href="/verktyg/varmepump-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Värmepump</Link>
            <Link href="/verktyg/bergvarme-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Bergvärme</Link>
            <Link href="/verktyg/franluftvarme-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Frånluftsvärme</Link>
            <Link href="/verktyg/jordvarme-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Jordvärme</Link>
            <Link href="/verktyg/vvs-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">VVS</Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#0f172a] px-4 py-16 sm:px-6 sm:py-24 text-white">
        <div className="absolute left-1/2 top-20 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#6366f1]/20 blur-[80px]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6366f1]">Proprietary Data Report</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">Saga Index 2026</h1>
          <p className="mt-6 text-xl font-medium text-slate-300 max-w-2xl mx-auto">
            Den sanna bilden av svenska hantverkspriser. Baserat på anonymiserad data från över 3 800 offerter analyserade av Fråga Saga.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase text-slate-500">Snittpris: Badrum</h3>
            <p className="mt-2 text-3xl font-black text-[#0f172a]">145 000 kr</p>
            <p className="mt-1 text-sm text-slate-500">Intervall: 110k – 220k kr</p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <Link href="/verktyg/badrumsrenovering-kalkylator" className="text-sm font-bold text-[#6366f1] hover:underline">Din kalkyl →</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase text-slate-500">Snittpris: Takbyte (tegel)</h3>
            <p className="mt-2 text-3xl font-black text-[#0f172a]">182 000 kr</p>
            <p className="mt-1 text-sm text-slate-500">Intervall: 130k – 280k kr</p>
             <div className="mt-4 pt-4 border-t border-slate-100">
              <Link href="/verktyg/takbyte-kalkylator" className="text-sm font-bold text-[#6366f1] hover:underline">Din kalkyl →</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase text-slate-500">Snittpris: Solceller (10kW)</h3>
            <p className="mt-2 text-3xl font-black text-[#0f172a]">125 000 kr</p>
            <p className="mt-1 text-sm text-slate-500">Intervall: 95k – 150k kr</p>
             <div className="mt-4 pt-4 border-t border-slate-100">
              <Link href="/verktyg/solcells-kalkylator" className="text-sm font-bold text-[#6366f1] hover:underline">Din kalkyl →</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase text-slate-500">Snittpris: Luft/Vatten-pump</h3>
            <p className="mt-2 text-3xl font-black text-[#0f172a]">115 000 kr</p>
            <p className="mt-1 text-sm text-slate-500">Intervall: 90k – 145k kr</p>
             <div className="mt-4 pt-4 border-t border-slate-100">
              <Link href="/verktyg/varmepump-kalkylator" className="text-sm font-bold text-[#6366f1] hover:underline">Din kalkyl →</Link>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
           <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8">
              <h2 className="text-2xl font-black text-[#0f172a]">Insikter från vår data</h2>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#6366f1] font-bold text-xl">•</span>
                  <div>
                    <h4 className="font-bold text-[#0f172a]">Offertvariation är enorm</h4>
                    <p className="mt-1 text-sm text-slate-600">I 34% av fallen där vi jämförde två offerter för samma arbete skilde sig priset med mer än 40%.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#6366f1] font-bold text-xl">•</span>
                   <div>
                    <h4 className="font-bold text-[#0f172a]">Röda flaggor är vanliga</h4>
                    <p className="mt-1 text-sm text-slate-600">Var femte offert (21%) från en ej tidigare granskad aktör hade anmärkningar kring F-skatt, momsregistrering eller bolagsstatus.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#6366f1] font-bold text-xl">•</span>
                   <div>
                    <h4 className="font-bold text-[#0f172a]">Regionala skillnader (Stockholm vs. Resten)</h4>
                    <p className="mt-1 text-sm text-slate-600">Timpriset i Stockholmsregionen snittar ca 18-24% högre än riksgenomsnittet beroende på yrkesgrupp.</p>
                  </div>
                </li>
              </ul>
           </div>
           
           <div className="rounded-2xl bg-[#0f172a] p-8 text-white flex flex-col justify-center">
              <h2 className="text-2xl font-black">Har du fått en offert?</h2>
              <p className="mt-4 text-slate-300">
                Bidra till datan och få samtidigt marknadens snabbaste och mest opartiska bedömning av ditt pris.
              </p>
              <div className="mt-8">
                <Link href="/" className="inline-flex rounded-xl bg-[#6366f1] px-6 py-3 font-bold text-white transition hover:bg-[#4f46e5]">
                  Analysera din offert gratis →
                </Link>
              </div>
           </div>
        </div>
        
        <div className="mt-16 text-center text-sm text-slate-500 max-w-3xl mx-auto">
          <p>
            * Siffrorna baseras på data extraherad från offerter uppladdade till Fråga Saga fram till juni 2026. 
            Priser anges normalt inklusive moms men före eventuellt ROT-avdrag. Detta är en levande rapport som uppdateras löpande när ny data ackumuleras.
          </p>
        </div>
      </div>
    </main>
  );
}
