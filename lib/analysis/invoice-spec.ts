/**
 * Specen för fakturakontrollen — systemprompt och JSON-schema.
 *
 * Formen motsvarar `InvoiceAnalysis` i app/page.tsx. Ändras den ena måste
 * den andra följa med, annars renderar resultatvyn tomma fält.
 */

export const INVOICE_SYSTEM_PROMPT = `Du är Saga, Sveriges AI för fakturakontroll. Analysera fakturan (bild eller text) och bedöm risken för bedrägeri eller förfalskning.

OBLIGATORISKA UPPGIFTER PÅ SVENSKA FAKTUROR (Bokföringslagen/Mervärdesskattelagen):
- Fakturanummer (unikt, löpande numrering)
- Fakturadatum och förfallodatum
- Säljarens fullständiga namn, adress och organisationsnummer (10 siffror)
- Säljarens momsregistreringsnummer (SE + org.nr + 01) om momspliktig
- Köparens namn och adress
- Tydlig beskrivning av levererade varor/tjänster, kvantitet, enhetspris
- Momsbelopp och momssats (vanligen 25%, 12% eller 6%)
- Betalningsuppgifter: bankgiro, plusgiro eller IBAN+BIC

VANLIGA TECKEN PÅ FALSKA FAKTUROR I SVERIGE:
- Organisationsnummer stämmer inte med angivet företagsnamn
- Bankgiro/plusgiro/IBAN tillhör inte avsändaren
- Saknade obligatoriska uppgifter (fakturanummer, org.nr, betalningsinfo)
- Onormalt kort betalningstid (under 5 dagar) kombinerat med hotfullt språk
- Vagt eller generiskt angivet tjänsteinnehåll ("konsulttjänster", "rådgivning" utan detaljer)
- Grammatik- eller stavfel, ovanlig formatering
- Belopp strax under attestgränser (49 999 kr, 99 999 kr)
- Ovanliga betalningsrutiner (kryptovaluta, Swish till privatperson, utländskt konto)
- Fakturan liknar en känd leverantörs men med avvikande konto eller adress
- Nyskapad e-postdomän eller domän som liknar ett känt företag

Svara ENDAST med ett giltigt JSON-objekt enligt det angivna schemat.`;

export const INVOICE_JSON_SCHEMA = {
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
    invoice: {
      type: "object",
      properties: {
        invoice_number: { type: ["string", "null"] },
        invoice_date: { type: ["string", "null"] },
        due_date: { type: ["string", "null"] },
        total_amount: { type: "number" },
        payment_account: { type: ["string", "null"] },
        payment_method: { type: ["string", "null"] },
        ocr_reference: { type: ["string", "null"] },
      },
      required: ["invoice_number", "invoice_date", "due_date", "total_amount", "payment_account", "payment_method", "ocr_reference"],
      additionalProperties: false,
    },
    fraud_verdict: { type: "string", enum: ["SAFE", "SUSPICIOUS", "LIKELY_FRAUD"] },
    verdict_text: { type: "string" },
    risk_score: { type: "number" },
    fraud_signals: { type: "array", items: { type: "string" } },
    legitimate_signals: { type: "array", items: { type: "string" } },
    missing_fields: { type: "array", items: { type: "string" } },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
  },
  required: [
    "company", "invoice", "fraud_verdict", "verdict_text",
    "risk_score", "fraud_signals", "legitimate_signals", "missing_fields", "confidence",
  ],
  additionalProperties: false,
};


/** Instruktionen som följer med själva fakturan i användarturen. */
export const INVOICE_INSTRUCTION =
  "Analysera denna faktura och bedöm risken för bedrägeri. Svara med exakt den JSON-struktur som angavs. Ingen annan text.";

/** Samlad spec som skickas till leverantören. */
export const INVOICE_SPEC = {
  systemPrompt: INVOICE_SYSTEM_PROMPT,
  schema: INVOICE_JSON_SCHEMA,
  instruction: INVOICE_INSTRUCTION,
};
