// Next.js API Route: Företagsverifiering via Roaring.io
import { NextRequest, NextResponse } from 'next/server';

// OAuth token cache (module-scope för hot reloads)
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getRoaringToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60_000) {
    return cachedToken;
  }

  const clientId = process.env.ROARING_CLIENT_ID;
  const clientSecret = process.env.ROARING_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.warn("Roaring.io credentials not configured - using development mode");
    throw new Error("ROARING_CREDENTIALS_MISSING");
  }

  const credentials = btoa(`${clientId}:${clientSecret}`);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch("https://api.roaring.io/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Roaring auth failed (${res.status}): ${errText}`);
    }

    const data = await res.json();
    cachedToken = data.access_token;
    tokenExpiresAt = now + data.expires_in * 1000;
    return cachedToken!;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchCompanyOverview(
  orgNr: string,
  token: string
): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `https://api.roaring.io/se/company/overview/2.0/${orgNr}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      }
    );

    if (res.status === 404) {
      throw Object.assign(new Error("Company not found"), { status: 404 });
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Roaring lookup failed (${res.status}): ${errText}`);
    }

    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

interface CompanyVerification {
  companyName: string | null;
  companyId: string | null;
  statusCode: string | null;
  statusTextHigh: string | null;
  statusTextDetailed: string | null;
  preliminaryTaxReg: boolean | null;
  vatReg: boolean | null;
  employerContributionReg: boolean | null;
  legalGroupCode: string | null;
  legalGroupText: string | null;
  companyRegistrationDate: string | null;
  address: string | null;
  zipCode: string | null;
  town: string | null;
  numberEmployeesInterval: string | null;
  industryCode: string | null;
  industryText: string | null;
  topDirectorName: string | null;
  topDirectorFunction: string | null;
  commune: string | null;
  county: string | null;
}

function mapToVerification(raw: Record<string, unknown>): CompanyVerification {
  return {
    companyName: (raw.companyName as string) ?? null,
    companyId: (raw.companyId as string) ?? null,
    statusCode: (raw.statusCode as string) ?? null,
    statusTextHigh: (raw.statusTextHigh as string) ?? null,
    statusTextDetailed: (raw.statusTextDetailed as string) ?? null,
    preliminaryTaxReg: typeof raw.preliminaryTaxReg === "boolean" ? raw.preliminaryTaxReg : null,
    vatReg: typeof raw.vatReg === "boolean" ? raw.vatReg : null,
    employerContributionReg: typeof raw.employerContributionReg === "boolean" ? raw.employerContributionReg : null,
    legalGroupCode: (raw.legalGroupCode as string) ?? null,
    legalGroupText: (raw.legalGroupText as string) ?? null,
    companyRegistrationDate: (raw.companyRegistrationDate as string) ?? null,
    address: (raw.address as string) ?? null,
    zipCode: (raw.zipCode as string) ?? null,
    town: (raw.town as string) ?? null,
    numberEmployeesInterval: (raw.numberEmployeesInterval as string) ?? null,
    industryCode: (raw.industryCode as string) ?? null,
    industryText: (raw.industryText as string) ?? null,
    topDirectorName: (raw.topDirectorName as string) ?? null,
    topDirectorFunction: (raw.topDirectorFunction as string) ?? null,
    commune: (raw.commune as string) ?? null,
    county: (raw.county as string) ?? null,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Normalize org_nr: strip whitespace and hyphens, expect 10 digits
    const orgNr = body.org_nr?.replace(/[\s-]/g, "");
    if (!orgNr || !/^\d{10}$/.test(orgNr)) {
      return NextResponse.json(
        { error: "Ogiltigt organisationsnummer. Förväntar 10 siffror." },
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

    // Get OAuth token (cached)
    let token: string;
    try {
      token = await getRoaringToken();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error("Roaring auth error:", message);

      // Development mode fallback when credentials are missing
      if (message.includes("ROARING_CREDENTIALS_MISSING")) {
        console.log("Using development mode for company verification");

        // Return mock verification data for development
        const mockVerification: CompanyVerification = {
          companyName: `Mock Företag AB (${orgNr})`,
          companyId: orgNr,
          statusCode: "1",
          statusTextHigh: "Aktiv",
          statusTextDetailed: "Företaget är aktivt registrerat",
          preliminaryTaxReg: true,
          vatReg: true,
          employerContributionReg: false,
          legalGroupCode: "AB",
          legalGroupText: "Aktiebolag",
          companyRegistrationDate: "2020-01-15",
          address: "Testgatan 123",
          zipCode: "11122",
          town: "Stockholm",
          numberEmployeesInterval: "1-4",
          industryCode: "43210",
          industryText: "Byggverksamhet",
          topDirectorName: "Test Testsson",
          topDirectorFunction: "VD",
          commune: "Stockholm",
          county: "Stockholm"
        };

        return NextResponse.json({
          verification: mockVerification,
          _dev_mode: true,
          _message: "Mock data - configure ROARING_CLIENT_ID and ROARING_CLIENT_SECRET for real verification"
        }, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        });
      }

      return NextResponse.json(
        { error: "Kunde inte autentisera mot företagsdataleverantören." },
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

    // Look up company
    try {
      const raw = await fetchCompanyOverview(orgNr, token);

      // Roaring wraps response in { records: [...], status: ... }
      // The actual company data is in records[0]
      const records = raw.records as Record<string, unknown>[] | undefined;
      const companyData = records?.[0] ?? {};

      const verification = mapToVerification(companyData as Record<string, unknown>);

      return NextResponse.json({ verification }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });

    } catch (e) {
      const err = e as Error & { status?: number };

      if (err.status === 404) {
        return NextResponse.json(
          { error: "company_not_found", message: "Företaget hittades inte i registret." },
          {
            status: 404,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            }
          }
        );
      }

      if (err.name === "AbortError") {
        return NextResponse.json(
          { error: "Tidsgräns överskriden vid företagsuppslag." },
          {
            status: 504,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            }
          }
        );
      }

      const message = err.message ?? String(e);
      console.error("Roaring lookup error:", message);
      return NextResponse.json(
        { error: "Företagsverifiering misslyckades.", details: message },
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

  } catch (error) {
    console.error('Company verification error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Request processing failed", details: message },
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