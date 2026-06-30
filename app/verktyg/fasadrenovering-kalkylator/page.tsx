import { type Metadata } from 'next';
import FacadeCalculator from './FacadeCalculator';

export const metadata: Metadata = {
  title: 'Fasadrenovering Kalkylator 2026 – Räkna ut priset',
  description:
    'Vad kostar det att renovera eller måla om fasaden? Använd vår gratis kalkylator för att räkna ut priset baserat på fasadtyp, åtgärd och storlek. Få en snabb uppskattning.',
  keywords: [
    'fasadrenovering kalkylator',
    'kostnad byta fasad',
    'pris måla om huset',
    'renovera fasad 2026',
    'träfasad byta pris',
    'putsa om hus kostnad'
  ],
  robots: 'index, follow',
  openGraph: {
    title: 'Fasadrenovering Kalkylator 2026',
    description: 'Räkna ut priset för din fasadrenovering direkt.',
    url: 'https://fragasaga.se/verktyg/fasadrenovering-kalkylator',
    siteName: 'Fråga Saga',
    locale: 'sv_SE',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Fasadrenovering Kalkylator",
  url: "https://fragasaga.se/verktyg/fasadrenovering-kalkylator",
  description: "Ett verktyg för att uppskatta kostnaden för en fasadrenovering i Sverige.",
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

export default function FacadeCalculatorPage() {
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
            Fasadrenovering Pris 2026
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-lg font-medium text-slate-600">
            Funderar du på att måla om, putsa om eller byta fasaden? Vår kalkylator baseras på
            Sagas insamlade marknadsdata och aktuella snittpriser. Få en realistisk
            uppskattning direkt.
          </p>
        </div>

        <FacadeCalculator />

        <div className="mt-16 rounded-[22px] border border-[#e2e8f0] bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0f172a]">
            Så bygger vår prisdata för fasadrenoveringar
          </h2>
          <div className="mt-6 space-y-4 text-base font-medium text-slate-700 leading-relaxed">
            <p>
              Priserna i denna kalkylator bygger på verkliga offerter från hela Sverige under 2025 och 2026.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Fasadtyp och Åtgärd:</strong> Att endast tvätta och måla om en träfasad är det billigaste alternativet (ofta 250-500 kr/kvm beroende på skick). Att knacka ner gammal puts och putsa om är betydligt mer arbetskrävande och dyrare (1500-2500 kr/kvm).
              </li>
              <li>
                <strong>Ställning:</strong> Ofta utgör hyra och montering av byggställning en stor post i en fasadrenovering (ca 15-20% av totalkostnaden för större projekt). Denna kostnad är inbakad i våra kvadratmeterpriser.
              </li>
              <li>
                <strong>ROT-avdrag:</strong> För fasadarbeten utgör arbetskostnaden en mycket stor del av priset, särskilt vid ommålning eller omputsning. Du kan dra av 30 % av arbetskostnaden upp till 50 000 kr per person och år.
              </li>
            </ul>
            <p className="mt-4 text-sm bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-900">
              <strong>Ett tips:</strong> När du får in dina offerter på fasaden — ladda upp dem på vår startsida! Fråga Saga
              analyserar dem kostnadsfritt rad för rad, jämför priser mot vår databas, och kollar dessutom upp att
              byggfirman har F-skatt och ordnad ekonomi (vilket är extra viktigt vid stora yttre arbeten).
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
