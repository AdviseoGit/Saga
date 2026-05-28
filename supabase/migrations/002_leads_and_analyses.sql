-- Migration 002: Lead capture and analysis logging
-- Run this in Supabase SQL Editor

-- ── Leads table ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'result_email',
  quote_category TEXT,
  quote_region TEXT,
  analysis_verdict TEXT,
  analysis_summary JSONB,
  gdpr_consent BOOLEAN NOT NULL DEFAULT TRUE,
  consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Upsert on email so re-submitting updates the record
CREATE UNIQUE INDEX IF NOT EXISTS leads_email_idx ON leads (lower(email));
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at);
CREATE INDEX IF NOT EXISTS leads_category_idx ON leads (quote_category);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- Only service role can read/write (server-side API routes use service role key)
GRANT ALL ON leads TO service_role;


-- ── Analyses table (anonymised market data logging) ────────────────────────────
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category TEXT NOT NULL,
  region TEXT,
  total_amount NUMERIC(12,2) NOT NULL,
  verdict TEXT NOT NULL CHECK (verdict IN ('LOW','FAIR','HIGH','VERY_HIGH')),
  market_low NUMERIC(12,2),
  market_high NUMERIC(12,2),
  includes_rot BOOLEAN DEFAULT FALSE,
  line_items_count INTEGER,
  red_flags_count INTEGER
);

CREATE INDEX IF NOT EXISTS analyses_category_idx ON analyses (category);
CREATE INDEX IF NOT EXISTS analyses_region_idx ON analyses (region);
CREATE INDEX IF NOT EXISTS analyses_created_at_idx ON analyses (created_at);
CREATE INDEX IF NOT EXISTS analyses_verdict_idx ON analyses (verdict);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
GRANT ALL ON analyses TO service_role;


-- ── Market summary view (feeds back into Claude's prompts over time) ───────────
CREATE OR REPLACE VIEW market_summary AS
SELECT
  category,
  region,
  COUNT(*)                                                         AS sample_count,
  ROUND(AVG(total_amount))                                         AS avg_price,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_amount)) AS median_price,
  ROUND(MIN(total_amount))                                         AS min_price,
  ROUND(MAX(total_amount))                                         AS max_price,
  ROUND(
    COUNT(*) FILTER (WHERE verdict IN ('LOW','FAIR'))::NUMERIC
    / NULLIF(COUNT(*), 0) * 100
  )                                                                AS pct_fair_or_low,
  MAX(created_at)                                                  AS last_updated
FROM analyses
WHERE created_at > NOW() - INTERVAL '6 months'
GROUP BY category, region
ORDER BY sample_count DESC;

COMMENT ON VIEW market_summary IS
  'Aggregated market price data from logged analyses. Query this to update Claude system prompt baselines.';
