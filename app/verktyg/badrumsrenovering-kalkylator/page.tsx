import { type Metadata } from 'next';
import BathroomCalculator from './BathroomCalculator';

export const metadata: Metadata = {
  title: 'Badrumsrenovering Kalkylator 2026 – Räkna ut priset',
  description:
    'Hur mycket kostar en badrumsrenovering 2026? Använd vår gratis kalkylator för att räkna ut priset baserat på dina val. Jämför sedan mot dina offerter.',
  keywords: [
    'badrumsrenovering kalkylator',
    'kostnad badrum',
    'pris badrum 2026',
    'räkna ut badrumspris',
    'badrumsrenovering pris',
  ],
  alternates: {
    canonical: 'https://fragasaga.se/verktyg/badrumsrenovering-kalkylator',
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
    title: 'Badrumsrenovering Kalkylator 2026',
    description: 'Räkna ut priset för din badrumsrenovering direkt.',
    url: 'https://fragasaga.se/verktyg/badrumsrenovering-kalkylator',
    siteName: 'Fråga Saga',
    locale: 'sv_SE',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Badrumsrenovering Kalkylator",
  url: "https://fragasaga.se/verktyg/badrumsrenovering-kalkylator",
  description: "Räkna ut priset för att renovera ett badrum i Sverige 2026. Få en prisuppskattning online.",
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

export default function BadrumCalculatorPage() {
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
              Badrumsrenovering Kalkylator 2026
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Vad kostar det att renovera badrummet? Räkna ut ett rimligt pris baserat på yta, materialval och dina unika förutsättningar.
            </p>
          </div>

          <div className="max-w-4xl mx-auto py-8">
            <div className="grid md:grid-cols-2 gap-12">
              <BathroomCalculator />
              
              <div className="mt-12 md:mt-0">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Att tänka på inför din badrumsrenovering</h2>
                <div className="space-y-6 text-slate-700">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">1. Budget & Marginaler</h3>
                    <p>En badrumsrenovering kostar oftast mer än planerat. Räkna alltid med en budgetmarginal på 10-15% för oväntade fel, såsom fuktskador som upptäcks efter rivning.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">2. Certifierade hantverkare</h3>
                    <p>Anlita enbart firmor med våtrumsbehörighet (t.ex. BKR eller GVK). Kontrollera även F-skatt och be om referenser från tidigare projekt.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">3. Material vs Arbete</h3>
                    <p>Vid en badrumsrenovering utgör arbetskostnaden en stor del. ROT-avdraget täcker endast arbetskostnaden (upp till 50 000 kr/år), inte material.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">4. Planering av el och VVS</h3>
                    <p>Flytt av brunn, nya eldragningar och inbyggda spotlights drar snabbt iväg kostnaden. Planera noggrant innan arbetet börjar för att undvika dyra sista-minuten-ändringar.</p>
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
