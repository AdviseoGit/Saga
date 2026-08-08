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
    <div className="max-w-4xl mx-auto py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Bergvärme Kalkylator</h1>
      <p className="text-slate-600 mb-8 font-medium">Att installera bergvärme kostar i snitt 150 000 till 200 000 kr (2026), varav själva värmepumpen står för ungefär halva priset och borrning för den andra. Exakt pris beror på djupet till berget och husets energibehov.</p>
      
      <BergvarmeCalculator />
      
      <div className="mt-16 prose prose-slate max-w-none">
        <h2>Vad påverkar priset på bergvärme?</h2>
        <p>Priset för bergvärme består i huvudsak av tre delar: värmepumpen, borrningen och installationen. Här är de faktorer som driver kostnaden:</p>
        
        <div className="overflow-x-auto my-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-200">
                <th className="p-4 font-bold text-slate-900">Kostnadspost</th>
                <th className="p-4 font-bold text-slate-900">Snittpris (innan ROT)</th>
                <th className="p-4 font-bold text-slate-900">Kommentar</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-100">
                <td className="p-4">Bergvärmepump</td>
                <td className="p-4">80 000 – 140 000 kr</td>
                <td className="p-4 text-slate-600">Beroende på effektbehov (storlek på hus).</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-4">Energiborrning</td>
                <td className="p-4">350 – 450 kr / meter</td>
                <td className="p-4 text-slate-600">Vanligt djup är 150-200 meter.</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-4">Foderrör till fast berg</td>
                <td className="p-4">700 – 900 kr / meter</td>
                <td className="p-4 text-slate-600">Krävs tills man når fast berg. Ofta ingår 6m i grundpris.</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-4">Installation & driftsättning</td>
                <td className="p-4">25 000 – 40 000 kr</td>
                <td className="p-4 text-slate-600">Arbetskostnad för inkoppling (ger rätt till ROT).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Hur djupt måste man borra för bergvärme?</h2>
        <p>Normalt borrar man mellan 120 och 250 meter beroende på husets värmebehov och var i Sverige du bor (berget är kallare i norr). Enligt data från branschorganisationen SKPT är snittdjupet ca 180 meter. Om energibehovet är mycket stort kan det krävas två kortare hål istället för ett djupt.</p>
        
        <p className="text-xs text-slate-500 mt-8 border-t pt-4">Källa priser och djup: <a href="https://skpt.se" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-800">Svenskt Geoenergicentrum / SKPT</a> samt granskade offerter 2025-2026. Uppdaterad 2026-08-08.</p>
      </div>
    </div>
  );
}
