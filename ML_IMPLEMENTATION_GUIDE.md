# 🧠 ML-Enhanced Saga: Implementation Guide

Detta är den fullständiga ML-arkitekturen för att förbättra prisprecisionen i Saga genom kontinuerlig inlärning från användarfeedback.

## 🎯 **Målsättning**

- **Förbättra prisprecision** med 40-60% jämfört med Claude-only approach
- **Kontinuerlig inlärning** från verklig användarfeedback
- **Transparent AI** med förklarbar prissättning
- **Svensk marknadsspecifik** modell som förstår byggbranschen

## 🏗️ **Arkitektur-översikt**

```
User Upload → Claude Analysis → Feature Extraction → ML Prediction → Hybrid Result
     ↓              ↓                ↓                  ↓              ↓
Raw Quote     Structured Data    ML Features      Price Estimate   Final Analysis
                    ↓                                    ↓
              User Feedback → Training Data → Periodic Retraining → Improved Models
```

## 📁 **Filstruktur**

```
saga/
├── lib/
│   ├── feature-extraction.ts      # Extraherar ML-features från Claude-resultat
│   └── ml-prediction.ts           # Frontend ML prediction service
├── components/
│   └── MLFeedback.tsx             # Feedback UI-komponent
├── supabase/
│   ├── functions/
│   │   ├── analyze-quote-enhanced/ # Hybrid Claude+ML analysis
│   │   ├── ml-predict/            # ML prediction edge function
│   │   └── ml-feedback/           # Feedback collection
│   └── migrations/
│       └── 001_ml_training_schema.sql # Database schema
└── scripts/
    └── train-ml-model.py          # Training pipeline
```

## 🚀 **Deployment Process**

### Steg 1: Database Migration

```bash
# Kör SQL migration för ML-tabeller
npx supabase db reset

# Eller manuellt:
psql -h <db-host> -U postgres -d postgres -f supabase/migrations/001_ml_training_schema.sql
```

### Steg 2: Deploya Edge Functions

```bash
# Deploya alla nya edge functions
npx supabase functions deploy ml-predict
npx supabase functions deploy ml-feedback
npx supabase functions deploy analyze-quote-enhanced

# Sätt environment variables i Supabase Dashboard:
# SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
```

### Steg 3: Frontend Integration

Modifiera `app/page.tsx` för att använda enhanced analysis:

```typescript
// I analyzeFile funktionen, ersätt:
const { data, error: fnError, response } = await supabase.functions.invoke("analyze-quote", {
  body: { ...body, mode: currentMode },
});

// Med:
const { data, error: fnError, response } = await supabase.functions.invoke("analyze-quote-enhanced", {
  body: { ...body, mode: currentMode },
});
```

Lägg till feedback-komponent i ResultBlock:

```tsx
import MLFeedback from '../components/MLFeedback';

// I ResultBlock komponenten:
{analysis.ml_prediction && (
  <MLFeedback
    analysis={analysis}
    features={analysis.ml_features_used}
    onFeedbackSubmitted={() => console.log('Feedback submitted!')}
  />
)}
```

### Steg 4: Training Pipeline Setup

```bash
# Installera Python dependencies
pip install supabase scikit-learn pandas numpy xgboost matplotlib seaborn

# Sätt environment variables
export SUPABASE_URL="https://lhontageceandzgcyurq.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Kör träning (efter att ha samlat tillräckligt med data)
python scripts/train-ml-model.py
```

## 📊 **Data Flow Detailed**

### 1. **Initial Analysis (Hybrid)**
- User uploadar offert → Claude extraherar strukturerad data
- Features extraheras från Claude-resultat
- ML-modell ger prisprediktion
- Hybrid resultat kombinerar bästa från båda

### 2. **Feature Engineering**
```typescript
// Från Claude-resultat extraheras:
{
  category: 'badrum',           // Normalized kategori
  region: 'stockholm',          // Geografisk justering
  estimatedArea: 25,            // kvm från beskrivning
  complexity: 'medium',         // Baserat på antal line items
  laborIntensity: 0.7,          // Andel arbetskostnad
  materialQuality: 'premium',   // Från keywords i beskrivning
  seasonality: 2,               // Q2 = vårsäsong
  // ... +15 andra features
}
```

### 3. **ML Prediction Process**
```
Features → [Neural Network] → Prediction (80% confidence)
        → [XGBoost Backup] → Fallback if low confidence
        → [Statistical Baseline] → Final fallback
```

### 4. **Continuous Learning**
- User ger feedback: "too_high", "fair", "too_low"
- Optionellt: faktisk slutpris, om offert antogs
- Data anonymiseras och sparas för träning
- Veckovis omträning när tillräckligt med ny data

## 🎯 **Performance Targets**

