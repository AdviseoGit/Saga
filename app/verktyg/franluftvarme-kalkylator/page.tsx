import React from 'react';
import type { Metadata } from 'next';
import FranluftvarmeCalculator from './FranluftvarmeCalculator';

export const metadata: Metadata = {
  title: 'Frånluftsvärmepump Kalkylator 2026 – Räkna ut pris & kostnad',
  description:
    'Hur mycket kostar en frånluftsvärmepump 2026? Använd vår gratis kalkylator för att räkna ut priset inklusive installation. Uppdaterade priser och fakta för 2026.',
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
  "dateModified": "2026-08-11"
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
          <em>Uppdaterad: 11 augusti 2026. Data baserad på <a href="https://skvp.se" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0f766e]">Svenska Kyl & Värmepumpföreningen (SKVP)</a> samt branschsnitt för 2026.</em>
        </p>
      </div>
      
      <FranluftvarmeCalculator />

      <article className="max-w-4xl mx-auto py-12 px-4 text-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Vad är en frånluftsvärmepump och hur fungerar den?</h2>
        <p className="mb-4">
          En frånluftsvärmepump (ofta förkortad FLVP) är en typ av värmepump som återvinner värme ur husets varma ventilationsluft (frånluft) innan den blåses ut ur byggnaden. Den värmen används sedan för att värma upp både inomhusluften och tappvarmvattnet. Det är en mycket vanlig lösning i hus byggda från 1980-talet och framåt, där det finns mekanisk frånluftsventilation.
        </p>
        
        <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">Fördelar med frånluftsvärme</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Relativt låg investeringskostnad:</strong> Jämfört med bergvärme är installationen betydligt billigare eftersom ingen borrning krävs.</li>
          <li><strong>Mindre platskrävande:</strong> Enheten fungerar både som värmepump, varmvattenberedare och ventilationsaggregat i ett skåp (ofta 60x60 cm i golvyta).</li>
          <li><strong>Bra för inomhusklimatet:</strong> Eftersom systemet kräver och driver husets ventilation säkerställs en god och kontinuerlig luftomsättning.</li>
          <li><strong>Hög besparing i välisolerade hus:</strong> Passar utmärkt i nyare, välisolerade villor med normalt varmvattenbehov.</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">Vad påverkar priset på en installation?</h3>
        <p className="mb-4">
          Priset för att byta eller installera en ny frånluftsvärmepump varierar, och styrs framförallt av följande faktorer:
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-2">
          <li><strong>Märke och modell:</strong> Välkända märken som NIBE (t.ex. NIBE F730 / S735), Bosch och IVT kostar mer i inköp men erbjuder ofta högre effektivitet (SCOP) och längre garantier.</li>
          <li><strong>Husets storlek och isolering:</strong> Större hus kräver pumpar med högre effekt, vilket kostar mer.</li>
          <li><strong>Komplexitet vid installation:</strong> Om rör behöver dras om, golvbrunnar saknas, eller om ventilationskanaler behöver rengöras eller justeras (OVK) ökar arbetskostnaden. Att enbart "byta rakt av" där den gamla pumpen stod är billigast.</li>
        </ol>

        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-6">Livslängd och utbyte av frånluftsvärmepump</h2>
        <p className="mb-4">
          En normal frånluftsvärmepump har en livslängd på cirka <strong>10 till 15 år</strong>, ibland upp emot 20 år om den är välskött och kompressorn håller. När det är dags att byta ut den är det vanligaste tecknet att elräkningen plötsligt skjuter i höjden under vintern. Detta beror på att kompressorn har gett upp, och pumpen istället drivs helt av den inbyggda elpatronen. 
        </p>
        <p className="mb-4">
          Att byta ut en befintlig värmepump är ofta 10 000 - 15 000 kr billigare än en nyinstallation eftersom ventilation och rördragning redan är på plats.
        </p>
        
        <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-4">Elförbrukning och besparing</h3>
        <p className="mb-4">
          Moderna frånluftsvärmepumpar, särskilt inverterstyrda modeller, är otroligt effektiva. Medan en äldre pump från tidigt 2000-tal kanske hade ett SCOP-värde (årsvärmefaktor) på runt 2.5, kan en modern pump leverera närmare 4-5 kWh värme för varje kWh el den förbrukar. I en normalstor villa (130-150 kvm) innebär bytet från en 15 år gammal pump till en ny ofta en besparing på <strong>4 000 - 6 000 kWh per år</strong>.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-6"> ROT-avdrag för frånluftsvärmepump</h2>
        <p className="mb-4">
          Du har rätt att använda ROT-avdraget för arbetskostnaden när du installerar en frånluftsvärmepump. För värmepumpar tillämpas ofta en schablon från Skatteverket där arbetskostnaden räknas som 30% av totalkostnaden. Du får dra av 30% av denna arbetskostnad (vilket motsvarar 9% av totalkostnaden). Detta är inbyggt i vår kalkylator.
        </p>

        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-bold text-emerald-900 mb-2">Tips inför offertförfrågan!</h3>
          <p className="text-emerald-800 mb-0">
            När du tar in offerter på frånluftsvärmepumpar, se till att jämföra "äpplen med äpplen". Ingår bortforsling av din gamla pump? Ingår injustering av ventilationssystemet i priset? Ingår eventuella elarbeten om nya säkringar krävs? Detta är vanliga dolda kostnader som oseriösa aktörer lämnar utanför sitt grundpris.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-6">Jämför med andra värmesystem</h2>
        <p className="mb-4">
          Är du osäker på om frånluftsvärme är rätt för dig, eller funderar du på andra alternativ? Jämför kostnader och teknik med våra andra kalkylatorer:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><a href="/verktyg/varmepump-kalkylator" className="text-emerald-700 hover:text-emerald-600 underline">Värmepump Kalkylator (Översikt)</a></li>
          <li><a href="/verktyg/bergvarme-kalkylator" className="text-emerald-700 hover:text-emerald-600 underline">Bergvärme Kalkylator</a></li>
          <li><a href="/verktyg/jordvarme-kalkylator" className="text-emerald-700 hover:text-emerald-600 underline">Jordvärme Kalkylator</a></li>
        </ul>

      </article>
    </>
  );
}
