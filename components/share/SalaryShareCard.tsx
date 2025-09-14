'use client';

interface SalaryShareCardProps {
  salary: number;
  country: 'KR' | 'US';
  percentile: number;
  rank: number;
  totalPeople: number;
}

export default function SalaryShareCard({
  salary,
  country,
  percentile,
  rank,
  totalPeople
}: SalaryShareCardProps) {

  const formatSalary = (amount: number, country: 'KR' | 'US') => {
    if (country === 'KR') {
      return `₩${amount.toLocaleString()}`;
    } else {
      return `$${amount.toLocaleString()}`;
    }
  };

  const getCountryInfo = (country: 'KR' | 'US') => {
    if (country === 'KR') {
      return {
        name: '🇰🇷 대한민국',
        flag: '🇰🇷',
        currency: '원',
        population: '5,200만 명'
      };
    } else {
      return {
        name: '🇺🇸 미국',
        flag: '🇺🇸',
        currency: '달러',
        population: '3.3억 명'
      };
    }
  };

  const getPerformanceLevel = (percentile: number) => {
    if (percentile >= 95) return { label: "최상위층", color: "from-yellow-400 to-orange-400", emoji: "👑" };
    if (percentile >= 90) return { label: "상위층", color: "from-emerald-400 to-teal-400", emoji: "🏆" };
    if (percentile >= 75) return { label: "중상위층", color: "from-blue-400 to-indigo-400", emoji: "⭐" };
    if (percentile >= 50) return { label: "중산층", color: "from-purple-400 to-violet-400", emoji: "💼" };
    if (percentile >= 25) return { label: "중하위층", color: "from-gray-400 to-slate-400", emoji: "📊" };
    return { label: "하위층", color: "from-gray-300 to-gray-400", emoji: "📈" };
  };

  const countryInfo = getCountryInfo(country);
  const performance = getPerformanceLevel(percentile);

  return (
    <div className="w-[1200px] h-[630px] relative overflow-hidden">
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900" />

      {/* 데코레이션 요소들 */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
      <div className="absolute top-32 left-32 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl" />
      <div className="absolute bottom-32 right-32 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-16 text-white">

        {/* 헤더 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-wide">PayLens</h1>
          </div>
          <h2 className="text-3xl font-light text-white/90">{countryInfo.name} 연봉 분석</h2>
        </div>

        {/* 메인 결과 카드 */}
        <div className="bg-white/15 backdrop-blur-md rounded-3xl p-10 text-center border border-white/20 shadow-2xl mb-8 min-w-[800px]">

          {/* 국가 정보 */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl">{countryInfo.flag}</span>
            <span className="text-2xl font-semibold text-white/90">{countryInfo.name}</span>
          </div>

          {/* 연봉 */}
          <div className="mb-8">
            <div className="text-5xl font-bold text-white mb-2">
              {formatSalary(salary, country)}
            </div>
            <div className="text-lg text-white/70">
              연간 총소득
            </div>
          </div>

          {/* 퍼센타일 & 등급 */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${performance.color} bg-clip-text text-transparent`}>
                상위 {(100 - percentile).toFixed(1)}%
              </div>
              <div className="text-white/70">
                전국 순위 퍼센타일
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl">{performance.emoji}</span>
                <span className={`text-2xl font-bold bg-gradient-to-r ${performance.color} bg-clip-text text-transparent`}>
                  {performance.label}
                </span>
              </div>
              <div className="text-white/70">
                소득 등급
              </div>
            </div>
          </div>

          {/* 세부 통계 */}
          <div className="bg-white/10 rounded-2xl p-6 grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-300 mb-1">
                #{rank.toLocaleString()}위
              </div>
              <div className="text-sm text-white/60">
                {countryInfo.population} 중 예상 순위
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-300 mb-1">
                {((100 - percentile) * totalPeople / 100).toLocaleString()}명
              </div>
              <div className="text-sm text-white/60">
                나보다 낮은 소득층
              </div>
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="text-center">
          <div className="text-white/60 text-base mb-2">
            {country === 'KR' ? '국세청 근로소득 통계' : 'US Census Bureau 데이터'} 기반 분석
          </div>
          <div className="text-white/40 text-sm">
            paylens-kappa.vercel.app에서 더 자세한 분석 확인
          </div>
        </div>

        {/* 워터마크 */}
        <div className="absolute bottom-8 right-8 text-white/30 text-xs">
          Generated by PayLens
        </div>
      </div>
    </div>
  );
}