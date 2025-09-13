/**
 * 숫자를 천 단위 구분 문자열로 변환
 */
export function formatNumber(value: number, locale: string = 'ko-KR'): string {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * 한국 원화 포맷팅 (만원 단위)
 */
export function formatKRW(manwon: number, showUnit: boolean = true): string {
  if (manwon >= 100000) {
    // 10억 이상
    const billion = manwon / 10000;
    return `${formatNumber(billion, 'ko-KR')}억원${showUnit ? '' : ''}`;
  } else if (manwon >= 10000) {
    // 1억 이상
    const eok = Math.floor(manwon / 10000);
    const remainder = manwon % 10000;
    if (remainder === 0) {
      return `${eok}억원${showUnit ? '' : ''}`;
    }
    return `${eok}억 ${formatNumber(remainder, 'ko-KR')}만원${showUnit ? '' : ''}`;
  } else {
    return `${formatNumber(manwon, 'ko-KR')}만원${showUnit ? '' : ''}`;
  }
}

/**
 * 미국 달러 포맷팅
 */
export function formatUSD(dollars: number, showSymbol: boolean = true): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(dollars);

  if (dollars >= 1000000) {
    const millions = (dollars / 1000000).toFixed(1);
    return showSymbol ? `$${millions}M` : `${millions}M`;
  } else if (dollars >= 1000) {
    const thousands = Math.round(dollars / 1000);
    return showSymbol ? `$${thousands}K` : `${thousands}K`;
  }

  return formatted;
}

/**
 * 퍼센트 포맷팅
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * 퍼센타일 라벨 생성
 */
export function formatPercentileLabel(
  percentile: number,
  country: 'korea' | 'us'
): string {
  const higherThan = 100 - percentile;

  if (country === 'korea') {
    if (percentile === 50) return '중위값';
    if (percentile > 50) return `상위 ${higherThan.toFixed(1)}%`;
    return `하위 ${percentile.toFixed(1)}%`;
  } else {
    if (percentile === 50) return 'Median';
    if (percentile > 50) return `Top ${higherThan.toFixed(1)}%`;
    return `Bottom ${percentile.toFixed(1)}%`;
  }
}

/**
 * 상대적 위치 설명 생성
 */
export function formatRelativePosition(
  percentile: number,
  country: 'korea' | 'us'
): string {
  const higherThan = Math.round(100 - percentile);
  // const lowerThan = Math.round(percentile);

  if (country === 'korea') {
    if (percentile >= 99) return '최상위 1% 이내';
    if (percentile >= 95) return '상위 5% 이내';
    if (percentile >= 90) return '상위 10% 이내';
    if (percentile >= 75) return '상위 25% 이내';
    if (percentile >= 50) return `상위 ${higherThan}%`;
    if (percentile >= 25) return '중하위권';
    return '하위권';
  } else {
    if (percentile >= 99) return 'Top 1%';
    if (percentile >= 95) return 'Top 5%';
    if (percentile >= 90) return 'Top 10%';
    if (percentile >= 75) return 'Top 25%';
    if (percentile >= 50) return `Top ${higherThan}%`;
    if (percentile >= 25) return 'Lower middle';
    return 'Lower tier';
  }
}

/**
 * 큰 숫자 축약 표현
 */
export function formatShortNumber(value: number, country: 'korea' | 'us'): string {
  if (country === 'korea') {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(1)}억`;
    }
    if (value >= 10000) {
      return `${(value / 10000).toFixed(1)}만`;
    }
    return formatNumber(value, 'ko-KR');
  } else {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return formatNumber(value, 'en-US');
  }
}

/**
 * 날짜 포맷팅
 */
export function formatDate(date: string, locale: string = 'ko-KR'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * 소득 차이 설명
 */
export function formatIncomeDifference(
  current: number,
  target: number,
  country: 'korea' | 'us'
): string {
  const difference = target - current;
  const percentDiff = ((difference / current) * 100).toFixed(1);

  if (country === 'korea') {
    if (difference > 0) {
      return `${formatKRW(difference)} (${percentDiff}%) 더 필요`;
    } else {
      return `${formatKRW(Math.abs(difference))} (${Math.abs(Number(percentDiff))}%) 초과`;
    }
  } else {
    if (difference > 0) {
      return `${formatUSD(difference)} (${percentDiff}%) more needed`;
    } else {
      return `${formatUSD(Math.abs(difference))} (${Math.abs(Number(percentDiff))}%) above`;
    }
  }
}