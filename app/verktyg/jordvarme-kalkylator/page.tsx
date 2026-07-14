import React from 'react';
import type { Metadata } from 'next';
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Jordvärme Kalkylator 2026",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "SEK"
  },
  "description": "Räkna ut pris och kostnad för jordvärme. Kalkylator för jordvärmepump, grävning av kollektorslang och installation. Uppdaterad för 2026."
};

export default function JordvarmeKalkylatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JordvarmeCalculator />
    </>
  );
}
