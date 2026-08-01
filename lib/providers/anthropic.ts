import {
  ProviderError,
  type AnalysisSpec,
  USER_MESSAGE,
  parseAnalysis,
  type ProviderResult,
  type QuoteInput,
  type QuoteProvider,
} from "./types.ts";

const ENDPOINT = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-haiku-4-5";

/** Översätter Anthropics felsvar till ett användarmeddelande + en loggrad med den riktiga orsaken. */
function mapError(status: number, body: string): ProviderError {
  let reason = body;
  let userMessage: string = USER_MESSAGE.unavailable;
  try {
    const msg = (JSON.parse(body)?.error?.message ?? "") as string;
    if (msg) reason = msg;
    if (/credit balance|billing/i.test(msg)) {
      reason = `SLUT PÅ CREDITS hos Anthropic — ${msg}`;
    } else if (/overloaded|rate_limit/i.test(msg) || status === 429 || status === 529) {
      userMessage = USER_MESSAGE.overloaded;
    } else if (/invalid_api_key|authentication/i.test(msg)) {
      reason = `OGILTIG API-NYCKEL — ${msg}`;
      userMessage = USER_MESSAGE.misconfigured;
    }
  } catch {
    /* icke-JSON-svar: behåll kroppen som orsak */
  }
  return new ProviderError({
    logMessage: `[anthropic] HTTP ${status}: ${reason}`,
    userMessage,
  });
}

export function createAnthropicProvider(): QuoteProvider {
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  return {
    name: "anthropic",
    model,

    async analyze(input: QuoteInput, spec: AnalysisSpec): Promise<ProviderResult> {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new ProviderError({
          logMessage: "[anthropic] ANTHROPIC_API_KEY saknas i miljön",
          userMessage: USER_MESSAGE.misconfigured,
          status: 500,
        });
      }

      const content = input.imageBase64
        ? [
            { type: "text", text: spec.instruction },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: input.mediaType ?? "image/jpeg",
                data: input.imageBase64,
              },
            },
          ]
        : [{ type: "text", text: `${spec.instruction}\n\n---\n\nInnehåll:\n\n${input.pdfText}` }];

      const startedAt = Date.now();
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 2000,
          temperature: 0,
          system: spec.systemPrompt,
          messages: [{ role: "user", content }],
          output_config: { format: { type: "json_schema", schema: spec.schema } },
        }),
      });

      if (!res.ok) throw mapError(res.status, await res.text());

      const data = await res.json();
      if (data.stop_reason === "max_tokens") {
        throw new ProviderError({
          logMessage: "[anthropic] svaret klipptes av mot max_tokens — höj max_tokens",
          userMessage: USER_MESSAGE.unavailable,
        });
      }

      const raw = data.content?.find((b: { type: string }) => b.type === "text")?.text ?? "";
      return {
        analysis: parseAnalysis(raw, "anthropic"),
        provider: "anthropic",
        model,
        raw,
        latencyMs: Date.now() - startedAt,
      };
    },
  };
}
