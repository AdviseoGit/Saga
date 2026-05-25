// Enhanced Analyze-Quote: Claude + ML Hybrid Approach
// Kombinerar Claude's strukturerade extraktion med ML-driven prisprediktion

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── Samma Claude schema som innan ───
const QUOTE_SYSTEM_PROMPT = `Du är Saga, Sveriges AI för offertanalys. Analysera offerten (bild eller text) och extrahera företagsuppgifter samt prisanalys.

SVENSK MARKNADSPRISDATA (riktvärden 2026):
- Badrumsrenovering: litet 60–120 kkr, medel 90–180 kkr, stort 150–300 kkr. Rivning 8–20 kkr, rör 15–40 kkr, kakel 800–1500 kr/kvm, el 5–15 kkr, tätskikt 10–20 kkr.
- Kök: ytskikt 30–80 kkr, komplett 80–250 kkr.
- Målning: per rum 5–15 kkr, hel lägenhet 25–60 kkr, fasad villa 40–100 kkr, timpris 350–550 kr/tim.
- El: timpris 450–700 kr/tim, elcentral 15–35 kkr, belysning per punkt 1,5–3,5 kkr.
- VVS: timpris 450–750 kr/tim, blandare 2–5 kkr, värmepanna 30–80 kkr, golvvärme 500–1200 kr/kvm.
- Golv: laminat 400–700 kr/kvm, parkett 600–1200 kr/kvm.
- Stockholm ~1,15–1,3x, Göteborg ~1,05–1,15x, Skåne ~1,0–1,1x. ROT 2026: 30% arbetskostnad, max 50 000 kr/person/år.

Fokusera på att extrahera STRUKTURERAD DATA istället för att ge prisomdömen. ML-modellen kommer hantera prisprediktionen.

Svara ENDAST med ett giltigt JSON-objekt enligt den angivna schemat.`;

const ENHANCED_QUOTE_SCHEMA = {
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

        // Nya fält för ML feature extraction
        estimated_area_sqm: { type: ["number", "null"] },
        estimated_rooms: { type: ["number", "null"] },
        timeline_weeks: { type: ["number", "null"] },
        complexity_indicators: { type: "array", items: { type: "string" } },
        quality_indicators: { type: "array", items: { type: "string" } },
      },
      required: ["total_amount", "includes_vat", "includes_rot", "category", "region_guess"],
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
          is_material: { type: "boolean" },
          category_hint: { type: ["string", "null"] }, // För ML kategorisering
          unit: { type: ["string", "null"] }, // "kvm", "st", "tim" etc
          quantity: { type: ["number", "null"] },
        },
        required: ["description", "amount"],
        additionalProperties: false,
      },
    },
    extracted_features: {
      type: "object",
      properties: {
        includes_design_work: { type: "boolean" },
        includes_permits: { type: "boolean" },
        includes_demolition: { type: "boolean" },
        quality_level: { type: "string", enum: ["basic", "standard", "premium", "unknown"] },
        urgency_indicators: { type: "array", items: { type: "string" } },
        risk_factors: { type: "array", items: { type: "string" } },
      },
      additionalProperties: false,
    },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
  },
  required: [
    "company", "quote", "line_items", "extracted_features", "confidence",
  ],
  additionalProperties: false,
};

// ─── ML Feature Extraction ───
interface MLFeatures {
  category: string;
  region: string;
  totalAmount: number;
  includesVat: boolean;
  includesRot: boolean;
  estimatedArea: number | null;
  roomCount: number | null;
  complexity: 'low' | 'medium' | 'high';
  seasonality: number;
  marketTrendFactor: number;
  companyAgeCategory: 'new' | 'established' | 'veteran';
  companyType: 'sole_proprietor' | 'limited' | 'unknown';
  laborIntensity: number;
  materialQuality: 'basic' | 'standard' | 'premium';
  includesDesign: boolean;
  includesPermits: boolean;
  priceComplexity: number;
  hasUnusualTerms: boolean;
  pricePerSqm: number | null;
  laborPerSqm: number | null;
  categoryPriceRatio: number;
}

