'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { regionalWealthData } from '@/data/global-wealth';

interface RegionalComparisonProps {
  wealth: number; // in USD
}

export default function RegionalComparison({ wealth }: RegionalComparisonProps) {
  const regions = Object.entries(regionalWealthData).map(([name, data]) => {
    let category = '';
    if (wealth >= data.top1Percent) {
      category = 'Top 1%';
    } else if (wealth >= data.top10Percent) {
      category = 'Top 10%';
    } else if (wealth >= data.mean) {
      category = '평균 이상';
    } else if (wealth >= data.median) {
      category = '중위값 이상';
    } else {
      category = '중위값 이하';
    }

    return {
      name,
      ...data,
      category,
      percentile: calculateRegionalPercentile(wealth, data)
    };
  });

  function calculateRegionalPercentile(wealth: number, data: any): number {
    if (wealth >= data.top1Percent) return 99;
    if (wealth >= data.top10Percent) return 90 + (wealth - data.top10Percent) / (data.top1Percent - data.top10Percent) * 9;
    if (wealth >= data.mean) return 50 + (wealth - data.mean) / (data.top10Percent - data.mean) * 40;
    if (wealth >= data.median) return 50;
    return Math.max(1, (wealth / data.median) * 50);
  }

  return (
    <div className="space-y-4">
      {regions.map((region, index) => (
        <motion.div
          key={region.name}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-4 border border-purple-300 shadow-lg"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              <h4 className="font-bold text-gray-900">{region.name}</h4>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              region.category === 'Top 1%' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold' :
              region.category === 'Top 10%' ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white font-bold' :
              region.category === '평균 이상' ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white font-bold' :
              region.category === '중위값 이상' ? 'bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold' :
              'bg-gray-200 text-gray-700 font-semibold'
            }`}>
              {region.category}
            </span>
          </div>

          <div className="space-y-2">
            <div className="relative h-3 bg-purple-100 rounded-full overflow-hidden border border-purple-200">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${region.percentile}%` }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>

            <div className="flex justify-between text-sm font-medium text-gray-800">
              <span>상위 {(100 - region.percentile).toFixed(1)}%</span>
              <span>중위값: ${region.median.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm text-gray-600 font-medium mt-4"
      >
        * 지역별 자산 분포는 구매력 차이를 반영하지 않은 명목 금액입니다
      </motion.div>
    </div>
  );
}