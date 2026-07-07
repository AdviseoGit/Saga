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
  title: 'Granska Offert från Hantverkare - Är Priset Rimligt?',
  description:
    'Få hjälp att granska din offert från hantverkare. Lär dig vad som ska ingå, hur du undviker överpriser och säkerställer att allt är korrekt innan du skriver på.',
}

export default function GranskaOffertHantverkare() {
  return (
    <SimpleLayout
      title="Är offerten från din hantverkare rimlig?"
      intro="Att anlita hantverkare är ett stort steg. Men hur vet du att offerten du fått är skälig? Vi hjälper dig att granska din offert, förstå vad som ska ingå och undvika de vanligaste fallgroparna."
    >
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-800">
            Steg 1: Kontrollera Företaget
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Innan du ens tittar på siffrorna, säkerställ att företaget är seriöst.
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
            Steg 2: Granska Offertens Innehåll
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
            Steg 3: Jämför och Förhandla
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
                Är du fortfarande osäker? Ladda upp din offert så gör vi en oberoende bedömning och ger dig feedback inom 24 timmar.
            </Card.Description>
             <Card.Cta>Ladda upp offert</Card.Cta>
          </Card>
        </section>

      </div>
    </SimpleLayout>
  )
}
