/**
 * EU:s VIES-tjänst — avgiftsfri, ingen nyckel, ingen registrering.
 *
 * Ger tre saker vi tidigare betalade Roaring för:
 *  - att organisationsnumret över huvud taget finns och är momsregistrerat
 *  - företagets officiellt registrerade namn
 *  - registrerad adress
 *
 * Svenskt momsnummer = "SE" + organisationsnummer (10 siffror) + "01".
 *
 * Viktigt: isValid=false betyder "numret är inte momsregistrerat ELLER finns
 * inte". På en fotograferad offert är felläst org.nr en betydligt troligare
 * förklaring än ett oseriöst företag — se toVerification() i ./verify.
 */

const VIES_BASE = "https://ec.europa.eu/taxation_customs/vies/rest-api/ms/SE/vat";
const TIMEOUT_MS = 8000;

export interface ViesResult {
  /** Numret gick att slå upp och är momsregistrerat. */
  isValid: boolean;
  /** Officiellt registrerat namn, om VIES lämnar ut det. */
  name: string | null;
  address: string | null;
  zipCode: string | null;
  town: string | null;
  /** Tjänsten svarade inte — skilj detta från isValid=false. */
  unavailable: boolean;
}

/** VIES maskerar okända värden som "---". */
function clean(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  if (!t || /^-+$/.test(t)) return null;
  return t;
}

/** "MAGASINSG 19 \n434 37 KUNGSBACKA" -> gata / postnr / ort */
export function splitAddress(raw: string | null): {
  address: string | null;
  zipCode: string | null;
  town: string | null;
} {
  if (!raw) return { address: null, zipCode: null, town: null };
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { address: null, zipCode: null, town: null };

  const last = lines[lines.length - 1];
  const m = last.match(/^(\d{3}\s?\d{2})\s+(.+)$/);
  if (m) {
    return {
      address: lines.slice(0, -1).join(", ") || null,
      zipCode: m[1].replace(/\s/g, ""),
      town: m[2],
    };
  }
  return { address: lines.join(", "), zipCode: null, town: null };
}

export async function lookupVies(orgNr: string): Promise<ViesResult> {
  const vat = `${orgNr}01`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${VIES_BASE}/${vat}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error(`[vies] HTTP ${res.status} för ${vat}`);
      return { isValid: false, name: null, address: null, zipCode: null, town: null, unavailable: true };
    }

    const data = (await res.json()) as Record<string, unknown>;
    const parsed = splitAddress(clean(data.address));

    return {
      isValid: data.isValid === true,
      name: clean(data.name),
      ...parsed,
      unavailable: false,
    };
  } catch (e) {
    console.error("[vies] uppslag misslyckades:", e instanceof Error ? e.message : String(e));
    return { isValid: false, name: null, address: null, zipCode: null, town: null, unavailable: true };
  } finally {
    clearTimeout(timeout);
  }
}

/** Bolagsformer och branschord som inte säger något om identiteten. */
const GENERIC = new Set([
  "ab", "aktiebolag", "hb", "handelsbolag", "kb", "kommanditbolag", "ekonomisk",
  "förening", "firma", "bygg", "byggnads", "byggservice", "entreprenad", "montage",
  "service", "sverige", "svenska", "nordic", "nordisk", "group", "gruppen", "och",
]);

function tokens(name: string): Set<string> {
  return new Set(
    name
      .toLowerCase()
      .replace(/[^a-z0-9åäöé\s-]+/g, " ")
      .split(/[\s-]+/)
      .filter((t) => t.length >= 2)
  );
}

/**
 * Jämför namnet på offerten med det registrerade namnet.
 *
 * Jämförelsen är medvetet generös. Kedjor och lokalkontor skriver sig sällan
 * exakt som den registrerade juridiska personen — offerten i testet stod som
 * "XL-BYGG Mölndal" medan bolaget heter "XL Bygg Kungsbacka AB". Bifirmor och
 * varumärkesnamn ger samma effekt. Ett falskt "fel namn" är dyrare än ett
 * missat, så det krävs ett gemensamt ord som faktiskt är särskiljande.
 */
export function compareNames(quoted: string | null, registered: string | null): boolean | null {
  if (!quoted || !registered) return null;
  const a = tokens(quoted);
  const b = tokens(registered);
  if (a.size === 0 || b.size === 0) return null;

  const shared = [...a].filter((t) => b.has(t));
  if (shared.length === 0) return false;
  if (shared.some((t) => !GENERIC.has(t))) return true;
  return shared.length >= 2 ? true : false;
}
