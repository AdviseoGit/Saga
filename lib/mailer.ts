import nodemailer, { type Transporter } from "nodemailer";

export const OWNER_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "simon@adviseo.se";

let cached: Transporter | null = null;

export function mailerConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function transport(): Transporter {
  if (!cached) {
    cached = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return cached;
}

/** Skickar ett mejl. Kastar aldrig – returnerar false om det inte gick. */
export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  if (!mailerConfigured()) {
    console.log("[mailer] SMTP not configured — skipping email to", opts.to);
    return false;
  }
  const from = `Fråga Saga <${process.env.SMTP_FROM || "noreply@adviseo.se"}>`;
  try {
    await transport().sendMail({ from, ...opts });
    return true;
  } catch (e) {
    console.error("[mailer] send failed:", e);
    return false;
  }
}

export function sek(value: unknown): string {
  const n = Number(value);
  if (!isFinite(n) || !value) return "—";
  return new Intl.NumberFormat("sv-SE").format(Math.round(n)) + " kr";
}

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
