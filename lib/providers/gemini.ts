import { toGeminiSchema, type JsonSchemaNode } from "./gemini-schema.ts";
import {
  ProviderError,
  type AnalysisSpec,
  USER_MESSAGE,
  parseAnalysis,
  type ProviderResult,
  type QuoteInput,
  type QuoteProvider,
} from "./types.ts";

const DEFAULT_MODEL = "gemini-2.5-flash";

/**
 * Gemini 2.5 tänker som standard, och tankebudgeten räknas mot maxOutputTokens.
 * Med en snäv budget kan hela utrymmet gå åt till tänkande och svaret bli tomt
 * med finishReason MAX_TOKENS. Vi stänger av tänkandet för att ligga nära
 * Claude-anropet (Haiku utan thinking) och sätter ändå ett generöst tak.
 */
const MAX_OUTPUT_TOKENS = 4096;
const THINKING_BUDGET = 0;

function endpoint(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

function mapError(status: number, body: string): ProviderError {
  let reason = body;
  let userMessage: string = USER_MESSAGE.unavailable;
  try {
    const err = JSON.parse(body)?.error;
    const msg = (err?.message ?? "") as string;
    if (msg) reason = msg;
    if (status === 429) {
      userMessage = USER_MESSAGE.overloaded;
    } else if (status === 401 || status === 403 || /API key/i.test(msg)) {
      reason = `OGILTIG API-NYCKEL — ${msg}`;
      userMessage = USER_MESSAGE.misconfigured;
    } else if (/quota|billing/i.test(msg)) {
      reason = `KVOT ELLER FAKTURERING hos Google — ${msg}`;
    }
  } catch {
    /* icke-JSON-svar: behåll kroppen som orsak */
  }
  return new ProviderError({ logMessage: `[gemini] HTTP ${status}: ${reason}`, userMessage });
}

export function createGeminiProvider(): QuoteProvider {
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  // Konverteringen är ren och specarna är få — cacha per schema.
  const schemaCache = new Map<unknown, unknown>();

  return {
    name: "gemini",
    model,

    async analyze(input: QuoteInput, spec: AnalysisSpec): Promise<ProviderResult> {
      let responseSchema = schemaCache.get(spec.schema);
      if (!responseSchema) {
        responseSchema = toGeminiSchema(spec.schema as JsonSchemaNode);
        schemaCache.set(spec.schema, responseSchema);
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new ProviderError({
          logMessage: "[gemini] GEMINI_API_KEY saknas i miljön",
          userMessage: USER_MESSAGE.misconfigured,
          status: 500,
        });
      }

      const parts = input.imageBase64
        ? [
            { text: spec.instruction },
            {
              inlineData: {
                mimeType: input.mediaType ?? "image/jpeg",
                data: input.imageBase64,
              },
            },
          ]
        : [{ text: `${spec.instruction}\n\n---\n\nInnehåll:\n\n${input.pdfText}` }];

      const startedAt = Date.now();
      const res = await fetch(endpoint(model), {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: spec.systemPrompt }] },
          contents: [{ role: "user", parts }],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            responseMimeType: "application/json",
            responseSchema,
            thinkingConfig: { thinkingBudget: THINKING_BUDGET },
          },
        }),
      });

      if (!res.ok) throw mapError(res.status, await res.text());

      const data = await res.json();

      // Ett blockerat anrop ger HTTP 200 utan kandidater — fånga det innan vi läser svaret.
      const blockReason = data.promptFeedback?.blockReason;
      if (blockReason) {
        throw new ProviderError({
          logMessage: `[gemini] anropet blockerades: ${blockReason}`,
          userMessage: USER_MESSAGE.unavailable,
        });
      }

      const candidate = data.candidates?.[0];
      if (candidate?.finishReason && candidate.finishReason !== "STOP") {
        throw new ProviderError({
          logMessage:
            `[gemini] avslutades med ${candidate.finishReason}` +
            (candidate.finishReason === "MAX_TOKENS"
              ? " — höj MAX_OUTPUT_TOKENS eller sänk schemats storlek"
              : ""),
          userMessage: USER_MESSAGE.unavailable,
        });
      }

      const raw = (candidate?.content?.parts ?? [])
        .map((p: { text?: string }) => p.text ?? "")
        .join("");

      return {
        analysis: parseAnalysis(raw, "gemini"),
        provider: "gemini",
        model,
        raw,
        latencyMs: Date.now() - startedAt,
      };
    },
  };
}
