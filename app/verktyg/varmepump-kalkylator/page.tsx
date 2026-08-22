import { type Metadata } from 'next';
import HeatPumpCalculator from './HeatPumpCalculator';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Värmepump Kalkylator 2026 – Räkna ut pris på bergvärme & luftvärme',
  description:
    'Hur mycket kostar en värmepump 2026? Använd vår gratis kalkylator för att räkna ut priset för bergvärme, luft/vatten och frånluft baserat på dina val.',
  keywords: [
    'värmepump kalkylator',
    'kostnad bergvärme',
    'pris värmepump 2026',
    'räkna ut pris luftvatten',
    'offert värmepump',
  ],
  alternates: {
    canonical: 'https://fragasaga.se/verktyg/varmepump-kalkylator',
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
    title: 'Värmepump Kalkylator 2026',
    description: 'Räkna ut priset för din värmepump direkt.',
    url: 'https://fragasaga.se/verktyg/varmepump-kalkylator',
    siteName: 'Fråga Saga',
    locale: 'sv_SE',
    type: 'website',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Värmepump Kalkylator 2026",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "SEK"
  },
  "description": "Räkna ut pris och kostnad för värmepump. Jämför bergvärme, luft/vatten och luft/luft. Uppdaterad för 2026.",
  "dateModified": "2026-08-22"
};

