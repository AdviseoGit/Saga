import type { SagaAnalysis, CompanyVerification } from "../app/page";

/**
 * "Saga-fällan" – varje analys landar i exakt ett av tre utfall, och varje
 * utfall har en egen nästa-steg-CTA. Logiken hålls här så att både
 * resultatvyn och (framtida) e-postutskick kan använda samma bedömning.
 */

export type OutcomeId = "COMPANY_RISK" | "EXPENSIVE" | "UNASSESSED" | "FAVORABLE";

export type LeadIntent =
  | "match_cheaper"    // Utfall A – matcha mot bolag som lägger sig under priset
  | "match_verified"   // Utfall C – offerter från kontrollerade bolag
  | "contract_review"  // Utfall B – avtalsgranskning före signering
  | "financing";       // Utfall B – finansiering av projektet

export interface OutcomeAction {
  intent: LeadIntent;
  label: string;
  /** Rubrik i formuläret som öppnas när knappen klickas. */
  formTitle: string;
  /** Texten användaren godkänner innan förfrågan skickas. */
  consentText: string;
}

export interface Outcome {
  id: OutcomeId;
  tone: "red" | "amber" | "emerald";
  eyebrow: string;
  headline: string;
  body: string;
  /** Konkreta skäl (företagsrisker) som motiverar utfallet. */
  reasons: string[];
  primary: OutcomeAction;
  secondary: OutcomeAction | null;
}

export interface MarketPosition {
  /** Mittpunkten i marknadsintervallet. */
  mid: number | null;
  /** Avvikelse mot mittpunkten i procent (positivt = dyrare). */
  pct: number | null;
  /** Kronor över mittpunkten (null om offerten ligger under). */
  overMarketAmount: number | null;
}

const INACTIVE_STATUS = /avregistrerad|konkurs|likvidation/i;

export function marketPosition(analysis: SagaAnalysis): MarketPosition {
  const total = analysis.quote?.total_amount ?? 0;
  const market = analysis.market_range;
  if (!market || !total) return { mid: null, pct: null, overMarketAmount: null };
  const mid = (market.low + market.high) / 2;
  if (!mid) return { mid: null, pct: null, overMarketAmount: null };
  const pct = Math.round(((total - mid) / mid) * 100);
  return { mid, pct, overMarketAmount: total > mid ? Math.round(total - mid) : null };
}

/** Röda flaggor som kommer från myndighetskollen, inte från offerten. */
export function companyRiskReasons(
  verification: CompanyVerification | null,
  verificationError: string | null
): string[] {
  const reasons: string[] = [];
  if (verification) {
    if (verification.preliminaryTaxReg === false) reasons.push("Företaget saknar F-skattsedel");
    if (verification.statusTextHigh && INACTIVE_STATUS.test(verification.statusTextHigh)) {
      reasons.push(`Bolagsstatus hos Bolagsverket: ${verification.statusTextHigh}`);
    }
    if (verification.vatReg === false) reasons.push("Företaget är inte momsregistrerat");
  } else if (verificationError && /hittades inte/i.test(verificationError)) {
    reasons.push("Företaget hittades inte i myndighetsregistren");
  }
  return reasons;
}

function kr(value: number): string {
  return `${Math.round(value).toLocaleString("sv-SE")} kr`;
}

const MATCH_CONSENT =
  "Jag godkänner att Fråga Saga kontaktar mig och delar min förfrågan med upp till två kvalitetssäkrade företag.";
const ADVICE_CONSENT =
  "Jag godkänner att Fråga Saga kontaktar mig om detta ärende.";

const CONTRACT_REVIEW: OutcomeAction = {
  intent: "contract_review",
  label: "Granska avtalet innan jag signerar →",
  formTitle: "Avtalsgranskning innan signering",
  consentText: ADVICE_CONSENT,
};

const FINANCING: OutcomeAction = {
  intent: "financing",
  label: "Se finansiering för projektet →",
  formTitle: "Finansiering av projektet",
  consentText: ADVICE_CONSENT,
};

/**
 * Bestämmer utfallet. Företagsrisk väger tyngst – ett bra pris hos ett bolag
 * utan F-skatt är fortfarande en dålig affär.
 */
export function resolveOutcome(
  analysis: SagaAnalysis,
  verification: CompanyVerification | null,
  verificationError: string | null
): Outcome {
  const reasons = companyRiskReasons(verification, verificationError);
  const { pct, overMarketAmount } = marketPosition(analysis);
  const category = analysis.quote?.category ?? "arbetet";

  if (reasons.length > 0) {
    return {
      id: "COMPANY_RISK",
      tone: "red",
      eyebrow: "Varning",
      headline: "Kontrollera företaget innan du går vidare",
      body:
        "Saga hittade allvarliga signaler i myndighetsregistren. Skriv inte på förrän du fått " +
        "en förklaring – eller ta in offerter från företag vi redan kontrollerat.",
      reasons,
      primary: {
        intent: "match_verified",
        label: "Begär offerter från kontrollerade företag →",
        formTitle: "Offerter från kontrollerade företag",
        consentText: MATCH_CONSENT,
      },
      secondary: CONTRACT_REVIEW,
    };
  }

  const priceIsHigh = analysis.verdict === "HIGH" || analysis.verdict === "VERY_HIGH";
  const aboveMarket = pct !== null && pct >= 10;
  const badTerms = (analysis.red_flags?.length ?? 0) > 0;

  if (priceIsHigh || aboveMarket || badTerms) {
    const headline = overMarketAmount
      ? `Du betalar ${kr(overMarketAmount)} mer än marknadssnittet`
      : badTerms && !priceIsHigh && !aboveMarket
      ? "Villkoren i offerten drar ner den"
      : "Offerten ligger över marknadsnivån";
    return {
      id: "EXPENSIVE",
      tone: priceIsHigh || aboveMarket ? "amber" : "red",
      eyebrow: "Nästa steg",
      headline,
      body:
        `Vi matchar dig med två kvalitetssäkrade bolag som lämnar en offert på ${category} ` +
        "under det här priset. Kostnadsfritt, och du bestämmer själv om du tackar ja.",
      reasons: [],
      primary: {
        intent: "match_cheaper",
        label: "Matcha mig med 2 bolag som lägger sig under priset →",
        formTitle: "Matcha mig med 2 kvalitetssäkrade bolag",
        consentText: MATCH_CONSENT,
      },
      secondary: null,
    };
  }

  // Saknar Saga prisunderlag för kategorin får utfallet inte påstå att priset
  // ser bra ut — vi vet inte. Samma CTA:n som FAVORABLE, ärlig rubrik.
  if (analysis.verdict === "UNKNOWN" || !analysis.market_range) {
    return {
      id: "UNASSESSED",
      tone: "amber",
      eyebrow: "Nästa steg",
      headline: `Saga kan inte prisbedöma ${category}`,
      body:
        "Vi har inget marknadsunderlag för den här typen av arbete, så vi säger varken att " +
        "priset är bra eller dåligt. Vill du ändå att någon går igenom avtalsvillkoren innan " +
        "du signerar?",
      reasons: [],
      primary: CONTRACT_REVIEW,
      secondary: FINANCING,
    };
  }

  return {
    id: "FAVORABLE",
    tone: "emerald",
    eyebrow: "Nästa steg",
    headline: "Priset ser bra ut – tryggt hela vägen fram?",
    body:
      "Innan du signerar: vill du att någon går igenom avtalsvillkoren, eller behöver du " +
      "finansiering för projektet?",
    reasons: [],
    primary: CONTRACT_REVIEW,
    secondary: FINANCING,
  };
}
