import { NextResponse } from 'next/server';

// 실시간 환율 API
export async function GET() {
  try {
    // 옵션 1: 한국은행 API (무료, 공식)
    // https://www.koreaexim.go.kr/ir/HPHKIR020M01?apino=2c954eb1-9867-4d7b-a1f5-51b5d47f7356&searchdate=20240101&data=AP01

    // 옵션 2: Fixer.io (무료 티어 - 월 100회)
    const fixerResponse = await fetch(
      `http://data.fixer.io/api/latest?access_key=${process.env.FIXER_API_KEY || 'demo'}&symbols=KRW,USD`,
      { next: { revalidate: 3600 } } // 1시간 캐시
    );

    if (fixerResponse.ok) {
      const data = await fixerResponse.json();
      const eurToUsd = data.rates.USD;
      const eurToKrw = data.rates.KRW;
      const usdToKrw = eurToKrw / eurToUsd;

      return NextResponse.json({
        source: 'Fixer.io',
        timestamp: new Date().toISOString(),
        rate: usdToKrw,
        cached: false
      });
    }

    // 옵션 3: ExchangeRate-API (무료 티어 - 월 1500회) - API 키 없이도 작동!
    const exchangeRateResponse = await fetch(
      'https://api.exchangerate-api.com/v4/latest/USD',
      { next: { revalidate: 3600 } }
    );

    if (exchangeRateResponse.ok) {
      const data = await exchangeRateResponse.json();
      return NextResponse.json({
        source: 'ExchangeRate-API',
        timestamp: data.date,
        rate: data.rates.KRW,
        cached: false
      });
    }

    // 옵션 4: 네이버 금융 스크래핑 (비공식)
    const naverResponse = await fetch(
      'https://api.manana.kr/exchange/rate/KRW/USD.json',
      { next: { revalidate: 3600 } }
    );

    if (naverResponse.ok) {
      const data = await naverResponse.json();
      return NextResponse.json({
        source: 'Naver Finance',
        timestamp: new Date().toISOString(),
        rate: data[0].rate,
        cached: false
      });
    }

    // 폴백: 최근 평균 환율 (2024년 기준)
    return NextResponse.json({
      source: 'Fallback',
      timestamp: new Date().toISOString(),
      rate: 1350,
      cached: true,
      message: '실시간 환율을 가져올 수 없어 기본값을 사용합니다'
    });

  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    return NextResponse.json({
      source: 'Error',
      timestamp: new Date().toISOString(),
      rate: 1350,
      cached: true,
      error: '환율 정보를 가져오는데 실패했습니다'
    });
  }
}