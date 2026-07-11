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

export default function BergvarmeKalkylatorPage() {
  return <BergvarmeCalculator />;
}
