-- Migration 003: Partnerleads från resultatvyns CTA:n ("Saga-fällan")
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS partner_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Vilken CTA som klickades, och vilket analysutfall den visades för
  intent TEXT NOT NULL CHECK (intent IN ('match_cheaper','match_verified','contract_review','financing')),
  outcome TEXT,

  -- Kontaktuppgifter
  name TEXT,
  email TEXT NOT NULL,
  phone TEXT,

  -- Säljunderlaget: exakt vad en installatör behöver för att värdera leadet
  quote_category TEXT,
  quote_region TEXT,
  quote_total NUMERIC(12,2),
  market_low NUMERIC(12,2),
  market_high NUMERIC(12,2),
  over_market_pct NUMERIC(6,2),
  analysis_verdict TEXT,
  company_name TEXT,
  company_org_nr TEXT,
  red_flags JSONB DEFAULT '[]'::jsonb,

  -- Säljstatus mot B2B-partners
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','sold','discarded')),
  sold_to TEXT,

  gdpr_consent BOOLEAN NOT NULL DEFAULT FALSE,
  consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingen unik nyckel på e-post: varje förfrågan är ett eget säljbart lead.
CREATE INDEX IF NOT EXISTS partner_leads_created_at_idx ON partner_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS partner_leads_status_idx ON partner_leads (status);
CREATE INDEX IF NOT EXISTS partner_leads_intent_idx ON partner_leads (intent);
CREATE INDEX IF NOT EXISTS partner_leads_category_idx ON partner_leads (quote_category);
CREATE INDEX IF NOT EXISTS partner_leads_email_idx ON partner_leads (lower(email));

ALTER TABLE partner_leads ENABLE ROW LEVEL SECURITY;
-- Endast service role (server-side API-routes) läser och skriver.
GRANT ALL ON partner_leads TO service_role;

-- Öppna leads redo att säljas vidare, färskast först.
CREATE OR REPLACE VIEW partner_leads_open AS
SELECT
  id,
  created_at,
  intent,
  quote_category,
  quote_region,
  quote_total,
  over_market_pct,
  analysis_verdict,
  name,
  email,
  phone
FROM partner_leads
WHERE status = 'new'
ORDER BY created_at DESC;

COMMENT ON TABLE partner_leads IS
  'Högintenta leads från resultatvyns CTA:n. Säljs vidare till B2B-partners per region/kategori.';
