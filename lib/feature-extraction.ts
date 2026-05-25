// Feature extraction från offerter för ML-pipeline
import type { SagaAnalysis } from '../app/page';

export interface MLFeatures {
  // Grundläggande
  category: string;
  region: string;
  totalAmount: number;
  includesVat: boolean;
  includesRot: boolean;

  // Strukturerade features
  estimatedArea: number | null;
  roomCount: number | null;
  complexity: 'low' | 'medium' | 'high';

  // Tidskontext
  seasonality: number; // 1-4 för Q1-Q4
  marketTrendFactor: number; // inflationsjustering

  // Företagsfaktorer (anonymiserade)
  companyAgeCategory: 'new' | 'established' | 'veteran';
  companyType: 'sole_proprietor' | 'limited' | 'unknown';

  // Line item analysis
  laborIntensity: number; // 0-1, andel arbetskostnad
  materialQuality: 'basic' | 'standard' | 'premium';
  includesDesign: boolean;
  includesPermits: boolean;

  // Riskfaktorer
  priceComplexity: number; // 0-1 baserat på antal rader
  hasUnusualTerms: boolean; // ovanliga villkor

  // Derived features för ML
  pricePerSqm: number | null;
  laborPerSqm: number | null;
  categoryPriceRatio: number; // vs marknadsmedeltal
}

export interface TrainingExample {
  features: MLFeatures;
  actualPrice: number;
  userFeedback?: 'too_low' | 'fair' | 'too_high';
  wasAccepted?: boolean;
  timestamp: string;
  dataHash: string; // för deduplicering
}

export class FeatureExtractor {
  private static readonly SEASONAL_FACTORS = {
    1: 0.95, // Q1 - lågssäsong
    2: 1.05, // Q2 - vårsäsong
    3: 1.0,  // Q3 - normalsäsong
    4: 1.1   // Q4 - högsäsong
  };

  private static readonly MARKET_BASELINES = {
    badrum: { low: 80000, high: 200000 },
    kök: { low: 50000, high: 150000 },
    målning: { low: 15000, high: 60000 },
    el: { low: 8000, high: 35000 },
    vvs: { low: 12000, high: 50000 }
  };

  static extractFeatures(
    analysis: SagaAnalysis,
    rawText?: string,
    imageMetadata?: { size: number; dimensions?: { width: number; height: number } }
  ): MLFeatures {
    const now = new Date();
    const quarter = Math.ceil((now.getMonth() + 1) / 3) as 1 | 2 | 3 | 4;

    return {
      // Grundläggande från Claude-analys
      category: this.normalizeCategory(analysis.quote.category),
      region: analysis.quote.region_guess || 'unknown',
      totalAmount: analysis.quote.total_amount,
      includesVat: analysis.quote.includes_vat ?? true, // Default: assume VAT included
      includesRot: analysis.quote.includes_rot ?? false, // Default: assume no ROT

      // Extrahera scope från beskrivningar
      estimatedArea: this.extractArea(analysis.line_items, rawText),
      roomCount: this.extractRoomCount(analysis.line_items, rawText),
      complexity: this.assessComplexity(analysis.line_items, analysis.missing_in_quote),

      // Tidskontext
      seasonality: quarter,
      marketTrendFactor: this.SEASONAL_FACTORS[quarter],

      // Företag (från Roaring data när tillgängligt)
      companyAgeCategory: this.categorizeCompanyAge(analysis.company.org_nr),
      companyType: this.inferCompanyType(analysis.company.org_nr),

      // Line item analysis
      laborIntensity: this.calculateLaborIntensity(analysis.line_items),
      materialQuality: this.assessMaterialQuality(analysis.line_items),
      includesDesign: this.checkForDesignWork(analysis.line_items),
      includesPermits: this.checkForPermits(analysis.line_items),

      // Risk factors
      priceComplexity: this.assessPriceComplexity(analysis.line_items),
      hasUnusualTerms: this.detectUnusualTerms(analysis.red_flags, analysis.yellow_flags),

      // Derived metrics
      pricePerSqm: this.calculatePricePerSqm(analysis.quote.total_amount, this.extractArea(analysis.line_items, rawText)),
      laborPerSqm: this.calculateLaborPerSqm(analysis.line_items, this.extractArea(analysis.line_items, rawText)),
      categoryPriceRatio: this.calculateCategoryRatio(analysis.quote.category, analysis.quote.total_amount)
    };
  }

  private static normalizeCategory(category: string): string {
    const normalized = category.toLowerCase();
    if (normalized.includes('badrum')) return 'badrum';
    if (normalized.includes('kök')) return 'kök';
    if (normalized.includes('målning')) return 'målning';
    if (normalized.includes('el')) return 'el';
    if (normalized.includes('vvs') || normalized.includes('rör')) return 'vvs';
    if (normalized.includes('golv')) return 'golv';
    if (normalized.includes('tak')) return 'tak';
    return 'övrigt';
  }

