// 실시간 환율 가져오기
export async function getExchangeRate(): Promise<number> {
  try {
    const response = await fetch('/api/exchange-rate');
    const data = await response.json();
    return data.rate || 1350;
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    return 1350; // 폴백 값
  }
}

// 환율 포맷팅
export function formatExchangeRate(rate: number): string {
  return `1 USD = ${rate.toLocaleString()} KRW`;
}