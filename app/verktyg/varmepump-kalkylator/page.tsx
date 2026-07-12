import { type Metadata } from 'next';
import HeatPumpCalculator from './HeatPumpCalculator';

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
          
        </div>
      </div>
    </>
  );
}