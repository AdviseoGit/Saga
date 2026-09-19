import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

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
  alternates: {
    canonical: 'https://fragasaga.se/f-skatt',
  },
  title: "F-skatt: Allt du behöver veta",
  description: "En komplett guide till F-skatt. Lär dig vad F-skatt är, varför det är viktigt att kontrollera, och hur du säkerställer att din hantverkare är registrerad.",
};

export default function FSkattPage() {
  return (
    <main className="bg-white text-gray-800">
      

      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <article className="prose lg:prose-lg">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl mb-4">
            Vad är F-skatt? (Kontrollera företaget)
          </h1>
          <p className="text-lg font-medium text-slate-800 bg-slate-50 p-4 rounded-lg border border-slate-200 mb-8">
            <strong>Kort svar:</strong> F-skatt (företagsskatt) innebär att företaget självt betalar in sina skatter och arbetsgivaravgifter. Anlitar du ett företag <em>utan</em> F-skatt blir du som privatperson betalningsansvarig för deras skatt och sociala avgifter (cirka 31,42%), och du förlorar rätten till ROT-avdrag.
          </p>
          <p className="lead">
            När du anlitar en hantverkare eller annan företagare är F-skatt ett av de viktigaste begreppen att ha koll på. Det kan verka som en teknisk detalj, men att anlita någon utan F-skatt kan leda till allvarliga ekonomiska konsekvenser för dig som kund.
          </p>

          <p>
            Den här guiden förklarar allt du behöver veta om F-skatt: vad det är, varför det är så viktigt, och hur du enkelt kontrollerar att företaget du anlitar har sin registrering i ordning.
          </p>

          <h2>Vad innebär F-skatt rent praktiskt?</h2>
          <p>
            F-skatt står för företagsskatt och är ett bevis på att Skatteverket litar på att företaget sköter sina betalningar. När en företagare har F-skatt ska du som kund <strong>inte</strong> dra av 30 % i skatt eller betala arbetsgivaravgifter på 31,42 %.
          </p>
          <p>
            Läs mer hos <a href="https://skatteverket.se/privat/skatter/arbeteochinkomst/fskatt.4.18e1b10334ebe8bc80006240.html" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Skatteverket om F-skatt</a>.
          </p>
          
          <h2>Vad händer om företaget saknar F-skatt?</h2>
          <p>
            Om du anlitar en hantverkare som inte är godkänd för F-skatt blir du enligt svensk lag att betrakta som arbetsgivare. Detta innebär:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Du måste dra av <strong>30 % i skatt</strong> på arbetskostnaden och betala in till Skatteverket.</li>
            <li>Du måste betala <strong>31,42 % i arbetsgivaravgifter</strong> ovanpå lönen (om ersättningen överstiger 1 000 kr under ett år).</li>
            <li>Du förlorar möjligheten att göra <strong>ROT-avdrag på upp till 50 000 kr</strong> (2026).</li>
          </ul>
          <blockquote>
            <strong>Exempel:</strong> Du anlitar en målare för ett jobb som kostar 20 000 kr. Målaren har ingen F-skattsedel. Då måste du betala 14 000 kr till målaren och 6 000 kr (30%) direkt till Skatteverket. Utöver det måste du betala arbetsgivaravgifter (ytterligare ca 6 280 kr) till Skatteverket. Den totala kostnaden för dig blir alltså betydligt högre än offerten.
          </blockquote>
          <p>
            Detta är en vanlig orsak till tvister och oväntade kostnader. Att anlita någon utan F-skatt är helt enkelt en stor risk.
          </p>

          <h2>Hur kontrollerar jag om ett företag har F-skatt?</h2>
          <p>
            Att kontrollera F-skatt är enkelt och gratis. Du kan göra det på flera sätt:
          </p>
          <ul>
            <li><strong>Fråga Saga:</strong> Det absolut enklaste sättet. När du laddar upp en offert på <Link href="/">fragasaga.se</Link> kontrollerar vi automatiskt F-skatt och en mängd andra punkter direkt mot Skatteverkets register.</li>
            <li><strong>Skatteverkets e-tjänst:</strong> Gå till Skatteverkets tjänst "Hämta företagsinformation". Där kan du söka på företagets organisationsnummer och direkt se om de är godkända för F-skatt, momsregistrerade och registrerade som arbetsgivare.</li>
            <li><strong>Fråga företaget:</strong> Ett seriöst företag ska utan problem kunna visa upp ett registerutdrag som bekräftar deras F-skattstatus.</li>
          </ul>
          
          <h2>F-skatt och ROT-avdrag</h2>
          <p>
            För att du ska kunna göra ROT-avdrag för ett arbete är det ett absolut krav att företaget du anlitar är godkänt för F-skatt vid både avtalstillfället och betalningstillfället. Om företaget saknar F-skatt, eller förlorar sin F-skatt under arbetets gång, har du inte rätt till skattereduktionen.
          </p>

          <h2>Sammanfattning: Din checklista för F-skatt</h2>
          <ol>
            <li><strong>Kräv alltid F-skatt:</strong> Anlita aldrig ett företag för ett arbete utan att de är godkända för F-skatt.</li>
            <li><strong>Kontrollera innan du skriver på:</strong> Använd Fråga Saga eller Skatteverkets e-tjänst för att verifiera F-skattstatus innan du accepterar en offert.</li>
            <li><strong>Spara bevis:</strong> Ta en skärmdump eller spara ett registerutdrag från Skatteverket som visar företagets status vid avtalstillfället.</li>
          </ol>
          <p>
            Genom att ta några minuter för att kontrollera F-skatten skyddar du dig själv från oväntade kostnader och problem. Det är ett litet steg som ger stor trygghet.
          </p>
        </article>
      </div>
    </main>
  );
}
