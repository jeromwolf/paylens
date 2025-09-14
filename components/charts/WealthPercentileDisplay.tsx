'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Award, Globe } from 'lucide-react';
import { getWealthLabel, formatWealth } from '@/data/global-wealth';

interface WealthPercentileDisplayProps {
  percentile: number;
  wealth: number;
  currency: 'KRW' | 'USD';
}

export default function WealthPercentileDisplay({
  percentile,
  wealth,
  currency
}: WealthPercentileDisplayProps) {
  const wealthInUSD = currency === 'KRW' ? wealth / 1350 : wealth;
  const globalRank = Math.round((100 - percentile) * 80000000);
  const topPercent = (100 - percentile).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Main Percentile Display */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="text-center"
      >
        <div className="mb-4">
          <p className="text-lg text-gray-600 mb-2">전 세계</p>
          <div className="relative inline-block">
            <span className="text-6xl font-bold text-gray-800">상위 </span>
            <span className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {topPercent}
            </span>
            <span className="text-6xl font-bold text-gray-800">%</span>
          </div>
        </div>
      </motion.div>

      {/* Status Badge */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 border border-purple-300"
      >
        <div className="flex items-center justify-center gap-3">
          <Award className="w-6 h-6 text-purple-600" />
          <span className="text-xl font-bold text-gray-800">
            {getWealthLabel(percentile)}
          </span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="space-y-4">

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center p-3 bg-purple-50 rounded-xl border border-purple-200"
        >
          <span className="text-purple-700 font-medium">글로벌 순위</span>
          <span className="text-xl font-bold text-purple-900">
            {globalRank < 1000000
              ? `${(globalRank / 1000).toFixed(0)}K위`
              : `${(globalRank / 1000000).toFixed(1)}M위`}
          </span>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-between items-center p-3 bg-purple-50 rounded-xl border border-purple-200"
        >
          <span className="text-purple-700 font-medium">자산 (USD)</span>
          <span className="text-xl font-bold text-purple-900">
            {formatWealth(wealthInUSD)}
          </span>
        </motion.div>
      </div>

      {/* Motivational Message */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-300"
      >
        <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
        <p className="text-gray-700">
          전 세계 80억 명 중 약 <span className="font-bold text-lg">{(globalRank / 10000).toFixed(0)}만 위</span>
        </p>
      </motion.div>
    </div>
  );
}