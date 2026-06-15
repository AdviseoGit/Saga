import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "F-skatt: Allt du behöver veta",
  description: "En komplett guide till F-skatt. Lär dig vad F-skatt är, varför det är viktigt att kontrollera, och hur du säkerställer att din hantverkare är registrerad.",
  alternates: {
    canonical: "/f-skatt",
  },
};

export default function FSkattPage() {
  return (
    <main className="bg-white text-gray-800">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">Saga</span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-600 sm:inline">Fråga Saga</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            <Link href="/verktyg/badrumsrenovering-kalkylator" className="text-sm font-bold text-slate-600 hover:text-gray-900 transition-colors">Badrumskalkylator</Link>
          </nav>
          <Link href="/" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700">
            Testa Offertanalys
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <article className="prose lg:prose-lg">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            Vad är F-skatt och varför måste du ha koll?
          </h1>
          <p className="lead">
            När du anlitar en hantverkare eller annan företagare är F-skatt ett av de viktigaste begreppen att ha koll på. Det kan verka som en teknisk detalj, men att anlita någon utan F-skatt kan leda till allvarliga ekonomiska konsekvenser för dig som kund.
          </p>

          <p>
            Den här guiden förklarar allt du behöver veta om F-skatt: vad det är, varför det är så viktigt, och hur du enkelt kontrollerar att företaget du anlitar har sin registrering i ordning.
          </p>

          <h2>Vad innebär F-skatt?</h2>
          <p>
            F-skatt, eller företagsskatt, är en typ av skatteregistrering i Sverige som visar att en näringsidkare (ett företag eller en enskild firma) själv ansvarar för att betala in sina skatter och sociala avgifter. När ett företag är godkänt för F-skatt, ska du som kund inte dra av någon skatt eller betala några arbetsgivaravgifter när du betalar för ett utfört arbete.
          </p>
          <p>
            Skatteverket uttrycker det så här: Godkännandet för F-skatt är en signal om att företaget är seriöst och sköter sina åtaganden. Det är en trygghet för dig som uppdragsgivare.
          </p>
          
          <h2>Varför är det viktigt för dig som kund?</h2>
          <p>
            Om du betalar ut ersättning för arbete till ett företag som <strong>inte</strong> är godkänt för F-skatt, jämställs du med en arbetsgivare. Det innebär att du är skyldig att dra av 30% i skatt på arbetskostnaden och betala arbetsgivaravgifter på hela beloppet.
          </p>
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
