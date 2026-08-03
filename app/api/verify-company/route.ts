// Next.js API Route: företagsverifiering.
// VIES (avgiftsfritt) som bas, Roaring som valfri påfyllnad — se lib/company/verify.
import { NextRequest, NextResponse } from 'next/server';
import { verifyCompany } from '@/lib/company/verify';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orgNr = String(body.org_nr ?? "").replace(/[\s-]/g, "");
    if (!/^\d{10}$/.test(orgNr)) {
      return NextResponse.json(
        { error: "Ogiltigt organisationsnummer. Förväntar 10 siffror." },
        { status: 400, headers: CORS }
      );
    }

    const verification = await verifyCompany(orgNr, body.company_name ?? null);

    // Ingen källa svarade — säg det rakt ut istället för att visa tomma fält
    // som om de vore kontrollerade.
    if (verification.sources.length === 0) {
      return NextResponse.json(
        {
          error: "verification_unavailable",
          message: "Företagsregistren svarar inte just nu. Försök igen om en stund.",
        },
        { status: 503, headers: CORS }
      );
    }

    // Numret gick inte att slå upp. På en fotograferad offert är felläst org.nr
    // en långt troligare förklaring än ett oseriöst företag, så detta får INTE
    // formuleras som att företaget saknas i registren — outcomes.ts skulle då
    // slå till med COMPANY_RISK på ett skarpt läsfel.
    if (verification.orgNrValid === false) {
      return NextResponse.json(
        {
          error: "org_nr_unresolved",
          message:
            `Vi kunde inte hitta organisationsnummer ${orgNr} i EU:s momsregister. ` +
            "Kontrollera siffrorna mot offerten — de läses av automatiskt och kan ha tolkats fel.",
          verification,
        },
        { status: 200, headers: CORS }
      );
    }

    return NextResponse.json({ verification }, { headers: CORS });
  } catch (error) {
    console.error('[verify-company]', error);
    return NextResponse.json(
      { error: "Företagsverifiering misslyckades." },
      { status: 500, headers: CORS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}
