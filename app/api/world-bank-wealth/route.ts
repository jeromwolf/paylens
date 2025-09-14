import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'cached-world-bank-data.json');

// World Bank API - 무료, API 키 불필요
// GNI per capita (Atlas method), Wealth indicators

const WORLD_BANK_ENDPOINTS = {
  // GNI per capita (Atlas method) - 국가별 소득
  gniPerCapita: 'https://api.worldbank.org/v2/country/all/indicator/NY.GNP.PCAP.CD?format=json&date=2023&per_page=300',
  // Wealth estimates
  wealth: 'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.CD?format=json&date=2023&per_page=300',
  // Population data
  population: 'https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&date=2023&per_page=300'
};

// 캐시된 데이터 저장
async function saveCacheData(data: any) {
  try {
    const dataDir = path.dirname(CACHE_FILE_PATH);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to save World Bank cache data:', error);
  }
}

// 캐시된 데이터 로드
async function loadCacheData() {
  try {
    const fileContent = await fs.readFile(CACHE_FILE_PATH, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
}

// World Bank API에서 데이터 가져오기
async function fetchWorldBankData() {
  try {
    // GNI per capita 데이터 가져오기
    const gniResponse = await fetch(WORLD_BANK_ENDPOINTS.gniPerCapita, {
      next: { revalidate: 86400 } // 24시간 캐시
    });

    if (!gniResponse.ok) {
      throw new Error('World Bank GNI API failed');
    }

    const gniData = await gniResponse.json();

    // World Bank API는 첫 번째 요소가 메타데이터, 두 번째가 실제 데이터
    const gniCountries = gniData[1] || [];

    // 유효한 데이터만 필터링
    const validCountries = gniCountries
      .filter((country: any) => country.value !== null && country.value > 0)
      .map((country: any) => ({
        countryName: country.country.value,
        countryCode: country.countrycode,
        gniPerCapita: country.value,
        year: country.date
      }));

    // 자산 퍼센타일 계산 (GNI 기준)
    const sortedByGni = validCountries.sort((a, b) => b.gniPerCapita - a.gniPerCapita);

    // 글로벌 자산 분포 생성 (GNI 기준 추정)
    const globalWealthPercentiles = generateWealthPercentiles(sortedByGni);

    // 지역별 데이터 생성
    const regionalData = generateRegionalData(validCountries);

    const result = {
      source: 'World Bank',
      lastUpdated: new Date().toISOString(),
      note: 'GNI per capita (Atlas method) 기준 자산 추정',
      count: validCountries.length,
      globalWealthPercentiles,
      regionalWealthData: regionalData,
      countries: sortedByGni.slice(0, 50) // 상위 50개국만 저장
    };

    return result;

  } catch (error) {
    console.error('World Bank API error:', error);
    throw error;
  }
}

// GNI 기준으로 글로벌 자산 퍼센타일 생성
function generateWealthPercentiles(countries: any[]) {
  if (countries.length === 0) return [];

  const maxGni = countries[0].gniPerCapita;
  const minGni = countries[countries.length - 1].gniPerCapita;

  // 자산은 GNI의 약 3-5배로 추정 (World Bank 연구 기반)
  return [
    { percentile: 99.99, minWealth: maxGni * 50, label: "Ultra High Net Worth" },
    { percentile: 99.9, minWealth: maxGni * 10, label: "Very High Net Worth" },
    { percentile: 99.5, minWealth: maxGni * 5, label: "High Net Worth" },
    { percentile: 99, minWealth: maxGni * 3, label: "Millionaire" },
    { percentile: 95, minWealth: maxGni * 2 },
    { percentile: 90, minWealth: maxGni * 1.5 },
    { percentile: 80, minWealth: maxGni * 1.2 },
    { percentile: 70, minWealth: maxGni * 1.0 },
    { percentile: 60, minWealth: maxGni * 0.8 },
    { percentile: 50, minWealth: (maxGni + minGni) / 2 }, // 중위값
    { percentile: 40, minWealth: minGni * 2 },
    { percentile: 30, minWealth: minGni * 1.5 },
    { percentile: 20, minWealth: minGni * 1.2 },
    { percentile: 10, minWealth: minGni * 1.0 },
    { percentile: 5, minWealth: minGni * 0.8 },
    { percentile: 1, minWealth: minGni * 0.5 }
  ];
}

// 지역별 데이터 생성 (주요 국가들 기준)
function generateRegionalData(countries: any[]) {
  // 주요 지역별 국가 매핑
  const regions: { [key: string]: string[] } = {
    "North America": ["USA", "CAN"],
    "Europe": ["DEU", "FRA", "GBR", "ITA", "ESP"],
    "Asia-Pacific": ["JPN", "AUS", "NZL"],
    "China": ["CHN"],
    "Latin America": ["BRA", "ARG", "MEX"],
    "Africa": ["ZAF", "EGY", "NGA"]
  };

  const regionalData: { [key: string]: any } = {};

  Object.entries(regions).forEach(([regionName, countryCodes]) => {
    const regionCountries = countries.filter(c => countryCodes.includes(c.countryCode));

    if (regionCountries.length > 0) {
      const gniValues = regionCountries.map(c => c.gniPerCapita);
      const avgGni = gniValues.reduce((sum, val) => sum + val, 0) / gniValues.length;

      // GNI 기준 자산 추정 (배수 적용)
      regionalData[regionName] = {
        median: Math.round(avgGni * 2.5),
        mean: Math.round(avgGni * 3.5),
        top10Percent: Math.round(avgGni * 8),
        top1Percent: Math.round(avgGni * 25)
      };
    }
  });

  return regionalData;
}

export async function GET() {
  try {
    // World Bank API에서 데이터 가져오기
    const data = await fetchWorldBankData();

    // 성공한 데이터를 캐시에 저장
    await saveCacheData(data);

    return NextResponse.json(data);

  } catch (error) {
    console.error('Failed to fetch World Bank data:', error);

    // 1차 폴백: 캐시된 World Bank 데이터 사용
    const cachedData = await loadCacheData();
    if (cachedData) {
      return NextResponse.json({
        ...cachedData,
        source: 'Cached World Bank Data',
        note: 'API 실패로 이전 저장된 World Bank 데이터 사용'
      });
    }

    // 2차 폴백: 기본 데이터 반환
    return NextResponse.json({
      source: 'Fallback Data',
      lastUpdated: '2024-01-14',
      note: 'World Bank API와 캐시 모두 실패',
      globalWealthPercentiles: [],
      regionalWealthData: {},
      countries: []
    });
  }
}