  private static extractArea(lineItems: any[], rawText?: string): number | null {
    // Leta efter kvm i line items
    for (const item of lineItems) {
      const desc = item.description?.toLowerCase() || '';
      const match = desc.match(/(\\d+(?:[,.]\\d+)?)\\s*(?:kvm|m²|m2|kvadratmeter)/);
      if (match) {
        return parseFloat(match[1].replace(',', '.'));
      }
    }

    // Leta i råtext om tillgänglig
    if (rawText) {
      const match = rawText.toLowerCase().match(/(\\d+(?:[,.]\\d+)?)\\s*(?:kvm|m²|m2|kvadratmeter)/);
      if (match) {
        return parseFloat(match[1].replace(',', '.'));
      }
    }

    return null;
  }

  private static extractRoomCount(lineItems: any[], rawText?: string): number | null {
    const roomKeywords = ['rum', 'sovrum', 'vardagsrum', 'kök', 'badrum', 'tvättstuga'];
    let roomCount = 0;

    for (const item of lineItems) {
      const desc = item.description?.toLowerCase() || '';
      for (const keyword of roomKeywords) {
        if (desc.includes(keyword)) {
          roomCount++;
          break; // Räkna bara en gång per line item
        }
      }
    }

    return roomCount > 0 ? roomCount : null;
  }

  private static assessComplexity(lineItems: any[], missingItems: string[]): 'low' | 'medium' | 'high' {
    const complexityScore = lineItems.length + (missingItems.length * 0.5);

    if (complexityScore < 5) return 'low';
    if (complexityScore < 15) return 'medium';
    return 'high';
  }

  private static categorizeCompanyAge(orgNr: string | null): 'new' | 'established' | 'veteran' {
    if (!orgNr) return 'unknown' as any;

    // Organisationsnummer format: YYYYMMDDXXXX
    const yearStr = orgNr.substring(0, 4);
    const year = parseInt(yearStr);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    if (age < 3) return 'new';
    if (age < 10) return 'established';
    return 'veteran';
  }

  private static inferCompanyType(orgNr: string | null): 'sole_proprietor' | 'limited' | 'unknown' {
    if (!orgNr) return 'unknown';

    // Förenklad logik: kontrollera sista siffran för företagsform
    const lastDigit = parseInt(orgNr.slice(-1));
    return lastDigit % 2 === 0 ? 'limited' : 'sole_proprietor';
  }

  private static calculateLaborIntensity(lineItems: any[]): number {
    const laborKeywords = ['arbete', 'montage', 'installation', 'timmar', 'personal'];
    let laborAmount = 0;
    let totalAmount = 0;

    for (const item of lineItems) {
      totalAmount += item.amount || 0;

      const desc = item.description?.toLowerCase() || '';
      if (laborKeywords.some(keyword => desc.includes(keyword)) || item.is_labor) {
        laborAmount += item.amount || 0;
      }
    }

    return totalAmount > 0 ? laborAmount / totalAmount : 0.5; // default 50%
  }

  private static assessMaterialQuality(lineItems: any[]): 'basic' | 'standard' | 'premium' {
    const premiumKeywords = ['premium', 'lux', 'design', 'märkes', 'high-end'];
    const basicKeywords = ['enkel', 'standard', 'billig', 'budget'];

    const descriptions = lineItems.map(item => item.description?.toLowerCase() || '').join(' ');

    if (premiumKeywords.some(keyword => descriptions.includes(keyword))) return 'premium';
    if (basicKeywords.some(keyword => descriptions.includes(keyword))) return 'basic';
    return 'standard';
  }

  private static checkForDesignWork(lineItems: any[]): boolean {
    const designKeywords = ['design', 'planering', 'ritning', 'arkitekt'];
    return lineItems.some(item =>
      designKeywords.some(keyword =>
        item.description?.toLowerCase().includes(keyword)
      )
    );
  }

  private static checkForPermits(lineItems: any[]): boolean {
    const permitKeywords = ['bygglov', 'tillstånd', 'ansökan', 'myndighetskontakt'];
    return lineItems.some(item =>
      permitKeywords.some(keyword =>
        item.description?.toLowerCase().includes(keyword)
      )
    );
  }

  private static assessPriceComplexity(lineItems: any[]): number {
    // Mer line items = mer komplexitet = mer osäkerhet
    return Math.min(lineItems.length / 20, 1); // Normaliserat till 0-1
  }

  private static detectUnusualTerms(redFlags: string[], yellowFlags: string[]): boolean {
    return redFlags.length > 2 || yellowFlags.length > 4;
  }

  private static calculatePricePerSqm(totalAmount: number, area: number | null): number | null {
    return area && area > 0 ? totalAmount / area : null;
  }

  private static calculateLaborPerSqm(lineItems: any[], area: number | null): number | null {
    if (!area || area <= 0) return null;

    const laborAmount = lineItems
      .filter(item => item.is_labor)
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    return laborAmount / area;
  }

  private static calculateCategoryRatio(category: string, amount: number): number {
    const normalizedCategory = this.normalizeCategory(category);
    const baseline = this.MARKET_BASELINES[normalizedCategory as keyof typeof this.MARKET_BASELINES];

    if (!baseline) return 1;

    const midpoint = (baseline.low + baseline.high) / 2;
    return amount / midpoint;
  }
}