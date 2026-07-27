import { NextRequest, NextResponse } from "next/server";
import { OWNER_EMAIL, escapeHtml, sek, sendMail } from "@/lib/mailer";

export const runtime = "nodejs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

const INTENTS = ["match_cheaper", "match_verified", "contract_review", "financing"] as const;
type Intent = (typeof INTENTS)[number];

const INTENT_LABEL: Record<Intent, string> = {
  match_cheaper: "Matchning – vill ha offert under nuvarande pris",
  match_verified: "Matchning – vill ha offert från kontrollerat företag",
  contract_review: "Avtalsgranskning före signering",
  financing: "Finansiering av projektet",
};

const USER_INTRO: Record<Intent, string> = {
  match_cheaper:
    "Vi letar nu upp två kvalitetssäkrade företag i ditt område som kan lämna en offert under det pris du fått. Du hör från oss inom kort.",
  match_verified:
    "Vi letar nu upp företag i ditt område som är kontrollerade mot Skatteverket och Bolagsverket. Skriv inte på den befintliga offerten förrän du hört av oss.",
  contract_review:
    "Vi återkommer med en genomgång av vad du bör titta på i avtalet innan du signerar.",
  financing:
    "Vi återkommer med alternativ för att finansiera projektet.",
};

type Payload = {
  intent?: string;
  outcome?: string;
  name?: string;
  email?: string;
  phone?: string;
  consent?: boolean;
  category?: string;
  region?: string;
  total?: number;
  verdict?: string;
  marketLow?: number;
  marketHigh?: number;
  overMarketPct?: number;
  companyName?: string;
  companyOrgNr?: string;
  redFlags?: string[];
};

function str(value: unknown, max = 200): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function num(value: unknown): number | null {
  const n = Number(value);
  return isFinite(n) && value !== null && value !== "" ? n : null;
}

/** Säljunderlaget – exakt det en installatör behöver för att vilja köpa leadet. */
function ownerHtml(d: Payload, intent: Intent): string {
  const pct = num(d.overMarketPct);
  const priceLine =
    pct === null ? "—" : pct > 0 ? `${pct}% över marknadssnittet` : `${Math.abs(pct)}% under snittet`;
  const rows: Array<[string, string]> = [
    ["Typ av lead", INTENT_LABEL[intent]],
    ["Kategori", escapeHtml(d.category)],
    ["Region", escapeHtml(d.region)],
    ["Offererat pris", sek(d.total)],
    ["Marknadsintervall", d.marketLow && d.marketHigh ? `${sek(d.marketLow)} – ${sek(d.marketHigh)}` : "—"],
    ["Prisläge", priceLine],
    ["Sagas omdöme", escapeHtml(d.verdict)],
    ["Nuvarande leverantör", `${escapeHtml(d.companyName)} (${escapeHtml(d.companyOrgNr)})`],
    ["Namn", escapeHtml(d.name)],
    ["E-post", escapeHtml(d.email)],
    ["Telefon", escapeHtml(d.phone)],
  ];
  const flags = (d.redFlags ?? []).slice(0, 5).map((f) => `<li>${escapeHtml(f)}</li>`).join("");
  return `<div style="font-family:Segoe UI,Arial,sans-serif;color:#0f172a">
    <h3>🔥 Ny partnerlead — Fråga Saga</h3>
    <table style="border-collapse:collapse;font-size:14px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 10px;color:#64748b">${k}</td><td style="padding:4px 10px;font-weight:600">${v}</td></tr>`
        )
        .join("")}
    </table>
    ${flags ? `<p style="font-size:14px;margin-top:14px"><b>Flaggor i analysen:</b></p><ul style="font-size:14px">${flags}</ul>` : ""}
  </div>`;
}

function userHtml(d: Payload, intent: Intent): string {
  return `
  <div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;color:#0f172a">
    <div style="background:#0f766e;color:#fff;padding:22px 24px;border-radius:12px 12px 0 0">
      <h2 style="margin:0;font-size:20px">Tack — vi har tagit emot din förfrågan</h2>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;padding:24px">
      <p>Hej${d.name ? ` ${escapeHtml(d.name)}` : ""},</p>
      <p>${USER_INTRO[intent]}</p>
      <table style="border-collapse:collapse;font-size:14px;margin:14px 0">
        <tr><td style="padding:5px 10px;color:#64748b">Kategori</td><td style="padding:5px 10px;font-weight:600">${escapeHtml(d.category)}</td></tr>
        <tr><td style="padding:5px 10px;color:#64748b">Region</td><td style="padding:5px 10px">${escapeHtml(d.region)}</td></tr>
        <tr><td style="padding:5px 10px;color:#64748b">Offererat pris</td><td style="padding:5px 10px;font-weight:600">${sek(d.total)}</td></tr>
      </table>
      <p style="margin-top:22px">Vänliga hälsningar,<br><b>Fråga Saga</b><br>
        <a href="https://fragasaga.se" style="color:#0f766e">fragasaga.se</a></p>
      <p style="font-size:11px;color:#94a3b8;margin-top:20px">Du får detta mejl för att du skickade en
        förfrågan på fragasaga.se. Vill du att vi raderar dina uppgifter? Svara på detta mejl.</p>
    </div>
  </div>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Payload;

    const intent = INTENTS.includes(body.intent as Intent) ? (body.intent as Intent) : null;
    if (!intent) {
      return NextResponse.json({ error: "Okänd förfrågan" }, { status: 400, headers: CORS });
    }

    const email = str(body.email, 320)?.toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Ogiltig e-postadress" }, { status: 400, headers: CORS });
    }
    if (body.consent !== true) {
      return NextResponse.json({ error: "Samtycke krävs" }, { status: 400, headers: CORS });
    }

    const lead = {
      intent,
      outcome: str(body.outcome, 40),
      name: str(body.name),
      email,
      phone: str(body.phone, 40),
      quote_category: str(body.category),
      quote_region: str(body.region),
      quote_total: num(body.total),
      market_low: num(body.marketLow),
      market_high: num(body.marketHigh),
      over_market_pct: num(body.overMarketPct),
      analysis_verdict: str(body.verdict, 40),
      company_name: str(body.companyName),
      company_org_nr: str(body.companyOrgNr, 40),
      red_flags: Array.isArray(body.redFlags) ? body.redFlags.slice(0, 10).map((f) => String(f).slice(0, 300)) : [],
      gdpr_consent: true,
      consent_timestamp: new Date().toISOString(),
    };

    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (sbUrl && sbKey) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const sb = createClient(sbUrl, sbKey);
        const { error } = await sb.from("partner_leads").insert([lead]);
        if (error) console.error("[partner-leads] insert failed:", error.message);
      } catch (dbErr) {
        console.error("[partner-leads] database unavailable:", dbErr);
      }
    } else {
      console.log("[partner-leads] supabase not configured —", email);
    }

    // Ägaren först: leadet är färskvara och ska kunna säljas vidare direkt.
    await sendMail({
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `Ny partnerlead — ${INTENT_LABEL[intent]}`,
      html: ownerHtml(body, intent),
    });
    await sendMail({
      to: email,
      replyTo: OWNER_EMAIL,
      subject: "Vi har tagit emot din förfrågan — Fråga Saga",
      html: userHtml(body, intent),
    });

    return NextResponse.json({ success: true }, { headers: CORS });
  } catch (err) {
    console.error("[partner-leads route]", err);
    return NextResponse.json({ error: "Serverfel" }, { status: 500, headers: CORS });
  }
}
