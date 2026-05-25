// Supabase Edge Function: Samlar feedback för ML-träning
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface FeedbackRequest {
  features: any; // MLFeatures från feature-extraction
  originalPrediction: number;
  userFeedback: 'too_low' | 'fair' | 'too_high';
  actualPrice?: number;
  wasAccepted?: boolean;
  sessionId?: string;
}

interface TrainingData {
  id?: string;
  created_at?: string;

  // Anonymiserade features
  category: string;
  region: string;
  estimated_area: number | null;
  room_count: number | null;
  complexity: string;
  seasonality: number;
  labor_intensity: number;
  material_quality: string;
  includes_design: boolean;
  includes_permits: boolean;
  price_complexity: number;
  has_unusual_terms: boolean;

  // Målvariabel
  actual_price: number;
  user_feedback: string;
  was_accepted: boolean | null;

  // Metadata
  original_prediction: number;
  prediction_error: number;
  data_hash: string;
  session_id: string | null;
}

// Rate limiting för feedback
const feedbackLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkFeedbackLimit(sessionId: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = feedbackLimitStore.get(sessionId);

  if (entry && entry.resetAt > now) {
    if (entry.count >= max) return false;
    entry.count++;
  } else {
    feedbackLimitStore.set(sessionId, { count: 1, resetAt: now + windowMs });
  }
  return true;
}

function generateDataHash(features: any): string {
  // Skapa hash från features för deduplicering
  const dataString = JSON.stringify({
    category: features.category,
    region: features.region,
    totalAmount: Math.round(features.totalAmount / 1000) * 1000, // Rundad för privacy
    estimatedArea: features.estimatedArea,
    complexity: features.complexity,
    materialQuality: features.materialQuality
  });

  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function anonymizeFeatures(features: any): Partial<TrainingData> {
  return {
    category: features.category,
    region: features.region,
    estimated_area: features.estimatedArea,
    room_count: features.roomCount,
    complexity: features.complexity,
    seasonality: features.seasonality,
    labor_intensity: Math.round(features.laborIntensity * 100) / 100,
    material_quality: features.materialQuality,
    includes_design: features.includesDesign || false,
    includes_permits: features.includesPermits || false,
    price_complexity: Math.round(features.priceComplexity * 100) / 100,
    has_unusual_terms: features.hasUnusualTerms || false
  };
}

async function saveTrainingData(supabase: any, trainingData: TrainingData): Promise<boolean> {
  try {
    // Kontrollera om vi redan har data med samma hash (undvik duplikater)
    const { data: existing } = await supabase
      .from('ml_training_data')
      .select('id')
      .eq('data_hash', trainingData.data_hash)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log('Duplicate training data detected, skipping');
      return true; // Inte ett fel, bara skippar duplicat
    }

    const { error } = await supabase
      .from('ml_training_data')
      .insert([trainingData]);

    if (error) {
      console.error('Database insert error:', error);
      return false;
    }

    console.log('Training data saved successfully');
    return true;

  } catch (error) {
    console.error('Failed to save training data:', error);
    return false;
  }
}

async function updateModelMetrics(supabase: any): Promise<void> {
  try {
    // Beräkna nya accuracy metrics baserat på senaste feedback
    const { data: recentFeedback } = await supabase
      .from('ml_training_data')
      .select('prediction_error, user_feedback')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // senaste 30 dagarna
      .not('prediction_error', 'is', null);

    if (recentFeedback && recentFeedback.length > 10) {
      const errors = recentFeedback.map((f: any) => Math.abs(f.prediction_error));
      const meanAbsoluteError = errors.reduce((a: number, b: number) => a + b, 0) / errors.length;

      const fairPredictions = recentFeedback.filter((f: any) => f.user_feedback === 'fair').length;
      const accuracyRate = fairPredictions / recentFeedback.length;

      // Spara metrics
      await supabase
        .from('model_performance')
        .insert([{
          model_version: 'current',
          mean_absolute_error: meanAbsoluteError,
          accuracy_rate: accuracyRate,
          sample_count: recentFeedback.length,
          calculation_date: new Date().toISOString()
        }]);
    }
  } catch (error) {
    console.warn('Failed to update model metrics:', error);
  }
}

// Main request handler
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  // Skapa Supabase-klient
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ error: "Supabase configuration missing" }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const feedbackData: FeedbackRequest = await req.json();

    // Validera input
    if (!feedbackData.features || !feedbackData.originalPrediction || !feedbackData.userFeedback) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    // Rate limiting baserat på session
    const sessionId = feedbackData.sessionId || 'anonymous';
    if (!checkFeedbackLimit(sessionId, 20, 60 * 60 * 1000)) { // Max 20 feedback per timme
      return new Response(
        JSON.stringify({ error: "Too many feedback submissions" }),
        { status: 429, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    // Beräkna faktiskt pris baserat på feedback
    let actualPrice = feedbackData.actualPrice;
    if (!actualPrice) {
      // Uppskatta baserat på användarfeedback
      const originalPrediction = feedbackData.originalPrediction;
      switch (feedbackData.userFeedback) {
        case 'too_low':
          actualPrice = originalPrediction * 1.2; // Uppskatta 20% högre
          break;
        case 'too_high':
          actualPrice = originalPrediction * 0.8; // Uppskatta 20% lägre
          break;
        case 'fair':
          actualPrice = originalPrediction;
          break;
      }
    }

    // Förbered träningsdata
    const dataHash = generateDataHash(feedbackData.features);
    const anonymizedFeatures = anonymizeFeatures(feedbackData.features);
    const predictionError = actualPrice - feedbackData.originalPrediction;

    const trainingData: TrainingData = {
      ...anonymizedFeatures,
      actual_price: actualPrice,
      user_feedback: feedbackData.userFeedback,
      was_accepted: feedbackData.wasAccepted || null,
      original_prediction: feedbackData.originalPrediction,
      prediction_error: predictionError,
      data_hash: dataHash,
      session_id: sessionId
    };

    // Spara till databas
    const success = await saveTrainingData(supabase, trainingData);

    if (!success) {
      return new Response(
        JSON.stringify({ error: "Failed to save feedback data" }),
        { status: 500, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    // Uppdatera modell-metrics i bakgrunden (utan att vänta)
    updateModelMetrics(supabase).catch(console.warn);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Feedback recorded successfully",
        dataPoints: await getTrainingDataCount(supabase)
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...cors } }
    );

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Feedback processing error:', error);

    return new Response(
      JSON.stringify({ error: "Failed to process feedback", details: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...cors } }
    );
  }
});

async function getTrainingDataCount(supabase: any): Promise<number> {
  try {
    const { count } = await supabase
      .from('ml_training_data')
      .select('*', { count: 'exact', head: true });

    return count || 0;
  } catch {
    return 0;
  }
}