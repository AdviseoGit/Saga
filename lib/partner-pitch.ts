import type { LeadIntent } from "./outcomes";

export type LeadStatus = "new" | "contacted" | "sold" | "discarded";

export interface PartnerLead {
  id: string;
  created_at: string;
  intent: LeadIntent;
  outcome: string | null;
  name: string | null;
  email: string;
  phone: string | null;
  quote_category: string | null;
  quote_region: string | null;
  quote_total: number | null;
  market_low: number | null;
  market_high: number | null;
  over_market_pct: number | null;
  analysis_verdict: string | null;
  company_name: string | null;
  company_org_nr: string | null;
  red_flags: string[] | null;
  status: LeadStatus;
  sold_to: string | null;
}

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "Ny",
  contacted: "Kontaktad",
  sold: "Såld",
  discarded: "Kastad",
};

export const INTENT_LABEL: Record<LeadIntent, string> = {
  match_cheaper: "Vill ha offert under nuvarande pris",
  match_verified: "Vill ha offert från kontrollerat företag",
  contract_review: "Avtalsgranskning",
  financing: "Finansiering",
};

/** Vilken sorts partner leadet ska säljas till. */
export const INTENT_BUYER: Record<LeadIntent, string> = {
  match_cheaper: "Installatör / hantverkare i regionen",
  match_verified: "Installatör / hantverkare i regionen",
  contract_review: "Juristbyrå eller besiktningsföretag",
  financing: "Bank eller finansbolag",
};

function kr(value: number | null | undefined): string | null {
  const n = Number(value);
  if (!isFinite(n) || !value) return null;
  return `${Math.round(n).toLocaleString("sv-SE")} kr`;
}

export function leadAgeDays(lead: Pick<PartnerLead, "created_at">): number {
  const ms = Date.now() - new Date(lead.created_at).getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}

function freshness(lead: PartnerLead): string {
  const days = leadAgeDays(lead);
  if (days === 0) return "Förfrågan kom in i dag";
  if (days === 1) return "Förfrågan kom in i går";
  return `Förfrågan kom in för ${days} dagar sedan`;
}

/** Kort beskrivning av jobbet – utan uppgifter som pekar ut kunden. */
function jobLine(lead: PartnerLead): string {
  const category = lead.quote_category ?? "ett hantverksjobb";
  const region = lead.quote_region ?? "Sverige";
  const total = kr(lead.quote_total);
  return total
    ? `en förfrågan från en villaägare i ${region} som fått ett prisförslag på ${category} för ${total}`
    : `en förfrågan från en villaägare i ${region} som fått ett prisförslag på ${category}`;
}

function priceLine(lead: PartnerLead): string | null {
  const pct = Number(lead.over_market_pct);
  if (!isFinite(pct) || !lead.over_market_pct) return null;
  if (pct > 0) return `Vår analys visar att offerten ligger ${Math.round(pct)} % över marknadspris`;
  if (pct < 0) return `Vår analys visar att offerten ligger ${Math.abs(Math.round(pct))} % under marknadspris`;
  return "Vår analys visar att offerten ligger på marknadspris";
}

export interface PartnerPitch {
  subject: string;
  body: string;
  /** Punkter att luta sig mot i ett telefonsamtal. */
  callScript: string;
}

/**
 * Bygger säljunderlaget till en B2B-partner.
 *
 * Texten är medvetet anonymiserad: kundens namn, e-post och telefon finns
 * aldrig med, och inte heller vilket bolag som lämnat den befintliga offerten.
 * Kontaktuppgifterna lämnas först när leadet är sålt.
 */
