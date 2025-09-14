import koreaData from '@/data/korea-income-percentile.json';
import usData from '@/data/us-income-percentile.json';
import { IncomeDataset, CalculationResult, Country } from '@/types/income';

/**
 * 선형 보간법을 사용하여 정확한 퍼센타일 계산
 */
function interpolatePercentile(income: number, data: IncomeDataset): number {
  const percentiles = data.percentiles;

  // 최소값보다 작은 경우
  if (income <= percentiles[0].income) {
    return percentiles[0].percentile;
  }

  // 최대값보다 큰 경우 (최상위 제외)
  if (income >= percentiles[percentiles.length - 2].income) {
    return percentiles[percentiles.length - 2].percentile;
  }

  // 선형 보간
  for (let i = 0; i < percentiles.length - 1; i++) {
    if (income >= percentiles[i].income && income <= percentiles[i + 1].income) {
      const x1 = percentiles[i].income;
      const x2 = percentiles[i + 1].income;
      const y1 = percentiles[i].percentile;
      const y2 = percentiles[i + 1].percentile;

      // 선형 보간 공식: y = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
      const percentile = y1 + ((income - x1) * (y2 - y1)) / (x2 - x1);
      return Math.round(percentile * 10) / 10; // 소수점 1자리로 반올림
    }
  }

  return 50; // 기본값 (이론상 도달하지 않음)
}

/**
 * 소득 그룹 찾기
 */
function findIncomeGroup(income: number, data: IncomeDataset): string {
  for (const [, group] of Object.entries(data.incomeGroups)) {
    const [min, max] = group.range;
    if (income >= min && (max === null || max === undefined || income < max)) {
      return group.label;
    }
  }
  return '분류 없음';
}

/**
 * 한국 소득 퍼센타일 계산
 */
export function calculateKoreaPercentile(income: number): CalculationResult {
  const data = koreaData as IncomeDataset;
  const incomeInManwon = income; // 입력은 만원 단위

  const percentile = interpolatePercentile(incomeInManwon, data);
  const higherThan = 100 - percentile;
  const lowerThan = percentile;

  // 적절한 라벨 찾기
  let label = `상위 ${higherThan.toFixed(1)}%`;
  if (percentile === 50) label = '정확히 중위값';
  else if (percentile < 50) label = `하위 ${percentile.toFixed(1)}%`;

  // 예상 순위 계산 (한국 전체 인구 약 5200만명 기준)
  const totalPopulation = 52000000;
  const rank = Math.round((higherThan / 100) * totalPopulation);

  return {
    country: 'korea',
    income: incomeInManwon,
    percentile,
    label,
    higherThan,
    lowerThan,
    rank,
    incomeGroup: findIncomeGroup(incomeInManwon, data),
    statistics: {
      average: data.statistics.averageIncome,
      median: data.statistics.medianIncome,
      currency: 'KRW'
    }
  };
}

/**
 * 미국 소득 퍼센타일 계산
 */
export function calculateUSPercentile(income: number): CalculationResult {
  const data = usData as IncomeDataset;

  const percentile = interpolatePercentile(income, data);
  const higherThan = 100 - percentile;
  const lowerThan = percentile;

  // 적절한 라벨 찾기
  let label = `Top ${higherThan.toFixed(1)}%`;
  if (percentile === 50) label = 'Exactly Median';
  else if (percentile < 50) label = `Bottom ${percentile.toFixed(1)}%`;

  // 예상 순위 계산 (미국 전체 인구 약 3.3억명 기준)
  const totalPopulation = 330000000;
  const rank = Math.round((higherThan / 100) * totalPopulation);

  return {
    country: 'us',
    income,
    percentile,
    label,
    higherThan,
    lowerThan,
    rank,
    incomeGroup: findIncomeGroup(income, data),
    statistics: {
      average: data.statistics.averageIncome,
      median: data.statistics.medianIncome,
      currency: 'USD'
    }
  };
}

/**
 * 통합 계산 함수
 */
export function calculatePercentile(
  income: number,
  country: Country
): CalculationResult {
  if (country === 'korea') {
    return calculateKoreaPercentile(income);
  } else {
    return calculateUSPercentile(income);
  }
}

/**
 * 목표 퍼센타일에 필요한 소득 계산
 */
export function getIncomeForPercentile(
  targetPercentile: number,
  country: Country
): number {
  const data = country === 'korea' ? koreaData : usData;
  const percentiles = data.percentiles;

  // 정확한 매치 찾기
  const exactMatch = percentiles.find(p => p.percentile === targetPercentile);
  if (exactMatch) {
    return exactMatch.income;
  }

  // 보간으로 계산
  for (let i = 0; i < percentiles.length - 1; i++) {
    if (targetPercentile >= percentiles[i].percentile &&
        targetPercentile <= percentiles[i + 1].percentile) {
      const x1 = percentiles[i].percentile;
      const x2 = percentiles[i + 1].percentile;
      const y1 = percentiles[i].income;
      const y2 = percentiles[i + 1].income;

      const income = y1 + ((targetPercentile - x1) * (y2 - y1)) / (x2 - x1);
      return Math.round(income);
    }
  }

  return 0;
}

/**
 * 비교 분석
 */
export function compareIncome(income: number, fromCountry: Country, toCountry: Country) {
  const fromResult = calculatePercentile(income, fromCountry);
  const targetIncome = getIncomeForPercentile(fromResult.percentile, toCountry);
  const toResult = calculatePercentile(targetIncome, toCountry);

  return {
    from: fromResult,
    to: toResult,
    equivalentIncome: targetIncome,
    message: `${fromCountry === 'korea' ? '한국' : '미국'}에서 ${
      fromCountry === 'korea' ? `${income.toLocaleString()}만원` : `$${income.toLocaleString()}`
    }은 ${toCountry === 'korea' ? '한국' : '미국'}의 ${
      toCountry === 'korea' ? `${targetIncome.toLocaleString()}만원` : `$${targetIncome.toLocaleString()}`
    }과 같은 소득 수준입니다.`
  };
}