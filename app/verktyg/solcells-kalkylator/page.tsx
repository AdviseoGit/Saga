import { type Metadata } from 'next';
import SolcellsCalculator from './SolcellsCalculator';

export const metadata: Metadata = {
  title: 'Solcellskalkylator 2026 – Räkna ut pris och lönsamhet',
  description:
    'Vad kostar solceller? Använd vår gratis kalkylator för att räkna ut pris, produktion och återbetalningstid för din solcellsanläggning.',
  keywords: [
    'solceller kalkylator',
    'kostnad solceller',
    'pris solceller 2026',
    'räkna ut solceller pris',
    'solpaneler pris',
    'återbetalningstid solceller',
    'grön teknik avdrag'
  ],
  robots: 'index, follow',
  openGraph: {
    title: 'Solcellskalkylator 2026',
    description: 'Räkna ut pris och lönsamhet för dina solceller direkt.',
    url: 'https://fragasaga.se/verktyg/solcells-kalkylator',
    siteName: 'Fråga Saga',
    locale: 'sv_SE',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Solcellskalkylator",
  url: "https://fragasaga.se/verktyg/solcells-kalkylator",
  description: "Ett verktyg för att uppskatta kostnaden och produktionen för solceller i Sverige.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  inLanguage: "sv-SE",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "SEK"
  }
};

export default function SolcellsCalculatorPage() {
  return (
    <main className="bg-[#f8fafc] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6366f1]">
            Lönsamhetskalkylator
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0f172a] sm:text-5xl">
            Solceller Pris & Kalkyl 2026
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg font-medium text-slate-600">
            Funderar du på om solceller är en bra affär? Vår kalkylator baseras på
            Sagas insamlade marknadsdata och aktuella snittpriser. Få en realistisk
            uppskattning av både kostnad och produktion direkt.
          </p>
        </div>

        <SolcellsCalculator />

        <div className="mt-16 rounded-[22px] border border-[#e2e8f0] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0f172a]">
            Så bygger vår prisdata för solceller
          </h2>
          <div className="mt-6 space-y-4 text-base font-medium text-slate-700 leading-relaxed">
            <p>
              Priserna i denna kalkylator bygger på aktuella snittpriser från hela Sverige under 2025 och 2026. Solcellsmarknaden är rörlig, men våra kalkyler ger dig ett stabilt riktmärke att jämföra offerter mot.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Anläggningens storlek:</strong> Storleken på systemet (mätt i kW) är den enskilt största faktorn. En större anläggning har en högre totalkostnad, men priset per installerad kilowatt sjunker ofta.
              </li>
              <li>
                <strong>Taktyp och riktning:</strong> Ett standard tak är billigare att montera på. Optimal riktning är söderläge, men även öst/väst är lönsamt idag. Vi räknar med standardmontage på tegeltak i kalkylen.
              </li>
              <li>
                <strong>Grön Teknik Avdrag:</strong> För privatpersoner täcker skattereduktionen för Grön Teknik upp till 20% av material- och arbetskostnaden. Detta hanteras direkt på fakturan av installationsföretaget. Vi räknar med de standardiserade procentsatserna.
              </li>
               <li>
                <strong>Återbetalningstid:</strong> Beror på ditt elpris, hur mycket du förbrukar själv och vad du kan sälja överskottet för. Skattereduktionen för såld el (60 öre/kWh) ingår ofta i de kalkyler företagen ger.
              </li>
            </ul>
            <p className="mt-4 text-sm bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-900">
              <strong>Ett tips:</strong> När du väl får offerter på din solcellsanläggning — ladda upp dem på vår startsida! Fråga Saga
              analyserar dem kostnadsfritt rad för rad, och kollar dessutom upp att
              solcellsföretaget har F-skatt och ordnad ekonomi. Många aktörer har gått i konkurs, så en kreditkoll är kritisk.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
