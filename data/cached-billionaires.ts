// 마지막으로 성공한 Wikipedia 데이터 캐시
// API 실패시 이 데이터를 사용

export interface CachedBillionaire {
  rank: number;
  name: string;
  wealth: number;
  country: string;
  source: string;
  change?: number;
}

export interface CachedBillionairesData {
  lastUpdated: string;
  source: string;
  billionaires: CachedBillionaire[];
}

// 초기 데이터 (빈 상태)
export let cachedBillionairesData: CachedBillionairesData = {
  lastUpdated: '',
  source: '',
  billionaires: []
};

// 캐시 업데이트 함수
export function updateBillionairesCache(data: CachedBillionairesData) {
  cachedBillionairesData = data;
}

// 캐시된 데이터 가져오기
export function getCachedBillionaires(): CachedBillionairesData {
  return cachedBillionairesData;
}