function extractMLFeatures(claudeResult: any, rawText?: string): MLFeatures {
  const now = new Date();
  const quarter = Math.ceil((now.getMonth() + 1) / 3) as 1 | 2 | 3 | 4;
  const seasonalFactors = [0.95, 1.05, 1.0, 1.1]; // Q1-Q4

  // Normalisera kategori
  const normalizeCategory = (cat: string): string => {
    const normalized = cat.toLowerCase();
    if (normalized.includes('badrum')) return 'badrum';
    if (normalized.includes('kök')) return 'kök';
    if (normalized.includes('målning')) return 'målning';
    if (normalized.includes('el')) return 'el';
    if (normalized.includes('vvs')) return 'vvs';
    return 'övrigt';
  };

  // Beräkna labor intensity från line items
  const calculateLaborIntensity = (lineItems: any[]): number => {
    const laborKeywords = ['arbete', 'montage', 'installation', 'timmar'];
    let laborAmount = 0;
    let totalAmount = 0;

    for (const item of lineItems) {
      totalAmount += item.amount || 0;
      if (item.is_labor || laborKeywords.some(keyword =>
        item.description?.toLowerCase().includes(keyword))) {
        laborAmount += item.amount || 0;
      }
    }

    return totalAmount > 0 ? laborAmount / totalAmount : 0.5;
  };

  // Bedöm komplexitet
  const assessComplexity = (lineItems: any[], features: any): 'low' | 'medium' | 'high' => {
    const score = lineItems.length +
                 features.risk_factors.length +
                 (features.includes_demolition ? 2 : 0) +
                 (features.includes_permits ? 1 : 0);

    if (score < 5) return 'low';
    if (score < 12) return 'medium';
    return 'high';
  };

  // Kategorisera företagsålder från org nr
  const categorizeCompanyAge = (orgNr: string | null): 'new' | 'established' | 'veteran' => {
    if (!orgNr) return 'new';

    const yearStr = orgNr.substring(0, 4);
    const year = parseInt(yearStr);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    if (age < 3) return 'new';
    if (age < 10) return 'established';
    return 'veteran';
  };

  return {
    category: normalizeCategory(claudeResult.quote.category),
    region: claudeResult.quote.region_guess || 'unknown',
    totalAmount: claudeResult.quote.total_amount,
    includesVat: claudeResult.quote.includes_vat,
    includesRot: claudeResult.quote.includes_rot,
    estimatedArea: claudeResult.quote.estimated_area_sqm,
    roomCount: claudeResult.quote.estimated_rooms,
    complexity: assessComplexity(claudeResult.line_items, claudeResult.extracted_features),
    seasonality: quarter,
    marketTrendFactor: seasonalFactors[quarter - 1],
    companyAgeCategory: categorizeCompanyAge(claudeResult.company.org_nr),
    companyType: 'unknown', // Kunde utökas med mer logik
    laborIntensity: calculateLaborIntensity(claudeResult.line_items),
    materialQuality: claudeResult.extracted_features.quality_level === 'unknown' ?
                    'standard' : claudeResult.extracted_features.quality_level,
    includesDesign: claudeResult.extracted_features.includes_design_work,
    includesPermits: claudeResult.extracted_features.includes_permits,
    priceComplexity: Math.min(claudeResult.line_items.length / 15, 1),
    hasUnusualTerms: claudeResult.extracted_features.risk_factors.length > 2,
    pricePerSqm: claudeResult.quote.estimated_area_sqm ?
                claudeResult.quote.total_amount / claudeResult.quote.estimated_area_sqm : null,
    laborPerSqm: null, // Kunde beräknas från line items
    categoryPriceRatio: 1.0 // Kunde beräknas mot marknadsbaseline
  };
}

// ─── ML Prediction Integration ───
async function getMLPrediction(features: MLFeatures): Promise<any> {
  try {
    const response = await fetch('https://lhontageceandzgcyurq.supabase.co/functions/v1/ml-predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({ features })
    });

    if (response.ok) {
      const result = await response.json();
      return result.prediction;
    } else {
      console.warn('ML prediction failed:', response.status);
      return null;
    }
  } catch (error) {
    console.warn('ML prediction error:', error);
    return null;
  }
}

