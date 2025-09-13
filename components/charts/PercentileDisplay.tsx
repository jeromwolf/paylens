'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CalculationResult } from '@/types/income';
import { formatKRW, formatUSD } from '@/lib/utils/format';
import { useTranslation } from '@/hooks/useTranslation';

interface PercentileDisplayProps {
  result: CalculationResult;
}

export default function PercentileDisplay({ result }: PercentileDisplayProps) {
  const { t } = useTranslation();
  const [animatedHigherThan, setAnimatedHigherThan] = useState(0);
  const isKorea = result.country === 'korea';

  useEffect(() => {
    // Animate the higherThan number (상위 %)
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = result.higherThan / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= result.higherThan) {
        setAnimatedHigherThan(result.higherThan);
        clearInterval(timer);
      } else {
        setAnimatedHigherThan(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [result.higherThan]);

  const getEmoji = () => {
    if (result.percentile >= 95) return '🏆';
    if (result.percentile >= 90) return '💎';
    if (result.percentile >= 80) return '⭐';
    if (result.percentile >= 70) return '✨';
    if (result.percentile >= 60) return '👍';
    if (result.percentile >= 50) return '💪';
    if (result.percentile >= 40) return '📈';
    return '🌱';
  };

  const getMotivationalMessage = () => {
    if (result.higherThan <= 5) return t('topTier');
    if (result.higherThan <= 10) return t('topTenPercent');
    if (result.higherThan <= 20) return t('excellentLevel');
    if (result.higherThan <= 30) return t('aboveAverage');
    if (result.higherThan <= 50) return t('aboveMedian');
    return t('roomToGrow');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Main Card */}
      <div className="relative bg-white rounded-3xl shadow-xl border border-gray-200">
        {/* Simple background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-blue-50/30 rounded-3xl opacity-50"></div>

        {/* Content */}
        <div className="relative p-8 md:p-12">
          {/* Country Flag & Income */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <span className="text-4xl">{isKorea ? '🇰🇷' : '🇺🇸'}</span>
              <div>
                <p className="text-sm font-bold text-gray-700">
                  {isKorea ? '연봉' : 'Annual Salary'}
                </p>
                <p className="text-3xl font-black text-gray-900">
                  {isKorea ? formatKRW(result.income) : formatUSD(result.income)}
                </p>
              </div>
            </div>
            <div className="text-5xl">
              {getEmoji()}
            </div>
          </div>

          {/* Percentile Display */}
          <div className="text-center mb-10">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
              <div className="text-8xl md:text-9xl font-black text-gray-900 mb-4">
                {t('higherThan')} {animatedHigherThan.toFixed(1)}%
              </div>
              <div className="text-xl md:text-2xl text-gray-700 font-bold">
                {result.label}
              </div>
            </div>

            <div className="mt-6">
              <div className="inline-flex items-center gap-3 bg-blue-100 px-8 py-4 rounded-2xl border-2 border-blue-300">
                <span className="text-3xl">{getEmoji()}</span>
                <span className="text-xl font-black text-gray-900">
                  {getMotivationalMessage()}
                </span>
              </div>
            </div>
          </div>


          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring' }}
              className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-6 text-center shadow-lg border border-blue-100/50 hover:shadow-xl transition-shadow"
            >
              <div className="text-2xl mb-2">📊</div>
              <p className="text-xs text-gray-500 mb-2 font-medium">
                {isKorea ? '소득 그룹' : 'Income Group'}
              </p>
              <p className="text-sm font-black text-gray-800">
                {result.incomeGroup}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.9, type: 'spring' }}
              className="bg-gradient-to-br from-white to-green-50/50 rounded-2xl p-6 text-center shadow-lg border border-green-100/50 hover:shadow-xl transition-shadow"
            >
              <div className="text-2xl mb-2">📈</div>
              <p className="text-xs text-gray-500 mb-2 font-medium">
                {isKorea ? '평균 대비' : 'vs Average'}
              </p>
              <p className="text-sm font-black text-gray-800">
                {((result.income / result.statistics.average) * 100).toFixed(0)}%
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.0, type: 'spring' }}
              className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl p-6 text-center shadow-lg border border-purple-100/50 hover:shadow-xl transition-shadow"
            >
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-xs text-gray-500 mb-2 font-medium">
                {isKorea ? '중위값' : 'Median'}
              </p>
              <p className="text-sm font-black text-gray-800">
                {isKorea
                  ? formatKRW(result.statistics.median, false)
                  : formatUSD(result.statistics.median, false)}
              </p>
            </motion.div>
          </div>

          {/* Comparison Message */}
          <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm font-bold text-gray-800 text-center mb-3">
              {isKorea
                ? `전체 근로자 중 약 ${Math.round(result.lowerThan)}%보다 높은 소득입니다`
                : `Your income is higher than ${Math.round(result.lowerThan)}% of workers`}
            </p>

            {/* Data Source Info */}
            <div className="border-t border-blue-200 pt-3 mt-3">
              <p className="text-xs font-bold text-gray-700 text-center mb-1">
                📊 데이터 출처
              </p>
              <p className="text-xs text-gray-600 text-center">
                {isKorea
                  ? "국세청 근로소득 백분위 자료 (2024년)"
                  : "US Census Bureau (2024)"}
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                {isKorea
                  ? "대한민국 전체 근로소득자 기준"
                  : "US household income data"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}