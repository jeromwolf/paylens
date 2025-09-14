'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SalaryInput from '@/components/forms/SalaryInput';
import PercentileDisplay from '@/components/charts/PercentileDisplay';
import useIncomeStore from '@/store/useIncomeStore';
import ShareImageGenerator from '@/components/share/ShareImageGenerator';
import SalaryShareCard from '@/components/share/SalaryShareCard';
import { calculatePercentile, getIncomeForPercentile } from '@/lib/calculations/percentile';
import { formatKRW, formatUSD } from '@/lib/utils/format';
import { convertCurrency } from '@/lib/utils/currency';
import { useTranslation } from '@/hooks/useTranslation';

export default function AnalyzePage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const {
    koreaIncome,
    usIncome,
    selectedCountry,
    koreaResult,
    usResult,
    setKoreaIncome,
    setUsIncome,
    setKoreaResult,
    setUsResult,
  } = useIncomeStore();

  const [activeTab, setActiveTab] = useState<'korea' | 'us' | 'compare'>('korea');
  const [targetPercentile, setTargetPercentile] = useState(90);
  const [isCalculating, setIsCalculating] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    if (selectedCountry) {
      setActiveTab(selectedCountry);
    }
  }, [selectedCountry]);

  // Get smart target percentile based on current position (gradual steps)
  const getSmartTargetPercentile = (currentPercentile: number) => {
    const higherThan = 100 - currentPercentile;
    if (higherThan <= 1) return currentPercentile + 0.5;
    if (higherThan <= 5) return currentPercentile + 2;
    if (higherThan <= 10) return currentPercentile + 3;
    if (higherThan <= 20) return currentPercentile + 5;
    if (higherThan <= 30) return currentPercentile + 7;
    if (higherThan <= 50) return currentPercentile + 10;
    return Math.min(currentPercentile + 15, 85);
  };

  // Update target percentile when results change
  useEffect(() => {
    if (koreaResult) {
      const smartTarget = getSmartTargetPercentile(koreaResult.percentile);
      setTargetPercentile(smartTarget);
    }
  }, [koreaResult]);

  useEffect(() => {
    if (usResult) {
      const smartTarget = getSmartTargetPercentile(usResult.percentile);
      setTargetPercentile(smartTarget);
    }
  }, [usResult]);

  // Calculate results when incomes change
  useEffect(() => {
    if (mounted && koreaIncome > 0) {
      const result = calculatePercentile(koreaIncome, 'korea');
      setKoreaResult(result);
    }
  }, [mounted, koreaIncome, setKoreaResult]);

  useEffect(() => {
    if (mounted && usIncome > 0) {
      const result = calculatePercentile(usIncome, 'us');
      setUsResult(result);
    }
  }, [mounted, usIncome, setUsResult]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 500);
  };

  const targetKorea = mounted ? getIncomeForPercentile(targetPercentile, 'korea') : 0;
  const targetUS = mounted ? getIncomeForPercentile(targetPercentile, 'us') : 0;

  // Prevent SSR issues
  if (!mounted) {
    return (
      <div className="min-h-screen py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            {t('salaryAnalysisTitle')}
          </h1>
          <p className="text-lg font-bold text-gray-800">
            {t('salaryAnalysisSubtitle')}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-1 inline-flex">
            <button
              onClick={() => setActiveTab('korea')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'korea'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              한국
            </button>
            <button
              onClick={() => setActiveTab('us')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'us'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              미국
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'compare'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              비교
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Korea Tab */}
          {activeTab === 'korea' && (
            <motion.div
              key="korea"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-black text-gray-900 mb-6">
                    {t('koreaSalary')}
                  </h2>
                  <SalaryInput
                    country="korea"
                    value={koreaIncome}
                    onChange={setKoreaIncome}
                  />

                  {/* Target Setting */}
                  {koreaResult && (
                    <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                      <h3 className="text-lg font-black text-gray-800 mb-4">
                        🎯 {t('goalSetting')}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-bold text-gray-600">
                            {t('targetPercentile')}:
                          </label>
                          <input
                            type="range"
                            min="50"
                            max="99"
                            value={targetPercentile}
                            onChange={(e) => setTargetPercentile(Number(e.target.value))}
                            className="w-full mt-2"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>50%</span>
                            <span className="font-black text-primary-600">
                              {t('higherThan')} {(100 - targetPercentile).toFixed(1)}%
                            </span>
                            <span>99%</span>
                          </div>
                        </div>

                        <div className="p-4 bg-white rounded-lg">
                          <div className="text-sm font-bold text-gray-600 mb-1">
                            {t('toReachTop')} {(100 - targetPercentile).toFixed(1)}%:
                          </div>
                          <div className="text-2xl font-black text-primary-600">
                            {formatKRW(targetKorea)}
                          </div>
                          {targetKorea > koreaIncome ? (
                            <div className="text-sm font-bold text-gray-500 mt-1">
                              (+{formatKRW(targetKorea - koreaIncome)} {t('needed')})
                            </div>
                          ) : (
                            <div className="text-sm font-bold text-green-600 mt-1">
                              {t('alreadyAchieved')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Result Section */}
                <div>
                  {koreaResult ? (
                    <PercentileDisplay result={koreaResult} />
                  ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                      <div className="text-gray-400 text-lg">
                        {t('enterSalary')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* US Tab */}
          {activeTab === 'us' && (
            <motion.div
              key="us"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-black text-gray-900 mb-6">
                    {t('usSalary')}
                  </h2>
                  <SalaryInput
                    country="us"
                    value={usIncome}
                    onChange={setUsIncome}
                  />

                  {/* Target Setting */}
                  {usResult && (
                    <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                      <h3 className="text-lg font-black text-gray-800 mb-4">
                        {t('goalSettingEn')}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-bold text-gray-600">
                            {t('targetPercentileEn')}
                          </label>
                          <input
                            type="range"
                            min="50"
                            max="99"
                            value={targetPercentile}
                            onChange={(e) => setTargetPercentile(Number(e.target.value))}
                            className="w-full mt-2"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>50%</span>
                            <span className="font-black text-primary-600">
                              {t('topPercent')} {(100 - targetPercentile).toFixed(1)}%
                            </span>
                            <span>99%</span>
                          </div>
                        </div>

                        <div className="p-4 bg-white rounded-lg">
                          <div className="text-sm font-bold text-gray-600 mb-1">
                            {t('toReachTopEn')} {(100 - targetPercentile).toFixed(1)}%:
                          </div>
                          <div className="text-2xl font-black text-primary-600">
                            {formatUSD(targetUS)}
                          </div>
                          {targetUS > usIncome ? (
                            <div className="text-sm font-bold text-gray-500 mt-1">
                              (+{formatUSD(targetUS - usIncome)} {t('neededEn')})
                            </div>
                          ) : (
                            <div className="text-sm font-bold text-green-600 mt-1">
                              {t('alreadyAchieved')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Result Section */}
                <div>
                  {usResult ? (
                    <PercentileDisplay result={usResult} />
                  ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                      <div className="text-gray-400 text-lg">
                        {t('enterSalary')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Compare Tab */}
          {activeTab === 'compare' && (
            <motion.div
              key="compare"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">
                  {t('crossCountryAnalysis')}
                </h2>

                {koreaResult && usResult ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Korea to US */}
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                      <h3 className="text-lg font-black text-gray-800 mb-4">
                        {t('koreaToUs')}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-bold text-gray-600">
                            {t('salary')} ({t('korea')}):
                          </div>
                          <div className="text-xl font-black">{formatKRW(koreaIncome)}</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-600">
                            {t('samePercentileBasis')} ({koreaResult.percentile.toFixed(1)}%):
                          </div>
                          <div className="text-xl font-black text-primary-600">
                            {formatUSD(getIncomeForPercentile(koreaResult.percentile, 'us'))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* US to Korea */}
                    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                      <h3 className="text-lg font-black text-gray-800 mb-4">
                        {t('usToKorea')}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-bold text-gray-600">
                            {t('salary')} ({t('usa')}):
                          </div>
                          <div className="text-xl font-black">{formatUSD(usIncome)}</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-600">
                            {t('samePercentileBasis')} ({usResult.percentile.toFixed(1)}%):
                          </div>
                          <div className="text-xl font-black text-primary-600">
                            {formatKRW(getIncomeForPercentile(usResult.percentile, 'korea'))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <p className="text-lg font-bold">
                      {t('enterSalary')}
                    </p>
                  </div>
                )}

                {/* Exchange Rate Info */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-bold text-gray-600">
                    {t('exchangeRateInfo')}
                  </p>
                  {koreaIncome > 0 && (
                    <p className="text-sm font-bold text-gray-500 mt-2">
                      {t('simpleExchangeRate')} {formatKRW(koreaIncome)} = {formatUSD(convertCurrency(koreaIncome, 'KRW', 'USD', 'manwon'))}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 공유 기능 - 결과가 있을 때만 표시 */}
        {(koreaResult || usResult) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 backdrop-blur-md rounded-2xl p-8 border border-indigo-400/20 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-3">🎉 연봉 분석 결과를 공유해보세요!</h3>
            <p className="text-gray-600 mb-6">
              나의 연봉 순위를 SNS에 자랑하고 친구들과 비교해보세요
            </p>

            <div className="space-y-4">
              {/* 한국 결과 공유 */}
              {koreaResult && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">🇰🇷 한국 연봉 분석 결과 공유</p>
                  <ShareImageGenerator
                    filename={`paylens-korea-salary-${Date.now()}`}
                  >
                    <SalaryShareCard
                      salary={koreaIncome}
                      country="KR"
                      percentile={koreaResult.percentile}
                      rank={koreaResult.rank}
                      totalPeople={52000000}
                    />
                  </ShareImageGenerator>
                </div>
              )}

              {/* 미국 결과 공유 */}
              {usResult && (
                <div className={koreaResult ? "border-t border-gray-200 pt-6" : ""}>
                  <p className="text-sm font-medium text-gray-700 mb-3">🇺🇸 미국 연봉 분석 결과 공유</p>
                  <ShareImageGenerator
                    filename={`paylens-us-salary-${Date.now()}`}
                  >
                    <SalaryShareCard
                      salary={usIncome}
                      country="US"
                      percentile={usResult.percentile}
                      rank={usResult.rank}
                      totalPeople={330000000}
                    />
                  </ShareImageGenerator>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Data Credibility Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-xl font-black text-gray-900 mb-6">
            {t('reliableData')}
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-black text-gray-800 mb-3">{t('koreaDataTitle')}</h4>
              <ul className="space-y-2 text-sm font-bold text-gray-600">
                <li>• {t('koreanTaxService')}</li>
                <li>• {t('year')} {t('latestYear')}</li>
                <li>• {t('scope')} {t('allKoreanWorkers')}</li>
                <li>• {t('accuracy')} {t('officialStats')}</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-black text-gray-800 mb-3">{t('usDataTitle')}</h4>
              <ul className="space-y-2 text-sm font-bold text-gray-600">
                <li>• {t('usCensusBureau')}</li>
                <li>• {t('year')} {t('latestYear')}</li>
                <li>• {t('scope')} {t('allUSHouseholds')}</li>
                <li>• {t('accuracy')} {t('federalOfficialStats')}</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm font-bold text-gray-500">
            {t('dataReliabilityNote')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}