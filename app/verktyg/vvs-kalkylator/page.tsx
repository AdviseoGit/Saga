import { Metadata } from "next";
import Link from "next/link";
import LeadForm from "@/components/Calculators/LeadForm";

export const metadata: Metadata = {
  title: "VVS Kalkylator – Räkna ut pris för rörmokare & rördragning",
  description:
    "Räkna ut vad ditt VVS-projekt bör kosta. Vår VVS-kalkylator ger dig en rimlighetsbedömning baserad på svenska marknadspriser för rörmokare och material.",
};

export default function VVSKalkylatorPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#0f172a] pb-20">
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
            <Link href="/verktyg/badrumsrenovering-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Badrum</Link>
            <Link href="/verktyg/takbyte-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Tak</Link>
            <Link href="/verktyg/solcells-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Solceller</Link>
            <Link href="/verktyg/varmepump-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Värmepump</Link>
            <Link href="/verktyg/fasadrenovering-kalkylator" className="text-sm font-bold text-slate-600 hover:text-[#0f172a] transition-colors">Fasad</Link>
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

      <section className="px-4 pt-12 pb-8 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            VVS Kalkylator
          </h1>
          <p className="mt-4 text-lg text-slate-600 font-medium">
            Räkna ut vad din VVS-installation, rördragning eller service bör kosta. Fyll i detaljerna nedan för att få en prisindikation baserad på dagsaktuella timpriser för rörmokare.
          </p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
                    <LeadForm toolName="VVS Kalkylator" />

          <div className="mt-12 space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold">Så fungerar prissättning för VVS och rörmokare</h2>
            
            <div>
              <h3 className="text-lg font-bold mb-2">Timpris för rörmokare 2026</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Det genomsnittliga timpriset för en certifierad rörmokare (VVS-montör) i Sverige ligger idag på mellan <strong>650 kr och 850 kr i timmen inklusive moms</strong> (före ROT-avdrag). I storstäder som Stockholm kan priset ligga något högre, ofta runt 750-950 kr per timme.
              </p>
              <p className="text-slate-600 leading-relaxed">
                När du använder vår VVS-kalkylator får du en uppskattning baserad på dessa snittpriser, justerat för projektets tänkta omfattning och materialkostnader.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Materialpåslag – det dolda priset</h3>
              <p className="text-slate-600 leading-relaxed">
                En viktig sak att granska i en VVS-offert är materialpåslaget. Många rörfirmor köper in material med rabatt från grossister och lägger sedan på en marginal (ofta 15-30%) när de fakturerar dig. Det är standard i branschen, men påslaget ska vara rimligt. Om du väljer att köpa material själv, var beredd på att rörmokaren ofta inte lämnar garanti på själva materialet, utan endast på sitt utförda arbete.
              </p>
            </div>

             <div>
              <h3 className="text-lg font-bold mb-2">ROT-avdrag för VVS-arbeten</h3>
              <p className="text-slate-600 leading-relaxed">
                Du kan använda ROT-avdraget för arbetskostnaden vid VVS-installationer, reparationer och underhåll i din bostad. ROT-avdraget täcker 30% av arbetskostnaden (upp till max 50 000 kr per person och år). Observera att ROT <em>inte</em> gäller för materialkostnader eller resekostnader (servicebil).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Servicebil och inställelseavgift</h3>
              <p className="text-slate-600 leading-relaxed">
                Utöver timpriset tillkommer i stort sett alltid en avgift för servicebil (ofta 400-600 kr per besök) samt ibland en inställelseavgift. Kontrollera alltid i offerten om dessa avgifter är inbakade i timpriset eller tillkommer separat.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
               <h3 className="text-lg font-bold text-blue-900 mb-2">Tips från Saga: Säker Vatten</h3>
               <p className="text-blue-800 leading-relaxed text-sm">
                 När du anlitar en rörmokare är det otroligt viktigt att företaget är auktoriserat enligt "Säker Vatten". Det är en branschstandard som minimerar risken för vattenskador. Många försäkringsbolag kräver att VVS-arbeten utförs enligt denna standard för att din hemförsäkring ska gälla fullt ut vid en eventuell skada.
               </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
