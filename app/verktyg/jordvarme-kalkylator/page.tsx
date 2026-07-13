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

export default function JordvarmeKalkylatorPage() {
  return <JordvarmeCalculator />;
}
