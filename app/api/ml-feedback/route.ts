// Next.js API Route: ML Feedback Collection för träningsdata
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface FeedbackRequest {
  features: any; // MLFeatures
  originalPrediction: number;
  userFeedback: 'too_low' | 'fair' | 'too_high';
  actualPrice?: number;
  wasAccepted?: boolean;
  sessionId?: string;
}

interface TrainingData {
  id?: string;
  created_at?: string;
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
  actual_price: number;
  user_feedback: string;
  was_accepted: boolean | null;
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

function anonymizeFeatures(features: any): Omit<TrainingData, 'id' | 'created_at' | 'actual_price' | 'user_feedback' | 'was_accepted' | 'original_prediction' | 'prediction_error' | 'data_hash' | 'session_id'> {
  return {
    category: features.category || 'unknown',
    region: features.region || 'unknown',
    estimated_area: features.estimatedArea || null,
    room_count: features.roomCount || null,
    complexity: features.complexity || 'medium',
    seasonality: features.seasonality || 1,
    labor_intensity: Math.round((features.laborIntensity || 0.5) * 100) / 100,
    material_quality: features.materialQuality || 'standard',
    includes_design: features.includesDesign || false,
    includes_permits: features.includesPermits || false,
    price_complexity: Math.round((features.priceComplexity || 0) * 100) / 100,
    has_unusual_terms: features.hasUnusualTerms || false
  };
}

async function saveTrainingData(trainingData: TrainingData): Promise<boolean> {
  // Om Supabase är tillgängligt, spara till databas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Kontrollera dubbletter
      const { data: existing } = await supabase
        .from('ml_training_data')
        .select('id')
        .eq('data_hash', trainingData.data_hash)
        .limit(1);

      if (existing && existing.length > 0) {
        console.log('Duplicate training data detected, skipping');
        return true;
      }

      const { error } = await supabase
        .from('ml_training_data')
        .insert([trainingData]);

      if (error) {
        console.error('Database insert error:', error);
        return false;
      }

      console.log('Training data saved to Supabase');
      return true;

    } catch (error) {
      console.error('Failed to save to Supabase:', error);
    }
  }

  // Fallback: spara lokalt eller till annat system
  try {
    // I Railway kan vi spara till lokal fil eller databas
    console.log('Training data collected:', trainingData);
    // TODO: Implementera lokal storage eller annat persistent lager
    return true;
  } catch (error) {
    console.error('Failed to save training data:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const feedbackData: FeedbackRequest = await request.json();

    // Validera input
    if (!feedbackData.features || !feedbackData.originalPrediction || !feedbackData.userFeedback) {
      return NextResponse.json(
        { error: "Missing required fields" },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Rate limiting baserat på session
    const sessionId = feedbackData.sessionId || 'anonymous';
    if (!checkFeedbackLimit(sessionId, 20, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many feedback submissions" },
        {
          status: 429,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Beräkna faktiskt pris baserat på feedback
    let actualPrice = feedbackData.actualPrice;
    if (!actualPrice) {
      const originalPrediction = feedbackData.originalPrediction;
      switch (feedbackData.userFeedback) {
        case 'too_low':
          actualPrice = originalPrediction * 1.2;
          break;
        case 'too_high':
          actualPrice = originalPrediction * 0.8;
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

    // Spara träningsdata
    const success = await saveTrainingData(trainingData);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to save feedback data" },
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback recorded successfully",
      dataPoints: 'saved' // I produktion: räkna faktiska datapunkter
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    console.error('Feedback processing error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to process feedback", details: message },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}