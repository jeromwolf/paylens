# CLAUDE.md - PayLens 프로젝트 컨텍스트

## ⚠️ 핵심 개발 원칙
### 데이터 정책 (매우 중요)
1. **하드코딩은 UI 프로토타입 개발 시에만 사용**
2. **실제 서비스는 반드시 실제 데이터 API 연동**
3. **하드코딩 사용 시 반드시 Kelly에게 알릴 것**
4. **목표: 실제 서비스 배포, 문서 작성이 아님**

## 프로젝트 개요
PayLens는 한국과 미국의 연봉 퍼센타일을 분석하는 웹 애플리케이션입니다.
- **핵심 기능**: 연봉 입력 → 즉시 상위 몇%인지 확인
- **데이터 신뢰성**: 국세청, US Census Bureau 공식 데이터 사용
- **배포 URL**: https://paylens-kappa.vercel.app

## 기술 스택
- Next.js 15.5.3 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (상태 관리)
- Vercel (배포)

## 주요 해결 과제
1. **SSR/Hydration 이슈**
   - Chart.js 제거 → 커스텀 SVG 컴포넌트로 대체
   - 클라이언트 사이드 mounted 상태 체크 추가

2. **다크 모드 텍스트 가시성**
   - 탭 텍스트 하드코딩으로 해결
   - CSS !important 플래그 사용

3. **API 기본값 처리**
   - action 파라미터 기본값 'calculate' 설정

## 프로젝트 구조
```
paylens/
├── app/
│   ├── page.tsx (→ /analyze 리다이렉트)
│   ├── analyze/page.tsx (메인 분석 페이지)
│   └── api/calculate/route.ts
├── components/
│   ├── charts/
│   │   ├── PercentileGauge.tsx
│   │   └── PercentileBar.tsx
│   └── ui/
├── data/
│   ├── korea-income.ts
│   └── us-income.ts
├── translations/
│   └── index.ts (한/영 번역)
└── lib/
    └── calculations.ts
```

## 배포 정보
- **플랫폼**: Vercel
- **도메인**: paylens-kappa.vercel.app
- **GitHub**: https://github.com/jeromwolf/paylens

## 개발 명령어
```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 배포 (자동)
git push origin main
```

## 주의사항
1. **커밋 시**: 사용자가 명시적으로 요청할 때만 커밋
2. **UI 변경**: 아름다운 UI가 목표 - 그라디언트, 애니메이션 중요
3. **데이터 정확성**: 신뢰가 생명 - 정부 공식 데이터만 사용
4. **언어**: 한국어 우선, 영어 지원

## 현재 상태
- ✅ MVP 완료 (95%)
- ✅ Vercel 배포 완료
- ✅ 모든 핵심 기능 구현
- ⏸️ Google Analytics (추후 구현)

## 📊 데이터 소스 현황

### ✅ 실제 데이터 사용 중
- **/analyze (연봉 분석)**: 국세청, US Census Bureau 공식 데이터
  - 데이터 위치: `/data/korea-income.ts`, `/data/us-income.ts`
  - 업데이트 주기: 연 1회

### ⚠️ 하드코딩 (API 연동 필요)
- **/wealth (세계 랭킹)**: `/data/global-wealth.ts` 하드코딩
  - TODO: World Bank API 또는 OECD API 연동
  - 필요 데이터: Credit Suisse Global Wealth Report

- **/leaderboard (TOP 100)**: 목 데이터 사용
  - TODO: Wikipedia API 또는 Forbes 스크래핑
  - 필요 데이터: 실시간 억만장자 순위

### 🔧 사용 가능한 무료 API
1. World Bank API - 국가별 GNI, 자산 데이터
2. OECD Data API - 글로벌 자산 분포
3. Wikipedia API - 억만장자 목록
4. Alpha Vantage - 주식 시세 (무료 티어)

## 담당자
- **프로젝트 오너**: Kelly
- **AI 어시스턴트**: Claude

---
*Last updated: 2025-01-14*