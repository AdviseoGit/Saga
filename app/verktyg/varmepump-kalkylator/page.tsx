import { type Metadata } from 'next';
import HeatPumpCalculator from './HeatPumpCalculator';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Värmepump Kalkylator 2026 – Räkna ut pris på bergvärme & luftvärme',
  description:
    'Hur mycket kostar en värmepump 2026? Använd vår gratis kalkylator för att räkna ut priset för bergvärme, luft/vatten och luft/luft baserat på dina val.',
  keywords: [
    'värmepump kalkylator',
    'kostnad bergvärme',
    'pris värmepump 2026',
    'räkna ut pris luftvatten',
    'offert värmepump',
  ],
  alternates: {
    canonical: 'https://fragasaga.se/verktyg/varmepump-kalkylator',
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
    title: 'Värmepump Kalkylator 2026',
    description: 'Räkna ut priset för din värmepump direkt.',
    url: 'https://fragasaga.se/verktyg/varmepump-kalkylator',
    siteName: 'Fråga Saga',
    locale: 'sv_SE',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Värmepump Kalkylator",
  url: "https://fragasaga.se/verktyg/varmepump-kalkylator",
  description: "Räkna ut vad en installation av värmepump bör kosta 2026.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  inLanguage: "sv-SE",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "SEK"
  }
};

export default function VarmepumpPage() {
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
              Värmepump Kalkylator 2026
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Ska du installera bergvärme, luft/vatten eller luft/luft? Räkna ut ett rimligt 
              riktpris för din installation och undvik att betala överpris när du tar in offerter.
            </p>
          </div>
          
          <HeatPumpCalculator />
          
          <article className="max-w-4xl mx-auto py-12 px-4 text-slate-700 mt-12 bg-white rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Vilken värmepump är rätt för ditt hus?</h2>
            
            <p className="mb-4">
              Att välja rätt värmepump handlar om husets nuvarande värmesystem, din budget och husets storlek. Här är en snabbgenomgång av de vanligaste systemen:
            </p>

            <div className="space-y-8 mt-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Bergvärmepump</h3>
                <p className="mb-2">
                  Ger den största besparingen över tid men har högst investeringskostnad eftersom det kräver att man borrar ett eller flera hål på tomten (energibrunn). 
                  Kostar vanligtvis mellan <strong>140 000 – 210 000 kr</strong> installerat och klart. Lämpar sig bäst för hus med stor energiförbrukning.
                </p>
                <Link href="/verktyg/bergvarme-kalkylator" className="text-emerald-700 hover:text-emerald-600 font-medium text-sm">
                  → Testa vår specifika kalkylator för bergvärme
                </Link>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Luft/vattenvärmepump</h3>
                <p className="mb-2">
                  Ett utmärkt alternativ om du inte kan eller vill borra för bergvärme. Utvinner värme ur utomhusluften och för över den till husets vattenburna värmesystem. 
                  Kostnaden ligger normalt på <strong>100 000 – 140 000 kr</strong>. 
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Frånluftsvärmepump</h3>
                <p className="mb-2">
                  Standard i många hus byggda efter 1980. Återvinner värme ur ventilationsluften. Kräver att huset har mekanisk frånluft. 
                  Kostar vanligen <strong>80 000 – 115 000 kr</strong> installerat. 
                </p>
                <Link href="/verktyg/franluftvarme-kalkylator" title="Frånluftsvärmepump kalkylator - Räkna ut pris 2026" className="text-emerald-700 hover:text-emerald-600 font-medium text-sm">
                  → Räkna på frånluftsvärmepump här (uppdaterad 2026)
                </Link>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Luft/luftvärmepump</h3>
                <p className="mb-2">
                  Det billigaste alternativet (ca <strong>18 000 – 30 000 kr</strong>) som värmer inomhusluften direkt via en innerdel (blåser varm luft). 
                  Perfekt komplement till direktverkande el. Ger dock inget varmvatten.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
