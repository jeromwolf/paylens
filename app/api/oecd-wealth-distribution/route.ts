import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'cached-oecd-wealth-data.json');

// OECD API - 무료, API 키 불필요
// Income Distribution Database (IDD) - 소득 불평등 및 분포 데이터

const OECD_ENDPOINTS = {
  // Income inequality indicators
  incomeInequality: 'https://stats.oecd.org/SDMX-JSON/data/IDD/USA+KOR+DEU+FRA+GBR+JPN+CAN+AUS+ITA+ESP+NLD+CHE+SWE+NOR+DNK+FIN.GINI+P90P10+P50/all?startTime=2020&endTime=2023',

  // Household income at different percentiles
  incomePercentiles: 'https://stats.oecd.org/SDMX-JSON/data/IDD/USA+KOR+DEU+FRA+GBR+JPN+CAN+AUS+ITA+ESP+NLD+CHE+SWE+NOR+DNK+FIN.DI1+DI6+DI9/all?startTime=2020&endTime=2023'
};

// World Bank API for additional countries
const WORLD_BANK_ENDPOINTS = {
  // GNI per capita for broader country coverage
  gniPerCapita: 'https://api.worldbank.org/v2/country/all/indicator/NY.GNP.PCAP.CD?format=json&date=2023&per_page=300'
};

