import koreaData from '@/data/korea-income-percentile.json';
import usData from '@/data/us-income-percentile.json';
import { IncomeDataset } from '@/types/income';

export function validateDataIntegrity(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 한국 데이터 검증
  try {
    const korea = koreaData as IncomeDataset;

    // 1. 퍼센타일이 순차적으로 증가하는지 확인
    for (let i = 1; i < korea.percentiles.length; i++) {
      if (korea.percentiles[i].percentile <= korea.percentiles[i - 1].percentile) {
        errors.push(`Korea: 퍼센타일 순서 오류 at index ${i}`);
      }
      if (korea.percentiles[i].income < korea.percentiles[i - 1].income) {
        errors.push(`Korea: 소득이 감소함 at percentile ${korea.percentiles[i].percentile}`);
      }
    }

    // 2. 중위값 확인
    const median = korea.percentiles.find(p => p.percentile === 50);
    if (median && Math.abs(median.income - korea.statistics.medianIncome) > 1) {
      errors.push(`Korea: 중위값 불일치 - ${median.income} vs ${korea.statistics.medianIncome}`);
    }

    // 3. 메타데이터 확인
    if (!korea.metadata.source || !korea.metadata.year) {
      errors.push('Korea: 메타데이터 누락');
    }

  } catch (e) {
    errors.push(`Korea data validation error: ${e}`);
  }

  // 미국 데이터 검증
  try {
    const us = usData as IncomeDataset;

    // 1. 퍼센타일이 순차적으로 증가하는지 확인
    for (let i = 1; i < us.percentiles.length; i++) {
      if (us.percentiles[i].percentile <= us.percentiles[i - 1].percentile) {
        errors.push(`US: 퍼센타일 순서 오류 at index ${i}`);
      }
      if (us.percentiles[i].income < us.percentiles[i - 1].income) {
        errors.push(`US: 소득이 감소함 at percentile ${us.percentiles[i].percentile}`);
      }
    }

    // 2. 중위값 확인
    const median = us.percentiles.find(p => p.percentile === 50);
    if (median && Math.abs(median.income - us.statistics.medianIncome) > 1) {
      errors.push(`US: 중위값 불일치 - ${median.income} vs ${us.statistics.medianIncome}`);
    }

    // 3. 메타데이터 확인
    if (!us.metadata.source || !us.metadata.year) {
      errors.push('US: 메타데이터 누락');
    }

  } catch (e) {
    errors.push(`US data validation error: ${e}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// 샘플 테스트
interface TestResult {
  passed: boolean;
  calculatedPercentile: number;
  expectedRange: number[];
  country: string;
  income: number;
}

export function testSampleCalculations(): { passed: boolean; results: TestResult[] } {
  const testCases = [
    { country: 'korea', income: 3000, expectedRange: [35, 45] }, // 3000만원
    { country: 'korea', income: 5000, expectedRange: [60, 70] }, // 5000만원
    { country: 'korea', income: 10000, expectedRange: [90, 95] }, // 1억
    { country: 'us', income: 50000, expectedRange: [45, 55] }, // $50k
    { country: 'us', income: 100000, expectedRange: [75, 85] }, // $100k
    { country: 'us', income: 200000, expectedRange: [93, 97] }, // $200k
  ];

  const results = testCases.map(test => {
    const data = test.country === 'korea' ? koreaData : usData;
    const percentiles = data.percentiles;

    // 선형 보간으로 퍼센타일 계산
    let percentile = 0;
    for (let i = 0; i < percentiles.length - 1; i++) {
      if (test.income >= percentiles[i].income && test.income <= percentiles[i + 1].income) {
        const ratio = (test.income - percentiles[i].income) /
                     (percentiles[i + 1].income - percentiles[i].income);
        percentile = percentiles[i].percentile +
                    ratio * (percentiles[i + 1].percentile - percentiles[i].percentile);
        break;
      }
    }

    const inRange = percentile >= test.expectedRange[0] && percentile <= test.expectedRange[1];

    return {
      ...test,
      calculatedPercentile: percentile,
      passed: inRange
    };
  });

  return {
    passed: results.every(r => r.passed),
    results
  };
}