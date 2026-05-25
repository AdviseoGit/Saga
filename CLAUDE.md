# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

There are no tests configured.

To deploy Supabase Edge Functions:
```bash
supabase functions deploy analyze-quote
supabase functions deploy verify-company
```

## Environment Variables

Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Supabase Edge Function secrets (set via Supabase dashboard → Project Settings → Edge Functions → Secrets):
- `ANTHROPIC_API_KEY` — used by `analyze-quote`
- `ROARING_CLIENT_ID` + `ROARING_CLIENT_SECRET` — used by `verify-company`

## Architecture

**Saga** is a Swedish quote-analysis web app. Users upload a contractor quote (image or PDF); the app analyzes it and returns a price verdict and company verification.

### Data flow

1. **Frontend** (`app/page.tsx`) — single-page client component. Accepts image or PDF upload.
   - Images: converted to base64 via `FileReader`
   - PDFs: text extracted via `pdfjs-dist` (up to 10 pages / 50k chars). Falls back to rendering page 1 as a PNG if the PDF is scanned/image-only.
   - Calls Supabase Edge Function `analyze-quote` with either `{ imageBase64, mediaType }` or `{ pdfText }`.
   - On success, calls `verify-company` with the extracted `org_nr`.

2. **`supabase/functions/analyze-quote/index.ts`** — Deno Edge Function. Forwards the quote to Claude (`claude-haiku-4-5`) with a structured JSON schema output. Enforces in-memory rate limiting (10 req/IP/hour).

3. **`supabase/functions/verify-company/index.ts`** — Deno Edge Function. Uses Roaring.io's Company Overview API (OAuth2 client credentials) to verify Swedish companies by org number. Caches the OAuth token in module scope across warm invocations.

4. **`lib/supabase.ts`** — exports a nullable `supabase` client; returns `null` if env vars are missing (frontend handles gracefully).

### UI states

The overlay modal cycles through: `idle` → `reading` → `verifying` → `result` (or `error`).

`ResultBlock` in `app/page.tsx` renders the full analysis: verdict, market comparison bar, line items, company verification data (from Roaring), flags (green/yellow/red), and pre-written email templates for the user to send to the contractor.

### Key types

- `SagaAnalysis` — the shape returned by `analyze-quote` and defined in both `app/page.tsx` (frontend) and the edge function's JSON schema.
- `CompanyVerification` — data from Roaring, defined in both `app/page.tsx` and `verify-company/index.ts`.

### Tech stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- Supabase (client SDK + Edge Functions runtime: Deno)
- Claude API via direct `fetch` (no SDK) in the edge function
- Roaring.io for Swedish company registry lookups
- `pdfjs-dist` (legacy build, worker loaded from unpkg CDN)
- Fonts: DM Sans + DM Mono via `next/font/google`