// ─── Hybrid Result Generation ───
function combineClaudeAndML(claudeResult: any, mlPrediction: any): any {
  if (!mlPrediction) {
    // Fallback: använd bara Claude's resultat
    return {
      ...claudeResult,
      analysis_method: 'claude_only',
      ml_prediction: null
    };
  }

  // Kombinera Claude's strukturella förståelse med ML's prisprediktion
  const confidenceScore = mlPrediction.confidenceScore || 0.7;

  // Generera ny verdict baserat på ML-prediktion
  const priceDiff = claudeResult.quote.total_amount - mlPrediction.predictedPrice;
  const relativeDiff = Math.abs(priceDiff) / mlPrediction.predictedPrice;

  let mlVerdict: string;
  let verdictText: string;

  if (relativeDiff < 0.1) {
    mlVerdict = 'FAIR';
    verdictText = `Priset ligger inom förväntat spann. ML-modellen uppskattar ${mlPrediction.predictedPrice.toLocaleString('sv-SE')} kr (${(confidenceScore * 100).toFixed(0)}% säkerhet).`;
  } else if (priceDiff > 0) {
    mlVerdict = relativeDiff > 0.3 ? 'VERY_HIGH' : 'HIGH';
    verdictText = `Priset ligger ${(relativeDiff * 100).toFixed(0)}% över ML-modellens prediktion på ${mlPrediction.predictedPrice.toLocaleString('sv-SE')} kr.`;
  } else {
    mlVerdict = 'LOW';
    verdictText = `Ovanligt lågt pris - ${Math.abs(relativeDiff * 100).toFixed(0)}% under ML-modellens prediktion.`;
  }

  return {
    ...claudeResult,

    // Ersätt Claude's prisomdöme med ML-baserat
    verdict: mlVerdict,
    verdict_text: verdictText,

    // Uppdatera market_range med ML-data
    market_range: mlPrediction.priceRange,

    // Lägg till ML metadata
    ml_prediction: {
      predicted_price: mlPrediction.predictedPrice,
      confidence_score: confidenceScore,
      methodology: mlPrediction.methodology,
      model_version: mlPrediction.modelVersion,
      factors: mlPrediction.factors
    },

    // Hybrid analysis method
    analysis_method: 'claude_ml_hybrid',

    // Förbättrade negotiate tips baserat på ML
    negotiate_tips: [
      ...claudeResult.negotiate_tips,
      ...(mlVerdict === 'HIGH' || mlVerdict === 'VERY_HIGH' ? [
        `ML-modellen föreslår att priset borde vara runt ${mlPrediction.predictedPrice.toLocaleString('sv-SE')} kr`,
        'Be om detaljerad motivering för prisdifferensen'
      ] : [])
    ]
  };
}

// ─── Rate limiting (samma som innan) ───
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

// ─── Main Handler ───
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

  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!checkRateLimit(ip, 10, 60 * 60 * 1000)) {
    return new Response(
      JSON.stringify({ error: "För många förfrågningar. Försök igen om en stund." }),
      { status: 429, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  // Check API keys
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  let body;
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

  // Bara quote mode för nu (invoice mode kunde läggas till senare)
  if (mode !== "quote") {
    return new Response(
      JSON.stringify({ error: "Enhanced analysis only supports quote mode currently" }),
      { status: 400, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  const userContent = isVision
    ? [
        { type: "text" as const, text: "Analysera denna offert och extrahera strukturerad data för ML-analys. Fokusera på noggrann dataextraktion." },
        { type: "image" as const, source: { type: "base64" as const, media_type: mediaType, data: imageBase64 } },
      ]
    : [{ type: "text" as const, text: `Analysera denna offert och extrahera strukturerad data för ML-analys.\n\n---\n\nInnehåll:\n\n${pdfText}` }];

  try {
    // Steg 1: Claude-analys med förbättrat schema
    console.log('Starting Claude analysis...');
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
        system: QUOTE_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }],
        output_config: {
          format: {
            type: "json_schema",
            schema: ENHANCED_QUOTE_SCHEMA,
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

    const claudeData = await anthropicRes.json();
    const textBlock = claudeData.content?.find((b: { type: string }) => b.type === "text");
    const claudeResult = JSON.parse(textBlock?.text ?? "{}");

    // Steg 2: Extrahera ML features
    console.log('Extracting ML features...');
    const mlFeatures = extractMLFeatures(claudeResult, isText ? pdfText : undefined);

    // Steg 3: Få ML-prediktion
    console.log('Getting ML prediction...');
    const mlPrediction = await getMLPrediction(mlFeatures);

    // Steg 4: Kombinera resultat
    console.log('Combining results...');
    const hybridResult = combineClaudeAndML(claudeResult, mlPrediction);

    return new Response(JSON.stringify({
      analysis: hybridResult,
      processing_time: Date.now(), // För debugging
      ml_features_used: Object.keys(mlFeatures), // För transparency
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...cors },
    });

  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('Enhanced analysis failed:', e);
    return new Response(
      JSON.stringify({
        error: "Enhanced analysis failed",
        details: message,
        fallback_available: true
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }
});