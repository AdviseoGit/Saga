
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Granska offert från hantverkare: Din kompletta checklista 2026',
  description:
    'Är offerten rimlig? Lär dig granska en offert från en hantverkare steg-för-steg. Kontrollera F-skatt, ROT-avdrag, och undvik vanliga fällor med vår checklista.',
  alternates: {
    canonical:
      'https://fragasaga.se/guider/granska-offert-hantverkare',
  },
};

const GuidePage = () => {
  return (
    <>
      <div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <article className="prose prose-lg mx-auto">
            <header>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Är offerten rimlig? Din guide till att granska hantverkarofferter 2026
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Att renovera eller bygga om är ett stort projekt. Offerter från hantverkare kan vara komplexa och svåra att tyda. Hur vet du om priset är rimligt och att allt viktigt är med? Här är din kompletta checklista för att känna dig trygg med din offert.
              </p>
            </header>

            <section>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-10">
                Steg 1: Kontrollera grunderna – Företagsuppgifter och F-skatt
              </h2>
              <p>
                Innan du ens tittar på priset, börja med det mest grundläggande: är företaget seriöst? En professionell offert ska alltid innehålla:
              </p>
              <ul>
                <li><strong>Fullständigt företagsnamn och organisationsnummer:</strong> Gör en snabb sökning på Allabolag.se eller Bolagsverket.se för att se att företaget existerar och inte har betalningsanmärkningar.</li>
                <li><strong>Kontaktuppgifter:</strong> Adress, telefonnummer och e-postadress ska finnas med.</li>
                <li><strong>Godkänd för F-skatt:</strong> Detta är avgörande för att du ska kunna göra ROT-avdrag. Kontrollera enkelt på Skatteverkets hemsida. Utan F-skatt blir du i praktiken arbetsgivare och ansvarig för sociala avgifter.</li>
              </ul>
               <p>
                Osäker på hur du kollar F-skatt? Vårt verktyg kan hjälpa dig att{' '}
                <Link href="/" title="Ladda upp och analysera offert">
                  verifiera detta direkt när du laddar upp din offert
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-10">
                Steg 2: Granska specifikationen – Vad ingår egentligen?
              </h2>
              <p>
                Den vanligaste källan till konflikt är en otydlig specifikation. En bra offert specificerar exakt vad som ingår i priset. Se upp för luddiga formuleringar.
              </p>
              <ul>
                  <li><strong>Arbetskostnad:</strong> Är det ett fast pris eller löpande timpris? Om det är timpris, hur många timmar uppskattas projektet ta? Vad är timpriset? Är det per hantverkare?</li>
                  <li><strong>Materialkostnad:</strong> Vilket material ingår? Är det specificerat med märke och kvalitet, eller står det bara "kakel" eller "parkettgolv"? Be om en detaljerad materiallista.</li>
                  <li><strong>Start- och slutdatum:</strong> En tidsplan är A och O. När planerar de att starta och när ska arbetet vara klart? Finns det några villkor för vite vid försening?</li>
                  <li><strong>Underarbete och kringkostnader:</strong> Ingår städning, bortforsling av avfall, och eventuella ställningskostnader? Detta kan bli dyra överraskningar om de inte är medräknade.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-10">
                Steg 3: Priset och betalningsvillkor
              </h2>
              <p>
                Är priset rimligt? Det bästa sättet att ta reda på det är att jämföra 2-3 offerter från olika, oberoende firmor. Men även en enskild offert kan ge ledtrådar.
              </p>
              <ul>
                  <li><strong>Jämför timpriser:</strong> Ett normalt timpris för en snickare, målare eller elektriker ligger ofta mellan 500-800 kr exklusive moms (2026). Priser varierar beroende på region och erfarenhet.</li>
                  <li><strong>ROT-avdraget:</strong> Avdraget är 30% av arbetskostnaden, upp till 50 000 kr per person och år. Offerter bör tydligt specificera hur stor del av totalpriset som är arbetskostnad och därmed berättigar till ROT.</li>
                  <li><strong>Betalningsplan:</strong> Betala aldrig hela summan i förskott! En vanlig modell är att betala en del vid projektstart, delbetalningar vid uppnådda milstolpar, och den sista delen när arbetet är slutfört och godkänt av dig.</li>
              </ul>
            </section>
            
             <section>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-10">
                Checklista: Saker att fråga hantverkaren
              </h2>
               <p>
                Innan du skriver på, ta ett sista möte eller samtal och ställ dessa frågor:
              </p>
              <ol>
                <li>Är detta en offert med fast pris eller en uppskattning?</li>
                <li>Vilka försäkringar har ni (ansvarsförsäkring är ett måste)?</li>
                <li>Använder ni underleverantörer? Är de i så fall också godkända för F-skatt?</li>
                <li>Hur hanterar vi eventuella tilläggsarbeten (ÄTA-arbeten)? Ska de godkännas skriftligen av mig innan de påbörjas?</li>
                <li>Vilka garantier lämnar ni på arbetet?</li>
              </ol>
            </section>
            
          </article>
        </div>
      </div>
      
    </>
  );
};

export default GuidePage;
