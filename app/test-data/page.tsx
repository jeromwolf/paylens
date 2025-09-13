'use client';

import { useEffect, useState } from 'react';
import { validateDataIntegrity, testSampleCalculations } from '@/lib/data/validate';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface TestResult {
  passed: boolean;
  calculatedPercentile: number;
  expectedRange: number[];
  country: string;
  income: number;
}

interface SampleTestResults {
  passed: boolean;
  results: TestResult[];
}

export default function TestDataPage() {
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [sampleTests, setSampleTests] = useState<SampleTestResults | null>(null);

  useEffect(() => {
    // 데이터 무결성 검증
    const validationResult = validateDataIntegrity();
    setValidation(validationResult);

    // 샘플 계산 테스트
    const testResult = testSampleCalculations();
    setSampleTests(testResult);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">📊 데이터 검증 결과</h1>

        {/* 데이터 무결성 검증 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">1. 데이터 무결성 검증</h2>
          {validation && (
            <div>
              <div className={`text-lg font-medium mb-2 ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                상태: {validation.isValid ? '✅ 통과' : '❌ 실패'}
              </div>
              {validation.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-medium text-red-800 mb-2">오류 목록:</p>
                  <ul className="list-disc list-inside text-red-700">
                    {validation.errors.map((error: string, i: number) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              {validation.isValid && (
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-green-800">✅ 모든 데이터 무결성 검사를 통과했습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 샘플 계산 테스트 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">2. 샘플 계산 테스트</h2>
          {sampleTests && (
            <div>
              <div className={`text-lg font-medium mb-4 ${sampleTests.passed ? 'text-green-600' : 'text-red-600'}`}>
                상태: {sampleTests.passed ? '✅ 모든 테스트 통과' : '❌ 일부 테스트 실패'}
              </div>
              <div className="space-y-3">
                {sampleTests.results.map((test: TestResult, i: number) => (
                  <div key={i} className={`border rounded p-3 ${test.passed ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {test.country === 'korea' ? '🇰🇷 한국' : '🇺🇸 미국'}:
                          {test.country === 'korea' ? ` ${test.income.toLocaleString()}만원` : ` $${test.income.toLocaleString()}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          예상 범위: {test.expectedRange[0]}% - {test.expectedRange[1]}%
                        </p>
                        <p className="text-sm">
                          계산된 퍼센타일: <span className="font-bold">{test.calculatedPercentile.toFixed(1)}%</span>
                        </p>
                      </div>
                      <span className="text-2xl">{test.passed ? '✅' : '❌'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 데이터 소스 정보 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">3. 데이터 소스 정보</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2">🇰🇷 한국 데이터</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>출처: 국세청 근로소득 백분위 자료</li>
                <li>기준년도: 2024년</li>
                <li>최종 업데이트: 2024-12-31</li>
                <li>단위: 만원</li>
              </ul>
            </div>
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2">🇺🇸 미국 데이터</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>출처: US Census Bureau</li>
                <li>기준년도: 2024년</li>
                <li>최종 업데이트: 2024-09-15</li>
                <li>단위: USD</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}