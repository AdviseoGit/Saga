# ML Architecture för Saga Prismodell

## Övergripande Arkitektur

```
User Upload → Feature Extraction → Price Prediction → User Feedback → Model Training
     ↓              ↓                    ↓              ↓               ↓
  Raw Data    → Vector Store    →   Prediction   →  Correction   →  Retrain
```

## 1. Data Collection & Storage

### Database Schema (Supabase)
```sql
-- Offerter (anonymiserad data)
CREATE TABLE quotes_data (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),

  -- Features extraherade från offerten
  category VARCHAR(50),           -- "badrum", "kök", "målning" etc
  region VARCHAR(50),             -- "stockholm", "göteborg" etc
  total_amount NUMERIC,           -- faktisk totalsumma
  includes_vat BOOLEAN,
  includes_rot BOOLEAN,

  -- Detaljerade features
  line_items JSONB,              -- strukturerade radposter
  scope_features JSONB,          -- "area_sqm", "rooms", "complexity" etc
  market_context JSONB,          -- tidsperiod, säsong, marknadstrender

  -- ML features (beräknade)
  feature_vector VECTOR(512),    -- dense representation

  -- Feedback från användare
  user_verdict VARCHAR(20),      -- "too_high", "fair", "too_low"
  actual_price NUMERIC,          -- om användaren ger feedback
  was_accepted BOOLEAN,          -- antogs offerten?

  -- Privacy
  company_hash VARCHAR(64),      -- anonymiserad företagsidentifierare
  text_hash VARCHAR(64)          -- för deduplicering
);

-- Träningsresultat
CREATE TABLE model_versions (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  model_version VARCHAR(50),
  accuracy_metrics JSONB,       -- MAE, RMSE, per kategori
  training_data_count INTEGER,
  model_artifact_url TEXT       -- S3/Supabase storage
);
```

## 2. Feature Engineering Pipeline

### Extrahera strukturerade features från offerter
```typescript
interface QuoteFeatures {
  // Grundläggande
  category: string;
  region: string;
  totalAmount: number;

  // Scope features
  estimatedArea?: number;        // kvm extraherat från beskrivning
  roomCount?: number;
  complexity: 'low' | 'medium' | 'high';

  // Marknadskontext
  seasonality: number;           // 1-4 för kvartal
  marketTrend: number;          // inflation/deflation
  timeframe: number;            // leveranstid i veckor

  // Företagsfaktorer (anonymiserade)
  companySize: 'small' | 'medium' | 'large';
  companyExperience: number;    // år i branschen
  companyRating?: number;       // aggregerad rating

  // Detalj-features från line items
  laborIntensity: number;       // andel arbetskostnad
  materialQuality: 'basic' | 'premium';
  includesDesign: boolean;
  warrantyYears: number;
}
```

## 3. ML Model Architecture

### Hybrid Approach: Ensemble av modeller
```
Input Features → [Kategori-specifika modeller] → Ensemble → Final Prediction
                      ↓
              [Generell prismodell]
                      ↓
              [Trendanalys-modell]
```

### Model Stack:
1. **Category-Specific Models**: XGBoost för varje kategori (badrum, kök etc)
2. **General Price Model**: Neural network för generella prismönster
3. **Market Trend Model**: Time-series för säsongstrend
4. **Ensemble Model**: Viktat genomsnitt baserat på confidence

## 4. Training Pipeline

### Incremental Learning Architecture
```typescript
// Träning triggas när:
// - Ny data batch (100+ nya quotes)
// - Accuracy drop upptäcks
// - Månadsvis schema

interface TrainingPipeline {
  dataValidation: () => Promise<boolean>;
  featureEngineering: (rawData: Quote[]) => Promise<FeatureVector[]>;
  modelTraining: (features: FeatureVector[]) => Promise<ModelArtifact>;
  evaluation: (model: ModelArtifact) => Promise<Metrics>;
  deployment: (model: ModelArtifact) => Promise<void>;
}
```

### A/B Testing för modeller
```sql
-- Split traffic mellan modell-versioner
CREATE TABLE model_experiments (
  id UUID PRIMARY KEY,
  model_version_a VARCHAR(50),
  model_version_b VARCHAR(50),
  traffic_split NUMERIC DEFAULT 0.5,
  start_date DATE,
  end_date DATE,
  winner VARCHAR(50)          -- efter experiment
);
```