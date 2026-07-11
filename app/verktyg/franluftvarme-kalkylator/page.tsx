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

export default function FranluftvarmeKalkylatorPage() {
  return <FranluftvarmeCalculator />;
}
