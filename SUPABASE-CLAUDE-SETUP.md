# Saga – Supabase + Claude (Anthropic)

## 1. Supabase-projekt

1. Gå till [supabase.com](https://supabase.com) och skapa ett nytt projekt.
2. Under **Project Settings → API** kopierar du:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Miljövariabler (Next.js)

Skapa `.env.local` i projektets rot (eller kopiera från `.env.local.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## 3. Anthropic API-nyckel (Edge Function)

1. Skapa en API-nyckel på [console.anthropic.com](https://console.anthropic.com) (Anthropic-konto).
2. I Supabase: **Project Settings → Edge Functions → Secrets**.
3. Lägg till secret: **`ANTHROPIC_API_KEY`** = din Anthropic API-nyckel.

## 4. Deploya Edge Function

Installera [Supabase CLI](https://supabase.com/docs/guides/cli) och logga in. Sedan:

```bash
cd saga
supabase link --project-ref DITT_PROJECT_REF
supabase functions deploy analyze-quote
```

`DITT_PROJECT_REF` hittar du under Project Settings → General → Reference ID.

## 5. Modell (Claude)

Edge-funktionen använder **`claude-haiku-4-5`** (Claude Haiku 4.5 – snabb och billig). Byta modell gör du i `supabase/functions/analyze-quote/index.ts` (rad med `model: "claude-haiku-4-5"`). Kontrollera exakt modellnamn på [Anthropic docs](https://docs.anthropic.com/en/docs/about-claude/models).

## 6. PDF-hantering

- **Bilder (JPG, PNG, etc.):** Skickas som base64 till Claude vision.
- **PDF med text:** Texten extraheras i webbläsaren och skickas som `pdfText` (billigare, snabbare).
- **Skannad PDF (ingen text):** Faller automatiskt tillbaka till att rendera första sidan som bild och använda vision.

## 7. Kör lokalt

- **Frontend:** `npm run dev` (kräver `.env.local`).
- **Edge Function lokalt (valfritt):** `supabase functions serve analyze-quote` (kräver att du sätter `ANTHROPIC_API_KEY` via `supabase secrets set` eller i en `.env` under funktionen).

Frontend anropar `supabase.functions.invoke("analyze-quote", { body: { imageBase64, mediaType } })` för bilder, eller `{ body: { pdfText } }` för textbaserade PDF:er. Funktionen måste vara deployad (eller köras lokalt) för att analysen ska fungera.
