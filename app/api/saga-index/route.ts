import { NextResponse } from 'next/server';

export const runtime = "nodejs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Under så här många analyser i en kategori säger snittpriset ingenting — då
// redovisar vi antalet i stället för att låtsas om en prisnivå.
const MIN_SAMPLES = 5;

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

/* Saga Index får ENDAST innehålla siffror vi faktiskt har mätt.
   Rutten läser `analyses` — den anonymiserade loggen över genomförda
   offertanalyser, vilket är exakt det som Saga Index utger sig för att visa.
   (Tidigare lästes `partner_leads`, alltså bara de som klickat på en CTA, och
   när tabellen var tom returnerades påhittade kategorisnitt plus en påhittad
   baslinje på 3841 analyser. Saknas data svarar vi nu med en tom lista.) */
export async function GET() {
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!sbUrl || !sbKey) {
    console.error("[saga-index] Supabase env vars saknas");
    return NextResponse.json(
      { error: "Prisdata är inte tillgänglig just nu." },
      { status: 503, headers: CORS }
    );
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const sb = createClient(sbUrl, sbKey);

    const { data: rows, error } = await sb
      .from("analyses")
      .select("category, total_amount")
      .not("total_amount", "is", null)
      .not("category", "is", null)
      .limit(5000);

    if (error) throw error;

    const { count, error: countError } = await sb
      .from("analyses")
      .select("*", { count: 'exact', head: true });

    if (countError) throw countError;

    const map = new Map<string, number[]>();
    for (const row of rows ?? []) {
      const total = Number(row.total_amount);
      if (row.category && isFinite(total) && total > 0) {
        const bucket = map.get(row.category) ?? [];
        bucket.push(total);
        map.set(row.category, bucket);
      }
    }

    const stats = Array.from(map.entries())
      .map(([category, values]) => {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return {
          category,
          count: sorted.length,
          averagePrice: Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length),
          medianPrice: Math.round(
            sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
          ),
        };
      })
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(
      { totalAnalyzed: count ?? 0, minSamples: MIN_SAMPLES, stats },
      { headers: CORS }
    );
  } catch (err) {
    console.error("[saga-index route]", err);
    return NextResponse.json(
      { error: "Prisdata är inte tillgänglig just nu." },
      { status: 503, headers: CORS }
    );
  }
}
