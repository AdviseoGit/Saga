import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ROT-avdrag 2026: Komplett guide – allt du behöver veta",
  description:
    "Komplett guide till ROT-avdraget 2026. Så fungerar det, vilka arbeten som ger rätt till avdrag, och hur du ansöker. Undvik vanliga misstag.",
};

export default function RotAvdragGuide() {
  return (
    <main className="bg-white">
      <div className="prose prose-lg mx-auto px-4 py-12">
        <h1>ROT-avdrag 2026: Komplett guide</h1>
        <p className="lead">
          Planerar du att renovera? ROT-avdraget är en fantastisk möjlighet att sänka kostnaderna, men det är också lätt att göra fel. Här är allt du behöver veta för att maximera ditt avdrag 2026.
        </p>

        <h2>Vad är ROT-avdrag?</h2>
        <p>
          ROT-avdraget är en skattereduktion för arbetskostnaden när du anlitar en hantverkare för att utföra reparation, ombyggnad eller tillbyggnad (ROT) i ditt hem. Avdraget är 30% av arbetskostnaden, upp till ett maximalt belopp per person och år.
        </p>

        <h2>Vem kan få ROT-avdrag?</h2>
        <ul>
          <li>Du måste äga bostaden där arbetet utförs.</li>
          <li>Du måste ha fyllt 18 år.</li>
          <li>Du måste betala tillräckligt med skatt i Sverige för att kunna göra avdraget.</li>
          <li>Arbetet måste vara sådant som ger rätt till ROT-avdrag (se lista nedan).</li>
        </ul>

        <h2>Vilka arbeten ger rätt till ROT-avdrag?</h2>
        <p>
          Här är några vanliga exempel på arbeten som är godkända för ROT:
        </p>
        <ul>
          <li>Målning och tapetsering</li>
          <li>Byte av köksinredning och vitvaror</li>
          <li>Badrumsrenovering</li>
          <li>Dränering av husgrund</li>
          <li>Installation av värmepump</li>
          <li>Takbyte och takreparationer</li>
          <li>Fönsterbyte</li>
        </ul>
        <p>
          Materialkostnader, resekostnader eller maskinkostnader ger inte rätt till avdrag. Det är enbart arbetskostnaden som är avdragsgill.
        </p>

        <h2>Hur ansöker jag?</h2>
        <p>
          Du ansöker inte själv. Företaget du anlitar gör avdraget direkt på fakturan. Du betalar alltså ett lägre pris från början. Företaget begär sedan utbetalning från Skatteverket. Det är därför det är så viktigt att anlita ett seriöst företag med F-skattsedel.
        </p>

        <h2>Vanliga misstag att undvika</h2>
        <ol>
          <li>
            <strong>Anlita en hantverkare utan F-skattsedel.</strong> Då kan du inte få ROT-avdrag.
          </li>
          <li>
            <strong>Betala hela fakturan.</strong> Avdraget ska göras direkt på fakturan av hantverkaren.
          </li>
          <li>
            <strong>Maxbeloppet är uppnått.</strong> Se till att du har utrymme kvar för avdraget. Du kan se ditt använda belopp i Skatteverkets e-tjänst.
          </li>
          <li>
            <strong>Du betalar inte tillräckligt med skatt.</strong> Om du har låg inkomst kanske du inte kan utnyttja hela avdraget.
          </li>
        </ol>
      </div>
    </main>
  );
}
