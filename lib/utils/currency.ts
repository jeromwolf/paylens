/**
 * 환율 정보
 * 실시간 API 대신 고정 환율 사용 (필요시 API 연동 가능)
 */
const EXCHANGE_RATES = {
  KRW_TO_USD: 0.00075,  // 1 KRW = 0.00075 USD (1 USD = 1,333 KRW 기준)
  USD_TO_KRW: 1333,      // 1 USD = 1,333 KRW
  lastUpdated: '2025-01-13'
};

/**
 * 원화를 달러로 변환
 */
export function krwToUsd(krwAmount: number): number {
  return Math.round(krwAmount * 10000 * EXCHANGE_RATES.KRW_TO_USD);
}

/**
 * 달러를 원화로 변환
 */
export function usdToKrw(usdAmount: number): number {
  return Math.round(usdAmount * EXCHANGE_RATES.USD_TO_KRW / 10000);
}

/**
 * 만원 단위를 달러로 변환
 */
export function manwonToUsd(manwon: number): number {
  const krw = manwon * 10000;
  return Math.round(krw * EXCHANGE_RATES.KRW_TO_USD);
}

/**
 * 달러를 만원 단위로 변환
 */
export function usdToManwon(usd: number): number {
  const krw = usd * EXCHANGE_RATES.USD_TO_KRW;
  return Math.round(krw / 10000);
}

/**
 * 구매력 평가(PPP) 적용
 * 한국의 물가 수준을 고려한 실질 구매력 변환
 * PPP 계수: 약 0.82 (한국이 미국보다 약 18% 저렴)
 */
const PPP_FACTOR = 0.82;

export function applyPPP(usdAmount: number, fromCountry: 'korea' | 'us'): number {
  if (fromCountry === 'korea') {
    // 한국 → 미국: 구매력 증가
    return Math.round(usdAmount / PPP_FACTOR);
  } else {
    // 미국 → 한국: 구매력 감소
    return Math.round(usdAmount * PPP_FACTOR);
  }
}

/**
 * 환율 정보 가져오기
 */
export function getExchangeRateInfo() {
  return {
    rate: EXCHANGE_RATES.USD_TO_KRW,
    inverseRate: EXCHANGE_RATES.KRW_TO_USD,
    lastUpdated: EXCHANGE_RATES.lastUpdated,
    pppFactor: PPP_FACTOR
  };
}

/**
 * 통화 심볼 가져오기
 */
export function getCurrencySymbol(currency: 'KRW' | 'USD'): string {
  return currency === 'KRW' ? '₩' : '$';
}

/**
 * 양방향 환율 변환
 */
export function convertCurrency(
  amount: number,
  from: 'KRW' | 'USD',
  to: 'KRW' | 'USD',
  unit: 'default' | 'manwon' = 'default'
): number {
  if (from === to) return amount;

  if (from === 'KRW' && to === 'USD') {
    if (unit === 'manwon') {
      return manwonToUsd(amount);
    }
    return krwToUsd(amount);
  } else {
    if (unit === 'manwon') {
      return usdToManwon(amount);
    }
    return usdToKrw(amount);
  }
}