'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Loader2 } from 'lucide-react';

interface WealthInputProps {
  onCalculate: (wealth: number, currency: 'KRW' | 'USD') => void;
  isCalculating?: boolean;
}

export default function WealthInput({ onCalculate, isCalculating = false }: WealthInputProps) {
  const [wealth, setWealth] = useState('');
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW');
  const [error, setError] = useState('');
  const [exchangeRate, setExchangeRate] = useState(1350);
  const [isLoadingRate, setIsLoadingRate] = useState(true);

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    try {
      const response = await fetch('/api/exchange-rate');
      const data = await response.json();
      if (data.rate) {
        setExchangeRate(Math.round(data.rate));
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    } finally {
      setIsLoadingRate(false);
    }
  };

  const formatNumber = (value: string) => {
    const number = value.replace(/,/g, '');
    if (!isNaN(Number(number))) {
      return Number(number).toLocaleString();
    }
    return value;
  };

  const handleWealthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || !isNaN(Number(value))) {
      setWealth(formatNumber(value));
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wealthValue = Number(wealth.replace(/,/g, ''));

    if (wealthValue <= 0) {
      setError('자산을 입력해주세요');
      return;
    }

    if (currency === 'KRW' && wealthValue < 10000) {
      setError('최소 1만원 이상 입력해주세요');
      return;
    }

    if (currency === 'USD' && wealthValue < 10) {
      setError('최소 $10 이상 입력해주세요');
      return;
    }

    onCalculate(wealthValue, currency);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-3">
            순자산 (총자산 - 총부채)
          </label>

          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                  {currency === 'KRW' ? '₩' : '$'}
                </span>
                <input
                  type="text"
                  value={wealth}
                  onChange={handleWealthChange}
                  placeholder={currency === 'KRW' ? '100,000,000' : '100,000'}
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 text-lg placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  disabled={isCalculating}
                />
              </div>
              {error && (
                <p className="mt-2 text-red-400 text-sm">{error}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrency('KRW')}
                className={`px-4 py-4 rounded-xl font-medium transition-all ${
                  currency === 'KRW'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={isCalculating}
              >
                KRW
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-4 py-4 rounded-xl font-medium transition-all ${
                  currency === 'USD'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={isCalculating}
              >
                USD
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <button
            type="button"
            onClick={() => setWealth(currency === 'KRW' ? '100,000,000' : '74,000')}
            className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            disabled={isCalculating}
          >
            {currency === 'KRW' ? '1억원' : '$74K'}
          </button>
          <button
            type="button"
            onClick={() => setWealth(currency === 'KRW' ? '500,000,000' : '370,000')}
            className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            disabled={isCalculating}
          >
            {currency === 'KRW' ? '5억원' : '$370K'}
          </button>
          <button
            type="button"
            onClick={() => setWealth(currency === 'KRW' ? '1,000,000,000' : '740,000')}
            className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            disabled={isCalculating}
          >
            {currency === 'KRW' ? '10억원' : '$740K'}
          </button>
          <button
            type="button"
            onClick={() => setWealth(currency === 'KRW' ? '5,000,000,000' : '3,700,000')}
            className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            disabled={isCalculating}
          >
            {currency === 'KRW' ? '50억원' : '$3.7M'}
          </button>
        </div>

        <button
          type="submit"
          disabled={isCalculating || !wealth}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              글로벌 데이터 분석 중...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5" />
              세계 랭킹 확인하기
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <TrendingUp className="w-4 h-4" />
          {isLoadingRate ? (
            <span>환율 정보 불러오는 중...</span>
          ) : (
            <span>현재 환율: 1 USD = {exchangeRate.toLocaleString()} KRW</span>
          )}
        </div>
      </form>
    </motion.div>
  );
}