export default function VarmepumpKalkylatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="bg-white min-h-screen pb-20">
        {/* Hero Section */}
        <div className="bg-slate-50 border-b border-slate-200 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Värmepump Kalkylator 2026
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              En ny värmepump är en stor investering som minskar dina uppvärmningskostnader markant. 
              Använd kalkylatorn nedan för att få fram ett realistiskt riktpris baserat på vilken typ av värmepump du behöver.
            </p>
          </div>
        </div>

        {/* Kalkylator Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <HeatPumpCalculator />
        </div>
        
        {/* Intilliggande intent (fördjupningar) */}
        <div className="max-w-4xl mx-auto px-4 mt-16 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Vilken värmepump är rätt för dig?</h2>
            <p className="text-slate-600 mb-6">
                Att välja rätt värmepump handlar om husets förutsättningar, nuvarande värmesystem och din budget. 
                Här hittar du våra specialiserade djupdykningar för respektive pump:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border-2 border-emerald-100 rounded-xl p-5 hover:border-emerald-300 transition-colors shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Bergvärme</h3>
                    <p className="text-sm text-slate-600 mb-4">Dyrast installation men ger högst besparing över tid. Perfekt för hus med stort uppvärmningsbehov.</p>
                    <Link href="/verktyg/bergvarme-kalkylator" title="Bergvärmepump kalkylator - Räkna ut pris 2026" className="text-emerald-700 hover:text-emerald-600 font-medium text-sm">
                        Till Bergvärme-kalkylatorn →
                    </Link>
                </div>
                
                <div className="bg-white border-2 border-emerald-100 rounded-xl p-5 hover:border-emerald-300 transition-colors shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Jordvärme</h3>
                    <p className="text-sm text-slate-600 mb-4">Samma teknik som bergvärme men slangen grävs ner i gräsmattan istället för att borras i berg. Kräver stor tomt.</p>
                    <Link href="/verktyg/jordvarme-kalkylator" title="Jordvärmepump kalkylator - Räkna ut pris 2026" className="text-emerald-700 hover:text-emerald-600 font-medium text-sm">
                        Till Jordvärme-kalkylatorn →
                    </Link>
                </div>

                <div className="bg-white border-2 border-emerald-100 rounded-xl p-5 hover:border-emerald-300 transition-colors shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Frånluftsvärme</h3>
                    <p className="text-sm text-slate-600 mb-4">Vanligast i hus byggda 1980 och framåt. Återvinner värme ur husets ventilation. Kräver vattenburet system.</p>
                    <Link href="/verktyg/franluftvarme-kalkylator" title="Frånluftsvärmepump kalkylator - Räkna ut pris 2026" className="text-emerald-700 hover:text-emerald-600 font-medium text-sm">
                        Till Frånluftsvärme-kalkylatorn →
                    </Link>
                </div>
            </div>
        </div>

        {/* Content / SEO Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="prose prose-slate max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:text-slate-900 prose-h2:mt-10 prose-h2:mb-4">
            <h2>Hur mycket kostar en värmepump 2026?</h2>
            <p>
              Priset för en värmepump 2026 beror främst på vilken typ av värmepump du väljer. En luft/luftvärmepump 
              kan kosta så lite som 20 000 kr färdiginstallerad, medan en komplett bergvärmeinstallation ofta landar 
              mellan 150 000 och 220 000 kr.
            </p>
            
            <p><strong>De tre vanligaste typerna och deras riktpriser (inkl. installation och ROT-avdrag):</strong></p>
            <ul>
              <li><strong>Luft/Luftvärmepump:</strong> 20 000 – 35 000 kr. Passar hus med direktverkande el. Värmer endast luften, inte tappvarmvatten.</li>
              <li><strong>Luft/Vattenvärmepump:</strong> 110 000 – 160 000 kr. Kräver vattenburet värmesystem. Ger både värme och varmvatten.</li>
              <li><strong>Bergvärmepump:</strong> 150 000 – 220 000 kr. Inkluderar borrning. Ger högsta besparingen men kräver störst initial investering.</li>
            </ul>

            <div className="overflow-x-auto my-8">
              <table className="min-w-full bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
                <caption className="sr-only">Prisjämförelse av värmepumpar 2026</caption>
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Typ av värmepump</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Pris för pump</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Installationskostnad (innan ROT)</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Totalpris (efter ROT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">Luft/Luft</td>
                    <td className="px-6 py-4 text-sm text-slate-600">12 000 – 25 000 kr</td>
                    <td className="px-6 py-4 text-sm text-slate-600">6 000 – 12 000 kr</td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-700">16 000 – 35 000 kr</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">Luft/Vatten</td>
                    <td className="px-6 py-4 text-sm text-slate-600">80 000 – 130 000 kr</td>
                    <td className="px-6 py-4 text-sm text-slate-600">30 000 – 50 000 kr</td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-700">110 000 – 160 000 kr</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">Bergvärme (inkl borrning)</td>
                    <td className="px-6 py-4 text-sm text-slate-600">90 000 – 140 000 kr</td>
                    <td className="px-6 py-4 text-sm text-slate-600">70 000 – 100 000 kr</td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-700">150 000 – 220 000 kr</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>Vilka bidrag och ROT-avdrag gäller för värmepumpar?</h2>
            <p>
              För installation av värmepump kan du använda ROT-avdraget för arbetskostnaden. Skatteverket tillämpar ofta 
              schabloner för hur stor del av totalkostnaden som räknas som arbete. För bergvärme och luft/vatten brukar 
              arbetskostnaden schablonmässigt sättas till 30-35% av totalkostnaden enligt <a href="https://www.skatteverket.se/privat/fastigheterochbostad/rotochrutarbete.4.2e56d4ba1202f95012080002966.html" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0f766e]">Skatteverket</a>.
            </p>
            
            <h2>Hur fungerar egentligen en värmepump?</h2>
            <p>
              Principen är densamma för alla värmepumpar: den hämtar gratis värmeenergi från en yttre källa (utomhusluften, berget eller marken), 
              komprimerar denna energi via ett köldmedium och en kompressor för att höja temperaturen, och avger sedan värmen inne i huset. 
              Enligt <a href="https://www.energimyndigheten.se/energieffektivisering/jag-vill-energieffektivisera-hemma/uppvarmning/varmepumpar/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0f766e]">Energimyndigheten</a> kan en modern värmepump ge upp till 3-5 gånger mer värmeenergi än den elenergi som krävs för att driva kompressorn. 
            </p>

            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-bold text-emerald-900 mb-2">💡 Tips inför offertförfrågan</h3>
              <p className="text-emerald-800 mb-0">
                Det viktigaste när du tar in offerter är att jämföra vad som faktiskt ingår. Ingår bortforsling av gammal panna? 
                Hur många meter borrning ingår i bergvärmeofferten? Ingår elinstallationen? 
                När du har fått in dina offerter, ladda upp dem på vår startsida så granskar vi dem åt dig helt kostnadsfritt!
              </p>
            </div>
            
            <p className="text-xs text-slate-500 mt-8 border-t pt-4">Källa priser: Sagas databas av granskade offerter. Uppdaterad 2026-08-22.</p>
          </div>
        </div>
      </main>
    </>
  );
}
