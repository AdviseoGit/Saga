import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import JordvarmeCalculator from './JordvarmeCalculator';

export const metadata: Metadata = {
  title: 'Jordvärme Kalkylator 2026 – Räkna ut pris & installation',
  description:
    'Hur mycket kostar jordvärme 2026? Använd vår gratis kalkylator för att räkna ut priset på jordvärmepump inklusive grävning av kollektorslang och installation.',
  keywords: [
    'jordvärme kalkylator',
    'kostnad jordvärme',
    'kalkyl jordvärme',
    'jordvärmepump kalkyl',
    'pris jordvärme 2026',
    'offert jordvärme',
  ],
  alternates: {
    canonical: 'https://fragasaga.se/verktyg/jordvarme-kalkylator',
  },
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
  openGraph: {
    title: 'Jordvärme Kalkylator 2026',
    description: 'Räkna ut priset för jordvärme direkt.',
    url: 'https://fragasaga.se/verktyg/jordvarme-kalkylator',
    siteName: 'Fråga Saga',
    locale: 'sv_SE',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Jordvärme Kalkylator 2026",
  "url": "https://fragasaga.se/verktyg/jordvarme-kalkylator",
  "description": "Ett verktyg för att uppskatta kostnaden för jordvärme i Sverige.",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "inLanguage": "sv-SE",
  "isAccessibleForFree": true,
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "SEK"
  }
};

export default function JordvarmeKalkylatorPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <Link href="/saga-index" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Saga Index</Link>
            <Link href="/verktyg/renoverings-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Renovering</Link>
            <Link href="/verktyg/badrumsrenovering-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Badrum</Link>
            <Link href="/verktyg/takbyte-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Tak</Link>
            <Link href="/verktyg/fasadrenovering-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Fasad</Link>
            <Link href="/verktyg/solcells-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Solceller</Link>
            <Link href="/verktyg/bergvarme-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Bergvärme</Link>
            <Link href="/verktyg/franluftvarme-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Frånluftsvärme</Link>
            <Link href="/verktyg/jordvarme-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Jordvärme</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6366f1]">
            Kostnadskalkylator
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0f172a] sm:text-5xl">
            Jordvärme Pris 2026
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg font-medium text-slate-600">
            Funderar du på att installera jordvärme? Vår kalkylator baseras på
            Sagas insamlade marknadsdata och aktuella snittpriser. Få en realistisk
            uppskattning direkt.
          </p>
        </div>

        <JordvarmeCalculator />

      </div>
    </div>
  );
}
