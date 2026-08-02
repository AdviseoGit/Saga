/**
 * Specen för offertanalysen — systemprompt och JSON-schema.
 *
 * Enda källan till sanning: både Claude- och Gemini-adaptern och
 * jämförelseskriptet läser härifrån, så ett byte av leverantör aldrig
 * innebär två versioner av prompten som glider isär.
 */

export const QUOTE_SYSTEM_PROMPT = `Du är Saga, Sveriges AI för offertanalys. Analysera offerten (bild eller text) och extrahera företagsuppgifter samt prisanalys.

SVENSK MARKNADSPRISDATA (riktvärden 2026):
- Badrumsrenovering: litet 60–120 kkr, medel 90–180 kkr, stort 150–300 kkr. Rivning 8–20 kkr, rör 15–40 kkr, kakel 800–1500 kr/kvm, el 5–15 kkr, tätskikt 10–20 kkr.
- Kök: ytskikt 30–80 kkr, komplett 80–250 kkr.
- Målning: per rum 5–15 kkr, hel lägenhet 25–60 kkr, fasad villa 40–100 kkr, timpris 350–550 kr/tim.
- El: timpris 450–700 kr/tim, elcentral 15–35 kkr, belysning per punkt 1,5–3,5 kkr.
- VVS: timpris 450–750 kr/tim, blandare 2–5 kkr, värmepanna 30–80 kkr, golvvärme 500–1200 kr/kvm.
- Golv: laminat 400–700 kr/kvm, parkett 600–1200 kr/kvm.
- Stockholm ~1,15–1,3x, Göteborg ~1,05–1,15x, Skåne ~1,0–1,1x. ROT 2026: 30% arbetskostnad, max 50 000 kr/person/år.

Svara ENDAST med ett giltigt JSON-objekt enligt den angivna schemat.`;

export const QUOTE_JSON_SCHEMA = {
  type: "object",
  properties: {
    company: {
      type: "object",
      properties: {
        name: { type: ["string", "null"] },
        org_nr: { type: ["string", "null"] },
        address: { type: ["string", "null"] },
        contact: { type: ["string", "null"] },
      },
      required: ["name", "org_nr", "address", "contact"],
      additionalProperties: false,
    },
    quote: {
      type: "object",
      properties: {
        total_amount: { type: "number" },
        includes_vat: { type: "boolean" },
        includes_rot: { type: "boolean" },
        rot_eligible_labor: { type: ["number", "null"] },
        rot_deduction: { type: ["number", "null"] },
        total_after_rot: { type: ["number", "null"] },
        category: { type: "string" },
        region_guess: { type: ["string", "null"] },
        validity_days: { type: ["number", "null"] },
        estimated_area_sqm: { type: ["number", "null"] },
        estimated_rooms: { type: ["number", "null"] },
        timeline_weeks: { type: ["number", "null"] },
      },
      required: ["total_amount", "includes_vat", "includes_rot", "category", "region_guess"],
      additionalProperties: false,
    },
    verdict: { type: "string", enum: ["LOW", "FAIR", "HIGH", "VERY_HIGH"] },
    verdict_text: { type: "string" },
    market_range: {
      type: "object",
      properties: { low: { type: "number" }, high: { type: "number" } },
      required: ["low", "high"],
      additionalProperties: false,
    },
    line_items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          description: { type: "string" },
          amount: { type: "number" },
          is_labor: { type: "boolean" },
          assessment: { type: "string", enum: ["LOW", "FAIR", "HIGH"] },
          market_range: { type: "string" },
          comment: { type: "string" },
        },
        required: ["description", "amount"],
        additionalProperties: false,
      },
    },
    red_flags: { type: "array", items: { type: "string" } },
    yellow_flags: { type: "array", items: { type: "string" } },
    green_flags: { type: "array", items: { type: "string" } },
    negotiate_tips: { type: "array", items: { type: "string" } },
    missing_in_quote: { type: "array", items: { type: "string" } },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
  },
  required: [
    "company", "quote", "verdict", "verdict_text", "market_range",
    "line_items", "red_flags", "yellow_flags", "green_flags",
    "negotiate_tips", "missing_in_quote", "confidence",
  ],
  additionalProperties: false,
};

/** Instruktionen som följer med själva offerten i användarturen. */
export const QUOTE_INSTRUCTION =
  "Analysera denna offert och svara med exakt den JSON-struktur som angavs. Ingen annan text.";

/** Samlad spec som skickas till leverantören. */
export const QUOTE_SPEC = {
  systemPrompt: QUOTE_SYSTEM_PROMPT,
  schema: QUOTE_JSON_SCHEMA,
  instruction: QUOTE_INSTRUCTION,
};
