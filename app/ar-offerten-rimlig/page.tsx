
import { Metadata } from 'next';

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
  title: 'Är Offerten Rimlig? Fråga Saga Granskar Din Hantverkaroffert Gratis',
  description: 'Osäker på om din hantverkaroffert är rimlig? Ladda upp och få en gratis analys av Fråga Saga. Vi hjälper dig jämföra priser och undvika överpriser.',
  openGraph: {
    title: 'Är Offerten Rimlig? Få en Kostnadsfri Granskning av Fråga Saga',
    description: 'Låt oss hjälpa dig avgöra om din offert från hantverkare är skälig. Vår AI-drivna tjänst analyserar din offert och ger dig snabbt svar, helt gratis.',
    url: 'https://fragasaga.se/ar-offerten-rimlig',
    siteName: 'Fråga Saga',
    images: [
      {
        url: 'https://fragasaga.se/og-image.png', // Update with a specific image later
        width: 1200,
        height: 630,
      },
    ],
    locale: 'sv_SE',
    type: 'website',
  },
};

export default function ArOffertenRimligPage() {
  return (
    <div className="bg-white text-gray-800">
      <main className="container mx-auto px-4 py-8">
        <article className="prose lg:prose-xl max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Är offerten från hantverkaren rimlig? Så här vet du.</h1>
          <p className="lead text-lg">
            Att få en offert från en hantverkare är första steget i ett spännande projekt, men det kan också vara en källa till osäkerhet. Hur vet man att priset är rättvist och att alla delar finns med? Ett för högt pris kan dränera din budget, medan ett misstänkt lågt pris kan signalera dolda kostnader eller undermålig kvalitet. Här går vi igenom nyckelfaktorerna för att bedöma om din offert är rimlig.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">1. Jämför alltid flera offerter</h2>
          <p>
            Det absolut viktigaste rådet är att aldrig nöja dig med en enda offert. Ta in anbud från minst tre olika, seriösa hantverkare. Detta ger dig en tydlig bild av marknadspriset för just ditt projekt. Om en offert avviker markant från de andra – antingen mycket högre eller mycket lägre – är det en varningsflagga. Använd Fråga Sagas kostnadsfria verktyg för att få en oberoende första bedömning.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3">2. Granska detaljerna i offerten – vad ingår?</h2>
          <p>
            En rimlig offert är detaljerad. Den specificerar tydligt vad som ingår i priset och vad som kan tillkomma. Kontrollera följande punkter:
          </p>
          <ul>
            <li><strong>Materialkostnad:</strong> Är material specificerat? Vilken kvalitet och vilket märke? Ingår allt material eller förväntas du köpa något själv?</li>
            <li><strong>Arbetskostnad:</strong> Hur många timmar beräknas arbetet ta? Vad är timpriset? Är det fast pris eller löpande räkning?</li>
            <li><strong>Start- och slutdatum:</strong> Finns en tidsplan? Vad händer vid eventuella förseningar?</li>
            <li><strong>ROT-avdrag:</strong> Är avdraget specificerat direkt på offerten? Seriösa företag sköter detta automatiskt.</li>
            <li><strong>Eventuella tillägg:</strong> Framgår det vad som händer om oförutsedda problem uppstår? Hur hanteras ändringar och tilläggsarbeten?</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-3">3. Kontrollera företagets bakgrund</h2>
          <p>
            Ett rimligt pris är bara en del av ekvationen. Företaget måste också vara pålitligt. Innan du accepterar en offert, se till att:
          </p>
          <ul>
            <li><strong>F-skatt och moms:</strong> Kontrollera att företaget är registrerat för F-skatt och moms. Det är en förutsättning för att kunna göra ROT-avdrag.</li>
            <li><strong>Referenser:</strong> Be om referenser från tidigare, liknande projekt. Ring upp dem och fråga hur samarbetet fungerade.</li>
            <li><strong>Försäkringar:</strong> Har företaget en giltig ansvarsförsäkring om olyckan skulle vara framme?</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3">Låt Fråga Saga ge dig sinnesro</h2>
          <p>
            Känns det fortfarande överväldigande? Det är här Fråga Saga kommer in i bilden. Vi har utvecklat ett verktyg som, med hjälp av data från tusentals verkliga projekt, kan ge dig en snabb och träffsäker bedömning. Ladda upp din offert, svara på några enkla frågor om projektet, och få en oberoende analys helt gratis. Vi hjälper dig att fatta ett tryggt och välgrundat beslut.
          </p>
        </article>
      </main>
    </div>
  );
}
