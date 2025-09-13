'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SalaryInput from '@/components/forms/SalaryInput';
import PercentileDisplay from '@/components/charts/PercentileDisplay';
import PercentileChart from '@/components/charts/PercentileChart';
import useIncomeStore from '@/store/useIncomeStore';
import { calculatePercentile, getIncomeForPercentile } from '@/lib/calculations/percentile';
import { formatKRW, formatUSD } from '@/lib/utils/format';
import { convertCurrency } from '@/lib/utils/currency';
import { useTranslation } from '@/hooks/useTranslation';

export default function AnalyzePage() {
  const { t } = useTranslation();
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

  const [activeTab, setActiveTab] = useState<'korea' | 'us' | 'compare'>(selectedCountry || 'korea');
  const [targetPercentile, setTargetPercentile] = useState(90);
  const [isCalculating, setIsCalculating] = useState(false);

  // Get smart target percentile based on current position (gradual steps)
  const getSmartTargetPercentile = (currentPercentile: number) => {
    // Very gradual improvements - add about 5-10 percentile points
    const higherThan = 100 - currentPercentile;

    if (higherThan <= 1) return currentPercentile + 0.5; // Top 1% -> slightly better
    if (higherThan <= 5) return currentPercentile + 2;   // Top 5% -> add 2 points
    if (higherThan <= 10) return currentPercentile + 3;  // Top 10% -> add 3 points
    if (higherThan <= 20) return currentPercentile + 5;  // Top 20% -> add 5 points
    if (higherThan <= 30) return currentPercentile + 7;  // Top 30% -> add 7 points
    if (higherThan <= 50) return currentPercentile + 10; // Top 50% -> add 10 points

    // For lower positions, aim for next meaningful milestone
    return Math.min(currentPercentile + 15, 85); // Add 15 points, max 85th percentile
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
    if (koreaIncome > 0) {
      const result = calculatePercentile(koreaIncome, 'korea');
      setKoreaResult(result);
    }
  }, [koreaIncome, setKoreaResult]);

  useEffect(() => {
    if (usIncome > 0) {
      const result = calculatePercentile(usIncome, 'us');
      setUsResult(result);
    }
  }, [usIncome, setUsResult]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 500);
  };

  const targetKorea = getIncomeForPercentile(targetPercentile, 'korea');
  const targetUS = getIncomeForPercentile(targetPercentile, 'us');

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
          <div className="inline-flex rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-xl p-2 border border-gray-200">
            <button
              onClick={() => setActiveTab('korea')}
              className={`relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                activeTab === 'korea'
                  ? 'bg-gray-900 text-white shadow-xl scale-105 border border-gray-700 z-10'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:scale-105'
              }`}
            >
              <span className="flex items-center gap-2">
                🇰🇷 <span className="font-bold">{t('koreaTab')}</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('us')}
              className={`relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                activeTab === 'us'
                  ? 'bg-gray-900 text-white shadow-xl scale-105 border border-gray-700 z-10'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:scale-105'
              }`}
            >
              <span className="flex items-center gap-2">
                🇺🇸 <span className="font-bold">{t('usaTab')}</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                activeTab === 'compare'
                  ? 'bg-gray-900 text-white shadow-xl scale-105 border border-gray-700 z-10'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:scale-105'
              }`}
            >
              <span className="flex items-center gap-2">
                🌏 <span className="font-bold">{t('compareTab')}</span>
              </span>
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
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <SalaryInput
                country="korea"
                value={koreaIncome}
                onChange={(value) => {
                  setKoreaIncome(value);
                  handleCalculate();
                }}
              />

              {koreaResult && !isCalculating && (
                <>
                  <PercentileDisplay result={koreaResult} />
                  <PercentileChart
                    country="korea"
                    currentIncome={koreaIncome}
                    currentPercentile={koreaResult.percentile}
                  />

                  {/* Target Calculator */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8"
                  >
                    <h3 className="text-xl font-bold mb-6">{t('goalSetting')}</h3>

                    {/* Smart Default Target */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">{t('recommendedNextGoal')}</p>
                      {(() => {
                        const smartTarget = getSmartTargetPercentile(koreaResult.percentile);
                        const smartTargetIncome = getIncomeForPercentile(smartTarget, 'korea');
                        return (
                          <div>
                            <p className="text-lg font-bold text-blue-700">
                              {t('higherThan')} {(100 - smartTarget).toFixed(1)}% ({formatKRW(smartTargetIncome)})
                            </p>
                            <p className="text-sm text-gray-600">
                              목표까지 {formatKRW(smartTargetIncome - koreaIncome)} {t('targetRequired')}
                            </p>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <label className="font-medium">{t('customGoal')}</label>
                      <input
                        type="range"
                        min={Math.min(koreaResult.percentile + 1, 99)}
                        max="99.5"
                        step="0.5"
                        value={targetPercentile}
                        onChange={(e) => setTargetPercentile(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="font-bold text-primary-600 w-20">
                        {t('higherThan')} {(100 - targetPercentile).toFixed(1)}%
                      </span>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
                      <p className="text-lg mb-2">
                        {t('higherThan')} {(100 - targetPercentile).toFixed(1)}%{t('toReachTop')}
                      </p>
                      <p className="text-3xl font-bold text-primary-600 mb-2">
                        {formatKRW(targetKorea)} {t('needed')}
                      </p>
                      {targetKorea > koreaIncome ? (
                        <p className="text-sm text-gray-600">
                          목표까지 {formatKRW(targetKorea - koreaIncome)} {t('targetRequired')}
                        </p>
                      ) : (
                        <p className="text-sm text-green-600">
                          {t('alreadyAchieved')}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}

          {/* US Tab */}
          {activeTab === 'us' && (
            <motion.div
              key="us"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <SalaryInput
                country="us"
                value={usIncome}
                onChange={(value) => {
                  setUsIncome(value);
                  handleCalculate();
                }}
              />

              {usResult && !isCalculating && (
                <>
                  <PercentileDisplay result={usResult} />
                  <PercentileChart
                    country="us"
                    currentIncome={usIncome}
                    currentPercentile={usResult.percentile}
                  />

                  {/* Target Calculator */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8"
                  >
                    <h3 className="text-xl font-bold mb-6">{t('goalSettingEn')}</h3>
                    <div className="flex items-center gap-4 mb-6">
                      <label className="font-medium">{t('targetPercentileEn')}</label>
                      <input
                        type="range"
                        min="50"
                        max="99"
                        value={targetPercentile}
                        onChange={(e) => setTargetPercentile(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="font-bold text-primary-600 w-20">
                        {t('topPercent')} {(100 - targetPercentile).toFixed(0)}%
                      </span>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
                      <p className="text-lg mb-2">
                        {t('toReachTopEn')} {(100 - targetPercentile).toFixed(0)}%
                      </p>
                      <p className="text-3xl font-bold text-primary-600 mb-2">
                        {formatUSD(targetUS)} {t('neededEn')}
                      </p>
                      {targetUS > usIncome && (
                        <p className="text-sm text-gray-600">
                          {formatUSD(targetUS - usIncome)} {t('moreThanCurrent')}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}

          {/* Compare Tab */}
          {activeTab === 'compare' && (
            <motion.div
              key="compare"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t('koreaSalary')}</h3>
                  <SalaryInput
                    country="korea"
                    value={koreaIncome}
                    onChange={(value) => {
                      setKoreaIncome(value);
                      handleCalculate();
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t('usSalary')}</h3>
                  <SalaryInput
                    country="us"
                    value={usIncome}
                    onChange={(value) => {
                      setUsIncome(value);
                      handleCalculate();
                    }}
                  />
                </div>
              </div>

              {koreaResult && usResult && !isCalculating && (
                <>
                  {/* Comparison Results */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <PercentileDisplay result={koreaResult} />
                    <PercentileDisplay result={usResult} />
                  </div>

                  {/* Cross-Country Analysis */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8"
                  >
                    <h3 className="text-xl font-bold mb-6">{t('crossCountryAnalysis')}</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Korea to US */}
                      <div className="p-6 bg-blue-50 rounded-xl">
                        <h4 className="font-semibold mb-4">{t('koreaToUs')}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {t('koreaTab')} {formatKRW(koreaIncome)} ({t('higherThan')} {(100 - koreaResult.percentile).toFixed(1)}%)
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          = {t('usaTab')} {formatUSD(getIncomeForPercentile(koreaResult.percentile, 'us'))}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {t('samePercentileBasis')}
                        </p>
                      </div>

                      {/* US to Korea */}
                      <div className="p-6 bg-green-50 rounded-xl">
                        <h4 className="font-semibold mb-4">{t('usToKorea')}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {t('usaTab')} {formatUSD(usIncome)} ({t('topPercent')} {(100 - usResult.percentile).toFixed(1)}%)
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          = {t('koreaTab')} {formatKRW(getIncomeForPercentile(usResult.percentile, 'korea'))}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {t('samePercentileBasis')}
                        </p>
                      </div>
                    </div>

                    {/* Exchange Rate Info */}
                    <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                      <p className="text-sm text-gray-600 text-center">
                        {t('exchangeRateInfo')}
                      </p>
                      <p className="text-sm text-gray-600 text-center mt-1">
                        {t('simpleExchangeRate')} {formatKRW(koreaIncome)} = {formatUSD(convertCurrency(koreaIncome, 'KRW', 'USD', 'manwon'))}
                      </p>
                    </div>
                  </motion.div>

                  {/* Side by Side Charts */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <PercentileChart
                      country="korea"
                      currentIncome={koreaIncome}
                      currentPercentile={koreaResult.percentile}
                    />
                    <PercentileChart
                      country="us"
                      currentIncome={usIncome}
                      currentPercentile={usResult.percentile}
                    />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Credibility Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
            <h3 className="text-xl font-black text-gray-900 mb-6 text-center">
              {t('reliableData')}
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Korea Data */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🇰🇷</span>
                  <h4 className="font-black text-gray-900">{t('koreaDataTitle')}</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>{t('dataSource')}</strong> {t('koreanTaxService')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>{t('year')}</strong> {t('latestYear')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>{t('scope')}</strong> {t('allKoreanWorkers')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>{t('accuracy')}</strong> {t('officialStats')}</span>
                  </li>
                </ul>
              </div>

              {/* US Data */}
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🇺🇸</span>
                  <h4 className="font-black text-gray-900">{t('usDataTitle')}</h4>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>{t('dataSource')}</strong> {t('usCensusBureau')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>{t('year')}</strong> {t('latestYear')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>{t('scope')}</strong> {t('allUSHouseholds')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>{t('accuracy')}</strong> {t('federalOfficialStats')}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm font-bold text-gray-800">
                {t('dataReliabilityNote')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}