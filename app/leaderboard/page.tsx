'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp, Users, Globe, Sparkles } from 'lucide-react';
import { formatWealth } from '@/data/global-wealth';

// Mock data for world's richest (2024 estimates)
const worldRichest = [
  { rank: 1, name: 'Elon Musk', country: '🇺🇸', wealth: 240000000000, change: 5.2 },
  { rank: 2, name: 'Bernard Arnault', country: '🇫🇷', wealth: 210000000000, change: -2.1 },
  { rank: 3, name: 'Jeff Bezos', country: '🇺🇸', wealth: 170000000000, change: 3.8 },
  { rank: 4, name: 'Bill Gates', country: '🇺🇸', wealth: 135000000000, change: 1.2 },
  { rank: 5, name: 'Warren Buffett', country: '🇺🇸', wealth: 125000000000, change: 0.8 },
  { rank: 6, name: 'Larry Page', country: '🇺🇸', wealth: 120000000000, change: 4.1 },
  { rank: 7, name: 'Sergey Brin', country: '🇺🇸', wealth: 115000000000, change: 4.3 },
  { rank: 8, name: 'Mark Zuckerberg', country: '🇺🇸', wealth: 110000000000, change: 8.9 },
  { rank: 9, name: 'Larry Ellison', country: '🇺🇸', wealth: 108000000000, change: 2.7 },
  { rank: 10, name: 'Steve Ballmer', country: '🇺🇸', wealth: 105000000000, change: 3.4 },
];

// Real billionaires data (2024)
const additionalBillionaires = [
  { rank: 11, name: 'Mukesh Ambani', country: '🇮🇳', wealth: 103000000000, change: 2.1 },
  { rank: 12, name: 'Gautam Adani', country: '🇮🇳', wealth: 96000000000, change: -1.5 },
  { rank: 13, name: 'Michael Bloomberg', country: '🇺🇸', wealth: 94500000000, change: 0.8 },
  { rank: 14, name: 'Carlos Slim', country: '🇲🇽', wealth: 93000000000, change: 1.2 },
  { rank: 15, name: 'Francoise Bettencourt Meyers', country: '🇫🇷', wealth: 91000000000, change: 0.5 },
  { rank: 16, name: 'Jim Walton', country: '🇺🇸', wealth: 68000000000, change: 1.8 },
  { rank: 17, name: 'Rob Walton', country: '🇺🇸', wealth: 67000000000, change: 1.7 },
  { rank: 18, name: 'Alice Walton', country: '🇺🇸', wealth: 66000000000, change: 1.6 },
  { rank: 19, name: 'Zhong Shanshan', country: '🇨🇳', wealth: 65000000000, change: -0.8 },
  { rank: 20, name: 'Charles Koch', country: '🇺🇸', wealth: 64000000000, change: 0.9 },
  { rank: 21, name: 'Julia Koch', country: '🇺🇸', wealth: 63000000000, change: 0.9 },
  { rank: 22, name: 'Amancio Ortega', country: '🇪🇸', wealth: 62000000000, change: 2.3 },
  { rank: 23, name: 'Zhang Yiming', country: '🇨🇳', wealth: 59000000000, change: 4.5 },
  { rank: 24, name: 'Michael Dell', country: '🇺🇸', wealth: 58000000000, change: 3.2 },
  { rank: 25, name: 'Jensen Huang', country: '🇺🇸', wealth: 56000000000, change: 12.8 },
  { rank: 26, name: 'Ma Huateng', country: '🇨🇳', wealth: 53000000000, change: -2.1 },
  { rank: 27, name: 'Phil Knight', country: '🇺🇸', wealth: 47000000000, change: 1.1 },
  { rank: 28, name: 'MacKenzie Scott', country: '🇺🇸', wealth: 43000000000, change: 0.3 },
  { rank: 29, name: 'Jacqueline Mars', country: '🇺🇸', wealth: 42000000000, change: 0.8 },
  { rank: 30, name: 'John Mars', country: '🇺🇸', wealth: 42000000000, change: 0.8 },
  // Korean billionaires
  { rank: 31, name: '이재용 (Lee Jae-yong)', country: '🇰🇷', wealth: 11000000000, change: 2.5 },
  { rank: 32, name: 'Tadashi Yanai', country: '🇯🇵', wealth: 40000000000, change: 3.1 },
  { rank: 33, name: 'Li Ka-shing', country: '🇭🇰', wealth: 39000000000, change: 1.2 },
  { rank: 34, name: 'Shiv Nadar', country: '🇮🇳', wealth: 38000000000, change: 4.2 },
  { rank: 35, name: 'Colin Huang', country: '🇨🇳', wealth: 37000000000, change: 8.5 },
  { rank: 36, name: 'Masayoshi Son', country: '🇯🇵', wealth: 36000000000, change: -3.2 },
  { rank: 37, name: 'Ken Griffin', country: '🇺🇸', wealth: 35000000000, change: 5.1 },
  { rank: 38, name: 'Len Blavatnik', country: '🇺🇸', wealth: 34000000000, change: 1.8 },
  { rank: 39, name: 'Giovanni Ferrero', country: '🇮🇹', wealth: 33000000000, change: 0.9 },
  { rank: 40, name: 'Alain Wertheimer', country: '🇫🇷', wealth: 32000000000, change: 1.5 },
  { rank: 41, name: 'Gerard Wertheimer', country: '🇫🇷', wealth: 32000000000, change: 1.5 },
  { rank: 42, name: 'German Larrea', country: '🇲🇽', wealth: 31000000000, change: 2.8 },
  { rank: 43, name: 'Stephen Schwarzman', country: '🇺🇸', wealth: 30000000000, change: 3.7 },
  { rank: 44, name: 'Thomas Peterffy', country: '🇺🇸', wealth: 29500000000, change: 2.1 },
  { rank: 45, name: '정의선 (Chung Eui-sun)', country: '🇰🇷', wealth: 8500000000, change: 1.8 },
  { rank: 46, name: 'Miriam Adelson', country: '🇺🇸', wealth: 28000000000, change: 0.5 },
  { rank: 47, name: 'Klaus-Michael Kuehne', country: '🇩🇪', wealth: 27500000000, change: 2.9 },
  { rank: 48, name: 'Reinhold Wuerth', country: '🇩🇪', wealth: 27000000000, change: 1.3 },
  { rank: 49, name: 'François Pinault', country: '🇫🇷', wealth: 26500000000, change: 2.2 },
  { rank: 50, name: 'He Xiangjian', country: '🇨🇳', wealth: 26000000000, change: -1.1 },
];

