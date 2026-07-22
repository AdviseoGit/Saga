import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

const OWNER = process.env.LEAD_NOTIFY_EMAIL || "simon@adviseo.se";

function sek(v: unknown): string {
  const n = Number(v);
  if (!isFinite(n) || !v) return "—";
  return new Intl.NumberFormat("sv-SE").format(Math.round(n)) + " kr";
}

function userHtml(d: any): string {
  const s = d.analysisSummary || {};
  return `
  <div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:auto;color:#0f172a">
    <div style="background:#0f766e;color:#fff;padding:22px 24px;border-radius:12px 12px 0 0">
      <h2 style="margin:0;font-size:20px">Din offertanalys 🧾</h2>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;padding:24px">
      <p>Hej,</p>
      <p>Tack för att du använde Fråga Saga. Här är en sammanfattning av din analys —
         spara gärna mejlet inför att du jämför offerter.</p>
      <table style="border-collapse:collapse;font-size:14px;margin:14px 0">
        <tr><td style="padding:5px 10px;color:#64748b">Företag</td><td style="padding:5px 10px;font-weight:600">${s.company ?? "—"}</td></tr>
        <tr><td style="padding:5px 10px;color:#64748b">Belopp</td><td style="padding:5px 10px;font-weight:600">${sek(s.total)}</td></tr>
        <tr><td style="padding:5px 10px;color:#64748b">Kategori</td><td style="padding:5px 10px">${d.quoteCategory ?? "—"}</td></tr>
        <tr><td style="padding:5px 10px;color:#64748b">Region</td><td style="padding:5px 10px">${d.quoteRegion ?? "—"}</td></tr>
      </table>
      <p style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:10px;padding:14px 16px">
        <b>Sagas omdöme:</b><br>${s.verdict ?? d.analysisVerdict ?? "Analys genomförd."}</p>
      <p><b>Så går du vidare:</b></p>
      <ul style="color:#334155;font-size:14px;line-height:1.6">
        <li>Begär alltid en specificerad offert (material, arbete, ev. ROT).</li>
        <li>Jämför minst tre aktörer på samma underlag.</li>
        <li>Kontrollera F-skatt och referenser innan du skriver på.</li>
      </ul>
      <p style="margin-top:22px">Vänliga hälsningar,<br><b>Fråga Saga</b><br>
        <a href="https://fragasaga.se" style="color:#0f766e">fragasaga.se</a></p>
      <p style="font-size:11px;color:#94a3b8;margin-top:20px">Du får detta för att du begärde din
        analys på fragasaga.se. Detta är vägledning, inte juridisk eller ekonomisk rådgivning.</p>
    </div>
  </div>`;
}

function ownerHtml(d: any): string {
  const s = d.analysisSummary || {};
  return `<div style="font-family:Segoe UI,Arial,sans-serif;color:#0f172a">
    <h3>🧾 Ny lead — Fråga Saga</h3>
    <table style="border-collapse:collapse;font-size:14px">
      <tr><td style="padding:4px 10px;color:#64748b">E-post</td><td style="padding:4px 10px;font-weight:600">${d.email}</td></tr>
      <tr><td style="padding:4px 10px;color:#64748b">Företag</td><td style="padding:4px 10px">${s.company ?? "—"}</td></tr>
      <tr><td style="padding:4px 10px;color:#64748b">Belopp</td><td style="padding:4px 10px">${sek(s.total)}</td></tr>
      <tr><td style="padding:4px 10px;color:#64748b">Kategori</td><td style="padding:4px 10px">${d.quoteCategory ?? "—"}</td></tr>
      <tr><td style="padding:4px 10px;color:#64748b">Omdöme</td><td style="padding:4px 10px">${s.verdict ?? d.analysisVerdict ?? "—"}</td></tr>
    </table></div>`;
}

async function sendMails(d: any) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("[leads] SMTP not configured — skipping email");
    return;
  }
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const from = `Fråga Saga <${process.env.SMTP_FROM || "noreply@adviseo.se"}>`;
  try {
    await transport.sendMail({ from, to: d.email, replyTo: OWNER,
      subject: "Din offertanalys från Fråga Saga", html: userHtml(d) });
    await transport.sendMail({ from, to: OWNER, replyTo: d.email,
      subject: "Ny lead — Fråga Saga", html: ownerHtml(d) });
    console.log("[leads] emails sent ->", d.email);
  } catch (e) {
    console.error("[leads] email send failed:", e);
  }
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

    if (sbUrl && sbKey) {
      // Dynamic import to prevent build errors if module not installed or fails locally
      try {
        const { createClient } = await import('@supabase/supabase-js');
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
      } catch (dbErr) {
        console.error("[leads] Database insert failed or supabase module missing:", dbErr);
      }
    } else {
      console.log("[leads] supabase not configured —", email);
    }

    // Deliver the analysis to the user + notify owner. Awaited so it completes
    // before the serverless function freezes; never throws to the client.
    await sendMails({ email, name, quoteCategory, quoteRegion, analysisVerdict, analysisSummary });

    return NextResponse.json({ success: true }, { headers: CORS });
  } catch (err) {
    console.error("[leads route]", err);
    return NextResponse.json({ error: "Serverfel" }, { status: 500, headers: CORS });
  }
}
