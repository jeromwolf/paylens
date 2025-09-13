export const translations = {
  ko: {
    // Header
    analyze: '분석하기',
    about: '소개',
    dataSource: '데이터 출처',
    start: '시작하기',

    // Homepage
    heroTitle: '내 연봉은 상위 몇%?',
    heroSubtitle: '정확한 데이터로 당신의 소득 위치를 렌즈처럼 선명하게 보여드립니다',
    selectCountry: '국가를 선택하세요',
    enterSalary: '연봉을 입력하세요',
    analyzeNow: '지금 분석하기',

    // Countries
    korea: '🇰🇷 한국',
    usa: '🇺🇸 미국',

    // SalaryInput
    annualSalaryKorea: '연간 총 급여 (세전)',
    annualSalaryUS: 'Annual Salary (Pre-tax)',
    koreanWon: '만원',
    usDollar: 'USD',

    // Salary suggestions
    newGradAvg: '신입 평균',
    fiveYearAvg: '5년차 평균',
    tenYearAvg: '10년차 평균',
    executiveLevel: '임원급',

    // PercentileDisplay
    higherThan: '상위',
    topTier: '최상위권입니다!',
    topTenPercent: '상위 10% 안에 있습니다!',
    excellentLevel: '훌륭한 수준입니다!',
    aboveAverage: '평균보다 높습니다!',
    aboveMedian: '중위값 이상입니다!',
    roomToGrow: '성장 가능성이 있습니다!',

    // Stats
    analyzedSalaries: '분석된 연봉',
    dataAccuracy: '데이터 정확도',
    latestDataYear: '최신 데이터',

    // Features
    whySpecial: 'PayLens가 특별한 이유',
    reliableServiceDesc: '정확하고 신뢰할 수 있는 소득 분석 서비스',
    accurateData: '정확한 데이터',
    accurateDataDesc: '국세청과 US Census Bureau의 공식 통계 기반',
    instantCheck: '즉시 확인',
    instantCheckDesc: '연봉 입력만으로 바로 퍼센타일 확인',
    globalComparison: '국제 비교',
    globalComparisonDesc: '한국과 미국 소득 수준 비교 분석',
    goalSetting: '목표 설정',
    goalSettingDesc: '원하는 퍼센타일 도달에 필요한 소득 계산'
  },
  en: {
    // Header
    analyze: 'Analyze',
    about: 'About',
    dataSource: 'Data Source',
    start: 'Get Started',

    // Homepage
    heroTitle: 'What percentile is my salary?',
    heroSubtitle: 'Precise data to show your income position crystal clear like a lens',
    selectCountry: 'Select a country',
    enterSalary: 'Enter your salary',
    analyzeNow: 'Analyze Now',

    // Countries
    korea: '🇰🇷 Korea',
    usa: '🇺🇸 USA',

    // SalaryInput
    annualSalaryKorea: 'Annual Salary (Pre-tax)',
    annualSalaryUS: 'Annual Salary (Pre-tax)',
    koreanWon: 'KRW',
    usDollar: 'USD',

    // Salary suggestions
    newGradAvg: 'New Grad Avg',
    fiveYearAvg: '5-Year Avg',
    tenYearAvg: '10-Year Avg',
    executiveLevel: 'Executive Level',

    // PercentileDisplay
    higherThan: 'Top',
    topTier: 'Top tier!',
    topTenPercent: 'Top 10%!',
    excellentLevel: 'Excellent level!',
    aboveAverage: 'Above average!',
    aboveMedian: 'Above median!',
    roomToGrow: 'Room to grow!',

    // Stats
    analyzedSalaries: 'Salaries Analyzed',
    dataAccuracy: 'Data Accuracy',
    latestDataYear: 'Latest Data',

    // Features
    whySpecial: 'Why PayLens is Special',
    reliableServiceDesc: 'Accurate and reliable income analysis service',
    accurateData: 'Accurate Data',
    accurateDataDesc: 'Based on official statistics from Korean Tax Service and US Census Bureau',
    instantCheck: 'Instant Check',
    instantCheckDesc: 'Get your percentile instantly just by entering your salary',
    globalComparison: 'Global Comparison',
    globalComparisonDesc: 'Compare income levels between Korea and the United States',
    goalSetting: 'Goal Setting',
    goalSettingDesc: 'Calculate the income needed to reach your desired percentile'
  }
};

export type TranslationKey = keyof typeof translations.ko;