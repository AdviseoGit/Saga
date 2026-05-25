-- ML Training Data Schema för Saga
-- Skapar tabeller för att lagra träningsdata och modellprestanda

-- Enable pgvector extension för feature vectors (om tillgänglig)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- Huvudtabell för träningsdata (anonymiserad)
CREATE TABLE ml_training_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Anonymiserade input features
  category VARCHAR(50) NOT NULL,
  region VARCHAR(50) NOT NULL,
  estimated_area NUMERIC(8,2),
  room_count INTEGER,
  complexity VARCHAR(20) NOT NULL CHECK (complexity IN ('low', 'medium', 'high')),
  seasonality INTEGER NOT NULL CHECK (seasonality BETWEEN 1 AND 4),
  labor_intensity NUMERIC(4,3) CHECK (labor_intensity BETWEEN 0 AND 1),
  material_quality VARCHAR(20) NOT NULL CHECK (material_quality IN ('basic', 'standard', 'premium')),
  includes_design BOOLEAN DEFAULT FALSE,
  includes_permits BOOLEAN DEFAULT FALSE,
  price_complexity NUMERIC(4,3) CHECK (price_complexity BETWEEN 0 AND 1),
  has_unusual_terms BOOLEAN DEFAULT FALSE,

  -- Målvariabel och feedback
  actual_price NUMERIC(10,2) NOT NULL CHECK (actual_price > 0),
  user_feedback VARCHAR(20) NOT NULL CHECK (user_feedback IN ('too_low', 'fair', 'too_high')),
  was_accepted BOOLEAN,

  -- Prediktionsanalys
  original_prediction NUMERIC(10,2) NOT NULL,
  prediction_error NUMERIC(10,2) NOT NULL, -- actual_price - original_prediction
  abs_prediction_error NUMERIC(10,2) GENERATED ALWAYS AS (ABS(prediction_error)) STORED,
  relative_error NUMERIC(6,4) GENERATED ALWAYS AS (
    CASE WHEN actual_price > 0
    THEN ABS(prediction_error) / actual_price
    ELSE NULL END
  ) STORED,

  -- Metadata för deduplicering och spårning
  data_hash VARCHAR(64) UNIQUE NOT NULL,
  session_id VARCHAR(100),

  -- Träningspartition (för train/test split)
  training_partition VARCHAR(10) DEFAULT 'train' CHECK (training_partition IN ('train', 'test', 'validation'))
);

-- Index för snabba querys
CREATE INDEX idx_training_category ON ml_training_data(category);
CREATE INDEX idx_training_region ON ml_training_data(region);
CREATE INDEX idx_training_created_at ON ml_training_data(created_at);
CREATE INDEX idx_training_feedback ON ml_training_data(user_feedback);
CREATE INDEX idx_training_error ON ml_training_data(abs_prediction_error);
CREATE INDEX idx_training_hash ON ml_training_data(data_hash);

-- Modellversioner och prestanda
CREATE TABLE model_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  model_name VARCHAR(100) NOT NULL,
  model_version VARCHAR(50) NOT NULL,
  model_type VARCHAR(50) NOT NULL, -- 'neural_network', 'xgboost', 'linear_regression', 'ensemble'

  -- Träningsmetadata
  training_start_date TIMESTAMP WITH TIME ZONE,
  training_end_date TIMESTAMP WITH TIME ZONE,
  training_data_count INTEGER,
  validation_data_count INTEGER,

  -- Prestanda-metrics
  mean_absolute_error NUMERIC(10,2),
  root_mean_squared_error NUMERIC(10,2),
  accuracy_within_10_percent NUMERIC(5,4), -- andel prediktioner inom 10%
  accuracy_within_20_percent NUMERIC(5,4), -- andel prediktioner inom 20%

  -- Per-kategori prestanda
  performance_by_category JSONB,

  -- Modell-artefakter
  model_artifact_url TEXT, -- S3/Supabase storage URL
  model_config JSONB, -- hyperparameters, architecture etc

  -- Status
  is_active BOOLEAN DEFAULT FALSE,
  deployment_date TIMESTAMP WITH TIME ZONE,

  UNIQUE(model_name, model_version)
);

CREATE INDEX idx_model_active ON model_versions(is_active);
CREATE INDEX idx_model_performance ON model_versions(mean_absolute_error);

-- Modell-prestanda över tid (för monitoring)
CREATE TABLE model_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  model_version VARCHAR(50) NOT NULL,
  calculation_date DATE NOT NULL,

  -- Prestanda för senaste period (t.ex. 7 dagar)
  sample_count INTEGER NOT NULL,
  mean_absolute_error NUMERIC(10,2),
  accuracy_rate NUMERIC(5,4), -- andel 'fair' feedback

  -- Per kategori (om tillräckligt med data)
  category_performance JSONB,

  -- Drift detection
  feature_drift_score NUMERIC(5,4), -- 0-1, högre = mer drift
  prediction_drift_score NUMERIC(5,4),

  UNIQUE(model_version, calculation_date)
);

CREATE INDEX idx_performance_date ON model_performance(calculation_date);
CREATE INDEX idx_performance_model ON model_performance(model_version);

