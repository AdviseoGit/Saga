/**
 * Specen för offertanalysen — systemprompt och JSON-schema.
 *
 * Enda källan till sanning: både Claude- och Gemini-adaptern och
 * jämförelseskriptet läser härifrån, så ett byte av leverantör aldrig
 * innebär två versioner av prompten som glider isär.
 */

/**
 * Kontrollerad vokabulär för `quote.category`.
 *
 * Fältet var fritext utan vägledning, vilket gav värden som "Kök",
 * "Inredning", "maskiner/utrustning" och "unknown" i `analyses` — omöjligt att
 * gruppera i Saga Index. Värdena är gemena och matchar CATEGORY_CONFIG i
 * SagaIndexData (som slår upp skiftlägesokänsligt).
 *
 * Kategorin styr dessutom vilket marknadsintervall offerten jämförs mot, så fel
 * kategori ger fel prisdom.
 */
export const QUOTE_CATEGORIES = [
  "badrumsrenovering",
  "köksrenovering",
  "målning",
  "el",
  "vvs-arbete",
  "golv",
  "takbyte",
  "fasadrenovering",
  "solceller",
  "bergvärme",
  "värmepump",
  "fönster/dörrar",
  "markarbete",
  "övrigt",
] as const;

export const QUOTE_SYSTEM_PROMPT = `Du är Saga, Sveriges AI för offertanalys. Analysera offerten (bild eller text) och extrahera företagsuppgifter samt prisanalys.

KATEGORISERING — gör detta först:
1. Avgör vad offerten huvudsakligen avser och sätt quote.category till exakt ett av schemats tillåtna värden. Väg artikel- och arbetsraderna tyngst. Avsändarens eget firmanamn i sidhuvudet säger inget om kategorin — en byggvaruhandel säljer allt.
2. Leverantörs- och varumärkesnamn PÅ ARTIKELRADERNA är däremot starka signaler: Marbodal, Ballingslöv, Vedum, HTH, Kvik, Puustelli, Nobia => kök. Hafa, Svedbergs, INR, Macro, Gustavsberg, Ifö => badrum.
3. Nyckelord: köksstommar, köksluckor, lådfronter, bänkskiva, kökskran, vitvaror, snickerier till kök => "köksrenovering". Kakel, klinker, tätskikt, golvbrunn, dusch, wc, handfat, badrumsmöbel => "badrumsrenovering". Blanda aldrig ihop dem.
4. Ord som räknas upp i en undantagsmening ("exkl vitvaror & bänkskiva, vaskar och kökskran") beskriver fortfarande vilket arbete offerten avser — använd dem som signal, inte som skäl att bortse från kategorin.
5. En ren material- eller leveransoffert från en byggvaruhandel kategoriseras efter vad materialet ska användas till. Använd "övrigt" endast när det verkligen inte går att avgöra vilken sorts arbete offerten avser.
6. Jämför ENDAST mot marknadsdatan för den kategori du valt. Låna aldrig ett prisintervall från en annan kategori.
7. Saknas marknadsdata nedan för den valda kategorin: sätt market_range till null, verdict till "UNKNOWN", confidence till "low" och förklara i verdict_text att Saga saknar prisunderlag för just den här typen av arbete. Hitta aldrig på ett intervall.
8. Omfattar offerten bara material och leverans utan montage: jämför ändå mot kategorins riktvärde, men skriv i verdict_text att riktvärdet avser ett komplett arbete inklusive montage, så att jämförelsen inte övertolkas.

SVENSK MARKNADSPRISDATA (riktvärden 2026) — finns endast för kategorierna nedan:
- Badrumsrenovering: litet 60–120 kkr, medel 90–180 kkr, stort 150–300 kkr. Rivning 8–20 kkr, rör 15–40 kkr, kakel 800–1500 kr/kvm, el 5–15 kkr, tätskikt 10–20 kkr.
- Köksrenovering: ytskikt 30–80 kkr, komplett 80–250 kkr.
- Målning: per rum 5–15 kkr, hel lägenhet 25–60 kkr, fasad villa 40–100 kkr, timpris 350–550 kr/tim.
- El: timpris 450–700 kr/tim, elcentral 15–35 kkr, belysning per punkt 1,5–3,5 kkr.
- VVS-arbete: timpris 450–750 kr/tim, blandare 2–5 kkr, värmepanna 30–80 kkr, golvvärme 500–1200 kr/kvm.
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
        category: { type: "string", enum: [...QUOTE_CATEGORIES] },
        region_guess: { type: ["string", "null"] },
        validity_days: { type: ["number", "null"] },
        estimated_area_sqm: { type: ["number", "null"] },
        estimated_rooms: { type: ["number", "null"] },
        timeline_weeks: { type: ["number", "null"] },
      },
      required: ["total_amount", "includes_vat", "includes_rot", "category", "region_guess"],
      additionalProperties: false,
    },
    verdict: { type: "string", enum: ["LOW", "FAIR", "HIGH", "VERY_HIGH", "UNKNOWN"] },
    verdict_text: { type: "string" },
    // Nullbar: utan den möjligheten tvingas modellen uppfinna ett intervall när
    // kategorin saknar underlag. I test hittade den på 120–220, 130–210 och
    // 140–180 kkr för samma köksoffert — inget av dem är riktvärdet ovan.
    // toGeminiSchema översätter unionen till OBJECT + nullable: true.
    market_range: {
      type: ["object", "null"],
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