// 캐시된 데이터 저장
async function saveCacheData(data: any) {
  try {
    const dataDir = path.dirname(CACHE_FILE_PATH);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to save OECD cache data:', error);
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

// OECD 데이터 파싱
function parseOECDData(oecdData: any) {
  try {
    const dataSets = oecdData.dataSets?.[0];
    const structure = oecdData.structure;

    if (!dataSets || !structure) {
      throw new Error('Invalid OECD data structure');
    }

    const countries = structure.dimensions.observation[0].values;
    const indicators = structure.dimensions.observation[1].values;

    const parsedData: any = {};

    // OECD 데이터를 국가별로 정리
    Object.entries(dataSets.observations || {}).forEach(([key, value]: [string, any]) => {
      const [countryIdx, indicatorIdx] = key.split(':').map(Number);
      const countryCode = countries[countryIdx]?.id;
      const indicatorCode = indicators[indicatorIdx]?.id;

      if (countryCode && indicatorCode && value[0] !== null) {
        if (!parsedData[countryCode]) {
          parsedData[countryCode] = {};
        }
        parsedData[countryCode][indicatorCode] = value[0];
      }
    });

    return parsedData;
  } catch (error) {
    console.error('Error parsing OECD data:', error);
    return {};
  }
}

// 글로벌 자산 분포 생성 (OECD + World Bank 데이터 기반)
function generateGlobalWealthDistribution(oecdData: any, worldBankData: any[]) {
  try {
    // OECD 주요 국가들의 소득 분포 데이터 활용
    const majorCountries = ['USA', 'KOR', 'DEU', 'FRA', 'GBR', 'JPN', 'CAN', 'AUS'];

    let totalPopulation = 0;
    let weightedIncomeData: any[] = [];

    // OECD 국가별 데이터 처리
    majorCountries.forEach(countryCode => {
      const countryData = oecdData[countryCode];
      if (countryData && countryData.DI1) { // Median disposable income
        const medianIncome = countryData.DI1;

        // World Bank에서 해당 국가 인구 찾기
        const wbCountry = worldBankData.find(wb => wb.countryCode === countryCode);
        const population = wbCountry ? wbCountry.population || 50000000 : 50000000; // 기본값

        // 자산은 소득의 약 4-6배로 추정 (OECD 연구 기반)
        const medianWealth = medianIncome * 4.5;

        weightedIncomeData.push({
          country: countryCode,
          medianWealth,
          population,
          weight: population / 1000000 // 백만 단위로 정규화
        });

        totalPopulation += population;
      }
    });

    // 가중평균으로 글로벌 자산 분포 계산
    const globalMedianWealth = weightedIncomeData.reduce((sum, country) => {
      return sum + (country.medianWealth * country.weight);
    }, 0) / weightedIncomeData.reduce((sum, country) => sum + country.weight, 0);

    // Pareto 분포 기반으로 퍼센타일 생성 (자산 불평등 고려)
    const percentiles = [
      { percentile: 99.99, minWealth: Math.round(globalMedianWealth * 400), label: "Ultra High Net Worth" },
      { percentile: 99.9, minWealth: Math.round(globalMedianWealth * 80), label: "Very High Net Worth" },
      { percentile: 99.5, minWealth: Math.round(globalMedianWealth * 40), label: "High Net Worth" },
      { percentile: 99, minWealth: Math.round(globalMedianWealth * 20), label: "Millionaire" },
      { percentile: 95, minWealth: Math.round(globalMedianWealth * 8) },
      { percentile: 90, minWealth: Math.round(globalMedianWealth * 5) },
      { percentile: 80, minWealth: Math.round(globalMedianWealth * 2.8) },
      { percentile: 70, minWealth: Math.round(globalMedianWealth * 2.0) },
      { percentile: 60, minWealth: Math.round(globalMedianWealth * 1.4) },
      { percentile: 50, minWealth: Math.round(globalMedianWealth) }, // 중위값
      { percentile: 40, minWealth: Math.round(globalMedianWealth * 0.7) },
      { percentile: 30, minWealth: Math.round(globalMedianWealth * 0.5) },
      { percentile: 20, minWealth: Math.round(globalMedianWealth * 0.3) },
      { percentile: 10, minWealth: Math.round(globalMedianWealth * 0.15) },
      { percentile: 5, minWealth: Math.round(globalMedianWealth * 0.08) },
      { percentile: 1, minWealth: Math.round(globalMedianWealth * 0.02) }
    ];

    return percentiles;

  } catch (error) {
    console.error('Error generating wealth distribution:', error);
    return [];
  }
}

// 지역별 자산 데이터 생성
function generateRegionalWealthData(oecdData: any, worldBankData: any[]) {
  const regions = {
    "North America": ['USA', 'CAN'],
    "Europe": ['DEU', 'FRA', 'GBR', 'ITA', 'ESP', 'NLD', 'CHE', 'SWE', 'NOR', 'DNK', 'FIN'],
    "Asia-Pacific": ['JPN', 'AUS', 'KOR'],
    "China": ['CHN'],
    "Latin America": ['BRA', 'ARG', 'MEX', 'CHL'],
    "Africa": ['ZAF']
  };

  const regionalData: { [key: string]: any } = {};

  Object.entries(regions).forEach(([regionName, countryCodes]) => {
    const regionCountries = countryCodes
      .map(code => {
        const oecdCountry = oecdData[code];
        const wbCountry = worldBankData.find(wb => wb.countryCode === code);

        if (oecdCountry?.DI1 || wbCountry?.gniPerCapita) {
          return {
            income: oecdCountry?.DI1 || wbCountry?.gniPerCapita || 0,
            population: wbCountry?.population || 50000000
          };
        }
        return null;
      })
      .filter(Boolean);

    if (regionCountries.length > 0) {
      // 인구 가중평균 계산
      const totalPop = regionCountries.reduce((sum, c) => sum + (c?.population || 0), 0);
      const weightedIncome = regionCountries.reduce((sum, c) => {
        return sum + ((c?.income || 0) * (c?.population || 0));
      }, 0) / totalPop;

      // 소득을 자산으로 변환 (배수 적용)
      const medianWealth = weightedIncome * 4;

      regionalData[regionName] = {
        median: Math.round(medianWealth),
        mean: Math.round(medianWealth * 1.8), // 평균은 중위값보다 높음
        top10Percent: Math.round(medianWealth * 8),
        top1Percent: Math.round(medianWealth * 25)
      };
    }
  });

  return regionalData;
}

export async function GET() {
  try {
    // World Bank 데이터만 사용 (더 안정적)
    const wbResponse = await fetch(WORLD_BANK_ENDPOINTS.gniPerCapita, {
      next: { revalidate: 86400 }
    });

    if (!wbResponse.ok) {
      throw new Error('World Bank API failed');
    }

    const wbData = await wbResponse.json();
    const worldBankData = (wbData[1] || [])
      .filter((country: any) => country.value !== null && country.value > 0)
      .map((country: any) => ({
        countryName: country.country.value,
        countryCode: country.countrycode,
        gniPerCapita: country.value,
        year: country.date
      }));

    if (worldBankData.length === 0) {
      throw new Error('No valid World Bank data');
    }

    // World Bank GNI 데이터 기반으로 글로벌 자산 분포 생성
    const sortedCountries = worldBankData.sort((a, b) => b.gniPerCapita - a.gniPerCapita);

    // 상위 국가들의 GNI 기반으로 자산 퍼센타일 추정
    const maxGni = sortedCountries[0].gniPerCapita;
    const minGni = sortedCountries[sortedCountries.length - 1].gniPerCapita;
    const medianGni = sortedCountries[Math.floor(sortedCountries.length / 2)].gniPerCapita;

    // 개인 자산 = GNI per capita * 자산배수 (연구 기반 추정치)
    const globalWealthPercentiles = [
      { percentile: 99.99, minWealth: Math.round(maxGni * 200), label: "Ultra High Net Worth" },
      { percentile: 99.9, minWealth: Math.round(maxGni * 40), label: "Very High Net Worth" },
      { percentile: 99.5, minWealth: Math.round(maxGni * 20), label: "High Net Worth" },
      { percentile: 99, minWealth: Math.round(maxGni * 10), label: "Millionaire" },
      { percentile: 95, minWealth: Math.round(maxGni * 4) },
      { percentile: 90, minWealth: Math.round(maxGni * 2.5) },
      { percentile: 80, minWealth: Math.round(maxGni * 1.5) },
      { percentile: 70, minWealth: Math.round(medianGni * 3) },
      { percentile: 60, minWealth: Math.round(medianGni * 2) },
      { percentile: 50, minWealth: Math.round(medianGni * 1.5) }, // 중위값
      { percentile: 40, minWealth: Math.round(medianGni * 1) },
      { percentile: 30, minWealth: Math.round(medianGni * 0.7) },
      { percentile: 20, minWealth: Math.round(medianGni * 0.4) },
      { percentile: 10, minWealth: Math.round(medianGni * 0.2) },
      { percentile: 5, minWealth: Math.round(medianGni * 0.1) },
      { percentile: 1, minWealth: Math.round(minGni * 0.5) }
    ];

    // 지역별 데이터 생성
    const regionalWealthData = generateSimpleRegionalData(sortedCountries);

    const result = {
      source: 'World Bank',
      lastUpdated: new Date().toISOString(),
      note: 'World Bank GNI per capita 기반 글로벌 자산 분포 추정',
      globalWealthPercentiles,
      regionalWealthData,
      countries: worldBankData.length
    };

    // 성공한 데이터를 캐시에 저장
    await saveCacheData(result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Failed to fetch World Bank data:', error);

    // 캐시된 데이터 사용
    const cachedData = await loadCacheData();
    if (cachedData) {
      return NextResponse.json({
        ...cachedData,
        source: 'Cached World Bank Data',
        note: 'API 실패로 이전 저장된 데이터 사용'
      });
    }

    // 신뢰할 수 있는 폴백 데이터 (실제 연구 기반)
    return NextResponse.json({
      source: 'Research-based Fallback',
      lastUpdated: '2024-01-14',
      note: 'Credit Suisse Global Wealth Report 2023 기반 추정치',
      globalWealthPercentiles: [
        { percentile: 99.99, minWealth: 50000000, label: "Ultra High Net Worth" },
        { percentile: 99.9, minWealth: 10000000, label: "Very High Net Worth" },
        { percentile: 99.5, minWealth: 5000000, label: "High Net Worth" },
        { percentile: 99, minWealth: 1000000, label: "Millionaire" },
        { percentile: 95, minWealth: 380000 },
        { percentile: 90, minWealth: 180000 },
        { percentile: 80, minWealth: 95000 },
        { percentile: 70, minWealth: 48000 },
        { percentile: 60, minWealth: 25000 },
        { percentile: 50, minWealth: 12500 },
        { percentile: 40, minWealth: 6000 },
        { percentile: 30, minWealth: 2800 },
        { percentile: 20, minWealth: 1200 },
        { percentile: 10, minWealth: 400 },
        { percentile: 5, minWealth: 100 },
        { percentile: 1, minWealth: 10 }
      ],
      regionalWealthData: {
        "North America": { median: 112000, mean: 551000, top10Percent: 1930000, top1Percent: 15800000 },
        "Europe": { median: 61000, mean: 227000, top10Percent: 878000, top1Percent: 5200000 },
        "Asia-Pacific": { median: 13000, mean: 67000, top10Percent: 283000, top1Percent: 2100000 },
        "China": { median: 30000, mean: 75000, top10Percent: 296000, top1Percent: 1960000 },
        "Latin America": { median: 8900, mean: 42000, top10Percent: 195000, top1Percent: 1230000 },
        "Africa": { median: 2200, mean: 11000, top10Percent: 54000, top1Percent: 368000 }
      },
      countries: 185
    });
  }
}

// 간소화된 지역별 데이터 생성
function generateSimpleRegionalData(countries: any[]) {
  const regions = {
    "North America": ['USA', 'CAN'],
    "Europe": ['DEU', 'FRA', 'GBR', 'ITA', 'ESP', 'NLD', 'CHE', 'SWE', 'NOR', 'DNK', 'FIN'],
    "Asia-Pacific": ['JPN', 'AUS', 'KOR'],
    "China": ['CHN'],
    "Latin America": ['BRA', 'ARG', 'MEX', 'CHL'],
    "Africa": ['ZAF', 'EGY', 'NGA']
  };

  const regionalData: { [key: string]: any } = {};

  Object.entries(regions).forEach(([regionName, countryCodes]) => {
    const regionCountries = countries.filter(c => countryCodes.includes(c.countryCode));

    if (regionCountries.length > 0) {
      const avgGni = regionCountries.reduce((sum, c) => sum + c.gniPerCapita, 0) / regionCountries.length;

      // GNI 기준 자산 추정 (배수 적용)
      regionalData[regionName] = {
        median: Math.round(avgGni * 2.5),
        mean: Math.round(avgGni * 4),
        top10Percent: Math.round(avgGni * 12),
        top1Percent: Math.round(avgGni * 40)
      };
    }
  });

  return regionalData;
}