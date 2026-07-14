import { type Metadata } from 'next';
import Link from 'next/link';
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
  description: "Ett verktyg för att uppskatta kostnaden för en badrumsrenovering i Sverige.",
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

export default function BathroomCalculatorPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#0f172a] pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="sticky top-0 z-40 border-b border-[#e2e8f0] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-xl font-black tracking-tight text-[#0f172a] sm:text-2xl">
              Saga
            </span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-[#6366f1] sm:inline">
              Fråga Saga
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <Link href="/verktyg/renoverings-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Renovering</Link>
            <Link href="/verktyg/badrumsrenovering-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Badrum</Link>
            <Link href="/verktyg/takbyte-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Tak</Link>
            <Link href="/verktyg/fasadrenovering-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Fasad</Link>
            <Link href="/verktyg/maleriarbete-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Måleri</Link>
            <Link href="/verktyg/solcells-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Solceller</Link>
            <Link href="/verktyg/varmepump-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Värmepump</Link>
            <Link href="/verktyg/bergvarme-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Bergvärme</Link>
            <Link href="/verktyg/franluftvarme-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Frånluftsvärme</Link>
            <Link href="/verktyg/jordvarme-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Jordvärme</Link>
            <Link href="/verktyg/vvs-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">VVS</Link>
          </nav>
          <div className="text-right hidden sm:block">
            <div className="font-bold tabular-nums text-[#0f172a]">3 841</div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-[#64748b]">
              offerter analyserade
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6366f1]">
            Kostnadskalkylator
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0f172a] sm:text-5xl">
            Badrumsrenovering Pris 2026
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg font-medium text-slate-600">
            Funderar du på vad badrummet kommer kosta? Vår kalkylator baseras på
            Sagas insamlade marknadsdata och aktuella snittpriser. Få en realistisk
            uppskattning direkt.
          </p>
        </div>

        <BathroomCalculator />

        <div className="mt-16 rounded-[22px] border border-[#e2e8f0] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0f172a]">
            Så bygger vår prisdata för badrum
          </h2>
          <div className="mt-6 space-y-4 text-base font-medium text-slate-700 leading-relaxed">
            <p>
              Priserna i denna kalkylator bygger på verkliga offerter från hela
              Sverige under 2025 och 2026, justerade för regionala skillnader.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Storlek:</strong> Det mest avgörande. Fler kvadratmeter
                kräver mer tätskikt, fler plattor och mer arbetstid.
              </li>
              <li>
                <strong>Standard:</strong> Val av kakel, klinker, kommod och
                blandare styr materialkostnaden avsevärt. Standard kakel kostar
                kanske 300 kr/kvm, exklusiv sten kan kosta 1500 kr/kvm.
              </li>
              <li>
                <strong>Region:</strong> Hantverkare i storstäder (särskilt
                Stockholm) tar ofta ett högre timpris (600–800 kr) än på mindre
                orter (450–600 kr).
              </li>
            </ul>
            <p className="mt-4 text-sm bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-900">
              <strong>Ett tips:</strong> När du väl får offerter på din
              badrumsrenovering — ladda upp dem på vår startsida! Fråga Saga
              analyserar dem kostnadsfritt rad för rad, och kollar dessutom upp att
              byggfirman har F-skatt och ordnad ekonomi.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}