import { type Metadata } from 'next';
import RoofCalculator from './RoofCalculator';

export const metadata: Metadata = {
  title: 'Takbyte Kalkylator 2026 – Räkna ut priset för nytt tak',
  description:
    'Vad kostar ett takbyte? Använd vår gratis kalkylator för att räkna ut priset baserat på taktyp och yta. Få en realistisk uppskattning direkt.',
  keywords: [
    'takbyte kalkylator',
    'kostnad nytt tak',
    'pris takbyte 2026',
    'räkna ut takpris',
    'byta tak pris',
    'tegeltak kostnad',
    'plåttak kostnad',
    'papptak pris'
  ],
  alternates: {
    canonical: 'https://fragasaga.se/verktyg/takbyte-kalkylator',
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
    title: 'Takbyte Kalkylator 2026',
    description: 'Räkna ut priset för ditt takbyte direkt.',
    url: 'https://fragasaga.se/verktyg/takbyte-kalkylator',
    siteName: 'Fråga Saga',
    locale: 'sv_SE',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Takbyte Kalkylator",
  "url": "https://fragasaga.se/verktyg/takbyte-kalkylator",
  "description": "Ett verktyg för att uppskatta kostnaden för ett takbyte i Sverige.",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "inLanguage": "sv-SE",
  "isAccessibleForFree": true,
  "dateModified": "2026-08-08T08:00:00+00:00",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "SEK"
  }
};

export default function RoofCalculatorPage() {
  return (
    <main className="bg-[#f8fafc] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="text-center mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6366f1]">
            Kostnadskalkylator
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0f172a] sm:text-5xl">
            Takbyte Pris 2026
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg font-medium text-slate-600">
            Att byta tak kostar normalt <strong>700 – 1 800 kr per kvadratmeter</strong> (inklusive ROT-avdrag) år 2026, beroende på material och skick. Ett standardtak på 150 kvm med betongpannor kostar i snitt 150 000 kr efter ROT.
          </p>
        </div>

        <RoofCalculator />

        <div className="mt-16 rounded-[22px] border border-[#e2e8f0] bg-white p-8 shadow-sm prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-[#0f172a]">
            Vad kostar ett takbyte per kvadratmeter?
          </h2>
          <div className="mt-6 space-y-4 text-base font-medium text-slate-700 leading-relaxed">
            <p>
              Priserna i denna kalkylator bygger på verkliga offerter från hela
              Sverige under 2025 och 2026. Materialet är den enskilt största faktorn.
            </p>
            
            <div className="overflow-x-auto my-8">
              <table className="w-full text-left border-collapse not-prose">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-200">
                    <th className="p-4 font-bold text-slate-900">Takmaterial</th>
                    <th className="p-4 font-bold text-slate-900">Snittpris per kvm (efter ROT)</th>
                    <th className="p-4 font-bold text-slate-900">Hållbarhet</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-slate-100">
                    <td className="p-4">Papptak</td>
                    <td className="p-4">400 – 700 kr</td>
                    <td className="p-4">15 – 30 år</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-4">Betongpannor</td>
                    <td className="p-4">700 – 1 200 kr</td>
                    <td className="p-4">30 – 50 år</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-4">Tegelpannor</td>
                    <td className="p-4">900 – 1 500 kr</td>
                    <td className="p-4">40 – 100 år</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-4">Klickplåt / Profilplåt</td>
                    <td className="p-4">800 – 1 300 kr</td>
                    <td className="p-4">30 – 50 år</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-4">Bandtäckt plåt</td>
                    <td className="p-4">1 200 – 1 800 kr</td>
                    <td className="p-4">40 – 80 år</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-[#0f172a] mt-8">
              Hur mycket ROT-avdrag får man vid takbyte?
            </h2>
            <p>
              För privatpersoner täcker ROT-avdraget 30 % av arbetskostnaden upp till maximalt 50 000 kr per person och år. Arbetskostnaden utgör ofta 50–60 % av totalkostnaden för ett takbyte enligt <a href="https://skatteverket.se" target="_blank" rel="noopener noreferrer" className="underline text-slate-900">Skatteverket</a>. Är ni två ägare i hushållet kan ni få upp till 100 000 kr i ROT-avdrag totalt (se vår <a href="/rot-avdrag" className="underline text-slate-900">guide till ROT-avdrag</a>).
            </p>
            
            <h2 className="text-2xl font-bold text-[#0f172a] mt-8">
              Vad ingår i priset för ett takbyte?
            </h2>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li><strong>Rivning och bortforsling:</strong> Ta bort det gamla takmaterialet.</li>
              <li><strong>Underlag:</strong> Ny råspont (vid behov), underlagspapp och läkt.</li>
              <li><strong>Ytskikt:</strong> Takpannor, plåt eller papp.</li>
              <li><strong>Plåtarbete:</strong> Vindskiveplåt, fotplåt och skorstensbeslag.</li>
              <li><strong>Takavvattning:</strong> Hängrännor och stuprör (byts ofta i samma veva).</li>
              <li><strong>Säkerhet:</strong> Snörasskydd, takstegar och gångbryggor (lagkrav i många fall).</li>
            </ul>

            <p className="mt-8 text-sm bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-900">
              <strong>Ett tips:</strong> När du väl får offerter på ditt takbyte — ladda upp dem på vår startsida! Fråga Saga
              analyserar dem kostnadsfritt rad för rad, jämför priser mot vår databas, och kollar dessutom upp att
              byggfirman har F-skatt och ordnad ekonomi. Ett takbyte är en stor investering, se till att offerten är rimlig innan du signerar.
            </p>
            
            <p className="text-xs text-slate-500 mt-8 border-t pt-4">Källa priser: Sagas databas av granskade offerter (2025-2026). Uppdaterad 2026-08-08.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
