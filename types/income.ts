export interface PercentileData {
  percentile: number;
  income: number;
  label: string;
}

export interface IncomeGroup {
  range: [number, number | null];
  label: string;
  percentage: number;
}

export interface IncomeStatistics {
  totalWorkers: number;
  averageIncome: number;
  medianIncome: number;
  giniCoefficient: number;
}

export interface IncomeDataset {
  metadata: {
    source: string;
    year: number;
    lastUpdated: string;
    currency: 'KRW' | 'USD';
    unit: string;
    description: string;
  };
  percentiles: PercentileData[];
  statistics: IncomeStatistics;
  incomeGroups: Record<string, IncomeGroup>;
  householdPercentiles?: Record<string, number>;
}

export type Country = 'korea' | 'us';

export interface CalculationResult {
  country: Country;
  income: number;
  percentile: number;
  label: string;
  higherThan: number; // 상위 몇 %
  lowerThan: number; // 하위 몇 %
  incomeGroup: string;
  statistics: {
    average: number;
    median: number;
    currency: string;
  };
}