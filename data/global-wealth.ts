// Global Wealth Distribution Data (2024)
// Source: Credit Suisse Global Wealth Report, UBS Wealth Report
// All values in USD

export interface WealthPercentile {
  percentile: number;
  minWealth: number;
  label?: string;
}

// Global wealth distribution percentiles (in USD)
// Updated based on 2024 Credit Suisse/UBS Global Wealth Report
// Note: Global wealth is highly concentrated at the top
export const globalWealthPercentiles: WealthPercentile[] = [
  { percentile: 99.99, minWealth: 50000000, label: "Ultra High Net Worth" },  // $50M+
  { percentile: 99.9, minWealth: 10000000, label: "Very High Net Worth" },   // $10M+
  { percentile: 99.5, minWealth: 5000000, label: "High Net Worth" },         // $5M+
  { percentile: 99, minWealth: 1000000, label: "Millionaire" },              // $1M+ (상위 1%)
  { percentile: 98, minWealth: 690000 },                                     // $690K
  { percentile: 95, minWealth: 380000 },                                     // $380K
  { percentile: 90, minWealth: 180000 },                                     // $180K (상위 10%)
  { percentile: 80, minWealth: 95000 },                                      // $95K
  { percentile: 70, minWealth: 48000 },                                      // $48K
  { percentile: 60, minWealth: 25000 },                                      // $25K
  { percentile: 50, minWealth: 12500 },                                      // $12.5K (중위값)
  { percentile: 40, minWealth: 6000 },                                       // $6K
  { percentile: 30, minWealth: 2800 },                                       // $2.8K
  { percentile: 20, minWealth: 1200 },                                       // $1.2K
  { percentile: 10, minWealth: 400 },                                        // $400
  { percentile: 5, minWealth: 100 },                                         // $100
  { percentile: 1, minWealth: 10 }                                          // $10
];

// Regional wealth data for comparison
export const regionalWealthData = {
  "North America": {
    median: 112000,
    mean: 551000,
    top10Percent: 1930000,
    top1Percent: 15800000
  },
  "Europe": {
    median: 61000,
    mean: 227000,
    top10Percent: 878000,
    top1Percent: 5200000
  },
  "Asia-Pacific": {
    median: 13000,
    mean: 67000,
    top10Percent: 283000,
    top1Percent: 2100000
  },
  "China": {
    median: 30000,
    mean: 75000,
    top10Percent: 296000,
    top1Percent: 1960000
  },
  "Latin America": {
    median: 8900,
    mean: 42000,
    top10Percent: 195000,
    top1Percent: 1230000
  },
  "Africa": {
    median: 2200,
    mean: 11000,
    top10Percent: 54000,
    top1Percent: 368000
  }
};

// Age group wealth distribution (Global average)
export const ageGroupWealth = {
  "20-29": { median: 7500, mean: 28000 },
  "30-39": { median: 35000, mean: 110000 },
  "40-49": { median: 78000, mean: 256000 },
  "50-59": { median: 134000, mean: 420000 },
  "60-69": { median: 178000, mean: 490000 },
  "70+": { median: 186000, mean: 468000 }
};

// Wealth calculation utilities
export function calculateWealthPercentile(wealthUSD: number): number {
  // If wealth is above the highest bracket ($43M)
  if (wealthUSD >= globalWealthPercentiles[0].minWealth) {
    // Cap at 99.99% for ultra wealthy
    const ratio = Math.min(wealthUSD / globalWealthPercentiles[0].minWealth, 10);
    return Math.min(99.99, 99.9 + 0.09 * Math.log10(ratio));
  }

  // Find the appropriate percentile bracket
  for (let i = 0; i < globalWealthPercentiles.length - 1; i++) {
    const higherBracket = globalWealthPercentiles[i];
    const lowerBracket = globalWealthPercentiles[i + 1];

    if (wealthUSD >= lowerBracket.minWealth && wealthUSD < higherBracket.minWealth) {
      // Linear interpolation between brackets
      const ratio = (wealthUSD - lowerBracket.minWealth) / (higherBracket.minWealth - lowerBracket.minWealth);
      return lowerBracket.percentile + ratio * (higherBracket.percentile - lowerBracket.percentile);
    }
  }

  // Below minimum threshold
  const lowestBracket = globalWealthPercentiles[globalWealthPercentiles.length - 1];
  if (wealthUSD < lowestBracket.minWealth) {
    // For very low wealth, scale from 0.01% to 1%
    return Math.max(0.01, (wealthUSD / lowestBracket.minWealth) * lowestBracket.percentile);
  }

  // Default (shouldn't reach here)
  return 50;
}

export function getWealthLabel(percentile: number): string {
  if (percentile >= 99.9) return "Ultra High Net Worth (0.1%)";
  if (percentile >= 99.5) return "Very High Net Worth (0.5%)";
  if (percentile >= 99) return "High Net Worth (1%)";
  if (percentile >= 95) return "상위 5%";
  if (percentile >= 90) return "상위 10%";
  if (percentile >= 75) return "중상위층";
  if (percentile >= 50) return "중산층";
  if (percentile >= 25) return "중하위층";
  return "하위층";
}

export function formatWealth(amount: number): string {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}