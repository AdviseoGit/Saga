import { Metadata } from "next";
import Link from "next/link";
import LeadForm from "@/components/Calculators/LeadForm";

export const metadata: Metadata = {
  title: "Måleriarbete Kalkylator – Beräkna pris för målare | Fråga Saga",
  description: "Räkna ut rimligt pris för måleriarbete direkt. Vår kalkylator uppskattar kostnad för material och arbetskostnad efter ROT-avdrag för målare.",
  keywords: ["måleriarbete kalkylator", "pris målare", "kostnad måla om", "målare offert", "rotavdrag målare", "måla fasad pris", "måla inomhus pris"],
  alternates: {
    canonical: 'https://fragasaga.se/verktyg/maleriarbete-kalkylator',
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
    title: "Måleriarbete Kalkylator – Beräkna pris för målare",
    description: "Räkna ut rimligt pris för måleriarbete direkt.",
    url: "https://fragasaga.se/verktyg/maleriarbete-kalkylator",
    siteName: "Fråga Saga",
    locale: "sv_SE",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Måleriarbete Kalkylator",
  "url": "https://fragasaga.se/verktyg/maleriarbete-kalkylator",
  "description": "Ett verktyg för att uppskatta kostnaden för måleriarbete i Sverige.",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "inLanguage": "sv-SE",
  "isAccessibleForFree": true,
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "SEK"
  }
};

export default function MaleriarbeteKalkylatorPage() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🦉</span>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Fråga <span className="text-indigo-600">Saga</span>
                </span>
              </Link>
            </div>
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
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 border-b border-slate-200">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 mb-4">
            Gratis Verktyg
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl mb-6">
            Måleriarbete Kalkylator
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Planerar du att måla om hemma? Använd vår kalkylator för att få en blixtsnabb uppskattning av vad en målare bör kosta. Beräkningen inkluderar arbetskostnad, material och ROT-avdrag.
          </p>
        </div>
      </section>

      {/* KALKYLATOR & LEAD FORM SEKTION */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* VÄNSTER: Info & Instruktioner */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Så här räknar du ut priset</h2>
            <p className="text-slate-600 mb-6">
              Att anlita en professionell målare är en investering som kräver en rimlig budget. Priset påverkas av faktorer som ytans storlek, underarbetets omfattning, färgkvalitet och om det rör sig om inomhus- eller utomhusmålning.
            </p>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">Snittpriser i Sverige (2026)</h3>
              <ul className="space-y-3 text-sm text-indigo-800">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span><strong>Timpris målare:</strong> 550 - 750 kr/tim (inkl. moms, före ROT).</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span><strong>Inomhusmålning (väggar/tak):</strong> ca 150 - 300 kr/m² (inkl. färg och ROT).</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span><strong>Fasadmålning (trä):</strong> ca 250 - 450 kr/m² (inkl. färg och ROT). Omfattande skrapning ökar priset.</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-indigo-500 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span><strong>Materialkostnad:</strong> Utgör ofta 15-25% av totalkostnaden beroende på färgval.</span>
                </li>
              </ul>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3">Tänk på underarbetet</h3>
            <p className="text-slate-600 mb-4">
              Underarbetet (tvätt, skrapning, spackling, slipning) är ofta det som tar mest tid och därmed kostar mest. En slät och fin yta kräver noggrant underarbete. Om du vill spara pengar kan du utföra delar av underarbetet själv, men tänk på att målaren kanske inte lämnar garanti på slutresultatet om de inte gjort hela jobbet.
            </p>
          </div>

          {/* HÖGER: LeadForm Component */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
              <div className="p-1 bg-indigo-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Få en exakt prisanalys</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Har du redan fått en offert? Ladda upp den så kontrollerar Sagas AI om priset för målningen är rimligt baserat på marknadsdata.
                </p>
                <LeadForm toolName="maleriarbete-kalkylator" />
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
