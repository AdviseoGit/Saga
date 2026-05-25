'use client';

import { useState } from 'react';
import { RailwayAPIClient } from '../lib/api-client';

interface MLFeedbackProps {
  analysis: any; // SagaAnalysis med ml_prediction
  features: any; // MLFeatures som användes
  onFeedbackSubmitted?: () => void;
}

export default function MLFeedback({ analysis, features, onFeedbackSubmitted }: MLFeedbackProps) {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<'too_low' | 'fair' | 'too_high' | null>(null);
  const [actualPrice, setActualPrice] = useState('');
  const [wasAccepted, setWasAccepted] = useState<boolean | null>(null);
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);

  if (!analysis.ml_prediction) {
    return null; // Visa bara feedback när ML användes
  }

  const handleFeedbackSubmit = async () => {
    if (!selectedFeedback) return;

    setIsSubmitting(true);

    try {
      const feedbackData = {
        features,
        originalPrediction: analysis.ml_prediction.predicted_price,
        userFeedback: selectedFeedback,
        actualPrice: actualPrice ? parseFloat(actualPrice.replace(/[\\s,]/g, '')) : undefined,
        wasAccepted,
        sessionId: `session_${Date.now()}` // Enkel session tracking
      };

      const { error } = await RailwayAPIClient.submitFeedback(feedbackData);

      if (error) {
        console.error('Feedback submission failed:', error);
        return;
      }

      setFeedbackSubmitted(true);
      onFeedbackSubmitted?.();

    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (feedbackSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Tack för din feedback! Detta hjälper oss förbättra Sagas prisanalys.
            </p>
            <p className="text-xs text-green-600 mt-1">
              Din data används anonymt för att träna våra modeller.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium text-blue-800">
            Hjälp Saga bli bättre på prisbedömningar
          </h4>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              AI-modellen uppskattar: <span className="font-semibold">
                {analysis.ml_prediction.predicted_price.toLocaleString('sv-SE')} kr
              </span>
              {' '}(säkerhet: {Math.round(analysis.ml_prediction.confidence_score * 100)}%)
            </p>
            <p className="mt-1">Vad tycker du om denna uppskattning?</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFeedback('too_low')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedFeedback === 'too_low'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              För låg uppskattning
            </button>
            <button
              onClick={() => setSelectedFeedback('fair')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedFeedback === 'fair'
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Bra uppskattning
            </button>
            <button
              onClick={() => setSelectedFeedback('too_high')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedFeedback === 'too_high'
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              För hög uppskattning
            </button>
          </div>

          {selectedFeedback && (
            <div className="mt-4">
              <button
                onClick={() => setShowDetailedFeedback(!showDetailedFeedback)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {showDetailedFeedback ? 'Mindre detaljer' : 'Lägg till mer information (valfritt)'}
              </button>
            </div>
          )}

          {showDetailedFeedback && selectedFeedback && (
            <div className="mt-4 space-y-4 p-3 bg-white rounded border border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Känner du till det faktiska priset? (valfritt)
                </label>
                <input
                  type="text"
                  value={actualPrice}
                  onChange={(e) => setActualPrice(e.target.value)}
                  placeholder="t.ex. 120 000"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Detta hjälper oss träna modellen mer noggrant
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Antog ni offerten?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="wasAccepted"
                      checked={wasAccepted === true}
                      onChange={() => setWasAccepted(true)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Ja</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="wasAccepted"
                      checked={wasAccepted === false}
                      onChange={() => setWasAccepted(false)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Nej</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {selectedFeedback && (
            <div className="mt-4">
              <button
                onClick={handleFeedbackSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Skickar...' : 'Skicka feedback'}
              </button>
            </div>
          )}

          <div className="mt-3 text-xs text-gray-500">
            <p>
              🔒 Din feedback sparas anonymt och används bara för att förbättra prismodeller.
              Inga personuppgifter eller företagsnamn sparas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}