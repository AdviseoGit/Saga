// Next.js API Route: Analys av offerter med Claude + ML hybrid approach
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getQuoteProvider, ProviderError } from '@/lib/providers';

// Fire-and-forget: log anonymised analysis data for market baseline training
function logAnalysis(result: Record<string, any>): void {
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!sbUrl || !sbKey || !result?.quote?.category) return;

  const sb = createClient(sbUrl, sbKey);
  sb.from("analyses")
    .insert([{
      category: String(result.quote.category ?? "unknown").toLowerCase(),
      region: String(result.quote.region_guess ?? "unknown").toLowerCase(),
      total_amount: Number(result.quote.total_amount ?? 0),
      verdict: String(result.verdict ?? "FAIR"),
      market_low: result.market_range?.low ?? null,
      market_high: result.market_range?.high ?? null,
      includes_rot: result.quote.includes_rot ?? false,
      line_items_count: result.line_items?.length ?? 0,
      red_flags_count: result.red_flags?.length ?? 0,
    }])
    .then(
      ({ error }) => { if (error) console.error("[logAnalysis]", error.message); },
      (e: unknown) => console.error("[logAnalysis]", String(e))
    );
}

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

    // Vald leverantör styrs av QUOTE_PROVIDER (anthropic som standard)
    const provider = getQuoteProvider();
    const keyName = provider.name === 'gemini' ? 'GEMINI_API_KEY' : 'ANTHROPIC_API_KEY';
    const apiKey = process.env[keyName];
    const devMode = process.env.NODE_ENV !== 'production';

    if (!apiKey && !devMode) {
      return NextResponse.json(
        { error: `${keyName} not configured` },
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
          total_amount: 85000,
          includes_vat: true,
          includes_rot: true,
          rot_eligible_labor: 25000,
          rot_deduction: 7500,
          total_after_rot: 77500,
          category: "badrum",
          region_guess: "stockholm",
          validity_days: 30,
          estimated_area_sqm: 5,
          estimated_rooms: 1,
          timeline_weeks: 2
        },
        verdict: "FAIR",
        verdict_text: "Priset ligger inom normal marknadsrange för denna typ av projekt i Stockholm.",
        market_range: { low: 70000, high: 100000 },
        line_items: [
          {
            description: "Rivning och förberedelse",
            amount: 15000,
            is_labor: true,
            assessment: "FAIR",
            market_range: "20-30k",
            comment: "Standard rivningskostnad"
          },
          {
            description: "VVS-installation",
            amount: 20000,
            is_labor: true,
            assessment: "FAIR",
            market_range: "25-40k",
            comment: "Inom normal prisram"
          },
          {
            description: "Kakel och material",
            amount: 25000,
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

    const result = await provider.analyzeQuote({ imageBase64, mediaType, pdfText });

    // Auto-log for ML training (fire and forget — does not delay response)
    logAnalysis(result.analysis);

    return NextResponse.json({ analysis: result.analysis, provider: result.provider, model: result.model }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    // Leverantörsfel: den riktiga orsaken loggas, användaren får en neutral text.
    if (error instanceof ProviderError) {
      console.error(error.message);
      return NextResponse.json(
        { error: error.userMessage },
        {
          status: error.status,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

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