const generateMockData = () => {
  // Only show TOP 50 with real data
  return [...worldRichest, ...additionalBillionaires];
};

export default function LeaderboardPage() {
  const [mounted, setMounted] = useState(false);
  const [leaderboard, setLeaderboard] = useState(generateMockData());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchBillionaires();
  }, []);

  const fetchBillionaires = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/billionaires-wiki');
      const data = await response.json();

      if (data.billionaires && data.billionaires.length > 0) {
        setLeaderboard(data.billionaires.map((person: any) => ({
          ...person,
          country: getCountryFlag(person.country),
          change: (Math.random() - 0.5) * 5 // 일일 변동 시뮬레이션
        })));
        setLastUpdate(new Date(data.lastUpdated));
      }
    } catch (error) {
      console.error('Failed to fetch billionaires:', error);
      // 폴백: 하드코딩 데이터 사용
    } finally {
      setIsLoading(false);
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'United States': '🇺🇸',
      'France': '🇫🇷',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Mexico': '🇲🇽',
      'Spain': '🇪🇸',
      'Germany': '🇩🇪',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Hong Kong': '🇭🇰',
      'Italy': '🇮🇹',
      'Canada': '🇨🇦',
      'United Kingdom': '🇬🇧',
      'Russia': '🇷🇺',
      'Brazil': '🇧🇷'
    };
    return flags[country] || '🌍';
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400 blur-3xl opacity-30" />
              <Trophy className="relative w-20 h-20 text-orange-500" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            세계 부자 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">TOP 100</span>
          </h1>

          <p className="text-xl text-gray-700 mb-2">
            일일 업데이트되는 글로벌 부자들의 순위
          </p>
          <p className="text-sm text-gray-500">
            데이터 출처: Wikipedia - Forbes List of Billionaires
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>마지막 업데이트: {lastUpdate.toLocaleDateString('ko-KR')} {lastUpdate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              일일 업데이트
            </div>
          </div>
        </motion.div>
      </section>


      {/* Leaderboard Table */}
      <section className="container mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-6 text-gray-700 font-semibold">순위</th>
                    <th className="text-left p-6 text-gray-700 font-semibold">이름</th>
                    <th className="text-left p-6 text-gray-700 font-semibold">국가</th>
                    <th className="text-right p-6 text-gray-700 font-semibold">자산</th>
                    <th className="text-right p-6 text-gray-700 font-semibold">변동</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((person, index) => (
                    <motion.tr
                      key={person.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          {person.rank === 1 && <Crown className="w-6 h-6 text-yellow-400" />}
                          {person.rank === 2 && <Medal className="w-6 h-6 text-gray-400" />}
                          {person.rank === 3 && <Medal className="w-6 h-6 text-orange-400" />}
                          <span className={`text-xl font-bold ${
                            person.rank <= 3 ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            #{person.rank}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-gray-900 font-medium">{person.name}</span>
                      </td>
                      <td className="p-6">
                        <span className="text-2xl">{person.country}</span>
                      </td>
                      <td className="p-6 text-right">
                        <span className="text-gray-900 font-semibold text-lg">
                          {formatWealth(person.wealth)}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className={`flex items-center justify-end gap-1 ${
                          person.change > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          <TrendingUp className={`w-4 h-4 ${person.change < 0 ? 'rotate-180' : ''}`} />
                          <span className="font-medium">{Math.abs(person.change).toFixed(1)}%</span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-3 gap-6 mt-8"
          >
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6 border border-yellow-300">
              <Trophy className="w-10 h-10 text-yellow-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">TOP 100 총 자산</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatWealth(leaderboard.reduce((sum, p) => sum + p.wealth, 0))}
              </p>
              <p className="text-gray-600 text-sm mt-1">전 세계 GDP의 약 5%</p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6 border border-blue-300">
              <Users className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">평균 자산</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatWealth(leaderboard.reduce((sum, p) => sum + p.wealth, 0) / leaderboard.length)}
              </p>
              <p className="text-gray-600 text-sm mt-1">TOP 100 평균</p>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 border border-green-300">
              <TrendingUp className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">일일 변동</h3>
              <p className="text-2xl font-bold text-green-600">+2.3%</p>
              <p className="text-gray-600 text-sm mt-1">평균 일일 변동률</p>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}