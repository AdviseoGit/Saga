// Next.js API Route: Analys av offerter med Claude + ML hybrid approach
import { NextRequest, NextResponse } from 'next/server';

// Rate limiting för API
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

// Claude prompts och schemas (samma som tidigare)
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

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
               request.headers.get('x-real-ip') ||
               'unknown';
    if (!checkRateLimit(ip, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "För många förfrågningar. Försök igen om en stund." },
        {
          status: 429,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const devMode = process.env.NODE_ENV !== 'production';

    if (!apiKey && !devMode) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Development mode fallback - return mock analysis without API call
    if (!apiKey && devMode) {
      console.log('Development mode: returning mock analysis');
      const mockAnalysis = {
        company: {
          name: "Mock Byggfirma AB",
          org_nr: "5561234567",
          address: "Testgatan 123, Stockholm",
          contact: "info@mockbyggfirma.se"
        },
        quote: {
          total_amount: isText ? 150000 : 85000,
          includes_vat: true,
          includes_rot: true,
          rot_eligible_labor: isText ? 45000 : 25000,
          rot_deduction: isText ? 13500 : 7500,
          total_after_rot: isText ? 136500 : 77500,
          category: "badrum",
          region_guess: "stockholm",
          validity_days: 30,
          estimated_area_sqm: isText ? 8 : 5,
          estimated_rooms: 1,
          timeline_weeks: isText ? 3 : 2
        },
        verdict: "FAIR",
        verdict_text: "Priset ligger inom normal marknadsrange för denna typ av projekt i Stockholm.",
        market_range: { low: isText ? 120000 : 70000, high: isText ? 180000 : 100000 },
        line_items: [
          {
            description: "Rivning och förberedelse",
            amount: isText ? 25000 : 15000,
            is_labor: true,
            assessment: "FAIR",
            market_range: "20-30k",
            comment: "Standard rivningskostnad"
          },
          {
            description: "VVS-installation",
            amount: isText ? 35000 : 20000,
            is_labor: true,
            assessment: "FAIR",
            market_range: "25-40k",
            comment: "Inom normal prisram"
          },
          {
            description: "Kakel och material",
            amount: isText ? 45000 : 25000,
            is_labor: false,
            assessment: "FAIR",
            market_range: "35-55k",
            comment: "Standardkvalitet material"
          }
        ],
        red_flags: [],
        yellow_flags: ["Kontrollera att ROT-avdrag är korrekt beräknat"],
        green_flags: ["Tydligt specificerad offert", "Etablerat företag"],
        negotiate_tips: ["Fråga om grupprising för flera badrum"],
        missing_in_quote: ["Garanti på arbetet", "Slutstädning"],
        confidence: "medium"
      };

      return NextResponse.json({ analysis: mockAnalysis }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // Parse request body
    const body = await request.json();
    const { imageBase64, mediaType = "image/jpeg", pdfText, mode = "quote" } = body;

    const isVision = imageBase64 && typeof imageBase64 === "string";
    const isText = pdfText && typeof pdfText === "string";

    if (!isVision && !isText) {
      return NextResponse.json(
        { error: "Missing imageBase64 or pdfText" },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Validate image format
    if (isVision) {
      const ALLOWED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!ALLOWED_MEDIA_TYPES.includes(mediaType)) {
        return NextResponse.json(
          { error: "Invalid mediaType" },
          {
            status: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            }
          }
        );
      }
    }

    // Validate text length
    if (isText && pdfText.length > 100_000) {
      return NextResponse.json(
        { error: "pdfText too long" },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Prepare Claude request
    const instructionText = "Analysera denna offert och svara med exakt den JSON-struktur som angavs. Ingen annan text.";

    const userContent = isVision
      ? [
          { type: "text" as const, text: instructionText },
          { type: "image" as const, source: { type: "base64" as const, media_type: mediaType, data: imageBase64 } },
        ]
      : [{ type: "text" as const, text: `${instructionText}\n\n---\n\nInnehåll:\n\n${pdfText}` }];

    // Call Claude API
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-3-5",
        max_tokens: 2000,
        temperature: 0,
        system: QUOTE_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }],
        output_config: {
          format: {
            type: "json_schema",
            schema: QUOTE_JSON_SCHEMA,
          },
        },
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error('Claude API error:', errText);
      return NextResponse.json(
        { error: "Claude API error", details: errText },
        {
          status: 502,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    const data = await anthropicRes.json();
    const textBlock = data.content?.find((b: { type: string }) => b.type === "text");
    const result = JSON.parse(textBlock?.text ?? "{}");

    return NextResponse.json({ analysis: result }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Analysis failed", details: message },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}