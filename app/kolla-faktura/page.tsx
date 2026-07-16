import { Metadata } from "next";
import Link from "next/link";

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
    canonical: 'https://fragasaga.se/kolla-faktura',
  },
    title: "Kolla Faktura från Hantverkare - Är Priset Rimligt? | Fråga Saga",
    description: "Är du osäker på din faktura från hantverkaren? Vår guide hjälper dig att kontrollera arbetskostnad, material, och ROT-avdrag. Lär dig granska fakturan som ett proffs.",
    openGraph: {
        title: "Kolla Faktura från Hantverkare - Är Priset Rimligt? | Fråga Saga",
        description: "Är du osäker på din faktura från hantverkaren? Vår guide hjälper dig att kontrollera arbetskostnad, material, och ROT-avdrag. Lär dig granska fakturan som ett proffs.",
        url: "https://fragasaga.se/kolla-faktura",
    },
};

export default function KollaFakturaPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <article className="prose lg:prose-xl max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <header>
                    <h1 className="text-4xl font-bold mb-4">Fråga Saga: Din Guide för att Kontrollera Fakturor från Hantverkare</h1>
                </header>
                <p className="lead">
                    Att renovera eller bygga om hemma är en spännande process, men när fakturan från hantverkaren landar i brevlådan kan det snabbt uppstå osäkerhet. Är allt korrekt? Är priset rimligt? Att kunna granska en faktura på rätt sätt är A och O för en trygg och lyckad affär. Fråga Saga guidar dig genom de viktigaste stegen för att säkerställa att du betalar rätt pris för rätt arbete.
                </p>

                <section>
                    <h2 className="text-2xl font-semibold mt-6 mb-2">1. Jämför Fakturan med Offerten</h2>
                    <p>
                        Det allra första steget är att noggrant jämföra fakturan med den offert du ursprungligen godkände. Offerten är ditt avtal och din trygghet. Gå igenom varje post och säkerställ att de överensstämmer.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Arbetskostnad:</strong> Är timpriset detsamma som i offerten? Stämmer antalet arbetade timmar?</li>
                        <li><strong>Materialkostnad:</strong> Har hantverkaren specificerat allt material? Verkar mängden och priset rimligt i förhållande till det arbete som utförts?</li>
                        <li><strong>Övriga kostnader:</strong> Finns det några avgifter som inte nämndes i offerten, till exempel resekostnader, servicebil eller etableringsavgifter? Dessa ska vara tydligt specificerade i ert avtal.</li>
                    </ul>
                    <p>
                        Om något inte stämmer, eller om en kostnad är högre än avtalat, har du rätt att ifrågasätta det.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mt-6 mb-2">2. Kontrollera Specifikationerna – Tydlighet är Nyckeln</h2>
                    <p>
                        En seriös hantverkare lämnar alltid en specificerad faktura. Det innebär att varje moment, allt material och alla övriga kostnader är uppdelade och tydligt redovisade. Acceptera aldrig en klumpsumma utan en detaljerad förklaring. En specificerad faktura ger dig inte bara en tydlig överblick, utan är också ett krav för att du ska kunna nyttja ROT-avdraget.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mt-6 mb-2">3. ROT-avdraget – Din Rättighet som Konsument</h2>
                    <p>
                        ROT-avdraget är en skattereduktion som ger dig rätt att dra av 30% av arbetskostnaden, upp till ett visst tak. För att kunna använda ROT-avdraget måste du säkerställa följande:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Arbetskostnaden är specificerad:</strong> Avdraget gäller endast för arbete, inte material eller resekostnader.</li>
                        <li><strong>Företaget har F-skatt:</strong> Detta är ett grundläggande krav. Du kan enkelt kontrollera detta på Skatteverkets eller Allabolags hemsida.</li>
                        <li><strong>Du har betalat elektroniskt:</strong> Betalning måste ske via exempelvis kort, Swish eller banköverföring. Kontantbetalningar är inte giltiga för ROT-avdrag.</li>
                    </ul>
                    <p>
                        Hantverkaren ska dra av ROT-beloppet direkt på din faktura. Du betalar alltså det reducerade beloppet.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mt-6 mb-2">4. F-skatt och Moms – Tecken på ett Seriöst Företag</h2>
                    <p>
                        Att företaget är godkänt för F-skatt är inte bara ett krav för ROT-avdraget, det är också en grundläggande trygghet för dig som kund. Det visar att företaget sköter sina skatter och avgifter. Detta, tillsammans med att de är momsregistrerade (vilket ska framgå på fakturan med momsbelopp och procentsats specificerat), är starka indikatorer på att du har att göra med en pålitlig aktör.
                    </p>
                </section>

                <div className="mt-8 bg-gray-50">
                    <div className="p-6">
                        <h3 className="text-xl font-bold">Vanliga Fallgropar att Undvika</h3>
                        <ul className="list-disc pl-5 space-y-2 mt-4">
                            <li><strong>Ospecificerade fakturor:</strong> Kräv alltid en detaljerad faktura.</li>
                            <li><strong>"Glömda" kostnader:</strong> Alla avgifter ska finnas med i offerten. Nya kostnader måste godkännas av dig innan de läggs till.</li>
                            <li><strong>Kontantbetalning:</strong> Undvik detta helt, då det omöjliggör ROT-avdrag och minskar din trygghet.</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 text-center bg-blue-50 border-blue-200">
                    <div className="p-6">
                        <h3 className="text-xl font-bold">Låt Saga Granska Din Faktura – Kostnadsfritt</h3>
                        <p className="mb-4 mt-4">
                            Känner du dig fortfarande osäker? Ladda upp din faktura hos Fråga Saga så gör vi en kostnadsfri granskning. Vår AI-drivna tjänst analyserar varje del av din faktura, jämför den mot branschstandarder och flaggar för eventuella oklarheter. Få sinnesro och säkerställ att du betalar rätt pris – snabbt, enkelt och helt gratis.
                        </p>
                        <Link href="/" className="inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                            Granska faktura nu
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
