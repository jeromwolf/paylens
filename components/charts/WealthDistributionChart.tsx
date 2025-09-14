'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface WealthDistributionChartProps {
  percentile: number;
  wealth: number;
  currency: 'KRW' | 'USD';
}

export default function WealthDistributionChart({
  percentile,
  wealth,
  currency
}: WealthDistributionChartProps) {
  // Pyramid levels with population distribution
  const pyramidLevels = [
    { label: 'Top 0.1%', percentile: 99.9, color: 'from-yellow-400 to-yellow-500', population: '8M' },
    { label: 'Top 1%', percentile: 99, color: 'from-orange-400 to-orange-500', population: '80M' },
    { label: 'Top 5%', percentile: 95, color: 'from-purple-400 to-purple-500', population: '400M' },
    { label: 'Top 10%', percentile: 90, color: 'from-blue-400 to-blue-500', population: '800M' },
    { label: 'Top 25%', percentile: 75, color: 'from-green-400 to-green-500', population: '2B' },
    { label: 'Top 50%', percentile: 50, color: 'from-teal-400 to-teal-500', population: '4B' },
    { label: 'Bottom 50%', percentile: 0, color: 'from-gray-400 to-gray-500', population: '4B' },
  ];

  const userLevel = pyramidLevels.findIndex(level => percentile >= level.percentile);

  return (
    <div className="h-full flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
        글로벌 자산 피라미드
      </h3>

      <div className="space-y-2">
        {pyramidLevels.map((level, index) => {
          const widthPercent = 10 + (index * 15);
          const isUserLevel = index === userLevel;

          return (
            <motion.div
              key={level.label}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div
                className="relative mx-auto"
                style={{ width: `${widthPercent}%` }}
              >
                <div
                  className={`h-12 bg-gradient-to-r ${level.color} rounded-lg flex items-center justify-between px-4 ${
                    isUserLevel ? 'ring-4 ring-purple-500 shadow-lg shadow-purple-500/20' : ''
                  }`}
                >
                  <span className="text-xs font-semibold text-white">
                    {level.label}
                  </span>
                  <span className="text-xs text-white/90">
                    {level.population}
                  </span>
                </div>

                {isUserLevel && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -right-12 top-1/2 -translate-y-1/2"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500 blur-xl animate-pulse" />
                      <div className="relative bg-purple-600 text-white rounded-full p-2">
                        <Users className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-6"
      >
        <p className="text-sm text-gray-600">
          피라미드 너비 = 인구 비율
        </p>
      </motion.div>
    </div>
  );
}