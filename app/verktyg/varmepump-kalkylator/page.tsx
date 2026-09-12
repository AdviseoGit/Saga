import React from 'react';
import type { Metadata } from 'next';
import HeatPumpCalculator from './HeatPumpCalculator';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Luft/Vatten Värmepump Kalkylator 2026 – Pris & Besparing',
  description:
    'Räkna ut kostnaden för luft/vatten-värmepump 2026. Få en uppskattning av pris med och utan ROT-avdrag samt jämför med andra värmesystem.',
  keywords: [
    'luft vatten värmepump kalkylator',
    'kostnad luft vatten',
    'kalkyl värmepump',
    'pris värmepump 2026',
    'luft vatten',
  ],
  alternates: {
    canonical: 'https://fragasaga.se/verktyg/varmepump-kalkylator',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Luft/Vatten Värmepump Kalkylator 2026",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "SEK"
  },
  "description": "Räkna ut vad en luft/vatten-värmepump kostar och jämför med andra uppvärmningssystem.",
  "url": "https://fragasaga.se/verktyg/varmepump-kalkylator"
};

export default function VarmepumpKalkylatorPage() {
  return (
    <main className="min-h-screen py-10 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Luft/Vatten Värmepump Kalkylator</h1>
        <p className="text-lg text-slate-600 mb-8">
          Få en uppskattning på vad det kostar att installera en luft/vatten-värmepump och räkna på ROT-avdraget.
        </p>

        <HeatPumpCalculator />

        <div className="mt-16 prose prose-slate max-w-none">
          <h2>Vad påverkar priset på en luft/vatten-värmepump?</h2>
          <p>
            Att installera en luft/vatten-värmepump är ett av de mest populära sätten att sänka sina uppvärmningskostnader idag. Systemet är särskilt fördelaktigt eftersom det inte kräver något borrhål, vilket gör den initiala kostnaden lägre än för <Link href="/verktyg/bergvarme-kalkylator" className="text-blue-600 hover:underline">bergvärme</Link>.
          </p>
          <ul>
            <li>
              <strong>Själva värmepumpen:</strong> Största delen av kostnaden är maskinen (utedel och innedel/panna). Priset styrs primärt av märke och effekt (hur stort hus du har).
            </li>
            <li>
              <strong>Installationsarbetet:</strong> Eftersom man slipper borra består arbetet "endast" av rördragning, inkoppling av utedel och innedel samt elinstallation.
            </li>
            <li>
              <strong>Bortforsling och anpassning:</strong> Att forsla bort den gamla pannan eller tanken är ofta ett extra tillägg som kostar några tusenlappar.
            </li>
          </ul>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg my-8">
            <h3 className="text-xl font-semibold mt-0 mb-4">Snittpriser för Luft/Vatten-värmepump (2026)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="py-2 px-3">Husets storlek (Effektbehov)</th>
                    <th className="py-2 px-3">Standard vs Premium</th>
                    <th className="py-2 px-3">Totalpris (innan ROT)</th>
                    <th className="py-2 px-3">Pris (efter ROT)*</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3">Mindre villa (5-7 kW)</td>
                    <td className="py-2 px-3">Standard</td>
                    <td className="py-2 px-3">95 000 - 110 000 kr</td>
                    <td className="py-2 px-3"><strong>85 000 - 95 000 kr</strong></td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3">Normal villa (8-10 kW)</td>
                    <td className="py-2 px-3">Standard</td>
                    <td className="py-2 px-3">115 000 - 135 000 kr</td>
                    <td className="py-2 px-3"><strong>100 000 - 120 000 kr</strong></td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2 px-3">Normal villa (8-10 kW)</td>
                    <td className="py-2 px-3">Premium (t.ex. NIBE, Thermia)</td>
                    <td className="py-2 px-3">130 000 - 155 000 kr</td>
                    <td className="py-2 px-3"><strong>115 000 - 135 000 kr</strong></td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Stor villa (12+ kW)</td>
                    <td className="py-2 px-3">Premium</td>
                    <td className="py-2 px-3">145 000 - 180 000 kr</td>
                    <td className="py-2 px-3"><strong>125 000 - 160 000 kr</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-4 mb-0">
              * Enligt Skatteverkets schablon för luft/vatten räknas 30% av totalpriset som arbetskostnad. ROT-avdraget ges därefter på 30% av den uträknade arbetskostnaden.
            </p>
          </div>

          <h2>Fördelar och Nackdelar: Luft/Vatten vs Bergvärme</h2>
          <p>
            Många husägare står och väljer mellan luft/vatten och bergvärme. Här är de avgörande skillnaderna enligt <a href="https://www.energimyndigheten.se/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Energimyndigheten</a>:
          </p>
          <ul>
            <li>
              <strong>Besparing:</strong> Bergvärme ger en något högre årlig besparing, speciellt kalla vinterdagar då bergvärmens temperatur i hålet är konstant (ca 4-8 grader), medan luft/vatten-pumpen tappar effekt när det är minusgrader utomhus.
            </li>
            <li>
              <strong>Kostnad:</strong> Luft/vatten kostar vanligtvis 40 000 - 70 000 kr mindre i inköp/installation än bergvärme. Det tar ofta 10-15 år för bergvärmens högre besparing att "tjäna in" prisskillnaden jämfört med luft/vatten.
            </li>
            <li>
              <strong>Klimatzon:</strong> I södra Sverige (Zon 3 och 4) är luft/vatten ofta den mest lönsamma lösningen. I norra Sverige (Zon 1 och 2) rekommenderas oftare bergvärme på grund av de kalla vintrarna.
            </li>
          </ul>

          <h2>Vad är ett rimligt pris? (Checklista vid offert)</h2>
          <p>
            När du tar in offerter, kontrollera att följande ingår i totalpriset:
          </p>
          <ul>
            <li>Demontering och bortforsling av gammal panna (kan kosta 3000-8000 kr om det läggs till i efterhand).</li>
            <li>Elinstallation och rördragning ingår (står det "tillkommer", se upp!).</li>
            <li>Eventuell gjutning/markstativ för utedelen (en utedel väger ofta över 100 kg och måste stå stadigt och rakt).</li>
            <li>Igångsättning och injustering av systemet.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