export function buildPartnerPitch(lead: PartnerLead, partnerName?: string): PartnerPitch {
  const hello = partnerName?.trim() ? `Tjena ${partnerName.trim()}!` : "Tjena!";
  const region = lead.quote_region ?? "regionen";
  const category = lead.quote_category ?? "jobbet";
  const price = priceLine(lead);
  const intro =
    "Vi driver analysverktyget Fråga Saga (fragasaga.se) där konsumenter laddar upp sina " +
    "offerter för pris- och seriositetsgranskning.";

  if (lead.intent === "contract_review" || lead.intent === "financing") {
    const need =
      lead.intent === "contract_review"
        ? `vill ha avtalsvillkoren granskade innan hen signerar`
        : `söker finansiering för projektet`;
    return {
      subject: `Kundförfrågan i ${region} – ${category}`,
      body:
        `${hello}\n\n${intro}\n\nVi har just nu ${jobLine(lead)}. Kunden ${need}.\n\n` +
        `${freshness(lead)}. Är det här en kund ni vill ta över? Vi söker ett par fasta ` +
        `samarbetspartners som löpande vill få den här typen av färdiga förfrågningar.\n\n` +
        `Med vänlig hälsning\nFråga Saga`,
      callScript: [
        `Fråga Saga – konsumenter laddar upp offerter för granskning.`,
        `Färskt: ${jobLine(lead)}.`,
        `Kunden ${need}.`,
        `${freshness(lead)} – vill ni ta över den?`,
      ].join("\n• "),
    };
  }

  if (lead.intent === "match_verified") {
    const why = lead.red_flags?.length
      ? `Bolaget som lämnat offerten föll på vår myndighetskontroll (${lead.red_flags[0]})`
      : "Bolaget som lämnat offerten föll på vår myndighetskontroll";
    return {
      subject: `Färdig offertförfrågan i ${region} – ${category}`,
      body:
        `${hello}\n\n${intro}\n\nVi fick precis in ${jobLine(lead)}. ${why}, och kunden vill nu ` +
        `ha en offert från ett företag som vi kontrollerat mot Skatteverket och Bolagsverket.\n\n` +
        `Eftersom ni täcker det området tänkte jag höra om ni vill ta över detta lead? Kunden är ` +
        `redan varm – hen har bestämt sig för att göra jobbet, det är bara utföraren som ska bytas.\n\n` +
        `${freshness(lead)}. Vi söker just nu 2 fasta partners i regionen som vill få den här typen ` +
        `av färdiga offertförfrågningar löpande.\n\nMed vänlig hälsning\nFråga Saga`,
      callScript: [
        `Fråga Saga – konsumenter laddar upp offerter för granskning.`,
        `Färskt: ${jobLine(lead)}.`,
        `${why} – kunden vill byta utförare, inte ompröva jobbet.`,
        `${freshness(lead)}. Vi tar in 2 fasta partners i ${region}.`,
      ].join("\n• "),
    };
  }

  // match_cheaper
  const low = lead.market_low ? Math.round(Number(lead.market_low)).toLocaleString("sv-SE") : null;
  const range =
    low && kr(lead.market_high) ? `Vårt marknadsintervall för jobbet är ${low}–${kr(lead.market_high)}.` : "";
  return {
    subject: `Färdig offertförfrågan i ${region} – ${category}`,
    body:
      `${hello}\n\n${intro}\n\nVi fick precis in ${jobLine(lead)}. ` +
      `${price ? price + ", och " : ""}kunden vill nu ha ett jämförande förslag.\n\n` +
      `Eftersom ni täcker det området tänkte jag höra om ni vill ta över detta lead? ` +
      `Ni vet ju exakt vad ni behöver lägga er under för att ta affären. ${range}\n\n` +
      `${freshness(lead)}. Vi söker just nu 2 fasta partners i regionen som vill få den här typen ` +
      `av färdiga offertförfrågningar löpande.\n\nMed vänlig hälsning\nFråga Saga`,
    callScript: [
      `Fråga Saga – konsumenter laddar upp offerter för granskning.`,
      `Färskt: ${jobLine(lead)}.`,
      price ? `${price} – kunden vill ha ett jämförande förslag.` : `Kunden vill ha ett jämförande förslag.`,
      `Ni vet exakt vad ni ska lägga er under. ${freshness(lead)}.`,
      `Vi tar in 2 fasta partners i ${region}.`,
    ].join("\n• "),
  };
}

/** Kontaktuppgifterna som lämnas ut först när leadet är sålt. */
export function buildHandoverText(lead: PartnerLead): string {
  const rows = [
    ["Namn", lead.name],
    ["E-post", lead.email],
    ["Telefon", lead.phone],
    ["Kategori", lead.quote_category],
    ["Region", lead.quote_region],
    ["Offererat pris", kr(lead.quote_total)],
  ].filter(([, v]) => v);
  return (
    `Kontaktuppgifter till kunden:\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nKunden har godkänt att bli kontaktad av upp till två företag om denna förfrågan.`
  );
}
