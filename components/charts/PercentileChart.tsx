'use client';

import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { IncomeDataset } from '@/types/income';
import koreaData from '@/data/korea-income-percentile.json';
import usData from '@/data/us-income-percentile.json';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

interface PercentileChartProps {
  country: 'korea' | 'us';
  currentIncome: number;
  currentPercentile: number;
}

export default function PercentileChart({ country, currentIncome, currentPercentile }: PercentileChartProps) {
  const isKorea = country === 'korea';
  const data = (isKorea ? koreaData : usData) as IncomeDataset;

  // Select key percentiles for display
  const keyPercentiles = [10, 25, 50, 75, 90, 95, 99];
  const chartData = keyPercentiles.map(p => {
    const point = data.percentiles.find(d => d.percentile === p);
    return point ? point.income : 0;
  });

  // Add current position
  const labels = keyPercentiles.map(p => {
    if (p === 50) return isKorea ? '중위값' : 'Median';
    if (p < 50) return isKorea ? `하위 ${p}%` : `Bottom ${p}%`;
    return isKorea ? `상위 ${100 - p}%` : `Top ${100 - p}%`;
  });

  const chartConfig = {
    labels,
    datasets: [
      {
        label: isKorea ? '소득 분포' : 'Income Distribution',
        data: chartData,
        backgroundColor: chartData.map((_, index) => {
          const percentile = keyPercentiles[index];
          // Highlight the bracket where user falls
          if (currentPercentile >= percentile && currentPercentile < (keyPercentiles[index + 1] || 100)) {
            return 'rgba(79, 70, 229, 0.8)'; // Primary color
          }
          return 'rgba(156, 163, 175, 0.3)'; // Gray
        }),
        borderColor: chartData.map((_, index) => {
          const percentile = keyPercentiles[index];
          if (currentPercentile >= percentile && currentPercentile < (keyPercentiles[index + 1] || 100)) {
            return 'rgba(79, 70, 229, 1)';
          }
          return 'rgba(156, 163, 175, 0.5)';
        }),
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: isKorea ? '내 위치' : 'Your Position',
        data: chartData.map(() => currentIncome),
        type: 'line' as const,
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 3,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(239, 68, 68, 1)',
        pointRadius: 0,
        fill: false,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
          },
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: isKorea ? '한국 소득 분포 차트' : 'US Income Distribution Chart',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: { dataset: { label?: string }, parsed: { y: number } }) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (isKorea) {
              return `${label}: ${value.toLocaleString()}만원`;
            }
            return `${label}: $${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function(value: string | number) {
            const numValue = typeof value === 'string' ? parseFloat(value) : value;
            if (isKorea) {
              if (numValue >= 10000) {
                return `${(numValue / 10000).toFixed(1)}억`;
              }
              return `${numValue.toLocaleString()}만`;
            }
            if (numValue >= 1000000) {
              return `$${(numValue / 1000000).toFixed(1)}M`;
            }
            if (numValue >= 1000) {
              return `$${(numValue / 1000).toFixed(1)}K`;
            }
            return `$${numValue}`;
          },
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white rounded-2xl shadow-xl p-6"
    >
      <div className="h-80">
        <Bar data={chartConfig as any} options={options} />
      </div>

      {/* Income Ranking Table */}
      <div className="mt-8">
        <h3 className="text-xl font-black mb-4 text-gray-900">
          {isKorea ? '주요 소득 구간' : 'Key Income Brackets'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-100">
                <th className="text-left py-3 px-3 font-black text-gray-900">
                  {isKorea ? '퍼센타일' : 'Percentile'}
                </th>
                <th className="text-right py-3 px-3 font-black text-gray-900">
                  {isKorea ? '연봉' : 'Salary'}
                </th>
                <th className="text-right py-3 px-3 font-black text-gray-900">
                  {isKorea ? '순위' : 'Rank'}
                </th>
                <th className="text-center py-3 px-3 font-black text-gray-900">
                  {isKorea ? '상태' : 'Status'}
                </th>
              </tr>
            </thead>
            <tbody>
              {[99, 95, 90, 75, 50, 25, 10].map((p) => {
                const point = data.percentiles.find(d => d.percentile === p);
                if (!point) return null;
                const isCurrentBracket = currentPercentile >= p && currentPercentile < (p === 99 ? 100 : data.percentiles.find(d => d.percentile > p)?.percentile || 100);

                return (
                  <tr
                    key={p}
                    className={`border-b transition-colors ${isCurrentBracket ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="py-2 px-2">
                      <span className={`font-medium ${isCurrentBracket ? 'text-primary-600' : 'text-gray-700'}`}>
                        {p < 50 ? (isKorea ? `하위 ${p}%` : `Bottom ${p}%`) :
                         p === 50 ? (isKorea ? '중위값' : 'Median') :
                         (isKorea ? `상위 ${100 - p}%` : `Top ${100 - p}%`)}
                      </span>
                    </td>
                    <td className="text-right py-2 px-2 font-mono">
                      {isKorea ? `${point.income.toLocaleString()}만원` : `$${point.income.toLocaleString()}`}
                    </td>
                    <td className="text-right py-2 px-2">
                      <span className="text-gray-500">
                        {isKorea ? `상위 ${(100 - p).toFixed(0)}%` : `Top ${(100 - p).toFixed(0)}%`}
                      </span>
                    </td>
                    <td className="text-center py-2 px-2">
                      {isCurrentBracket ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          YOU
                        </span>
                      ) : currentPercentile > p ? (
                        <span className="text-green-500">✓</span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
        <p className="text-sm text-gray-700">
          💡 {isKorea ? '알고 계셨나요?' : 'Did you know?'}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {currentPercentile >= 90
            ? (isKorea ? '당신은 상위 10%에 속합니다! 전체 근로자의 90%보다 높은 소득을 받고 있습니다.' : 'You are in the top 10%! Your income is higher than 90% of all workers.')
            : currentPercentile >= 75
            ? (isKorea ? '상위 25%에 속합니다. 4명 중 1명만이 당신보다 높은 소득을 받습니다.' : 'You are in the top 25%. Only 1 in 4 people earn more than you.')
            : currentPercentile >= 50
            ? (isKorea ? '중위값 이상입니다. 전체의 절반 이상보다 높은 소득입니다.' : 'Above median! Your income is higher than more than half of all workers.')
            : (isKorea ? '성장 잠재력이 있습니다. 경력과 스킬 향상으로 더 높은 소득을 목표로 해보세요.' : 'Room to grow! Focus on career development to increase your income.')}
        </p>
      </div>
    </motion.div>
  );
}