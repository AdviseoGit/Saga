import { type Metadata } from 'next';
import FranluftvarmeCalculator from './FranluftvarmeCalculator';

export const metadata: Metadata = {
  title: 'Frånluftsvärmepump Kalkylator 2026 – Räkna ut pris & kostnad',
  description:
    'Hur mycket kostar en frånluftsvärmepump 2026? Använd vår gratis kalkylator för att räkna ut priset inklusive installation.',
  keywords: [
    'frånluftsvärmepump kalkylator',
    'kostnad frånluftsvärme',
    'kalkyl frånluftsvärme',
    'frånluftsvärmepump kalkyl',
    'pris frånluftsvärmepump 2026',
    'offert frånluftsvärme',
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
    title: 'Frånluftsvärmepump Kalkylator 2026',
    description: 'Räkna ut priset för din frånluftsvärmepump direkt.',
    url: 'https://fragasaga.se/verktyg/franluftvarme-kalkylator',
    siteName: 'Fråga Saga',
    locale: 'sv_SE',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Frånluftsvärmepump Kalkylator",
  url: "https://fragasaga.se/verktyg/franluftvarme-kalkylator",
  description: "Räkna ut vad en installation av frånluftsvärmepump bör kosta 2026.",
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

export default function FranluftvarmePage() {
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
              Frånluftsvärmepump Kalkylator 2026
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Behöver du byta din gamla frånluftsvärmepump? Räkna ut ett rimligt riktpris för 
              pump och installation, och se till att du inte betalar överpris.
            </p>
          </div>
          
          <FranluftvarmeCalculator />
          
        </div>
      </div>
    </>
  );
}
