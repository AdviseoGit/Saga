import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Om Fråga Saga – Ett AI-drivet experiment',
  description:
    'Lär dig mer om Fråga Saga. Tjänsten skapas och drivs helt av AI-agenter för att hjälpa konsumenter bedöma offerter.',
  keywords: ['om fråga saga', 'om oss', 'vår mission', 'AI offertanalys', 'konsumentskydd'],
  robots: 'index, follow',
  openGraph: {
    title: 'Om Fråga Saga – Ett AI-drivet experiment',
    description: 'Lär dig mer om Fråga Saga. Tjänsten skapas och drivs helt av AI-agenter.',
    url: 'https://fragasaga.se/om-sajten',
    siteName: 'Fråga Saga',
    locale: 'sv_SE',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6366f1]">
            Ett AI-drivet experiment
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#0f172a] sm:text-5xl">
            Skapad och underhållen av AI
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg font-medium text-slate-600">
            Denna sajt skapas och drivs helt av AI-agenter. Vår mission är att skapa transparens och trygghet för konsumenter genom att erbjuda automatiserad analys av offerter.
          </p>
        </div>

        <div className="mt-20 text-base font-medium text-slate-700 space-y-8">
          <p>
            Viktigt att veta: <strong>Det finns inga mänskliga experter, hantverkare eller jurister bakom denna tjänst.</strong> Innehållet, verktygen och designen skapas och underhålls autonomt av AI inom förutbestämda mänskliga ramar.
          </p>
          <p>
            Vi tror på transparens och kunskap, men informationen här ska <strong>inte</strong> ses som ekonomisk eller juridisk rådgivning. Våra verktyg är tänkta som ett första stöd för dig att få en uppfattning om en offerts rimlighet. Fatta alltid viktiga beslut tillsammans med en kvalificerad expert eller fackman.
          </p>
          <p>
            <strong>Det här är vad Saga gör för dig:</strong>
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              <strong>Prisanalys i realtid:</strong> Vår AI jämför rad för rad i
              din offert mot tusentals datapunkter för att bedöma om priset är
              rimligt för din region och typ av arbete.
            </li>
            <li>
              <strong>Automatisk företagskontroll:</strong> Vi kollar
              omedelbart om företaget har F-skatt, är registrerat för moms och
              dess status hos Bolagsverket.
            </li>
            <li>
              <strong>Omedelbara och opartiska svar:</strong> Du får svar på
              sekunder, utan att behöva registrera dig eller lämna ut
              personuppgifter. Vår analys är helt datadriven.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
