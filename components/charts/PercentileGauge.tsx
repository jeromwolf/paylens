'use client';

import { motion } from 'framer-motion';
import { CalculationResult } from '@/types/income';

interface PercentileGaugeProps {
  result: CalculationResult;
}

export default function PercentileGauge({ result }: PercentileGaugeProps) {
  const percentage = 100 - result.higherThan;
  const radius = 120;
  const strokeWidth = 20;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getGradientColor = () => {
    if (result.percentile >= 95) return 'from-purple-500 to-pink-500';
    if (result.percentile >= 90) return 'from-blue-500 to-purple-500';
    if (result.percentile >= 80) return 'from-cyan-500 to-blue-500';
    if (result.percentile >= 70) return 'from-green-500 to-cyan-500';
    if (result.percentile >= 60) return 'from-yellow-500 to-green-500';
    if (result.percentile >= 50) return 'from-orange-500 to-yellow-500';
    return 'from-red-500 to-orange-500';
  };

  const getPercentileLabel = () => {
    if (result.percentile >= 95) return '최상위권';
    if (result.percentile >= 90) return '상위권';
    if (result.percentile >= 80) return '우수';
    if (result.percentile >= 70) return '양호';
    if (result.percentile >= 60) return '평균 이상';
    if (result.percentile >= 50) return '평균';
    return '평균 이하';
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Background circle */}
      <svg
        width={radius * 2}
        height={radius * 2}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={`gradient-${result.country}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(59 130 246)" />
            <stop offset="50%" stopColor="rgb(147 51 234)" />
            <stop offset="100%" stopColor="rgb(236 72 153)" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        {/* Progress circle */}
        <motion.circle
          stroke={`url(#gradient-${result.country})`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      {/* Center content */}
      <div className="absolute text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          <div className="text-5xl font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            {result.higherThan.toFixed(1)}%
          </div>
          <div className="text-sm font-bold text-gray-600 mt-1">
            상위
          </div>
          <div className="text-xs font-medium text-gray-500 mt-1">
            {getPercentileLabel()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}