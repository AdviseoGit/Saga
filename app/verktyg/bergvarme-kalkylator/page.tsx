import React from 'react';
import type { Metadata } from 'next';
import BergvarmeCalculator from './BergvarmeCalculator';
import Link from 'next/link';

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
  "description": "Räkna ut vad bergvärme kostar inklusive borrning och installation.",
  "url": "https://fragasaga.se/verktyg/bergvarme-kalkylator"
};

export default function BergvarmeKalkylatorPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Bergvärme Kalkylator</h1>
        <p className="text-lg text-slate-600 mb-8">
          Få en uppskattning på vad det kostar att installera bergvärme, inklusive borrning och ROT-avdrag.
        </p>

        <BergvarmeCalculator />

        <div className="mt-16 prose prose-slate max-w-none">
          <h2>Vad påverkar priset på bergvärme?</h2>
          <p>
            Bergvärme är en av de största investeringarna du kan göra i ditt hus, men det är också den uppvärmningsform
            som ger allra störst besparing på lång sikt. Den totala kostnaden för bergvärme består i huvudsak av tre delar:
          </p>
          <ul>
            <li>
              <strong>Bergvärmepumpen:</strong> Själva maskinen står för en stor del av kostnaden. Priset beror på effektbehovet (storleken på ditt hus och din förbrukning).
            </li>
            <li>
              <strong>Borrning (energibrunn):</strong> Kostnaden för att borra hålet styrs av hur djupt man behöver borra och hur långt ner det är till berget. Borrning kostar normalt cirka 300–400 kr per meter.
            </li>
            <li>
              <strong>Installation och rördragning:</strong> Arbetskostnaden för att koppla in pumpen till husets befintliga vattenburna system.
            </li>
          </ul>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg my-8">
            <h3 className="text-xl font-semibold mt-0 mb-4">Snittpriser för bergvärme (2026)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="py-2 px-3">Husets storlek</th>
                    <th className="py-2 px-3">Borrdjup (ca)</th>
                    <th className="py-2 px-3">Totalpris (innan ROT)</th>
                    <th className="py-2 px-3">Pris (efter ROT)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3">Mindre villa (&lt;120 kvm)</td>
                    <td className="py-2 px-3">120 - 150 meter</td>
                    <td className="py-2 px-3">130 000 - 160 000 kr</td>
                    <td className="py-2 px-3"><strong>110 000 - 140 000 kr</strong></td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3">Normal villa (120-180 kvm)</td>
                    <td className="py-2 px-3">150 - 200 meter</td>
                    <td className="py-2 px-3">160 000 - 200 000 kr</td>
                    <td className="py-2 px-3"><strong>140 000 - 175 000 kr</strong></td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Stor villa (&gt;180 kvm)</td>
                    <td className="py-2 px-3">200+ meter</td>
                    <td className="py-2 px-3">190 000 - 240 000 kr</td>
                    <td className="py-2 px-3"><strong>165 000 - 215 000 kr</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-4 mb-0">
              * Tabellen visar genomsnittliga marknadspriser. ROT-avdraget ges på 30% av arbetskostnaden. Vid totalentreprenad räknas schablonmässigt 35% av totalkostnaden som arbetskostnad. Läs mer om <Link href="/rot-avdrag" className="text-blue-600 hover:underline">ROT-avdraget här</Link>.
            </p>
          </div>

          <h2>Hur djupt måste man borra för bergvärme?</h2>
          <p>
            Tumregeln är att varje meter borrhål ger cirka 30-40 watt i utvunnen energi (kallas <em>aktivt borrdjup</em>). 
            Ett normalstort hus behöver ofta ett hål som är mellan 150 och 200 meter djupt.
          </p>
          <p>
            Om det är långt ner till fast berg måste entreprenören montera foderrör genom jorden för att skydda hålet. 
            Foderrör är dyrare per meter än vanlig borrning i berg, vilket kan driva upp priset om du har djupt till berggrunden. 
            Detta kallas <em>avstånd till berg</em>.
          </p>

          <h2>Jämför med andra värmesystem</h2>
          <p>
            Bergvärme kräver högst initial investering men har lägst driftkostnad och längst livslängd på kollektorn (borrhålet håller ofta &gt;50 år).
          </p>
          <ul>
            <li>
              <strong>Bergvärme vs Luft-vattenvärmepump:</strong> Luft-vatten är billigare att installera (inget borrhål krävs) men ger något lägre besparing, särskilt i kallt klimat. Om du bor i södra Sverige kan luft-vatten vara mer ekonomiskt lönsamt.
            </li>
            <li>
              <strong>Bergvärme vs Frånluftsvärmepump:</strong> <Link href="/verktyg/franluftvarme-kalkylator" className="text-blue-600 hover:underline">Frånluftsvärme</Link> används i nyare hus med mekanisk ventilation och slutet system. Det går sällan att byta från frånluft till bergvärme utan omfattande ombyggnad av ventilationen.
            </li>
          </ul>
          
          <h2>Är offerten rimlig?</h2>
          <p>
            När du får in offerter på bergvärme är det viktigt att jämföra äpplen med äpplen. Kontrollera alltid att:
          </p>
          <ul>
            <li><strong>Borrdjupet</strong> (aktivt borrdjup) är specificerat. Vissa leverantörer lämnar offert på ett grundare hål för att se billigare ut, vilket tvingar pumpen att gå på dyr elpatron på vintern.</li>
            <li><strong>Foderrör</strong> ingår (t.ex. de första 6 meterna) och vad priset per extra meter foderrör är om berget ligger djupare än väntat.</li>
            <li>Inkoppling till befintligt system, bortforsling av gammal panna och elektrikerarbete ingår i priset.</li>
          </ul>
          <p>
            Använd gärna vårt verktyg för att <Link href="/" className="text-blue-600 hover:underline">granska din offert</Link> om du vill veta om priset du fått är i linje med marknaden.
          </p>
        </div>
      </div>
    </main>
  );
}
