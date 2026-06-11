import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Om Fråga Saga – Vår Mission och Teknologi',
  description:
    'Lär dig mer om Fråga Saga, den AI-drivna tjänsten som hjälper dig granska offerter och fakturor. Vår mission är att skapa transparens och trygghet för konsumenter.',
  keywords: ['om fråga saga', 'om oss', 'vår mission', 'AI offertanalys', 'konsumentskydd'],
  robots: 'index, follow',
  openGraph: {
    title: 'Om Fråga Saga – Vår Mission och Teknologi',
    description: 'Lär dig mer om Fråga Saga, den AI-drivna tjänsten som hjälper dig granska offerter och fakturor.',
    url: 'https://fragasaga.se/om-oss',
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
            Vår Mission
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#0f172a] sm:text-5xl">
            Vi skapar trygghet i en osäker marknad
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg font-medium text-slate-600">
            Fråga Saga föddes ur en enkel insikt: att anlita hantverkare och
            andra serviceföretag är för många en källa till oro och osäkerhet.
            Hur vet man om ett pris är rimligt? Kan man lita på företaget? Vi
            finns för att ge dig svaren.
          </p>
        </div>

        <div className="mt-20 text-base font-medium text-slate-700 space-y-8">
          <p>
            Vårt mål är att ge vanliga konsumenter och småföretagare samma
            verktyg som stora inköpsavdelningar har. Genom att kombinera
            avancerad AI med offentliga data från svenska myndigheter som
            Skatteverket och Bolagsverket, kan vi omedelbart ge dig en bild av
            både priset och leverantörens seriositet.
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
          <p>
            Vi tror på transparens och kunskap. Genom att göra information
            lättillgänglig och begriplig, vill vi jämna ut maktbalansen mellan
            konsument och företag. Med Fråga Saga behöver du aldrig mer känna
            dig osäker på en offert.
          </p>
          <p>Tack för att du använder vår tjänst!</p>
        </div>
      </div>
    </main>
  );
}
