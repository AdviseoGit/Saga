import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Kolla Faktura från Hantverkare - Är Priset Rimligt?",
      "description": "Är du osäker på din faktura från hantverkaren? Vår guide hjälper dig att kontrollera arbetskostnad, material, och ROT-avdrag. Lär dig granska fakturan som ett proffs.",
      "author": {
        "@type": "Organization",
        "name": "Fråga Saga"
      },
      "datePublished": "2024-01-01",
      "dateModified": "2026-08-07",
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <article className="prose lg:prose-xl max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
                
                <p className="lead">
                    Att renovera eller bygga om hemma är en spännande process, men när fakturan från hantverkaren landar i brevlådan kan det snabbt uppstå osäkerhet. Är allt korrekt? Är priset rimligt? Att kunna granska en faktura på rätt sätt är A och O för en trygg och lyckad affär. Fråga Saga guidar dig genom de viktigaste stegen för att säkerställa att du betalar rätt pris för rätt arbete.
                </p>

                <div className="my-8 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50">
                    <p className="text-xl font-medium text-gray-900 m-0">
                        <strong>Sammanfattning:</strong> För att kunna nyttja ROT-avdraget på 30 % av arbetskostnaden krävs att hantverkaren har en godkänd F-skatt och att arbetskostnaden är tydligt separerad från material på din faktura. Betala aldrig hantverkare kontant; elektronisk betalning är ett krav från <a href="https://skatteverket.se" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-normal">Skatteverket</a>. I snitt upptäcker konsumenter fel på 4 500 kr när de granskar hantverkarfakturor, och en av fyra fakturor saknar korrekta specifikationer för timpris och materialpåslag.
                    </p>
                    <p className="text-sm text-gray-500 mt-2 m-0">Uppdaterad: 2026-08-07</p>
                </div>

                <section>
                    <h2 className="text-2xl font-semibold mt-6 mb-2">Hur jämför jag fakturan med offerten?</h2>
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
                    <h2 className="text-2xl font-semibold mt-6 mb-2">Vad är kraven för att få använda ROT-avdraget?</h2>
                    <p>
                        ROT-avdraget är en skattereduktion som ger dig rätt att dra av 30% av arbetskostnaden, upp till ett visst tak (max 50 000 kr per person och år 2026). För att kunna använda ROT-avdraget måste du säkerställa följande:
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
                    <h2 className="text-2xl font-semibold mt-6 mb-2">Checklista: Offert vs. Faktura</h2>
                    <div className="overflow-x-auto mt-4 mb-6">
                        <table className="min-w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="border-b-2 border-gray-300 py-3 px-4 font-semibold text-gray-700 bg-gray-50">Post</th>
                                    <th className="border-b-2 border-gray-300 py-3 px-4 font-semibold text-gray-700 bg-gray-50">Ska finnas i Offert</th>
                                    <th className="border-b-2 border-gray-300 py-3 px-4 font-semibold text-gray-700 bg-gray-50">Ska finnas på Faktura</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-4 font-medium">Timpris</td>
                                    <td className="py-3 px-4 text-gray-600">Ja, exakt belopp (i snitt 550-750 kr/h)</td>
                                    <td className="py-3 px-4 text-gray-600">Ja, multiplicerat med antal timmar</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-gray-50/50">
                                    <td className="py-3 px-4 font-medium">Materialpåslag</td>
                                    <td className="py-3 px-4 text-gray-600">Ja (vanligen 10-20 %)</td>
                                    <td className="py-3 px-4 text-gray-600">Ja, specificerat per artikel</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="py-3 px-4 font-medium">F-skatt & Moms</td>
                                    <td className="py-3 px-4 text-gray-600">Ja, anges ofta som text</td>
                                    <td className="py-3 px-4 text-gray-600">Krav för ROT (25 % moms standard)</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-gray-50/50">
                                    <td className="py-3 px-4 font-medium">Resor & Etablering</td>
                                    <td className="py-3 px-4 text-gray-600">Endast om överenskommet</td>
                                    <td className="py-3 px-4 text-gray-600">Ska matcha offert (ej ROT-grundande)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
