import React from 'react';
import type { Metadata } from 'next';
import BergvarmeCalculator from './BergvarmeCalculator';

export const metadata: Metadata = {
  title: 'Bergvärme Kalkylator 2026 – Räkna ut pris & borrning',
  description:
    'Hur mycket kostar bergvärme 2026? Använd vår gratis kalkylator för att räkna ut priset på bergvärmepump inklusive borrning och installation.',
  keywords: [
    'bergvärme kalkylator',
    'kostnad bergvärme',
    'kalkyl bergvärme',
    'bergvärmepump kalkyl',
    'pris bergvärme 2026',
    'offert bergvärme',
  ],
  alternates: {
    canonical: 'https://fragasaga.se/verktyg/bergvarme-kalkylator',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Bergvärme Kalkylator 2026",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "SEK"
  },
  "description": "Räkna ut pris och kostnad för bergvärme. Kalkylator för bergvärmepump, energiborrning och installation. Uppdaterad för 2026."
};

export default function BergvarmeKalkylatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BergvarmeCalculator />
    </>
  );
}
