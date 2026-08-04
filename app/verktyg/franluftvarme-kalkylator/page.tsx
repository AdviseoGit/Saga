import React from 'react';
import type { Metadata } from 'next';
import FranluftvarmeCalculator from './FranluftvarmeCalculator';

export const metadata: Metadata = {
  title: 'Frånluftsvärmepump Kalkylator 2026 – Räkna ut pris & kostnad',
  description:
    'Hur mycket kostar en frånluftsvärmepump 2026? Använd vår gratis kalkylator för att räkna ut priset inklusive installation.',
  keywords: [
    'frånluftsvärmepump kalkylator',
    'kostnad frånluftsvärme',
    'kalkyl frånluftsvärme',
    'frånluftsvärmepump kalkyl',
    'pris frånluftsvärmepump 2026',
    'offert frånluftsvärme',
  ],
  alternates: {
    canonical: 'https://fragasaga.se/verktyg/franluftvarme-kalkylator',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Frånluftsvärmepump Kalkylator 2026",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "SEK"
  },
  "description": "Räkna ut pris och kostnad för frånluftsvärmepump. Kalkylator för värmepump och installation. Uppdaterad för 2026.",
  "dateModified": "2026-08-04"
};

export default function FranluftvarmeKalkylatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 text-center">
          Frånluftsvärmepump Kostnad & Pris 2026
        </h1>
        <p className="text-lg text-slate-600 text-center mb-4">
          <strong>En frånluftsvärmepump kostar i snitt mellan 80 000 kr och 115 000 kr</strong> installerad och klar efter ROT-avdrag. Själva värmepumpen står för den största kostnaden (cirka 65 000 – 95 000 kr) medan installationen kostar runt 15 000 – 20 000 kr.
        </p>
        <p className="text-sm text-slate-500 text-center mb-8">
          <em>Uppdaterad: 4 augusti 2026. <a href="https://skvp.se" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0f766e]">Källa: Svenska Kyl & Värmepumpföreningen (SKVP)</a></em>
        </p>
      </div>
      <FranluftvarmeCalculator />
    </>
  );
}
