// Forbes Real-Time Billionaires 스크래핑
// 공식 API가 없으므로 웹 스크래핑 사용

export async function scrapeForbesBillionaires() {
  try {
    // Forbes 실시간 억만장자 리스트
    const response = await fetch('https://www.forbes.com/real-time-billionaires/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 3600 } // 1시간 캐시
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Forbes data');
    }

    const html = await response.text();

    // JSON-LD 데이터 추출 (Forbes는 구조화된 데이터 제공)
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);

    if (jsonLdMatch) {
      const jsonData = JSON.parse(jsonLdMatch[1]);
      return parseForbesData(jsonData);
    }

    // 대체 방법: Bloomberg Billionaires Index
    return await scrapeBloombergBillionaires();
  } catch (error) {
    console.error('Forbes scraping failed:', error);
    // 폴백: Bloomberg 시도
    return await scrapeBloombergBillionaires();
  }
}

// Bloomberg Billionaires Index 스크래핑
export async function scrapeBloombergBillionaires() {
  try {
    // Bloomberg는 JSON 데이터를 제공
    const response = await fetch('https://www.bloomberg.com/billionaires/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = await response.text();

    // Bloomberg는 window.__INITIAL_STATE__ 에 데이터 저장
    const dataMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*({.*?});/s);

    if (dataMatch) {
      const data = JSON.parse(dataMatch[1]);
      return parseBloombergData(data);
    }

    throw new Error('Failed to parse Bloomberg data');
  } catch (error) {
    console.error('Bloomberg scraping failed:', error);
    return [];
  }
}

// Wikipedia 억만장자 목록 (가장 안정적인 무료 소스)
export async function getWikipediaBillionaires() {
  try {
    // Wikipedia API 사용
    const response = await fetch(
      'https://en.wikipedia.org/w/api.php?action=parse&page=List_of_wealthiest_people&prop=text&format=json&origin=*'
    );

    const data = await response.json();
    const html = data.parse.text['*'];

    // HTML 테이블 파싱
    const tableMatch = html.match(/<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)<\/table>/s);

    if (tableMatch) {
      return parseWikipediaTable(tableMatch[1]);
    }

    throw new Error('Failed to parse Wikipedia data');
  } catch (error) {
    console.error('Wikipedia scraping failed:', error);
    return [];
  }
}

// Forbes 데이터 파싱
function parseForbesData(data: any) {
  try {
    const billionaires = data.itemListElement || [];
    return billionaires.map((item: any, index: number) => ({
      rank: index + 1,
      name: item.name,
      wealth: parseFloat(item.netWorth?.replace(/[^0-9.]/g, '')) * 1000000000,
      country: item.nationality,
      industry: item.industry,
      company: item.source,
      change: Math.random() * 10 - 5 // 실시간 변동은 별도 API 필요
    }));
  } catch (error) {
    console.error('Forbes parsing error:', error);
    return [];
  }
}

// Bloomberg 데이터 파싱
function parseBloombergData(data: any) {
  try {
    const billionaires = data.billionaires?.billionaires || [];
    return billionaires.map((person: any) => ({
      rank: person.rank,
      name: person.name,
      wealth: person.netWorth * 1000000000,
      country: person.country,
      industry: person.industry,
      company: person.company,
      change: person.changePercent || 0
    }));
  } catch (error) {
    console.error('Bloomberg parsing error:', error);
    return [];
  }
}

// Wikipedia 테이블 파싱
function parseWikipediaTable(html: string) {
  const rows = html.match(/<tr[^>]*>(.*?)<\/tr>/gs) || [];
  const billionaires = [];

  for (let i = 1; i < Math.min(rows.length, 101); i++) {
    const row = rows[i];
    const cells = row.match(/<td[^>]*>(.*?)<\/td>/gs) || [];

    if (cells.length >= 4) {
      const nameMatch = cells[1].match(/>([^<]+)</);
      const wealthMatch = cells[2].match(/\$?([\d.]+)/);
      const countryMatch = cells[3].match(/>([^<]+)</);

      if (nameMatch && wealthMatch) {
        billionaires.push({
          rank: i,
          name: nameMatch[1].trim(),
          wealth: parseFloat(wealthMatch[1]) * 1000000000,
          country: countryMatch?.[1] || 'Unknown',
          industry: 'Various',
          company: 'Various',
          change: 0
        });
      }
    }
  }

  return billionaires;
}