### Baseline (Claude only)
- **Accuracy inom 20%**: ~65%
- **Mean Absolute Error**: ~45,000 kr
- **User satisfaction**: ~72%

### ML-Enhanced Targets
- **Accuracy inom 20%**: >85%
- **Mean Absolute Error**: <25,000 kr
- **User satisfaction**: >90%

### Kategori-specifika mål:
```
Badrum: ±15% accuracy (högt värde, viktig precision)
Kök: ±20% accuracy (mycket variation)
Målning: ±10% accuracy (standardiserat)
El/VVS: ±15% accuracy (reglerat, förutsägbart)
```

## 📈 **Monitoring & Metrics**

### Real-time Dashboards (Supabase)
```sql
-- Modellprestanda över tid
SELECT
  DATE_TRUNC('week', created_at) as week,
  AVG(abs_prediction_error) as avg_error,
  COUNT(*) FILTER (WHERE user_feedback = 'fair') * 1.0 / COUNT(*) as satisfaction
FROM ml_training_data
WHERE created_at > NOW() - INTERVAL '3 months'
GROUP BY week;

-- Per-kategori accuracy
SELECT
  category,
  COUNT(*) as samples,
  AVG(relative_error) as avg_relative_error,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY relative_error) as median_error
FROM ml_training_data
GROUP BY category;
```

### Alerts & Thresholds
- **Model drift**: Om accuracy sjunker >10% från baseline
- **Data quality**: Om >30% saknade features
- **Feedback rate**: Om <20% users ger feedback

## 🔄 **Training Schedule**

### Phase 1: Bootstrap (0-100 samples)
- **Frequency**: Manuell triggering
- **Model**: Statistical baseline + Claude
- **Goal**: Samla initial dataset

### Phase 2: Early Learning (100-500 samples)
- **Frequency**: Bi-weekly retraining
- **Model**: Simple XGBoost + ensemble
- **Goal**: Etablera grundläggande patterns

### Phase 3: Mature Model (500+ samples)
- **Frequency**: Weekly automated retraining
- **Model**: Deep ensemble (Neural + XGBoost + Linear)
- **Goal**: Fine-tuned svensk marknadsspecifik modell

## 🛡️ **Privacy & Security**

### Data Anonymization
```typescript
// Sparar ALDRIG:
- Företagsnamn eller kontaktuppgifter
- Exakta adresser (bara region)
- Kund-identifierande information
- Offert-text eller bilder

// Sparar BARA:
- Anonymiserade features (kategori, area, etc.)
- Priser (rundade till närmaste 1000)
- Aggregerad feedback
- Hash för deduplicering
```

### GDPR Compliance
- **Lawful basis**: Legitimate interest (förbättra tjänst)
- **Data retention**: Max 2 år för träningsdata
- **User rights**: Opt-out från feedback tracking
- **Anonymization**: Ingen re-identifiering möjlig

## 🧪 **A/B Testing Framework**

### Experiment Setup
```sql
INSERT INTO model_experiments (
  experiment_name,
  model_version_a,      -- 'claude_baseline'
  model_version_b,      -- 'ml_enhanced_v1.2'
  traffic_split,        -- 0.5 (50/50 split)
  start_date,
  end_date
) VALUES (...);
```

### Success Metrics
- **Primary**: User satisfaction (% "fair" feedback)
- **Secondary**: Engagement (feedback submission rate)
- **Technical**: Prediction accuracy, response time

## 🎓 **Learning & Iteration**

### Week 1-4: Data Collection
- Deploy basic ML pipeline
- Focus på feedback UI/UX
- Monitor data quality

### Month 2-3: Model Improvement
- Experiment med feature engineering
- A/B test different algorithms
- Optimize för svensk byggmarknad

### Month 4+: Advanced Features
- Seasonal trend prediction
- Company-specific adjustments (anonymized)
- Market condition integration (inflation, etc.)

## 🎉 **Expected Business Impact**

### User Experience
- **Faster decisions**: Mer precisa analyser
- **Higher confidence**: Tydligare reasoning
- **Better negotiations**: Data-driven arguments

### Product Quality
- **Competitive advantage**: Bästa AI för svenska marknaden
- **Network effects**: Bättre data → bättre modell → fler users
- **Brand trust**: Transparent, accurate pricing

### Revenue Potential
- **Premium features**: Avancerad analys för professionella
- **B2B expansion**: Enterpri-se modell för byggföretag
- **Data insights**: Marknadsrapporter baserat på aggregerad data

---

## 🚀 **Getting Started**

1. **Deploy infrastructure** (Steg 1-2 ovan)
2. **Start collecting data** (deploy med Claude fallback)
3. **Iterate weekly** baserat på feedback och performance
4. **Scale gradually** när confidence växer

Denna ML-arkitektur förvandlar Saga från en statisk AI-tool till ett självförbättrande system som blir bättre för varje användare! 🎯