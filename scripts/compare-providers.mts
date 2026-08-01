/**
 * Skuggtest: kör samma offerter genom Claude och Gemini och jämför utfallet.
 *
 *   ANTHROPIC_API_KEY=... GEMINI_API_KEY=... \
 *     node --experimental-strip-types scripts/compare-providers.mts ./testdata
 *
 * Katalogen får innehålla bilder (.jpg/.jpeg/.png/.webp/.gif) och .txt-filer
 * med redan extraherad PDF-text. Rapporten skrivs till compare-report.json.
 *
 * Det som avgör beslutet är inte att båda svarar, utan att de säger SAMMA sak:
 * verdict styr vilken CTA användaren ser, och over_market_pct är det som säljs
 * vidare till partners. Systematisk skillnad där betyder omkalibrerad prompt.
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { createAnthropicProvider } from "../lib/providers/anthropic.ts";
import { createGeminiProvider } from "../lib/providers/gemini.ts";
import type { ProviderResult, QuoteInput } from "../lib/providers/types.ts";
import { QUOTE_SPEC } from "../lib/analysis/quote-spec.ts";

const IMAGE_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

interface Row {
  file: string;
  a?: Analysis;
  b?: Analysis;
  aError?: string;
  bError?: string;
}

interface Analysis {
  verdict: string;
  total: number | null;
  marketLow: number | null;
  marketHigh: number | null;
  pctVsMarket: number | null;
  category: string | null;
  region: string | null;
  redFlags: number;
  latencyMs: number;
}

interface RawAnalysis {
  verdict?: string;
  quote?: { total_amount?: number; category?: string; region_guess?: string };
  market_range?: { low?: number; high?: number };
  red_flags?: unknown[];
}

function summarise(result: ProviderResult): Analysis {
  const a = result.analysis as RawAnalysis;
  const total = a.quote?.total_amount ?? null;
  const low = a.market_range?.low ?? null;
  const high = a.market_range?.high ?? null;
  const mid = low != null && high != null ? (low + high) / 2 : null;
  return {
    verdict: String(a.verdict ?? "—"),
    total,
    marketLow: low,
    marketHigh: high,
    pctVsMarket: mid && total ? Math.round(((total - mid) / mid) * 100) : null,
    category: a.quote?.category ?? null,
    region: a.quote?.region_guess ?? null,
    redFlags: Array.isArray(a.red_flags) ? a.red_flags.length : 0,
    latencyMs: result.latencyMs,
  };
}

async function toInput(dir: string, file: string): Promise<QuoteInput | null> {
  const ext = extname(file).toLowerCase();
  const path = join(dir, file);
  if (IMAGE_TYPES[ext]) {
    const buf = await readFile(path);
    return { imageBase64: buf.toString("base64"), mediaType: IMAGE_TYPES[ext] };
  }
  if (ext === ".txt") return { pdfText: await readFile(path, "utf8") };
  return null;
}

function kr(v: number | null): string {
  return v == null ? "—" : Math.round(v).toLocaleString("sv-SE");
}

function pct(v: number | null): string {
  return v == null ? "—" : `${v > 0 ? "+" : ""}${v}%`;
}

async function main(): Promise<void> {
  const dir = process.argv[2];
  if (!dir) {
    console.error("Användning: node --experimental-strip-types scripts/compare-providers.mts <katalog>");
    process.exit(1);
  }
  for (const key of ["ANTHROPIC_API_KEY", "GEMINI_API_KEY"]) {
    if (!process.env[key]) {
      console.error(`Saknar ${key} i miljön.`);
      process.exit(1);
    }
  }

  const anthropic = createAnthropicProvider();
  const gemini = createGeminiProvider();
  const files = (await readdir(dir)).filter((f) => !f.startsWith("."));
  const rows: Row[] = [];

  console.log(`Jämför ${anthropic.model} mot ${gemini.model} på ${files.length} fil(er)\n`);

  for (const file of files) {
    const input = await toInput(dir, file);
    if (!input) {
      console.log(`  hoppar över ${file} (stöds inte)`);
      continue;
    }
    const row: Row = { file };
    // Sekventiellt och en i taget: ratelimits på båda sidor, och vi har inte bråttom.
    for (const [provider, slot] of [[anthropic, "a"], [gemini, "b"]] as const) {
      try {
        row[slot] = summarise(await provider.analyze(input, QUOTE_SPEC));
      } catch (e) {
        row[`${slot}Error`] = e instanceof Error ? e.message : String(e);
      }
    }
    rows.push(row);
    const verdicts = `${row.a?.verdict ?? "FEL"} / ${row.b?.verdict ?? "FEL"}`;
    console.log(`  ${file.padEnd(32)} ${verdicts}`);
  }

  // ── Tabell ──────────────────────────────────────────────────────────────────
  console.log(`\n${"Fil".padEnd(28)} ${"Verdict".padEnd(22)} ${"Totalt".padEnd(20)} ${"Mot snitt".padEnd(16)} Flaggor`);
  console.log("─".repeat(100));
  for (const r of rows) {
    const verdict = `${r.a?.verdict ?? "FEL"} / ${r.b?.verdict ?? "FEL"}`;
    const total = `${kr(r.a?.total ?? null)} / ${kr(r.b?.total ?? null)}`;
    const vs = `${pct(r.a?.pctVsMarket ?? null)} / ${pct(r.b?.pctVsMarket ?? null)}`;
    const flags = `${r.a?.redFlags ?? "—"} / ${r.b?.redFlags ?? "—"}`;
    console.log(`${r.file.slice(0, 27).padEnd(28)} ${verdict.padEnd(22)} ${total.padEnd(20)} ${vs.padEnd(16)} ${flags}`);
  }

  // ── Sammanfattning ──────────────────────────────────────────────────────────
  const both = rows.filter((r) => r.a && r.b);
  const sameVerdict = both.filter((r) => r.a!.verdict === r.b!.verdict).length;
  const pctDiffs = both
    .filter((r) => r.a!.pctVsMarket != null && r.b!.pctVsMarket != null)
    .map((r) => Math.abs(r.a!.pctVsMarket! - r.b!.pctVsMarket!));
  const meanPctDiff = pctDiffs.length
    ? Math.round(pctDiffs.reduce((s, v) => s + v, 0) / pctDiffs.length)
    : null;
  const totalDiffs = both
    .filter((r) => r.a!.total != null && r.b!.total != null)
    .filter((r) => Math.abs(r.a!.total! - r.b!.total!) > 1);

  const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((s, v) => s + v, 0) / xs.length) : 0);

  console.log(`\n${"─".repeat(100)}`);
  console.log(`Jämförbara analyser:      ${both.length} av ${rows.length}`);
  console.log(`Samma verdict:            ${sameVerdict}/${both.length}` +
    (both.length ? ` (${Math.round((sameVerdict / both.length) * 100)} %)` : ""));
  console.log(`Snittavvikelse mot snitt: ${meanPctDiff == null ? "—" : `${meanPctDiff} procentenheter`}`);
  console.log(`Olika extraherat belopp:  ${totalDiffs.length} — extraheringsfel, inte bedömningsskillnad`);
  console.log(`Latens (Claude/Gemini):   ${avg(both.map((r) => r.a!.latencyMs))} / ${avg(both.map((r) => r.b!.latencyMs))} ms`);

  const errors = rows.filter((r) => r.aError || r.bError);
  if (errors.length) {
    console.log(`\nFel:`);
    for (const r of errors) {
      if (r.aError) console.log(`  ${r.file} [claude]  ${r.aError}`);
      if (r.bError) console.log(`  ${r.file} [gemini]  ${r.bError}`);
    }
  }

  console.log(
    `\nTolkning: under ~90 % samma verdict, eller mer än ~5 procentenheters snittavvikelse,` +
    `\nbetyder att prompten måste kalibreras om innan ett byte — CTA:n och partnerleadsen` +
    `\nbygger båda på verdict och over_market_pct.`
  );

  await writeFile("compare-report.json", JSON.stringify({ rows, generatedAt: new Date().toISOString() }, null, 2));
  console.log(`\nFullständig rapport: compare-report.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
