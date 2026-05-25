// ML-driven prisprediktion för svenska byggmarknaden
import type { MLFeatures, TrainingExample } from './feature-extraction';

export interface PredictionResult {
  predictedPrice: number;
  confidenceScore: number; // 0-1
  priceRange: { low: number; high: number };
  methodology: 'ml_model' | 'claude_baseline' | 'hybrid';
  modelVersion?: string;
  factors: {
    categoryAverage: number;
    regionAdjustment: number;
    seasonalityFactor: number;
    complexityPenalty: number;
  };
}

export interface ModelPerformance {
  meanAbsoluteError: number;
  rootMeanSquaredError: number;
  accuracyWithin10Percent: number;
  sampleCount: number;
  lastTraining: string;
}

export class MLPredictionService {
  private static readonly MODEL_ENDPOINT = 'https://your-model-api.com'; // eller Supabase function
  private static readonly CONFIDENCE_THRESHOLD = 0.7;

  // Fallback-modell baserad på historisk data
  private static readonly CATEGORY_BASELINES = {
    badrum: {
      basePrice: 120000,
      pricePerSqm: 15000,
      laborIntensityFactor: 1.2,
      seasonalVariance: 0.15
    },
    kök: {
      basePrice: 80000,
      pricePerSqm: 8000,
      laborIntensityFactor: 1.1,
      seasonalVariance: 0.1
    },
    målning: {
      basePrice: 25000,
      pricePerSqm: 500,
      laborIntensityFactor: 1.5,
      seasonalVariance: 0.2
    },
    el: {
      basePrice: 15000,
      pricePerSqm: 1200,
      laborIntensityFactor: 1.3,
      seasonalVariance: 0.05
    },
    vvs: {
      basePrice: 20000,
      pricePerSqm: 2000,
      laborIntensityFactor: 1.4,
      seasonalVariance: 0.1
    }
  };

  private static readonly REGION_MULTIPLIERS = {
    stockholm: 1.25,
    göteborg: 1.1,
    malmö: 1.05,
    uppsala: 1.08,
    västerås: 1.0,
    örebro: 0.95,
    linköping: 0.98,
    helsingborg: 1.02,
    jönköping: 0.93,
    norrköping: 0.95,
    lund: 1.08,
    sundsvall: 0.9,
    gävle: 0.88,
    borås: 0.92,
    eskilstuna: 0.9
  };

  /**
   * Huvudsaklig prediktionsmetod som kombinerar ML-modell med fallbacks
   */
  static async predict(features: MLFeatures): Promise<PredictionResult> {
    try {
      // Försök med tränad ML-modell först
      const mlResult = await this.predictWithMLModel(features);

      if (mlResult && mlResult.confidenceScore >= this.CONFIDENCE_THRESHOLD) {
        return {
          ...mlResult,
          methodology: 'ml_model'
        };
      }

      // Fallback: hybrid approach
      const baselineResult = this.predictWithBaseline(features);

      if (mlResult) {
        // Kombinera ML-prediktering med baseline
        return this.hybridPrediction(mlResult, baselineResult, features);
      }

      return {
        ...baselineResult,
        methodology: 'claude_baseline'
      };

    } catch (error) {
      console.warn('ML prediction failed, using baseline:', error);
      return this.predictWithBaseline(features);
    }
  }

