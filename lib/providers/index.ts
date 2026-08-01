import { createAnthropicProvider } from "./anthropic.ts";
import { createGeminiProvider } from "./gemini.ts";
import { ProviderError, type ProviderName, type QuoteProvider } from "./types.ts";

export { ProviderError };
export type { AnalysisSpec, ProviderName, ProviderResult, QuoteInput, QuoteProvider } from "./types.ts";

const FACTORIES: Record<ProviderName, () => QuoteProvider> = {
  anthropic: createAnthropicProvider,
  gemini: createGeminiProvider,
};

export function isProviderName(value: string): value is ProviderName {
  return value === "anthropic" || value === "gemini";
}

/**
 * Väljer leverantör. Styrs av QUOTE_PROVIDER i miljön och faller tillbaka på
 * Claude — ett stavfel i miljövariabeln ska aldrig tyst byta modell i produktion.
 */
export function getQuoteProvider(explicit?: string): QuoteProvider {
  const requested = explicit ?? process.env.QUOTE_PROVIDER ?? "anthropic";
  if (!isProviderName(requested)) {
    console.error(`[providers] okänd leverantör "${requested}" — använder anthropic`);
    return FACTORIES.anthropic();
  }
  return FACTORIES[requested]();
}
