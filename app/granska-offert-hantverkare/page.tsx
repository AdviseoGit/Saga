import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Granska Offert från Hantverkare – Komplett Guide 2026",
  description: "Ska du anlita en hantverkare? Lär dig granska offerten som ett proffs. Vår guide täcker F-skatt, ROT-avdrag, fast vs. löpande pris och vanliga fällor.",
  alternates: {
    canonical: "/granska-offert-hantverkare",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Granska Offert från Hantverkare – Komplett Guide",
  "description": "En detaljerad guide för att granska och förstå offerter från hantverkare. Lär dig om F-skatt, ROT-avdrag, prissättning och hur du undviker vanliga misstag.",
  "author": {
    "@type": "Organization",
    "name": "Fråga Saga"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Fråga Saga",
    "logo": {
      "@type": "ImageObject",
      "url": "https://fragasaga.se/logo.png"
    }
  },
  "datePublished": "2026-06-04",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://fragasaga.se/granska-offert-hantverkare"
  }
};

export default function GuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-white text-[#0f172a]">
        <header className="sticky top-0 z-40 border-b border-[#e2e8f0] bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tight text-[#0f172a] sm:text-2xl">Saga</span>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.25em] text-[#6366f1] sm:inline">Fråga Saga</span>
            </Link>
            <Link href="/#faq" className="text-sm font-bold text-[#6366f1] hover:underline">
              Vanliga frågor
            </Link>
          </div>
        </header>

        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="text-3xl font-black leading-tight tracking-tight text-[#0f172a] sm:text-4xl md:text-5xl">
            Granska Offert från Hantverkare – Din Kompletta Guide
          </h1>
          <p className="mt-4 text-lg font-medium text-slate-600">
            Att få en offert från en hantverkare är första steget mot ditt drömprojekt, men det är också ett juridiskt dokument som kan kännas överväldigande. Otydliga poster, konstiga termer och osäkerhet kring priset kan göra vem som helst nervös. Men oroa dig inte. Med rätt kunskap kan du granska offerten som ett proffs och känna dig trygg.
          </p>
          <p className="mt-2 text-slate-600">
            Den här guiden lär dig allt du behöver veta för att förstå, ifrågasätta och i slutändan acceptera en offert från en hantverkare.
          </p>

          <section className="mt-10 space-y-8">
            <h2 className="text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
              Steg 1: Kontrollera Företagets Trovärdighet
            </h2>
            <p className="text-slate-600">
              Innan du ens tittar på priset, måste du säkerställa att företaget är seriöst. En snygg offert från ett oseriöst företag är värdelös.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-slate-600">
              <li>
                <strong>F-skatt:</strong> Det absolut viktigaste. Ett företag med F-skattsedel ansvarar själva för att betala sina skatter och sociala avgifter. Utan F-skatt kan du som beställare bli skyldig att betala dessa avgifter. Kontrollera alltid F-skatt hos Skatteverket. <strong className="text-slate-800">Fråga Sagas verktyg gör detta automatiskt.</strong>
              </li>
              <li>
                <strong>Momsregistrering (VAT):</strong> Företaget måste vara momsregistrerat för att få lägga på moms på fakturan. Detta kan du också verifiera hos Skatteverket.
              </li>
              <li>
                <strong>Skulder hos Kronofogden:</strong> Ett företag med stora skulder kan vara en varningsflagga. Det kan innebära risk för att de går i konkurs mitt under ditt projekt.
              </li>
              <li>
                <strong>Branschorganisation och Certifieringar:</strong> Är hantverkaren medlem i en branschorganisation (t.ex. Byggkeramikrådet för badrum)? Har de nödvändiga certifikat (t.ex. för VVS eller el)? Detta är en kvalitetsstämpel.
              </li>
            </ul>

            <h2 className="text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
              Steg 2: Förstå Prissättningen
            </h2>
            <p className="text-slate-600">
              Det finns två huvudsakliga prismodeller: fast pris och löpande räkning. Båda har sina för- och nackdelar.
            </p>
            <div>
              <h3 className="text-xl font-semibold text-[#0f172a]">Fast Pris</h3>
              <p className="mt-1 text-slate-600">
                Du betalar ett i förväg överenskommet totalpris för hela arbetet.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li className="text-emerald-700"><strong className="font-semibold">Fördel:</strong> Trygghet. Du vet exakt vad det kommer att kosta. Inga överraskningar.</li>
                <li className="text-red-700"><strong className="font-semibold">Nackdel:</strong> Hantverkaren lägger ofta på en riskmarginal för oförutsedda händelser. Om allt går smidigt betalar du kanske lite mer än nödvändigt.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#0f172a]">Löpande Räkning (Timpris)</h3>
              <p className="mt-1 text-slate-600">
                Du betalar för de faktiska timmarna och materialkostnaden.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li className="text-emerald-700"><strong className="font-semibold">Fördel:</strong> Du betalar bara för den tid och det material som faktiskt går åt. Kan bli billigare om projektet är enkelt.</li>
                <li className="text-red-700"><strong className="font-semibold">Nackdel:</strong> Risk. Du har ingen exakt aning om slutkostnaden. Kräver stort förtroende för hantverkaren.</li>
              </ul>
              <p className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800">
                <strong>Viktigt:</strong> Vid löpande räkning, begär alltid ett <strong className="font-semibold">kostnadstak</strong>. Det är en övre gräns som priset inte får överstiga utan ditt godkännande. En seriös hantverkare bör kunna ge en rimlig uppskattning.
              </p>
            </div>


            <h2 className="text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
              Steg 3: Granska Offertens Innehåll i Detalj
            </h2>
            <p className="text-slate-600">
              En bra offert är specificerad. "Badrumsrenovering: 150 000 kr" är inte en offert, det är en gissning. Titta efter följande:
            </p>
            <ul className="list-disc space-y-3 pl-5 text-slate-600">
                <li><strong>Arbetskostnad vs. Materialkostnad:</strong> Dessa ska vara tydligt separerade. Det är viktigt för ROT-avdraget, som bara gäller för arbetskostnaden.</li>
                <li><strong>Specifikation av arbete:</strong> Vad ingår exakt? "Installation av toalett" – ingår bortforsling av den gamla? "Målning av väggar" – ingår spackling och grundmålning? Ju mer detaljerat, desto bättre.</li>
                <li><strong>Specifikation av material:</strong> Vilket kakel, vilken färg, vilket märke på blandaren? Om det bara står "blandare" kan du få det billigaste alternativet. Se till att materialet du vill ha är specificerat.</li>
                <li><strong>Timpris:</strong> Om det är löpande räkning, vad är timpriset? Är det inklusive eller exklusive moms?</li>
                <li><strong>Start- och slutdatum:</strong> En tidsplan visar att hantverkaren har tänkt igenom projektet. Det ger dig också en tidsram.</li>
                <li><strong>Betalningsvillkor:</strong> När ska du betala? Betala <strong className="text-slate-800">aldrig</strong> hela summan i förskott. En mindre del för materialinköp kan vara ok, men slutbetalning sker först efter godkänd slutbesiktning.</li>
            </ul>

            <h2 className="text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
              Steg 4: ROT-avdraget
            </h2>
            <p className="text-slate-600">
              ROT-avdraget (Renovering, Ombyggnad, Tillbyggnad) ger dig 30% avdrag på arbetskostnaden, upp till 50 000 kr per person och år.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-slate-600">
              <li>Offerten bör tydligt specificera hur stor del av totalkostnaden som är arbetskostnad och därmed berättigar till ROT.</li>
              <li>Kontrollera att hantverkaren sköter administrationen av avdraget direkt på fakturan, så du slipper ligga ute med pengarna.</li>
              <li>Se till att du har utrymme kvar för ROT-avdrag för året.</li>
            </ul>

            <div className="rounded-lg bg-[#6366f1]/10 p-6 text-center">
              <h3 className="text-xl font-bold text-[#0f172a]">Osäker på om din offert är rimlig?</h3>
              <p className="mt-2 text-slate-700">
                Ladda upp din offert på vår startsida. Fråga Saga analyserar priset mot marknadsdata och kontrollerar företaget på sekunder – helt gratis.
              </p>
              <Link href="/" className="mt-4 inline-block rounded-lg bg-[#6366f1] px-6 py-3 font-bold text-white shadow-lg transition hover:bg-[#4f46e5]">
                Testa Fråga Saga gratis
              </Link>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-[#0f172a] sm:text-3xl">
              Checklista: Vanliga Fällor och Varningsflaggor
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-slate-600">
              <li><strong className="text-slate-800">Ospecificerade poster:</strong> En post som heter "övrigt" eller "diverse" är en stor varningsflagga. Allt ska specificeras.</li>
              <li><strong className="text-slate-800">Muntliga löften:</strong> "Det där fixar vi" – se till att allt som lovas muntligt också skrivs in i offerten. Ett muntligt avtal är svårt att bevisa.</li>
              <li><strong className="text-slate-800">Press att skriva på snabbt:</strong> En seriös hantverkare ger dig tid att tänka. Erbjudanden som "gäller bara idag" är ofta ett dåligt tecken.</li>
              <li><strong className="text-slate-800">Kontant betalning utan kvitto:</strong> Detta är ett stort nej. Det innebär svartarbete, inga garantier och ingen försäkring.</li>
              <li><strong className="text-slate-800">Vägrar ge referenser:</strong> En duktig hantverkare är stolt över sitt arbete och har oftast nöjda kunder att hänvisa till.</li>
            </ul>
            <p className="text-slate-600">
                Genom att följa denna guide och använda ditt sunda förnuft kan du navigera i offertdjungeln med självförtroende. Kom ihåg, en bra offert är grunden för ett lyckat projekt och en god relation med din hantverkare.
            </p>
          </section>
        </article>

        <footer className="border-t border-[#e2e8f0] bg-slate-50">
            <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs font-medium text-[#64748b] sm:px-6">
                <p>Saga – Offertanalys, offertjämförelse och fakturakontroll.</p>
                <p className="mt-2">
                    <Link href="/" className="underline hover:text-[#0f172a]">Hem</Link> | 
                    <Link href="/granska-offert-hantverkare" className="underline hover:text-[#0f172a]"> Granska Offert</Link>
                </p>
            </div>
        </footer>
      </main>
    </>
  );
}
