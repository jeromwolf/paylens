import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'cached-wikipedia-data.json');

// 캐시된 데이터 저장
async function saveCacheData(data: any) {
  try {
    const dataDir = path.dirname(CACHE_FILE_PATH);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to save cache data:', error);
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

// Wikipedia API - 무료, API 키 불필요
export async function GET() {
  try {
    // Forbes Billionaires List from Wikipedia
    const response = await fetch(
      'https://en.wikipedia.org/w/api.php?action=parse&page=Forbes_list_of_billionaires&format=json&origin=*&prop=text',
      { next: { revalidate: 86400 } } // 24시간 캐시 (일일 업데이트)
    );

    if (!response.ok) {
      throw new Error('Wikipedia API failed');
    }

    const data = await response.json();
    const html = data.parse?.text['*'] || '';

    // HTML에서 테이블 추출
    const tableMatch = html.match(/<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)<\/table>/s);

    let parsedData;
    if (!tableMatch) {
      // 대체: The World's Billionaires 페이지
      const altResponse = await fetch(
        'https://en.wikipedia.org/w/api.php?action=parse&page=The_World%27s_Billionaires&format=json&origin=*&prop=text',
        { next: { revalidate: 86400 } }
      );

      const altData = await altResponse.json();
      parsedData = parseWikipediaData(altData.parse?.text['*'] || '');
    } else {
      parsedData = parseWikipediaData(html);
    }

    // 성공한 데이터를 캐시에 저장
    if (parsedData.billionaires.length > 0) {
      await saveCacheData(parsedData);
    }

    return NextResponse.json(parsedData);

  } catch (error) {
    console.error('Failed to fetch Wikipedia data:', error);

    // 1차 폴백: 이전에 저장된 Wikipedia 데이터 사용
    const cachedData = await loadCacheData();
    if (cachedData && cachedData.billionaires.length > 0) {
      return NextResponse.json({
        ...cachedData,
        source: 'Cached Wikipedia Data',
        note: 'API 실패로 이전 저장된 데이터 사용'
      });
    }

    // 2차 폴백: 하드코딩 데이터 (캐시도 없을 때만)
    return NextResponse.json({
      source: 'Fallback Data',
      lastUpdated: '2024-01-14',
      note: 'API와 캐시 모두 실패로 기본 데이터 사용',
      billionaires: getFallbackData()
    });
  }
}

function parseWikipediaData(html: string) {
  const billionaires = [];

  // 테이블 행 추출
  const rows = html.match(/<tr[^>]*>(.*?)<\/tr>/gs) || [];

  for (let i = 1; i < Math.min(rows.length, 101); i++) {
    const row = rows[i];
    const cells = row.match(/<td[^>]*>(.*?)<\/td>/gs) || [];

    if (cells.length >= 4) {
      // 텍스트 추출 (HTML 태그 제거)
      const cleanText = (html: string) => {
        return html.replace(/<[^>]*>/g, '').trim();
      };

      const rank = i;
      const nameCell = cleanText(cells[1] || '');
      const wealthCell = cleanText(cells[2] || '');
      const countryCell = cleanText(cells[3] || '');
      const sourceCell = cleanText(cells[4] || '');

      // 자산 금액 파싱 ($XX billion)
      const wealthMatch = wealthCell.match(/\$?([\d.]+)\s*billion/i);
      const wealth = wealthMatch ? parseFloat(wealthMatch[1]) * 1000000000 : 0;

      if (nameCell && wealth > 0) {
        billionaires.push({
          rank,
          name: nameCell,
          wealth,
          country: countryCell || 'Unknown',
          source: sourceCell || 'Various',
          change: 0 // Wikipedia는 일일 변동 데이터 없음
        });
      }
    }
  }

  return {
    source: 'Wikipedia',
    lastUpdated: new Date().toISOString(),
    count: billionaires.length,
    billionaires
  };
}

// 폴백 데이터 (Wikipedia 접근 실패 시)
function getFallbackData() {
  return [
    { rank: 1, name: 'Elon Musk', wealth: 240000000000, country: 'United States', source: 'Tesla, SpaceX' },
    { rank: 2, name: 'Bernard Arnault', wealth: 211000000000, country: 'France', source: 'LVMH' },
    { rank: 3, name: 'Jeff Bezos', wealth: 177000000000, country: 'United States', source: 'Amazon' },
    { rank: 4, name: 'Bill Gates', wealth: 139000000000, country: 'United States', source: 'Microsoft' },
    { rank: 5, name: 'Warren Buffett', wealth: 135000000000, country: 'United States', source: 'Berkshire Hathaway' },
    { rank: 6, name: 'Larry Page', wealth: 129000000000, country: 'United States', source: 'Google' },
    { rank: 7, name: 'Sergey Brin', wealth: 124000000000, country: 'United States', source: 'Google' },
    { rank: 8, name: 'Mark Zuckerberg', wealth: 120000000000, country: 'United States', source: 'Meta' },
    { rank: 9, name: 'Larry Ellison', wealth: 117000000000, country: 'United States', source: 'Oracle' },
    { rank: 10, name: 'Steve Ballmer', wealth: 112000000000, country: 'United States', source: 'Microsoft' },
    // ... 더 많은 데이터
  ];
}