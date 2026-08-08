
import { Metadata } from 'next';

export const metadata: Metadata = {
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
  title: 'Allt om ROT-avdrag 2026: Regler, Villkor och Ansökan | Fråga Saga',
  description: 'Maximera ditt ROT-avdrag! Vår guide för 2026 går igenom regler, vilka arbeten som godkänns, och hur du enkelt ansöker. Få koll på allt du behöver veta.',
  openGraph: {
    title: 'Allt om ROT-avdrag 2026: Regler, Villkor och Ansökan | Fråga Saga',
    description: 'Maximera ditt ROT-avdrag! Vår guide för 2026 går igenom regler, vilka arbeten som godkänns, och hur du enkelt ansöker. Få koll på allt du behöver veta.',
    url: 'https://fragasaga.se/rot-avdrag',
  },
  alternates: {
    canonical: 'https://fragasaga.se/rot-avdrag',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "ROT-avdraget 2026: En Komplett Guide",
  "dateModified": "2026-08-08T08:00:00+00:00",
  "author": {
    "@type": "Organization",
    "name": "Fråga Saga"
  }
};

export default function RotAvdragPage() {
  return (
    <div className="prose lg:prose-xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1>ROT-avdraget 2026: En Komplett Guide</h1>
      <p className="lead font-medium text-slate-700">
        ROT-avdraget 2026 ger dig rätt att dra av 30 % av arbetskostnaden upp till maximalt 50 000 kr per person och år för reparation, ombyggnad och tillbyggnad. Tillsammans med RUT-avdraget får skattereduktionen uppgå till högst 75 000 kr per år.
      </p>

      <h2>Hur stort är ROT-avdraget 2026?</h2>
      <p>
        Taket för ROT-avdraget under 2026 är <strong>50 000 kr</strong> per person, och subventionen är <strong>30 %</strong> av den fakturerade arbetskostnaden. Det betyder att du måste ha arbetskostnader på cirka <strong>166 667 kr</strong> under året för att maxa avdraget. Om ni är två ägare till bostaden kan ni tillsammans dra av upp till <strong>100 000 kr</strong> (2 x 50 000 kr).
      </p>

      <h2>Vad är skillnaden på ROT- och RUT-avdrag?</h2>
      <p>
        Både ROT och RUT är skattereduktioner för hushållsnära tjänster, men de gäller olika typer av arbeten. De delar dock på samma gemensamma maxtak.
      </p>
      
      <div className="overflow-x-auto my-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b-2 border-slate-200">
              <th className="p-4 font-bold text-slate-900">Egenskap</th>
              <th className="p-4 font-bold text-slate-900">ROT-avdrag</th>
              <th className="p-4 font-bold text-slate-900">RUT-avdrag</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-slate-100">
              <td className="p-4">Avdragsnivå</td>
              <td className="p-4">30 % av arbetskostnaden</td>
              <td className="p-4">50 % av arbetskostnaden</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-4">Maxbelopp per person</td>
              <td className="p-4">50 000 kr</td>
              <td className="p-4">75 000 kr (totalt för ROT + RUT)</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-4">Typ av arbete</td>
              <td className="p-4">Renovering, bygg, VVS, el, tak, målning</td>
              <td className="p-4">Städning, trädgård, barnpassning, flytt</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="p-4">Krav på bostaden</td>
              <td className="p-4">Du måste äga och helt eller delvis bo i den</td>
              <td className="p-4">Räcker med att du bor där (ex. hyresrätt ok)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Vem kan använda ROT-avdraget?</h2>
      <p>För att ha rätt till ROT-avdrag måste du uppfylla några grundläggande krav enligt <a href="https://skatteverket.se/privat/fastigheterochbostad/rotochrutarbete" target="_blank" rel="noopener noreferrer" className="underline text-[#0f766e]">Skatteverket</a>:</p>
      <ul>
        <li>Du måste ha fyllt 18 år vid årets slut.</li>
        <li>Du måste äga bostaden (småhus, bostadsrätt eller ägarlägenhet) där arbetet utförs under perioden arbetet sker.</li>
        <li>Bostaden måste finnas i Sverige eller inom EU/EES-området.</li>
        <li>Du måste betala tillräckligt med skatt under året för att avdraget ska kunna göras (skattereduktionen kan aldrig bli större än skatten du ska betala).</li>
        <li>Arbetet måste vara sådant som ger rätt till ROT-avdrag.</li>
      </ul>

      <h2>Vilka arbeten ger rätt till ROT-avdrag?</h2>
      <p>
        Skatteverket har en detaljerad lista, men här är några av de vanligaste godkända arbetena:
      </p>
      <ul>
        <li><strong>Bygg:</strong> Måla om, tapetsera, byta golv, byta tak, renovera kök och badrum.</li>
        <li><strong>VVS:</strong> Dra nya vatten- och avloppsledningar, installera värmepump, byta blandare.</li>
        <li><strong>El:</strong> Dra ny el, installera jordfelsbrytare, installera laddbox till elbil (ger dock Grön Teknik-avdrag instället vilket ofta är fördelaktigare, 50%).</li>
        <li><strong>Markarbeten:</strong> Dränering av husgrund, bygga altan eller uteplats som är hopbyggd med huset.</li>
        <li><strong>Städning:</strong> Grovstädning i samband med byggarbeten.</li>
      </ul>
      <p>
        Viktigt att notera är att du <strong>aldrig kan få avdrag för materialkostnader</strong>, maskinhyra eller resekostnader.
      </p>

      <h2>Hur fungerar det i praktiken?</h2>
      <p>
        Processen är designad för att vara enkel för dig som kund (fakturamodellen):
      </p>
      <ol>
        <li>Du anlitar en hantverkare med svensk F-skatt (ett absolut krav).</li>
        <li>Hantverkaren gör avdraget direkt på din faktura. Arbetskostnad och materialkostnad måste specificeras tydligt.</li>
        <li>Du betalar din del av fakturan.</li>
        <li>Hantverkaren ansöker om resterande 30 % från Skatteverket.</li>
        <li>Skatteverket skickar ett meddelande till dig när avdraget är beviljat, och beloppet är förtryckt i din nästa deklaration.</li>
      </ol>

      <h2>Får man ROT-avdrag för att bygga ett nytt hus?</h2>
      <p>
        Nej, ROT-avdraget gäller <strong>inte</strong> för nybyggnation. Ett småhus anses vara nybyggt de första fem åren (baserat på värdeåret). Du kan inte få avdrag för om- eller tillbyggnad på ett hus som är yngre än fem år.
      </p>

      <h2>Vad gäller för fristående garage och tillbyggnader?</h2>
      <p>
        Du kan få ROT-avdrag för att bygga om, bygga till eller reparera ett <strong>vidbyggt garage</strong> (ett garage som är hopbyggt med bostadshuset). För ett <strong>fristående garage</strong> får du däremot <strong>inte</strong> ROT-avdrag för nybyggnation, men du kan få avdrag för reparation och underhåll av ett befintligt fristående garage (förutsatt att det tillhör ett småhus du äger).
      </p>

      <h2>Vad är en ROT-klausul i offerten?</h2>
      <p>
        När du anlitar en hantverkare finns det ofta en så kallad <strong>ROT-klausul</strong> i avtalet. Det är ett villkor som säger att om Skatteverket nekar utbetalningen (till exempel för att du tjänat för lite eller redan utnyttjat dina 50 000 kr) så är du som kund skyldig att betala den resterande summan direkt till hantverkaren. Det är ditt ansvar att veta hur mycket ROT du har kvar, inte hantverkarens.
      </p>
      
      <p className="text-xs text-slate-500 mt-12 border-t pt-4">Fakta kontrollerad mot Skatteverket. Uppdaterad: 2026-08-08.</p>
    </div>
  );
}
