import { type Metadata } from 'next';
import RoofCalculator from './RoofCalculator';

export const metadata: Metadata = {
  title: 'Takbyte Kalkylator 2026 – Räkna ut priset för nytt tak',
  description:
    'Vad kostar ett takbyte? Använd vår gratis kalkylator för att räkna ut priset baserat på taktyp och yta. Få en realistisk uppskattning direkt.',
  keywords: [
    'takbyte kalkylator',
    'kostnad nytt tak',
    'pris takbyte 2026',
    'räkna ut takpris',
    'byta tak pris',
    'tegeltak kostnad',
    'plåttak kostnad',
    'papptak pris'
  ],
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
    title: 'Takbyte Kalkylator 2026',
    description: 'Räkna ut priset för ditt takbyte direkt.',
    url: 'https://fragasaga.se/verktyg/takbyte-kalkylator',
    siteName: 'Fråga Saga',
    locale: 'sv_SE',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Takbyte Kalkylator",
  url: "https://fragasaga.se/verktyg/takbyte-kalkylator",
  description: "Ett verktyg för att uppskatta kostnaden för ett takbyte i Sverige.",
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

export default function RoofCalculatorPage() {
  return (
    <main className="bg-[#f8fafc] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6366f1]">
            Kostnadskalkylator
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0f172a] sm:text-5xl">
            Takbyte Pris 2026
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg font-medium text-slate-600">
            Funderar du på vad ett nytt tak kommer kosta? Vår kalkylator baseras på
            Sagas insamlade marknadsdata och aktuella snittpriser. Få en realistisk
            uppskattning direkt.
          </p>
        </div>

        <RoofCalculator />

        <div className="mt-16 rounded-[22px] border border-[#e2e8f0] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0f172a]">
            Så bygger vår prisdata för takbyten
          </h2>
          <div className="mt-6 space-y-4 text-base font-medium text-slate-700 leading-relaxed">
            <p>
              Priserna i denna kalkylator bygger på verkliga offerter från hela
              Sverige under 2025 och 2026.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Takmaterial:</strong> Materialet är den största faktorn. Ett papptak är ofta det billigaste alternativet (från ca 400 kr/kvm), medan ett bandtäckt plåttak är ett av de dyraste men mest hållbara (över 1500 kr/kvm). Betongpannor och tegelpannor ligger i mellanskiktet.
              </li>
              <li>
                <strong>Takets yta:</strong> Fler kvadratmeter innebär mer material och längre arbetstid. Tänk på att takets yta alltid är större än husets bottenyta, särskilt vid branta tak.
              </li>
              <li>
                <strong>ROT-avdrag:</strong> För privatpersoner täcker ROT-avdraget 30% av arbetskostnaden upp till 50 000 kr (75 000 kr under en viss period 2024, men vi räknar med de ordinarie 50 000 kr per person). Vår kalkylator visar priset både med och utan ROT-avdrag. Arbetskostnaden utgör ofta 50-60% av totalkostnaden för ett takbyte.
              </li>
            </ul>
            <p className="mt-4 text-sm bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-900">
              <strong>Ett tips:</strong> När du väl får offerter på ditt takbyte — ladda upp dem på vår startsida! Fråga Saga
              analyserar dem kostnadsfritt rad för rad, jämför priser mot vår databas, och kollar dessutom upp att
              byggfirman har F-skatt och ordnad ekonomi. Ett takbyte är en stor investering, se till att offerten är rimlig innan du signerar.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
