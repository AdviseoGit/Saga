import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import type { LeadStatus } from "@/lib/partner-pitch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES: LeadStatus[] = ["new", "contacted", "sold", "discarded"];

/** Jämför i konstant tid så att token inte går att gissa fram tecken för tecken. */
function tokenMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Returnerar ett felsvar om anropet inte är behörigt, annars null. */
function authorize(request: NextRequest): NextResponse | null {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    // Hellre stängt än öppet: utan token i miljön går vyn inte att använda alls.
    return NextResponse.json(
      { error: "ADMIN_TOKEN saknas i miljön – admin-vyn är avstängd." },
      { status: 503 }
    );
  }
  const provided = request.headers.get("x-admin-token") ?? "";
  if (!provided || !tokenMatches(provided, expected)) {
    return NextResponse.json({ error: "Fel token." }, { status: 401 });
  }
  return null;
}

async function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(url, key);
}

export async function GET(request: NextRequest) {
  const denied = authorize(request);
  if (denied) return denied;

  const sb = await client();
  if (!sb) {
    return NextResponse.json(
      { error: "Supabase är inte konfigurerad (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." },
      { status: 503 }
    );
  }

  const params = request.nextUrl.searchParams;
  const status = params.get("status");
  const category = params.get("category");
  const region = params.get("region");

  let query = sb.from("partner_leads").select("*").order("created_at", { ascending: false }).limit(200);
  if (status && STATUSES.includes(status as LeadStatus)) query = query.eq("status", status);
  if (category) query = query.eq("quote_category", category);
  if (region) query = query.eq("quote_region", region);

  const { data, error } = await query;
  if (error) {
    console.error("[admin/partner-leads] select failed:", error.message);
    return NextResponse.json({ error: "Kunde inte hämta leads." }, { status: 500 });
  }

  // Räkna per status så att vyn kan visa hur många som ligger osålda.
  const counts: Record<string, number> = { new: 0, contacted: 0, sold: 0, discarded: 0 };
  const { data: all } = await sb.from("partner_leads").select("status");
  for (const row of all ?? []) {
    if (row.status in counts) counts[row.status] += 1;
  }

  return NextResponse.json({ leads: data ?? [], counts });
}

export async function PATCH(request: NextRequest) {
  const denied = authorize(request);
  if (denied) return denied;

  const body = (await request.json()) as { id?: string; status?: string; soldTo?: string };
  if (!body.id || typeof body.id !== "string") {
    return NextResponse.json({ error: "id saknas." }, { status: 400 });
  }
  if (!body.status || !STATUSES.includes(body.status as LeadStatus)) {
    return NextResponse.json({ error: "Okänd status." }, { status: 400 });
  }

  const sb = await client();
  if (!sb) return NextResponse.json({ error: "Supabase är inte konfigurerad." }, { status: 503 });

  const update: { status: LeadStatus; sold_to?: string | null } = { status: body.status as LeadStatus };
  if (body.status === "sold") {
    update.sold_to = typeof body.soldTo === "string" && body.soldTo.trim() ? body.soldTo.trim().slice(0, 200) : null;
  }

  const { data, error } = await sb.from("partner_leads").update(update).eq("id", body.id).select().single();
  if (error) {
    console.error("[admin/partner-leads] update failed:", error.message);
    return NextResponse.json({ error: "Kunde inte uppdatera leadet." }, { status: 500 });
  }
  return NextResponse.json({ lead: data });
}
