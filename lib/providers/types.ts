/** Gemensamt gränssnitt för de modell-leverantörer som kan utföra offertanalysen. */

export type ProviderName = "anthropic" | "gemini";

export interface QuoteInput {
  imageBase64?: string;
  mediaType?: string;
  pdfText?: string;
}

export interface ProviderResult {
  analysis: Record<string, unknown>;
  provider: ProviderName;
  model: string;
  /** Råsvaret, sparat för felsökning och för jämförelseskriptet. */
  raw: string;
  latencyMs: number;
}

/**
 * Vad modellen ska göra med indatan. Offert och faktura skiljer sig bara åt
 * i prompt, schema och instruktion — inte i anropsvägen.
 */
export interface AnalysisSpec {
  systemPrompt: string;
  schema: unknown;
  instruction: string;
}

export interface QuoteProvider {
  readonly name: ProviderName;
  readonly model: string;
  analyze(input: QuoteInput, spec: AnalysisSpec): Promise<ProviderResult>;
}

/** Meddelanden som visas för slutanvändaren. Aldrig leverantörens egna feltexter. */
export const USER_MESSAGE = {
  unavailable: "Analysservicen är tillfälligt otillgänglig. Försök igen om en stund.",
  overloaded: "Saga är just nu överbelastad. Vänta 30 sekunder och försök igen.",
  misconfigured: "Konfigurationsfel. Kontakta support.",
} as const;

/**
 * Fel från en leverantör. `message` går till loggen och innehåller den riktiga
 * orsaken; `userMessage` är det enda som skickas vidare till klienten.
 */
export class ProviderError extends Error {
  readonly userMessage: string;
  readonly status: number;

  constructor(opts: { logMessage: string; userMessage: string; status?: number }) {
    super(opts.logMessage);
    this.name = "ProviderError";
    this.userMessage = opts.userMessage;
    this.status = opts.status ?? 503;
  }
}

/** Tolkar modellens JSON-svar och ger ett tydligt fel om det inte går att läsa. */
export function parseAnalysis(raw: string, provider: ProviderName): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("svaret är inte ett JSON-objekt");
    }
    return parsed as Record<string, unknown>;
  } catch (e) {
    throw new ProviderError({
      logMessage: `[${provider}] kunde inte tolka svaret som JSON: ${String(e)} — råsvar: ${raw.slice(0, 500)}`,
      userMessage: USER_MESSAGE.unavailable,
    });
  }
}
