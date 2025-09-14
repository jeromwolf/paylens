'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, DollarSign, Users, ChevronRight, Info } from 'lucide-react';
import { formatWealth } from '@/data/global-wealth';
import WealthInput from '@/components/forms/WealthInput';
import WealthPercentileDisplay from '@/components/charts/WealthPercentileDisplay';
import WealthDistributionChart from '@/components/charts/WealthDistributionChart';
import RegionalComparison from '@/components/charts/RegionalComparison';
import ShareImageGenerator from '@/components/share/ShareImageGenerator';
import WealthShareCard from '@/components/share/WealthShareCard';

export default function WealthRankingPage() {
  const [mounted, setMounted] = useState(false);
  const [wealth, setWealth] = useState<number | null>(null);
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [percentile, setPercentile] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [wealthData, setWealthData] = useState<any>(null);
  const [isLoadingWealthData, setIsLoadingWealthData] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(1350);

  useEffect(() => {
    setMounted(true);
    fetchWealthData();
  }, []);

  const fetchWealthData = async () => {
    try {
      setIsLoadingWealthData(true);
      const response = await fetch('/api/oecd-wealth-distribution');
      const data = await response.json();
      setWealthData(data);
    } catch (error) {
      console.error('Failed to fetch wealth data:', error);
    } finally {
      setIsLoadingWealthData(false);
    }
  };

  // OECD 데이터 기반 퍼센타일 계산
  const calculateWealthPercentile = (wealthUSD: number): number => {
    if (!wealthData?.globalWealthPercentiles) return 50;

    const percentiles = wealthData.globalWealthPercentiles;

    // 최고 구간 초과시
    if (wealthUSD >= percentiles[0]?.minWealth) {
      const ratio = Math.min(wealthUSD / percentiles[0].minWealth, 10);
      return Math.min(99.99, 99.9 + 0.09 * Math.log10(ratio));
    }

    // 적절한 구간 찾기
    for (let i = 0; i < percentiles.length - 1; i++) {
      const higher = percentiles[i];
      const lower = percentiles[i + 1];

      if (wealthUSD >= lower.minWealth && wealthUSD < higher.minWealth) {
        const ratio = (wealthUSD - lower.minWealth) / (higher.minWealth - lower.minWealth);
        return lower.percentile + ratio * (higher.percentile - lower.percentile);
      }
    }

    // 최저 구간 미만
    const lowest = percentiles[percentiles.length - 1];
    if (wealthUSD < lowest.minWealth) {
      return Math.max(0.01, (wealthUSD / lowest.minWealth) * lowest.percentile);
    }

    return 50;
  };

  // 자산 레이블 생성
  const getWealthLabel = (percentile: number): string => {
    if (percentile >= 99.9) return "Ultra High Net Worth (0.1%)";
    if (percentile >= 99.5) return "Very High Net Worth (0.5%)";
    if (percentile >= 99) return "High Net Worth (1%)";
    if (percentile >= 95) return "상위 5%";
    if (percentile >= 90) return "상위 10%";
    if (percentile >= 75) return "중상위층";
    if (percentile >= 50) return "중산층";
    if (percentile >= 25) return "중하위층";
    return "하위층";
  };

  const handleCalculate = async (wealthValue: number, selectedCurrency: 'KRW' | 'USD') => {
    setIsCalculating(true);
    setWealth(wealthValue);
    setCurrency(selectedCurrency);

    // Get current exchange rate and convert to USD if needed
    let currentExchangeRate = 1350; // 기본값
    try {
      const response = await fetch('/api/exchange-rate');
      const data = await response.json();
      if (data.rate) {
        currentExchangeRate = data.rate;
        setExchangeRate(currentExchangeRate);
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    }

    const wealthInUSD = selectedCurrency === 'KRW' ? wealthValue / currentExchangeRate : wealthValue;

    // Simulate calculation delay for effect
    setTimeout(() => {
      const calculatedPercentile = calculateWealthPercentile(wealthInUSD);
      setPercentile(calculatedPercentile);
      setIsCalculating(false);
    }, 800);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white backdrop-blur-md rounded-2xl shadow-lg">
              <Globe className="w-16 h-16 text-purple-600" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            나의 자산 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">세계 랭킹</span>
          </h1>

          <p className="text-xl text-gray-700 mb-2">
            전 세계 80억 명 중에서 내 자산 순위는 몇 위일까?
          </p>
          <p className="text-lg text-gray-600">
            World Bank 국가별 소득 데이터 기반 정확한 분석
          </p>
        </motion.div>
      </section>

      {/* Input Section */}
      <section className="container mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <WealthInput onCalculate={handleCalculate} isCalculating={isCalculating} />
        </motion.div>
      </section>

      {/* Results Section */}
      {percentile !== null && wealth !== null && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 pb-20"
        >
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Main Result Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-purple-800 mb-6">글로벌 자산 순위</h2>
                  <WealthPercentileDisplay
                    percentile={percentile}
                    wealth={wealth}
                    currency={currency}
                  />
                </div>
                <div>
                  <WealthDistributionChart
                    percentile={percentile}
                    wealth={wealth}
                    currency={currency}
                  />
                </div>
              </div>
            </motion.div>

            {/* Regional Comparison */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-purple-800 mb-6">지역별 비교</h2>
              <RegionalComparison
                wealth={currency === 'KRW' ? wealth / 1350 : wealth}
                regionalData={wealthData?.regionalWealthData}
              />
            </motion.div>

            {/* Insights */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid md:grid-cols-3 gap-6"
            >
              <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <TrendingUp className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">상위 {(100 - percentile).toFixed(1)}%</h3>
                <p className="text-white/70 text-sm">
                  전 세계 {((100 - percentile) * 80000000).toLocaleString()}명보다 많은 자산 보유
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <DollarSign className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{getWealthLabel(percentile)}</h3>
                <p className="text-white/70 text-sm">
                  글로벌 자산 분류 기준
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <Users className="w-10 h-10 text-orange-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">세계 {Math.round((100 - percentile) * 80000000).toLocaleString()}위</h3>
                <p className="text-white/70 text-sm">
                  80억 인구 중 예상 순위
                </p>
              </div>
            </motion.div>

            {/* 공유 기능 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-2xl p-8 border border-purple-400/20 text-center"
            >
              <h3 className="text-xl font-bold text-white mb-3">🎉 결과를 친구들과 공유해보세요!</h3>
              <p className="text-white/70 mb-6">
                나의 글로벌 자산 순위를 SNS에 자랑하고 친구들도 도전하게 해보세요
              </p>

              <ShareImageGenerator
                filename={`paylens-wealth-rank-${Date.now()}`}
              >
                <WealthShareCard
                  percentile={percentile}
                  wealth={wealth}
                  currency={currency}
                  exchangeRate={exchangeRate}
                />
              </ShareImageGenerator>
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="bg-blue-600/10 backdrop-blur-md rounded-2xl p-6 border border-blue-400/20"
            >
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-white/80">
                  <p className="font-semibold mb-1">데이터 출처</p>
                  <p>World Bank GNI per Capita Data 2023 (185개국)</p>
                  <p className="mt-2">순자산 = 총자산(부동산, 금융자산 등) - 총부채</p>
                  {wealthData && (
                    <p className="mt-1 text-xs">
                      마지막 업데이트: {new Date(wealthData.lastUpdated).toLocaleDateString('ko-KR')}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
}