  /**
   * Anropar tränad ML-modell (via Supabase Edge Function eller extern API)
   */
  private static async predictWithMLModel(features: MLFeatures): Promise<PredictionResult | null> {
    try {
      const response = await fetch('/api/ml-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features })
      });

      if (!response.ok) {
        throw new Error(`ML API error: ${response.status}`);
      }

      const result = await response.json();
      return result.prediction;

    } catch (error) {
      console.warn('ML model unavailable:', error);
      return null;
    }
  }

  /**
   * Regelbaserad prismodell som fallback
   */
  private static predictWithBaseline(features: MLFeatures): PredictionResult {
    const category = features.category as keyof typeof this.CATEGORY_BASELINES;
    const baseline = this.CATEGORY_BASELINES[category] || this.CATEGORY_BASELINES.badrum;

    // Grundpris baserat på kategori och area
    let basePrice = baseline.basePrice;
    if (features.estimatedArea && features.estimatedArea > 0) {
      basePrice = features.estimatedArea * baseline.pricePerSqm;
    }

    // Regionsjustering
    const regionKey = features.region.toLowerCase() as keyof typeof this.REGION_MULTIPLIERS;
    const regionMultiplier = this.REGION_MULTIPLIERS[regionKey] || 1.0;

    // Säsongsjustering
    const seasonalMultiplier = features.marketTrendFactor;

    // Komplexitetsjustering
    const complexityMultiplier = this.getComplexityMultiplier(features.complexity);

    // Kvalitetsjustering
    const qualityMultiplier = this.getQualityMultiplier(features.materialQuality);

    // Arbetstäthetsjustering
    const laborMultiplier = 1 + (features.laborIntensity - 0.5) * baseline.laborIntensityFactor;

    const adjustedPrice = basePrice *
                         regionMultiplier *
                         seasonalMultiplier *
                         complexityMultiplier *
                         qualityMultiplier *
                         laborMultiplier;

    // Beräkna konfidensintervall
    const variance = baseline.seasonalVariance;
    const confidenceRange = adjustedPrice * variance;

    return {
      predictedPrice: Math.round(adjustedPrice),
      confidenceScore: 0.6, // Lägre än ML-modell
      priceRange: {
        low: Math.round(adjustedPrice - confidenceRange),
        high: Math.round(adjustedPrice + confidenceRange)
      },
      methodology: 'claude_baseline',
      factors: {
        categoryAverage: basePrice,
        regionAdjustment: regionMultiplier,
        seasonalityFactor: seasonalMultiplier,
        complexityPenalty: complexityMultiplier
      }
    };
  }

  /**
   * Kombinerar ML-resultat med baseline för hybrid-approach
   */
  private static hybridPrediction(
    mlResult: PredictionResult,
    baselineResult: PredictionResult,
    features: MLFeatures
  ): PredictionResult {
    const mlWeight = mlResult.confidenceScore;
    const baselineWeight = 1 - mlWeight;

    const hybridPrice = (mlResult.predictedPrice * mlWeight) +
                       (baselineResult.predictedPrice * baselineWeight);

    const hybridRange = {
      low: Math.min(mlResult.priceRange.low, baselineResult.priceRange.low),
      high: Math.max(mlResult.priceRange.high, baselineResult.priceRange.high)
    };

    return {
      predictedPrice: Math.round(hybridPrice),
      confidenceScore: (mlResult.confidenceScore + baselineResult.confidenceScore) / 2,
      priceRange: hybridRange,
      methodology: 'hybrid',
      modelVersion: mlResult.modelVersion,
      factors: baselineResult.factors
    };
  }

  private static getComplexityMultiplier(complexity: 'low' | 'medium' | 'high'): number {
    switch (complexity) {
      case 'low': return 0.9;
      case 'medium': return 1.0;
      case 'high': return 1.2;
      default: return 1.0;
    }
  }

  private static getQualityMultiplier(quality: 'basic' | 'standard' | 'premium'): number {
    switch (quality) {
      case 'basic': return 0.85;
      case 'standard': return 1.0;
      case 'premium': return 1.3;
      default: return 1.0;
    }
  }

  /**
   * Spara användarfeedback för framtida träning
   */
  static async recordFeedback(
    features: MLFeatures,
    originalPrediction: number,
    userFeedback: 'too_low' | 'fair' | 'too_high',
    actualPrice?: number
  ): Promise<void> {
    const trainingExample: TrainingExample = {
      features,
      actualPrice: actualPrice || originalPrediction,
      userFeedback,
      timestamp: new Date().toISOString(),
      dataHash: this.generateDataHash(features)
    };

    try {
      await fetch('/api/ml-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainingExample)
      });
    } catch (error) {
      console.warn('Failed to record feedback:', error);
    }
  }

  /**
   * Hämta modellprestanda-statistik
   */
  static async getModelPerformance(): Promise<ModelPerformance | null> {
    try {
      const response = await fetch('/api/ml-performance');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Could not fetch model performance:', error);
    }
    return null;
  }

  private static generateDataHash(features: MLFeatures): string {
    const dataString = JSON.stringify(features);
    // Enkel hash-funktion (i produktion: använd crypto)
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }
}