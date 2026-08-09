import { Card } from '../components/Card'
import { SimpleLayout } from '../components/SimpleLayout'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: 'https://fragasaga.se/granska-offert-hantverkare',
  },
  title: 'Granska Offert från Hantverkare - Är Priset Rimligt?',
  description:
    'Få hjälp att granska din offert från hantverkare. Lär dig vad som ska ingå, hur du undviker överpriser och säkerställer att allt är korrekt innan du skriver på.',
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Granska Offert från Hantverkare - Är Priset Rimligt?",
  "description": "Få hjälp att granska din offert från hantverkare. Lär dig vad som ska ingå, hur du undviker överpriser och säkerställer att allt är korrekt innan du skriver på.",
  "author": {
    "@type": "Organization",
    "name": "Fråga Saga"
  },
  "datePublished": "2024-01-01",
  "dateModified": new Date().toISOString().split("T")[0],
};

export default function GranskaOffertHantverkare() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SimpleLayout
      title="Är offerten från din hantverkare rimlig?"
      intro="För att granska en hantverkaroffert ska du kontrollera tre saker: att företaget har giltig F-skatt, att priset ligger mellan 600–850 kr i timmen inklusive moms (innan ROT), och att arbetskostnad och materialkostnad är tydligt separerade."
    >
      <div className="space-y-12">
        <section>
          <p className="text-xl font-medium text-gray-900 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50">
            <strong>Snabbt svar:</strong> En rimlig offert är tydligt uppdelad i arbete och material, har ett totalpris som inkluderar moms, och kommer från ett företag med godkänd F-skatt (ett absolut krav för att få göra 30% ROT-avdrag). En normal timpenning för en hantverkare ligger mellan 600 kr och 850 kr i timmen.
            <br/><br/>
            <span className="text-sm text-gray-500">Uppdaterad: {new Date().toISOString().split("T")[0]}</span>
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-800">
            Hur mycket kostar en hantverkare i timmen?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            En normal timpenning för hantverkare (snickare, målare, VVS) i Sverige ligger i snitt på <strong>600 kr – 850 kr</strong> i timmen inklusive moms, innan ROT-avdraget på 30% är draget. Att företaget har F-skatt är ett absolut krav för att du ska få göra ROT-avdrag.
          </p>
          <div className="mt-8 mb-8 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Hantverkare</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Snittpris per timme (inkl. moms)</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Kostnad efter 30% ROT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-600">Snickare</td>
                  <td className="px-4 py-3 text-slate-500">550 – 750 kr</td>
                  <td className="px-4 py-3 text-[#6366f1] font-medium">385 – 525 kr</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-600">Målare</td>
                  <td className="px-4 py-3 text-slate-500">500 – 650 kr</td>
                  <td className="px-4 py-3 text-[#6366f1] font-medium">350 – 455 kr</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-600">Elektriker</td>
                  <td className="px-4 py-3 text-slate-500">700 – 950 kr</td>
                  <td className="px-4 py-3 text-[#6366f1] font-medium">490 – 665 kr</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-600">VVS-montör / Rörmokare</td>
                  <td className="px-4 py-3 text-slate-500">750 – 1 000 kr</td>
                  <td className="px-4 py-3 text-[#6366f1] font-medium">525 – 700 kr</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-gray-800">
            Hur kontrollerar man företaget bakom offerten?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Innan du ens tittar på siffrorna, säkerställ att företaget är seriöst. 
            Det kan du göra genom att kolla upp företaget hos <a href="https://skatteverket.se" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Skatteverket</a> eller via tjänster som Allabolag.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg text-gray-600">
            <li>
              <b>F-skatt och moms:</b> Kontrollera att företaget är registrerat för F-skatt och moms hos Skatteverket. Detta är ett grundkrav för att kunna göra ROT-avdrag.
            </li>
            <li>
              <b>Skulder:</b> Finns det skulder hos Kronofogden? Ett företag med dålig ekonomi kan vara en risk.
            </li>
            <li>
              <b>Kollektivavtal och försäkringar:</b> Har företaget kollektivavtal och nödvändiga ansvarsförsäkringar? Det skyddar både dig och hantverkarna.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800">
            Vad ska en komplett offert innehålla?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            En bra offert är detaljerad och tydlig. Se upp för luddiga formuleringar.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-lg text-gray-600">
            <li>
              <b>Arbetskostnad och material:</b> Är kostnaden för arbete och material specificerad? Se till att det framgår vad som är vad, eftersom ROT-avdraget endast gäller arbetskostnaden.
            </li>
            <li>
              <b>Tidsplan:</b> Finns en tydlig start- och slutdatum? Vad händer vid förseningar?
            </li>
            <li>
              <b>Fast eller löpande pris:</b> Är det ett fast pris, löpande räkning eller takpris? Var medveten om för- och nackdelarna med varje modell.
            </li>
             <li>
              <b>Vad ingår – och vad ingår inte?</b> En seriös offert specificerar allt. "Exklusive el och VVS" är en vanlig brasklapp som kan bli dyr. Se till att allt du förväntar dig finns med.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800">
            Hur förhandlar man priset på en offert?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Ta alltid in offerter från flera (minst tre) olika företag. Det ger dig ett förhandlingsläge och en känsla for vad som är ett rimligt pris.
          </p>
           <p className="mt-4 text-lg text-gray-600">
            Kom ihåg: den billigaste offerten är inte alltid den bästa. Väg in referenser, tidsplan och kvalitetsintryck.
          </p>
        </section>
        
         <section>
          <Card>
            <Card.Title as="h3">
                Låt oss granska din offert – helt kostnadsfritt
            </Card.Title>
            <Card.Description>
                Är du fortfarande osäker? Ladda upp din offert så gör vår AI-assistent Saga en bedömning av priset, kollar F-skatt och ger dig förhandlingstips direkt.
            </Card.Description>
             <Card.Cta>Testa Saga kostnadsfritt här →</Card.Cta>
          </Card>
        </section>

      </div>
    </SimpleLayout>
    </>
  )
}