-- A/B test results för modellexperiment
CREATE TABLE model_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  experiment_name VARCHAR(100) NOT NULL,
  model_version_a VARCHAR(50) NOT NULL,
  model_version_b VARCHAR(50) NOT NULL,

  traffic_split NUMERIC(3,2) DEFAULT 0.5 CHECK (traffic_split BETWEEN 0 AND 1),

  start_date DATE NOT NULL,
  end_date DATE,

  -- Resultat
  total_predictions_a INTEGER DEFAULT 0,
  total_predictions_b INTEGER DEFAULT 0,
  mean_error_a NUMERIC(10,2),
  mean_error_b NUMERIC(10,2),
  user_satisfaction_a NUMERIC(5,4), -- andel 'fair' feedback
  user_satisfaction_b NUMERIC(5,4),

  -- Slutsats
  winner VARCHAR(50), -- 'model_a', 'model_b', 'inconclusive'
  confidence_level NUMERIC(5,4), -- statistisk säkerhet

  is_active BOOLEAN DEFAULT TRUE
);

-- Feature importance för modell-förklarbarhet
CREATE TABLE feature_importance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_version VARCHAR(50) NOT NULL,
  feature_name VARCHAR(100) NOT NULL,
  importance_score NUMERIC(8,6) NOT NULL,
  feature_type VARCHAR(50), -- 'categorical', 'numerical', 'derived'

  PRIMARY KEY (model_version, feature_name)
);

-- Aggregerade marknadsstatistik för baseline-modeller
CREATE TABLE market_baselines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  category VARCHAR(50) NOT NULL,
  region VARCHAR(50) NOT NULL,
  quarter INTEGER CHECK (quarter BETWEEN 1 AND 4),
  year INTEGER NOT NULL,

  -- Prisstatistik
  avg_price NUMERIC(10,2),
  median_price NUMERIC(10,2),
  min_price NUMERIC(10,2),
  max_price NUMERIC(10,2),
  std_dev NUMERIC(10,2),

  -- Per-area statistik
  avg_price_per_sqm NUMERIC(10,2),

  sample_count INTEGER NOT NULL,

  UNIQUE(category, region, quarter, year)
);

-- Views för analys

-- Senaste modellprestanda per kategori
CREATE VIEW latest_model_performance AS
SELECT
  category,
  COUNT(*) as sample_count,
  AVG(abs_prediction_error) as mean_abs_error,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY abs_prediction_error) as median_abs_error,
  AVG(relative_error) as mean_relative_error,
  COUNT(*) FILTER (WHERE user_feedback = 'fair') * 1.0 / COUNT(*) as satisfaction_rate
FROM ml_training_data
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY category;

-- Trendar över tid
CREATE VIEW error_trends AS
SELECT
  DATE_TRUNC('week', created_at) as week,
  category,
  AVG(abs_prediction_error) as avg_error,
  COUNT(*) as predictions
FROM ml_training_data
WHERE created_at > NOW() - INTERVAL '3 months'
GROUP BY DATE_TRUNC('week', created_at), category
ORDER BY week DESC;

-- Row Level Security (RLS) - bara för interna system
ALTER TABLE ml_training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_performance ENABLE ROW LEVEL SECURITY;

-- Grant permissions för service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Funktioner för tränings-pipeline

-- Funktion för att sätta training partition
CREATE OR REPLACE FUNCTION set_training_partitions()
RETURNS void AS $$
BEGIN
  -- 80% training, 10% validation, 10% test
  UPDATE ml_training_data
  SET training_partition = CASE
    WHEN random() < 0.8 THEN 'train'
    WHEN random() < 0.9 THEN 'validation'
    ELSE 'test'
  END
  WHERE training_partition = 'train'; -- endast uppdatera default värden
END;
$$ LANGUAGE plpgsql;

-- Trigger för att automatiskt beräkna baseline när ny data kommer
CREATE OR REPLACE FUNCTION update_market_baselines()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO market_baselines (
    category, region, quarter, year,
    avg_price, median_price, min_price, max_price, std_dev, sample_count
  )
  SELECT
    NEW.category,
    NEW.region,
    EXTRACT(QUARTER FROM NEW.created_at)::INTEGER,
    EXTRACT(YEAR FROM NEW.created_at)::INTEGER,
    AVG(actual_price),
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY actual_price),
    MIN(actual_price),
    MAX(actual_price),
    STDDEV(actual_price),
    COUNT(*)
  FROM ml_training_data
  WHERE category = NEW.category
    AND region = NEW.region
    AND EXTRACT(QUARTER FROM created_at) = EXTRACT(QUARTER FROM NEW.created_at)
    AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NEW.created_at)
  GROUP BY category, region, EXTRACT(QUARTER FROM created_at), EXTRACT(YEAR FROM created_at)
  ON CONFLICT (category, region, quarter, year)
  DO UPDATE SET
    avg_price = EXCLUDED.avg_price,
    median_price = EXCLUDED.median_price,
    min_price = EXCLUDED.min_price,
    max_price = EXCLUDED.max_price,
    std_dev = EXCLUDED.std_dev,
    sample_count = EXCLUDED.sample_count,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_baselines_trigger
  AFTER INSERT ON ml_training_data
  FOR EACH ROW EXECUTE FUNCTION update_market_baselines();