import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: "400",
});

const SITE_URL = "https://fragasaga.se";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fråga Saga – Gratis offertanalys på sekunder",
    template: "%s | Fråga Saga",
  },
  description:
    "Ladda upp din offert eller faktura. Saga analyserar priset mot svenska marknadsdata, kontrollerar F-skatt och Bolagsverket – helt gratis. Svar på 10 sekunder.",
  keywords: [
    "offertanalys",
    "fråga saga",
    "gratis offertanalys",
    "kontrollera offert",
    "är min offert rimlig",
    "offertjämförelse",
    "fakturakontroll",
    "hantverkare offert",
    "f-skatt kontroll",
    "bolagsverket kontroll",
    "prisanalys offert Sverige",
    "är offerten rimlig",
  ],
  authors: [{ name: "Fråga Saga" }],
  creator: "Fråga Saga",
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: SITE_URL,
    siteName: "Fråga Saga",
    title: "Fråga Saga – Gratis offertanalys på sekunder",
    description:
      "Ladda upp din offert. Saga analyserar priset mot svenska marknadsdata och kontrollerar F-skatt och Bolagsverket. Gratis, utan inloggning.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fråga Saga – Gratis offertanalys på sekunder",
    description:
      "Ladda upp din offert. Saga analyserar priset mot svenska marknadsdata – gratis och utan inloggning.",
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Fråga Saga",
      url: SITE_URL,
      description:
        "AI-driven offertanalys och fakturakontroll för svenska konsumenter. Jämför ditt pris mot marknaden och verifiera företagets trovärdighet.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      inLanguage: "sv-SE",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "SEK",
      },
    },
    {
      "@type": "Organization",
      name: "Fråga Saga",
      url: SITE_URL,
      description: "Gratis offertanalystjänst för svenska konsumenter",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Vad ar Fraga Saga?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Fraga Saga ar ett gratis verktyg som analyserar offerter och fakturor med hjalp av AI och svenska myndighetsdata. Du laddar upp en bild eller PDF av din offert och far direkt svar pa om priset ar rimligt, om foretaget ar seriost och vad du bor forhandla om.",
          },
        },
        {
          "@type": "Question",
          name: "Ar Fraga Saga gratis att anvanda?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ja, Fraga Saga ar helt gratis att anvanda. Ingen registrering eller inloggning kravs och din fil sparas aldrig.",
          },
        },
        {
          "@type": "Question",
          name: "Hur lang tid tar en offertanalys?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En offertanalys tar normalt 10-20 sekunder. Saga laser offerten, jamfor mot marknadsdata och kontrollerar foretaget mot Skatteverket och Bolagsverket parallellt.",
          },
        },
        {
          "@type": "Question",
          name: "Vilka typer av offerter kan Saga analysera?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Saga kan analysera offerter fran hantverkare, byggforetag, VVS-firmor, elektriker, taklaggare, malare och andra servicebranscher. Du laddar upp offerten som foto (JPG/PNG) eller PDF.",
          },
        },
        {
          "@type": "Question",
          name: "Vad ar F-skatt och varfor ar det viktigt?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "F-skatt innebar att ett foretag ansvarar for sin egen skatteinbetalning. Om du anlitar en hantverkare utan F-skatt kan du bli ansvarig for arbetsgivaravgifter. Saga kontrollerar alltid F-skattstatus.",
          },
        },
        {
          "@type": "Question",
          name: "Kan jag jamfora tva offerter mot varandra?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ja! Med Sagas jämförelseläge kan du ladda upp tva offerter och fa en direkt analys av vilken som erbjuder bast pris, trovardighet och villkor.",
          },
        },
        {
          "@type": "Question",
          name: "Ar mina filer sakra?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ja. Din fil anvands bara for att genomfora analysen och sparas aldrig permanent. Inga personuppgifter kravs.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-M6XYW8WNY9"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-M6XYW8WNY9');`,
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${dmMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <div className="flex-1">
          {children}
        </div>
        <footer className="border-t border-[#e2e8f0] bg-white px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-5xl text-center text-xs font-medium text-[#64748b]">
            <p>Denna sajt skapas och drivs helt av AI · <a href="/om-sajten" className="underline hover:text-[#0f172a]">Om sajten</a></p>
            <p className="mt-2">Saga – Offertanalys, offertjämförelse och fakturakontroll. Prisanalys och företagskoll. Ingen garanti för fullständighet; använd som stöd, inte som enda beslutsunderlag.</p>
            <p className="mt-2">
              <a href="/granska-offert-hantverkare" className="underline hover:text-[#0f172a]">Guide: Granska offert från hantverkare</a>
              <span className="mx-2">·</span>
              <a href="/kolla-faktura" className="underline hover:text-[#0f172a]">Guide: Kolla faktura från hantverkare</a>
              <span className="mx-2">·</span>
              <a href="/rot-avdrag" className="underline hover:text-[#0f172a]">Guide: ROT-avdrag</a>
              <span className="mx-2">·</span>
              <a href="/f-skatt" className="underline hover:text-[#0f172a]">Guide: F-skatt</a>
              <span className="mx-2">·</span>
              <a href="/ar-offerten-rimlig" className="underline hover:text-[#0f172a]">Är offerten rimlig?</a>
              <span className="mx-2">·</span>
              <a href="/verktyg/renoverings-kalkylator" className="underline hover:text-[#0f172a]">Renovering</a><span className="mx-2">·</span><a href="/verktyg/badrumsrenovering-kalkylator" className="underline hover:text-[#0f172a]">Badrum</a>
              <span className="mx-2">·</span>
              <a href="/verktyg/takbyte-kalkylator" className="underline hover:text-[#0f172a]">Takbyte</a>
              <span className="mx-2">·</span>
              <a href="/verktyg/fasadrenovering-kalkylator" className="underline hover:text-[#0f172a]">Fasad</a>
              <span className="mx-2">·</span>
              <a href="/verktyg/maleriarbete-kalkylator" className="underline hover:text-[#0f172a]">Måleri</a>
              <span className="mx-2">·</span>
              <a href="/verktyg/varmepump-kalkylator" className="underline hover:text-[#0f172a]">Värmepump</a>
              <span className="mx-2">·</span>
              <a href="/verktyg/bergvarme-kalkylator" className="underline hover:text-[#0f172a]">Bergvärme</a>
              <span className="mx-2">·</span>
              <a href="/verktyg/franluftvarme-kalkylator" className="underline hover:text-[#0f172a]">Frånluftsvärme</a>
              <span className="mx-2">·</span>
              <a href="/verktyg/solcells-kalkylator" className="underline hover:text-[#0f172a]">Solceller</a>
              <span className="mx-2">·</span>
              <a href="/verktyg/vvs-kalkylator" className="underline hover:text-[#0f172a]">VVS</a>
              <span className="mx-2">·</span>
              <a href="/om-sajten" className="underline hover:text-[#0f172a]">Om Saga</a>
              <span className="mx-2">·</span>
              <a href="/kontakt" className="underline hover:text-[#0f172a]">Kontakt</a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
