'use client';

import { useState, useEffect } from 'react';
import { formatKRW, formatUSD } from '@/lib/utils/format';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

interface SalaryInputProps {
  country: 'korea' | 'us';
  value: number;
  onChange: (value: number) => void;
  onAnalyze?: () => void;
}

export default function SalaryInput({ country, value, onChange, onAnalyze }: SalaryInputProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  const isKorea = country === 'korea';

  const placeholders = {
    korea: ['3000', '5000', '7000', '10000'],
    us: ['50000', '75000', '100000', '150000']
  };

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(val);
    onChange(parseInt(val) || 0);
  };

  const getFormattedDisplay = () => {
    const num = parseInt(inputValue) || 0;
    return isKorea ? formatKRW(num) : formatUSD(num);
  };

  const getSuggestions = () => {
    if (isKorea) {
      return [
        { value: 3000, label: t('newGradAvg') },
        { value: 5000, label: t('fiveYearAvg') },
        { value: 7000, label: t('tenYearAvg') },
        { value: 10000, label: t('executiveLevel') }
      ];
    } else {
      return [
        { value: 50000, label: t('newGradAvg') },
        { value: 75000, label: t('fiveYearAvg') },
        { value: 100000, label: t('tenYearAvg') },
        { value: 150000, label: t('executiveLevel') }
      ];
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="mb-6">
        <label className="block text-sm font-black text-gray-900 mb-2">
          {isKorea ? t('annualSalaryKorea') : t('annualSalaryUS')}
        </label>

        {/* Input Container */}
        <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl blur-xl opacity-20" />

          <div className="relative bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-primary-200 transition-colors">
            <div className="flex items-center p-4">
              <span className="text-2xl mr-3">
                {isKorea ? '🇰🇷' : '🇺🇸'}
              </span>

              <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholders[country][placeholderIndex]}
                className="flex-1 text-2xl font-black text-gray-900 outline-none placeholder-gray-400"
              />

              <span className="text-gray-800 font-black ml-2">
                {isKorea ? t('koreanWon') : t('usDollar')}
              </span>
            </div>

            {/* Live Preview */}
            {inputValue && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-4 pb-3"
              >
                <div className="text-sm text-blue-700 font-black">
                  = {getFormattedDisplay()}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {getSuggestions().map((suggestion, index) => (
            <motion.button
              key={suggestion.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => {
                setInputValue(suggestion.value.toString());
                onChange(suggestion.value);
              }}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-all hover:scale-105"
            >
              <span className="block font-bold">
                {isKorea ? `${suggestion.value.toLocaleString()}만원` : `$${(suggestion.value / 1000)}K`}
              </span>
              <span className="text-xs text-gray-500">{suggestion.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Analyze Button */}
        {onAnalyze && inputValue && parseInt(inputValue) > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onAnalyze}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform transition-all hover:scale-105"
          >
            <span className="flex items-center justify-center">
{t('analyze')}
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}