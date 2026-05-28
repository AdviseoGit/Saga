import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, quoteCategory, quoteRegion, analysisVerdict, analysisSummary } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: "Ogiltig e-postadress" }, { status: 400, headers: CORS });
    }

    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!sbUrl || !sbKey) {
      // Graceful fallback — still acknowledge the user
      console.log("[lead]", email, quoteCategory, analysisVerdict);
      return NextResponse.json({ success: true }, { headers: CORS });
    }

    const sb = createClient(sbUrl, sbKey);

    await sb.from("leads").upsert(
      [{
        email: String(email).toLowerCase().trim(),
        name: name ? String(name).trim() : null,
        source: "result_email",
        quote_category: quoteCategory ?? null,
        quote_region: quoteRegion ?? null,
        analysis_verdict: analysisVerdict ?? null,
        analysis_summary: analysisSummary ?? null,
        gdpr_consent: true,
        consent_timestamp: new Date().toISOString(),
      }],
      { onConflict: "email" }
    );

    return NextResponse.json({ success: true }, { headers: CORS });

  } catch (err) {
    console.error("[leads route]", err);
    return NextResponse.json({ error: "Serverfel" }, { status: 500, headers: CORS });
  }
}
