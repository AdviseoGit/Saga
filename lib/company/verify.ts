/**
 * Företagskoll utan betaltjänst.
 *
 * VIES (avgiftsfritt, ingen nyckel) är basen och räcker för momsregistrering,
 * registrerat namn och adress. Roaring anropas bara om nycklarna finns kvar i
 * miljön och fyller då på med F-skatt och bolagsstatus — uppgifter som INTE
 * går att få från något avgiftsfritt öppet API (Skatteverkets
 * beskattningsengagemang är ett partner-API).
 *
 * Grundregeln: fält vi inte har kontrollerat ska vara null, aldrig gissade.
 * VerificationRow renderar null som "Uppgift saknas", och outcomes.ts triggar
 * bara på === false. Ett okänt värde får alltså aldrig peka ut ett företag.
 */

import { lookupVies, compareNames } from "./vies";

export interface CompanyVerification {
  companyName: string | null;
  companyId: string | null;
  statusCode: string | null;
  statusTextHigh: string | null;
  statusTextDetailed: string | null;
  preliminaryTaxReg: boolean | null;
  vatReg: boolean | null;
  employerContributionReg: boolean | null;
  legalGroupCode: string | null;
  legalGroupText: string | null;
  companyRegistrationDate: string | null;
  address: string | null;
  zipCode: string | null;
  town: string | null;
  numberEmployeesInterval: string | null;
  industryCode: string | null;
  industryText: string | null;
  topDirectorName: string | null;
  topDirectorFunction: string | null;
  commune: string | null;
  county: string | null;
  /** Vilka källor som faktiskt svarade — visas inte, men gör svaret felsökbart. */
  sources: string[];
  /** Gick numret att slå upp alls? null = tjänsten var nere. */
  orgNrValid: boolean | null;
  /** Stämmer namnet på offerten med det registrerade? null = kunde inte jämföras. */
  nameMatchesQuote: boolean | null;
}

function empty(): CompanyVerification {
  return {
    companyName: null, companyId: null, statusCode: null, statusTextHigh: null,
    statusTextDetailed: null, preliminaryTaxReg: null, vatReg: null,
    employerContributionReg: null, legalGroupCode: null, legalGroupText: null,
    companyRegistrationDate: null, address: null, zipCode: null, town: null,
    numberEmployeesInterval: null, industryCode: null, industryText: null,
    topDirectorName: null, topDirectorFunction: null, commune: null, county: null,
    sources: [], orgNrValid: null, nameMatchesQuote: null,
  };
}

// ─── Roaring (valfri påfyllnad) ───────────────────────────────────────────────

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function roaringToken(): Promise<string | null> {
  const id = process.env.ROARING_CLIENT_ID;
  const secret = process.env.ROARING_CLIENT_SECRET;
  if (!id || !secret) return null;

  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60_000) return cachedToken;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch("https://api.roaring.io/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error(`[roaring] auth ${res.status}`);
      return null;
    }
    const data = await res.json();
    cachedToken = data.access_token;
    tokenExpiresAt = now + data.expires_in * 1000;
    return cachedToken;
  } catch (e) {
    console.error("[roaring] auth fel:", e instanceof Error ? e.message : String(e));
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function roaringOverview(orgNr: string): Promise<Record<string, unknown> | null> {
  const token = await roaringToken();
  if (!token) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`https://api.roaring.io/se/company/overview/2.0/${orgNr}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });
    if (!res.ok) {
      if (res.status !== 404) console.error(`[roaring] uppslag ${res.status}`);
      return null;
    }
    const raw = await res.json();
    const records = raw.records as Record<string, unknown>[] | undefined;
    return records?.[0] ?? null;
  } catch (e) {
    console.error("[roaring] uppslag fel:", e instanceof Error ? e.message : String(e));
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
const bool = (v: unknown) => (typeof v === "boolean" ? v : null);

// ─── Orkestrering ─────────────────────────────────────────────────────────────

export async function verifyCompany(
  orgNr: string,
  quotedName?: string | null
): Promise<CompanyVerification> {
  const out = empty();
  out.companyId = orgNr;

  const [vies, roaring] = await Promise.all([
    lookupVies(orgNr),
    roaringOverview(orgNr).catch(() => null),
  ]);

  if (!vies.unavailable) {
    out.sources.push("vies");
    out.orgNrValid = vies.isValid;
    // isValid=false är tvetydigt (ej momsregistrerad ELLER numret finns inte),
    // så det får bara bli ett positivt besked — aldrig ett "nej" som pekar ut
    // företaget. Signalen om att numret inte gick att slå upp bärs av
    // orgNrValid, som konsumenterna behandlar som ett läsfel.
    out.vatReg = vies.isValid ? true : null;
    out.companyName = vies.name;
    out.address = vies.address;
    out.zipCode = vies.zipCode;
    out.town = vies.town;
  }

  if (roaring) {
    out.sources.push("roaring");
    out.orgNrValid = true;
    out.companyName = str(roaring.companyName) ?? out.companyName;
    out.statusCode = str(roaring.statusCode);
    out.statusTextHigh = str(roaring.statusTextHigh);
    out.statusTextDetailed = str(roaring.statusTextDetailed);
    out.preliminaryTaxReg = bool(roaring.preliminaryTaxReg);
    out.vatReg = bool(roaring.vatReg) ?? out.vatReg;
    out.employerContributionReg = bool(roaring.employerContributionReg);
    out.legalGroupCode = str(roaring.legalGroupCode);
    out.legalGroupText = str(roaring.legalGroupText);
    out.companyRegistrationDate = str(roaring.companyRegistrationDate);
    out.address = str(roaring.address) ?? out.address;
    out.zipCode = str(roaring.zipCode) ?? out.zipCode;
    out.town = str(roaring.town) ?? out.town;
    out.numberEmployeesInterval = str(roaring.numberEmployeesInterval);
    out.industryCode = str(roaring.industryCode);
    out.industryText = str(roaring.industryText);
    out.topDirectorName = str(roaring.topDirectorName);
    out.topDirectorFunction = str(roaring.topDirectorFunction);
    out.commune = str(roaring.commune);
    out.county = str(roaring.county);
  }

  out.nameMatchesQuote = compareNames(quotedName ?? null, out.companyName);
  return out;
}
