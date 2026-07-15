import { type Metadata } from 'next';
import Link from 'next/link';
import RenovationCalculator from './RenovationCalculator';

export const metadata: Metadata = {
  title: 'Renoveringskalkylator 2026 – Räkna ut priset för din renovering',
  description:
    'Vad kostar din renovering? Använd vår gratis kalkylator för att räkna ut priset baserat på rum, yta och materialstandard. Få en realistisk uppskattning direkt.',
  keywords: [
    'renoveringskalkylator',
    'kostnad renovering',
    'pris renovering 2026',
    'räkna ut renoveringspris',
    'totalrenovering pris',
    'renovera hus kostnad'
  ],
  alternates: {
    canonical: 'https://fragasaga.se/verktyg/renoverings-kalkylator',
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
    title: 'Renoveringskalkylator 2026',
    description: 'Räkna ut priset för din renovering direkt.',
    url: 'https://fragasaga.se/verktyg/renoverings-kalkylator',
    siteName: 'Fråga Saga',
    locale: 'sv_SE',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Renoveringskalkylator",
  url: "https://fragasaga.se/verktyg/renoverings-kalkylator",
  description: "Ett verktyg för att uppskatta kostnaden för en renovering i Sverige.",
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

export default function RenovationCalculatorPage() {
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
            <Link href="/saga-index" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Saga Index</Link>
            <Link href="/verktyg/renoverings-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Renovering</Link>
            <Link href="/verktyg/badrumsrenovering-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Badrum</Link>
            <Link href="/verktyg/takbyte-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Tak</Link>
            <Link href="/verktyg/fasadrenovering-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Fasad</Link>
            <Link href="/verktyg/solcells-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Solceller</Link>
            <Link href="/verktyg/bergvarme-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Bergvärme</Link>
            <Link href="/verktyg/franluftvarme-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Frånluftsvärme</Link>
            <Link href="/verktyg/jordvarme-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Jordvärme</Link>
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
            Renoveringspris 2026
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg font-medium text-slate-600">
            Funderar du på vad din renovering kommer kosta? Vår kalkylator baseras på
            Sagas insamlade marknadsdata och aktuella snittpriser. Få en realistisk
            uppskattning direkt.
          </p>
        </div>

        <RenovationCalculator />

        <div className="mt-16 rounded-[22px] border border-[#e2e8f0] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0f172a]">
            Så bygger vår prisdata för renoveringar
          </h2>
          <div className="mt-6 space-y-4 text-base font-medium text-slate-700 leading-relaxed">
            <p>
              Priserna i denna kalkylator bygger på verkliga offerter från hela Sverige under 2025 och 2026.
              Att bygga upp ett hem eller fräscha upp ytskikten innebär ofta en stor investering. Här går vi igenom
              viktiga faktorer som styr priset på din renovering.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Yta och Typ av rum:</strong> Våtutrymmen som badrum och kök (inkluderar rör och el) kostar betydligt mer per kvadratmeter än torra utrymmen (som sovrum och vardagsrum). En ytskiktsrenovering i vardagsrum kan ligga på 1500–3000 kr/kvm, medan ett badrum ofta ligger på 25 000–35 000 kr/kvm.
              </li>
              <li>
                <strong>Materialstandard:</strong> Budgetval drar ner materialkostnaden väsentligt. Premiumval (t.ex. äkta sten, platsbyggt kök, mässingblandare) kan lätt dubbla prislappen. Att välja slitstarka, standardmaterial är ofta det mest prisvärda och hållbara i längden.
              </li>
              <li>
                <strong>ROT-avdrag:</strong> Du kan dra av 30 % av arbetskostnaden upp till 50 000 kr per person och år. Vid renoveringar utgör arbetet oftast 40–60 % av den totala kostnaden (i vår kalkyl schablon på 50%). Kom ihåg att kontrollera med Skatteverket hur mycket ROT du har kvar att utnyttja i år.
              </li>
              <li>
                <strong>Val av entreprenad:</strong> Om du väljer totalentreprenad där en byggfirma sköter hela processen och samordnar olika hantverkare, blir det ofta dyrare än om du agerar projektledare själv. Fördelen är att du får en kontaktperson och tydligare garantier.
              </li>
              <li>
                <strong>Ålder på bostad:</strong> I äldre hus kan du stöta på oförutsedda utgifter, som att behöva byta ut gamla rör eller eldragningar för att möta dagens byggnormer. Det är bra att ha en buffert på 10-15% för detta.
              </li>
            </ul>
            <p className="mt-4 text-sm bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-900">
              <strong>Ett tips:</strong> När du får in dina renoveringsofferter — ladda upp dem på vår startsida! Fråga Saga
              analyserar dem kostnadsfritt rad för rad, jämför priser mot vår databas, och kollar dessutom upp att
              byggfirman har F-skatt och ordnad ekonomi. Trygga din renovering.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
