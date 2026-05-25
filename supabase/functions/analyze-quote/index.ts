// Supabase Edge Function: anropas med bild (base64) eller PDF-text. Använder Claude (Anthropic) för offert- och fakturaanalys.
// Sätt ANTHROPIC_API_KEY i Supabase → Project Settings → Edge Functions → Secrets.

// ─── Quote mode ───────────────────────────────────────────────────────────────

const QUOTE_SYSTEM_PROMPT = `Du är Saga, Sveriges AI för offertanalys. Analysera offerten (bild eller text) och extrahera företagsuppgifter samt prisanalys.

SVENSK MARKNADSPRISDATA (riktvärden 2026):
- Badrumsrenovering: litet 60–120 kkr, medel 90–180 kkr, stort 150–300 kkr. Rivning 8–20 kkr, rör 15–40 kkr, kakel 800–1500 kr/kvm, el 5–15 kkr, tätskikt 10–20 kkr.
- Kök: ytskikt 30–80 kkr, komplett 80–250 kkr.
- Målning: per rum 5–15 kkr, hel lägenhet 25–60 kkr, fasad villa 40–100 kkr, timpris 350–550 kr/tim.
- El: timpris 450–700 kr/tim, elcentral 15–35 kkr, belysning per punkt 1,5–3,5 kkr.
- VVS: timpris 450–750 kr/tim, blandare 2–5 kkr, värmepanna 30–80 kkr, golvvärme 500–1200 kr/kvm.
- Golv: laminat 400–700 kr/kvm, parkett 600–1200 kr/kvm.
- Stockholm ~1,15–1,3x, Göteborg ~1,05–1,15x, Skåne ~1,0–1,1x. ROT 2026: 30% arbetskostnad, max 50 000 kr/person/år.

Svara ENDAST med ett giltigt JSON-objekt enligt den angivna schemat.`;

const QUOTE_JSON_SCHEMA = {
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

// ─── Invoice mode ─────────────────────────────────────────────────────────────

const INVOICE_SYSTEM_PROMPT = `Du är Saga, Sveriges AI för fakturakontroll. Analysera fakturan (bild eller text) och bedöm risken för bedrägeri eller förfalskning.

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

const INVOICE_JSON_SCHEMA = {
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

// ─── Shared types ─────────────────────────────────────────────────────────────

interface AnalyzeRequestBody {
  imageBase64?: string;
  mediaType?: string;
  pdfText?: string;
  mode?: "quote" | "invoice";
}

// ─── Rate limiting ────────────────────────────────────────────────────────────

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (entry && entry.resetAt > now) {
    if (entry.count >= max) return false;
    entry.count++;
  } else {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
  }
  return true;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip, 10, 60 * 60 * 1000)) {
    return new Response(
      JSON.stringify({ error: "För många förfrågningar. Försök igen om en stund." }),
      { status: 429, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  let body: AnalyzeRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  const { imageBase64, mediaType = "image/jpeg", pdfText, mode = "quote" } = body;

  const isVision = imageBase64 && typeof imageBase64 === "string";
  const isText = pdfText && typeof pdfText === "string";

  if (!isVision && !isText) {
    return new Response(
      JSON.stringify({ error: "Missing imageBase64 or pdfText" }),
      { status: 400, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  if (isVision) {
    const ALLOWED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!ALLOWED_MEDIA_TYPES.includes(mediaType)) {
      return new Response(
        JSON.stringify({ error: "Invalid mediaType" }),
        { status: 400, headers: { "Content-Type": "application/json", ...cors } }
      );
    }
  }

  if (isText && pdfText.length > 100_000) {
    return new Response(
      JSON.stringify({ error: "pdfText too long" }),
      { status: 400, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  const systemPrompt = mode === "invoice" ? INVOICE_SYSTEM_PROMPT : QUOTE_SYSTEM_PROMPT;
  const jsonSchema = mode === "invoice" ? INVOICE_JSON_SCHEMA : QUOTE_JSON_SCHEMA;
  const instructionText = mode === "invoice"
    ? "Analysera denna faktura och bedöm risken för bedrägeri. Svara med exakt den JSON-struktur som angavs. Ingen annan text."
    : "Analysera denna offert och svara med exakt den JSON-struktur som angavs. Ingen annan text.";

  const userContent: Array<
    | { type: "text"; text: string }
    | { type: "image"; source: { type: "base64"; media_type: string; data: string } }
  > = isVision
    ? [
        { type: "text" as const, text: instructionText },
        { type: "image" as const, source: { type: "base64" as const, media_type: mediaType, data: imageBase64 } },
      ]
    : [{ type: "text" as const, text: `${instructionText}\n\n---\n\nInnehåll:\n\n${pdfText}` }];

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 2000,
        temperature: 0,
        system: systemPrompt,
        messages: [{ role: "user", content: userContent }],
        output_config: {
          format: {
            type: "json_schema",
            schema: jsonSchema,
          },
        },
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(
        JSON.stringify({ error: "Claude API error", details: errText }),
        { status: 502, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    const data = await anthropicRes.json();
    const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
    const jsonStr = textBlock?.text ?? "";
    const result = JSON.parse(jsonStr);

    const responseBody = mode === "invoice"
      ? { invoiceAnalysis: result }
      : { analysis: result };

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(
      JSON.stringify({ error: "Analysis failed", details: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }
});
