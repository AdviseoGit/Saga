// API Client för Railway deployment - ersätter Supabase functions
type APIResponse<T> = {
  data?: T;
  error?: string;
  details?: string;
}

interface AnalyzeRequestBody {
  imageBase64?: string;
  mediaType?: string;
  pdfText?: string;
  mode?: "quote" | "invoice";
}

interface VerifyRequestBody {
  org_nr: string;
}

export class RailwayAPIClient {
  private static baseUrl = process.env.NODE_ENV === 'production'
    ? (process.env.NEXT_PUBLIC_API_URL || 'https://fragasaga.se')
    : '';

  static async analyzeQuote(body: AnalyzeRequestBody): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze-quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Analysis failed', details: data.details };
      }

      return { data };

    } catch (error) {
      console.error('API call failed:', error);
      return { error: 'Network error - kunde inte nå servern' };
    }
  }

  static async verifyCompany(body: VerifyRequestBody): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/verify-company`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Verification failed', details: data.message };
      }

      return { data };

    } catch (error) {
      console.error('Company verification failed:', error);
      return { error: 'Network error - kunde inte verifiera företaget' };
    }
  }

  static async submitFeedback(feedbackData: any): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ml-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData)
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Feedback submission failed' };
      }

      return { data };

    } catch (error) {
      console.error('Feedback submission failed:', error);
      return { error: 'Network error' };
    }
  }

  static async getMLPrediction(features: any): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ml-predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'ML prediction failed' };
      }

      return { data };

    } catch (error) {
      console.error('ML prediction failed:', error);
      return { error: 'Network error' };
    }
  }
}