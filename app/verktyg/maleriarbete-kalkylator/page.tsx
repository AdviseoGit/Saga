import { Metadata } from "next";
import Link from "next/link";
import MaleriarbeteCalculator from "./MaleriarbeteCalculator";

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
            <Link href="/verktyg/varmepump-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Värmepump</Link>
            <Link href="/verktyg/vvs-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">VVS</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 border-b border-slate-200">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 mb-4">
            Kostnadskalkylator
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl mb-6">
            Måleriarbete Pris 2026
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-medium">
            Planerar du att måla om hemma eller måla fasaden? Använd vår kalkylator för att få en blixtsnabb uppskattning av vad en målare bör kosta. Beräkningen inkluderar arbetskostnad, material och ROT-avdrag.
          </p>
        </div>
      </section>

      {/* KALKYLATOR */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <MaleriarbeteCalculator />
      </section>
      
      {/* INFO SEKTION */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-8 mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Att tänka på när du anlitar en målare</h2>
        <div className="prose prose-slate max-w-none text-slate-700">
          <p>
            Att anlita en professionell målare är en investering som kräver en rimlig budget. Priset påverkas av faktorer som ytans storlek, underarbetets omfattning, färgkvalitet och om det rör sig om inomhus- eller utomhusmålning.
          </p>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 my-8">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Snittpriser i Sverige (2026)</h3>
            <ul className="space-y-3 text-sm text-indigo-800 list-none pl-0">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2 font-bold">•</span>
                <span><strong>Timpris målare:</strong> 550 - 750 kr/tim (inkl. moms, före ROT).</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2 font-bold">•</span>
                <span><strong>Inomhusmålning (väggar/tak):</strong> ca 150 - 300 kr/m² (inkl. färg och ROT).</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2 font-bold">•</span>
                <span><strong>Fasadmålning (trä):</strong> ca 250 - 450 kr/m² (inkl. färg och ROT). Omfattande skrapning ökar priset.</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2 font-bold">•</span>
                <span><strong>Materialkostnad:</strong> Utgör ofta 15-25% av totalkostnaden beroende på färgval.</span>
              </li>
            </ul>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-3">Underarbetet avgör priset</h3>
          <p>
            Underarbetet (tvätt, skrapning, spackling, slipning) är ofta det som tar mest tid och därmed kostar mest. En slät och fin yta kräver noggrant underarbete. Om du vill spara pengar kan du utföra delar av underarbetet själv, men tänk på att målaren kanske inte lämnar garanti på slutresultatet om de inte gjort hela jobbet.
          </p>
        </div>
      </section>
    </main>
  );
}
