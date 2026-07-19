import { type Metadata } from 'next';
import VVSCalculator from './VVSCalculator';

export const metadata: Metadata = {
  title: 'VVS Kalkylator – Räkna ut pris för rörmokare & rördragning | Fråga Saga',
  description:
    'Räkna ut vad ditt VVS-projekt bör kosta. Vår VVS-kalkylator ger dig en rimlighetsbedömning baserad på svenska marknadspriser för rörmokare och material.',
  keywords: [
    'vvs kalkylator',
    'pris rörmokare',
    'kostnad rördragning',
    'timpris vvs montör',
    'byta avloppsrör pris',
    'installera vatten kalkylator',
  ],
  alternates: {
    canonical: 'https://fragasaga.se/verktyg/vvs-kalkylator',
  },
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
  openGraph: {
    title: 'VVS Kalkylator – Räkna ut pris för rörmokare',
    description: 'Räkna ut vad ditt VVS-projekt bör kosta baserat på svenska marknadspriser.',
    url: 'https://fragasaga.se/verktyg/vvs-kalkylator',
    siteName: 'Fråga Saga',
    locale: 'sv_SE',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "VVS Kalkylator",
  url: "https://fragasaga.se/verktyg/vvs-kalkylator",
  description: "Räkna ut pris för VVS-arbeten, rördragning och timpris för rörmokare i Sverige.",
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

export default function VVSKalkylatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-[#f8fafc] min-h-screen border-t border-[#e2e8f0]">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl font-black tracking-tight text-[#0f172a] sm:text-4xl">
              VVS Kalkylator
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Vad kostar det att anlita en rörmokare för ditt VVS-projekt? Räkna ut en rimlig prisbild för installationer, rördragning och service.
            </p>
          </div>

          <div className="max-w-4xl mx-auto py-8">
            <div className="grid md:grid-cols-2 gap-12">
              <VVSCalculator />
              
              <div className="mt-12 md:mt-0">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Så fungerar prissättning för VVS och rörmokare</h2>
                <div className="space-y-6 text-slate-700">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">1. Timpris för rörmokare 2026</h3>
                    <p>Det genomsnittliga timpriset för en certifierad rörmokare i Sverige ligger idag på mellan <strong>650 kr och 850 kr i timmen inklusive moms</strong> (före ROT-avdrag). I storstäder som Stockholm kan priset ligga något högre, ofta runt 750-950 kr per timme.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">2. Materialpåslag – det dolda priset</h3>
                    <p>En viktig sak att granska i en VVS-offert är materialpåslaget. Många rörfirmor köper in material med rabatt från grossister och lägger sedan på en marginal (ofta 15-30%) när de fakturerar dig. Det är standard i branschen, men påslaget ska vara rimligt.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">3. ROT-avdrag för VVS-arbeten</h3>
                    <p>Du kan använda ROT-avdraget för arbetskostnaden vid VVS-installationer och reparationer. ROT täcker 30% av arbetskostnaden (upp till 50 000 kr/år). Det gäller <em>inte</em> för materialkostnader eller servicebil.</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-2">Tips från Saga: Säker Vatten</h3>
                    <p className="text-blue-800 text-sm">När du anlitar en rörmokare är det otroligt viktigt att företaget är auktoriserat enligt "Säker Vatten". Många försäkringsbolag kräver att VVS-arbeten utförs enligt denna standard för att din hemförsäkring ska gälla fullt ut vid en skada.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
