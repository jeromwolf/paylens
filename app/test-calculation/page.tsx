'use client';

import { useState } from 'react';
import { calculatePercentile, getIncomeForPercentile, compareIncome } from '@/lib/calculations/percentile';
import { formatKRW, formatUSD, formatPercent, formatPercentileLabel } from '@/lib/utils/format';
import { convertCurrency, getExchangeRateInfo } from '@/lib/utils/currency';

export default function TestCalculationPage() {
  const [koreaIncome, setKoreaIncome] = useState<number>(5000);
  const [usIncome, setUsIncome] = useState<number>(75000);
  const [targetPercentile, setTargetPercentile] = useState<number>(90);

  const koreaResult = calculatePercentile(koreaIncome, 'korea');
  const usResult = calculatePercentile(usIncome, 'us');

  const koreaTarget = getIncomeForPercentile(targetPercentile, 'korea');
  const usTarget = getIncomeForPercentile(targetPercentile, 'us');

  const comparison = compareIncome(koreaIncome, 'korea', 'us');
  const exchangeInfo = getExchangeRateInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🧮 계산 엔진 테스트</h1>

        {/* 입력 섹션 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🇰🇷 한국 연봉 입력</h2>
            <div className="space-y-4">
              <input
                type="number"
                value={koreaIncome}
                onChange={(e) => setKoreaIncome(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="연봉 (만원)"
              />
              <div className="text-lg font-medium text-primary-600">
                {formatKRW(koreaIncome)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🇺🇸 미국 연봉 입력</h2>
            <div className="space-y-4">
              <input
                type="number"
                value={usIncome}
                onChange={(e) => setUsIncome(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="연봉 (USD)"
              />
              <div className="text-lg font-medium text-primary-600">
                {formatUSD(usIncome)}
              </div>
            </div>
          </div>
        </div>

        {/* 계산 결과 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">한국 퍼센타일 결과</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">퍼센타일:</span>
                <span className="font-bold text-2xl text-primary-600">
                  {formatPercent(koreaResult.percentile)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">위치:</span>
                <span className="font-semibold">{koreaResult.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">소득 그룹:</span>
                <span className="font-semibold">{koreaResult.incomeGroup}</span>
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="text-sm text-gray-600">
                  평균: {formatKRW(koreaResult.statistics.average)}
                </div>
                <div className="text-sm text-gray-600">
                  중위값: {formatKRW(koreaResult.statistics.median)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">미국 퍼센타일 결과</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Percentile:</span>
                <span className="font-bold text-2xl text-primary-600">
                  {formatPercent(usResult.percentile)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Position:</span>
                <span className="font-semibold">{usResult.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Income Group:</span>
                <span className="font-semibold">{usResult.incomeGroup}</span>
              </div>
              <div className="border-t pt-3 space-y-2">
                <div className="text-sm text-gray-600">
                  Average: {formatUSD(usResult.statistics.average)}
                </div>
                <div className="text-sm text-gray-600">
                  Median: {formatUSD(usResult.statistics.median)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 목표 퍼센타일 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">🎯 목표 퍼센타일 계산</h3>
          <div className="flex items-center gap-4 mb-4">
            <label className="font-medium">목표 상위:</label>
            <input
              type="number"
              value={100 - targetPercentile}
              onChange={(e) => setTargetPercentile(100 - Number(e.target.value))}
              min="1"
              max="99"
              className="w-20 px-3 py-1 border rounded"
            />
            <span>%</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <p className="text-sm text-gray-600 mb-1">한국에서 상위 {(100 - targetPercentile).toFixed(1)}%가 되려면:</p>
              <p className="text-xl font-bold text-blue-600">{formatKRW(koreaTarget)} 필요</p>
              {koreaIncome > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  현재 대비 {formatKRW(koreaTarget - koreaIncome)} {koreaTarget > koreaIncome ? '더 필요' : '초과'}
                </p>
              )}
            </div>
            <div className="p-4 bg-green-50 rounded">
              <p className="text-sm text-gray-600 mb-1">미국에서 Top {(100 - targetPercentile).toFixed(1)}%가 되려면:</p>
              <p className="text-xl font-bold text-green-600">{formatUSD(usTarget)} 필요</p>
              {usIncome > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  현재 대비 {formatUSD(usTarget - usIncome)} {usTarget > usIncome ? '더 필요' : '초과'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 국가 간 비교 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">🌏 국가 간 비교</h3>
          <div className="p-4 bg-yellow-50 rounded">
            <p className="text-lg mb-2">{comparison.message}</p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-600">한국 {formatKRW(koreaIncome)}</p>
                <p className="font-semibold">→ 퍼센타일: {formatPercent(comparison.from.percentile)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">동일 수준 미국 연봉</p>
                <p className="font-semibold">→ {formatUSD(comparison.equivalentIncome)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 환율 정보 */}
        <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-600">
          <p>환율: 1 USD = {exchangeInfo.rate.toLocaleString()} KRW</p>
          <p>PPP Factor: {exchangeInfo.pppFactor}</p>
          <p>마지막 업데이트: {exchangeInfo.lastUpdated}</p>
        </div>
      </div>
    </div>
  );
}