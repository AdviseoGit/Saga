import { type Metadata } from 'next';
import BergvarmeCalculator from './BergvarmeCalculator';

export const metadata: Metadata = {
  title: 'Bergvärme Kalkylator 2026 – Räkna ut pris & borrning',
  description:
    'Hur mycket kostar bergvärme 2026? Använd vår gratis kalkylator för att räkna ut priset på bergvärmepump inklusive borrning och installation.',
  keywords: [
    'bergvärme kalkylator',
    'kostnad bergvärme',
    'kalkyl bergvärme',
    'bergvärmepump kalkyl',
    'pris bergvärme 2026',
    'offert bergvärme',
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
    title: 'Bergvärme Kalkylator 2026',
    description: 'Räkna ut priset för din bergvärmepump direkt.',
    url: 'https://fragasaga.se/verktyg/bergvarme-kalkylator',
    siteName: 'Fråga Saga',
    locale: 'sv_SE',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Bergvärme Kalkylator",
  url: "https://fragasaga.se/verktyg/bergvarme-kalkylator",
  description: "Räkna ut vad en installation av bergvärme bör kosta 2026.",
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

export default function BergvarmePage() {
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
              Bergvärme Kalkylator 2026
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Ska du installera bergvärme? Räkna ut ett rimligt riktpris för din bergvärmepump inklusive 
              borrning och installation, och undvik att betala överpris när du tar in offerter.
            </p>
          </div>
          
          <BergvarmeCalculator />
          
        </div>
      </div>
    </>
  );
}
