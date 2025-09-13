'use client';

import { motion } from 'framer-motion';
import { CalculationResult } from '@/types/income';

interface PercentileBarProps {
  result: CalculationResult;
}

export default function PercentileBar({ result }: PercentileBarProps) {
  const percentage = result.percentile;

  const getGradient = () => {
    if (percentage >= 95) return 'from-purple-600 via-pink-500 to-red-500';
    if (percentage >= 90) return 'from-blue-600 via-purple-500 to-pink-500';
    if (percentage >= 80) return 'from-cyan-600 via-blue-500 to-purple-500';
    if (percentage >= 70) return 'from-green-600 via-cyan-500 to-blue-500';
    if (percentage >= 60) return 'from-yellow-600 via-green-500 to-cyan-500';
    if (percentage >= 50) return 'from-orange-600 via-yellow-500 to-green-500';
    return 'from-red-600 via-orange-500 to-yellow-500';
  };

  const milestones = [0, 25, 50, 75, 90, 95, 99];

  return (
    <div className="w-full">
      {/* Percentage Labels */}
      <div className="flex justify-between mb-3 text-xs font-bold text-gray-600">
        {milestones.map((milestone) => (
          <span
            key={milestone}
            className={milestone <= percentage ? 'text-primary-600' : 'text-gray-400'}
          >
            {milestone}%
          </span>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden">
        {/* Milestone Markers */}
        {milestones.slice(1, -1).map((milestone) => (
          <div
            key={milestone}
            className="absolute top-0 bottom-0 w-0.5 bg-white/30 z-10"
            style={{ left: `${milestone}%` }}
          />
        ))}

        {/* Animated Progress */}
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getGradient()} rounded-full shadow-lg`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-white/20 blur-sm" />

          {/* Percentage Indicator */}
          <motion.div
            className="absolute -right-1 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-xl p-2 border-2 border-primary-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
          >
            <span className="text-xs font-black text-primary-600 px-1">
              {percentage.toFixed(1)}%
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3">
        <span className="text-xs font-bold text-gray-500">최하위</span>
        <span className="text-xs font-bold text-gray-500">평균</span>
        <span className="text-xs font-bold text-gray-500">상위권</span>
        <span className="text-xs font-bold text-gray-500">최상위</span>
      </div>
    </div>
  );
}