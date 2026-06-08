
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Allt om ROT-avdrag 2024: Regler, Villkor och Ansökan | Fråga Saga',
  description: 'Maximera ditt ROT-avdrag! Vår guide för 2024 går igenom regler, vilka arbeten som godkänns, och hur du enkelt ansöker. Få koll på allt du behöver veta.',
  openGraph: {
    title: 'Allt om ROT-avdrag 2024: Regler, Villkor och Ansökan | Fråga Saga',
    description: 'Maximera ditt ROT-avdrag! Vår guide för 2024 går igenom regler, vilka arbeten som godkänns, och hur du enkelt ansöker. Få koll på allt du behöver veta.',
    url: 'https://fragasaga.se/rot-avdrag',
  },
  alternates: {
    canonical: 'https://fragasaga.se/rot-avdrag',
  },
};

export default function RotAvdragPage() {
  return (
    <div className="prose lg:prose-xl mx-auto px-4 py-8">
      <h1>ROT-avdraget 2024: En Komplett Guide</h1>
      <p className="lead">
        ROT-avdraget är en fantastisk möjlighet för dig som privatperson att få skattereduktion för arbetskostnaden när du anlitar en hantverkare för reparation, underhåll, eller om- och tillbyggnad. Men reglerna kan kännas krångliga. Vi reder ut allt du behöver veta för att maximera ditt avdrag och undvika vanliga misstag.
      </p>

      <h2>Vad är ROT-avdrag?</h2>
      <p>
        ROT står för <strong>R</strong>eparation, <strong>O</strong>mbyggnad och <strong>T</strong>illbyggnad. Avdraget är en form av skattesubvention som låter dig dra av 30% av arbetskostnaden, upp till ett visst tak, direkt på fakturan. Det är ett sätt att göra det billigare att anlita seriösa hantverkare med F-skatt och samtidigt motverka svartarbete.
      </p>

      <h2>Vem kan använda ROT-avdraget?</h2>
      <p>För att ha rätt till ROT-avdrag måste du uppfylla några grundläggande krav:</p>
      <ul>
        <li>Du måste ha fyllt 18 år.</li>
        <li>Du måste äga bostaden (småhus, bostadsrätt eller ägarlägenhet) där arbetet utförs.</li>
        <li>Bostaden måste finnas i Sverige eller inom EU/EES-området.</li>
        <li>Du måste ha betalat tillräckligt med skatt under året för att kunna göra avdraget.</li>
        <li>Arbetet måste vara sådant som ger rätt till ROT-avdrag (se lista nedan).</li>
      </ul>

      <h2>Vilka arbeten ger rätt till ROT-avdrag?</h2>
      <p>
        Skatteverket har en detaljerad lista, men här är några av de vanligaste godkända arbetena:
      </p>
      <ul>
        <li><strong>Bygg:</strong> Måla om, tapetsera, byta golv, byta tak, renovera kök och badrum.</li>
        <li><strong>VVS:</strong> Dra nya vatten- och avloppsledningar, installera värmepump, byta blandare.</li>
        <li><strong>El:</strong> Dra ny el, installera jordfelsbrytare, installera laddbox till elbil.</li>
        <li><strong>Markarbeten:</strong> Dränering av husgrund, bygga altan eller uteplats som är hopbyggd med huset.</li>
        <li><strong>Städning:</strong> Grovstädning i samband med byggarbeten.</li>
      </ul>
      <p>
        Viktigt att notera är att du inte kan få avdrag för materialkostnader, resekostnader, eller för att bygga ett helt nytt hus.
      </p>

      <h2>Hur fungerar det i praktiken?</h2>
      <p>
        Processen är designad för att vara enkel för dig som kund. Hantverkaren gör avdraget direkt på din faktura.
      </p>
      <ol>
        <li>Du anlitar en hantverkare med svensk F-skattsedel.</li>
        <li>Ni kommer överens om arbetet och priset. Var noga med att specificera arbetskostnad och materialkostnad i offerten.</li>
        <li>När arbetet är klart skickar hantverkaren en faktura där 30% av arbetskostnaden är avdragen.</li>
        <li>Du betalar din del av fakturan.</li>
        <li>Hantverkaren ansöker om resten av betalningen från Skatteverket.</li>
      </ol>
      <p>
        Du behöver alltså inte själv skicka in någon ansökan. Allt kommer förtryckt i din inkomstdeklaration.
      </p>

      <h2>Taket för ROT-avdrag 2024</h2>
      <p>
        Det totala ROT-avdraget är max 50 000 kronor per person och år. Detta är det totala beloppet du kan få i skattereduktion. Det innebär att du kan få avdrag för arbetskostnader upp till cirka 167 000 kronor (eftersom 30% av 167 000 är ca 50 000).
      </p>
      <p>
        Kom ihåg att ROT- och RUT-avdraget räknas ihop. Det totala avdraget för båda får inte överstiga 75 000 kronor per person och år.
      </p>

      <h2>Vanliga frågor och svar</h2>
      <h3>Kan jag få ROT-avdrag för arbete i sommarstugan?</h3>
      <p>Ja, så länge du äger den och den klassas som småhus.</p>
      <h3>Vad händer om jag inte har betalat tillräckligt med skatt?</h3>
      <p>Om du har gjort ett för stort avdrag kommer du att bli återbetalningsskyldig för den del du inte hade rätt till. Detta syns i ditt skattebesked.</p>
      <h3>Kan två personer som äger en bostad tillsammans dela på avdraget?</h3>
      <p>Absolut. Om ni äger 50% var kan ni båda göra avdrag på upp till 50 000 kronor vardera för arbeten på den gemensamma bostaden.</p>
    </div>
  );
}
