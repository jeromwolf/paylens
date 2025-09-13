# PayLens 💰

<div align="center">

![PayLens Logo](https://img.shields.io/badge/PayLens-💎-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

**정확한 데이터로 당신의 소득 위치를 렌즈처럼 선명하게 보여드립니다**

[🚀 데모 보기](http://localhost:3912) | [📖 문서](https://github.com/your-username/paylens) | [🐛 버그 신고](https://github.com/your-username/paylens/issues)

</div>

---

## 📋 목차

- [소개](#-소개)
- [주요 기능](#-주요-기능)
- [빠른 시작](#-빠른-시작)
- [스크린샷](#-스크린샷)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [개발 환경 설정](#-개발-환경-설정)
- [데이터 신뢰성](#-데이터-신뢰성)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

## 🎯 소개

PayLens는 한국과 미국의 **공식 정부 통계**를 기반으로 연봉 퍼센타일을 분석해주는 현대적인 웹 애플리케이션입니다.

사용자의 연봉이 전체 근로자 중 상위 몇 %에 해당하는지 **즉시 분석**하고, 목표 퍼센타일 달성을 위한 **구체적인 가이드**를 제공합니다.

## ✨ 주요 기능

<table>
<tr>
<td>

### 🇰🇷 한국 연봉 분석
- 국세청 근로소득 백분위 자료 기반
- 2024년 최신 데이터
- 대한민국 전체 근로소득자 기준

</td>
<td>

### 🇺🇸 미국 연봉 분석
- US Census Bureau 데이터 기반
- 2024년 최신 데이터
- 미국 전체 가구소득 기준

</td>
</tr>
<tr>
<td>

### 🌏 국가 간 비교
- 한국 ↔ 미국 소득 수준 비교
- 동일 퍼센타일 기준 환산
- 구매력 평가 고려

</td>
<td>

### 🎯 스마트 목표 설정
- AI 기반 현실적 목표 제안
- 점진적 퍼센타일 개선 가이드
- 필요 추가 소득 정확 계산

</td>
</tr>
<tr>
<td colspan="2">

### 🌐 완벽한 이중 언어 지원
- **한국어/English** 실시간 전환
- 모든 UI 요소 완전 번역
- 일관된 사용자 경험

</td>
</tr>
</table>

## 🚀 빠른 시작

### Step 1: 국가 선택 및 연봉 입력

메인 페이지에서 분석하고 싶은 국가를 선택하고 연봉을 입력하세요.

<img src="https://via.placeholder.com/800x400/f3f4f6/374151?text=Step+1%3A+%EA%B5%AD%EA%B0%80+%EC%84%A0%ED%83%9D+%EB%B0%8F+%EC%97%B0%EB%B4%89+%EC%9E%85%EB%A0%A5" alt="Step 1 Screenshot" width="100%" />

**주요 기능:**
- 🇰🇷 한국 / 🇺🇸 미국 선택
- 연봉 입력 (만원/USD)
- 실시간 환율 표시
- 추천 연봉 버튼 (신입/5년차/10년차/임원급)

---

### Step 2: 퍼센타일 즉시 확인

입력한 연봉이 상위 몇 %에 해당하는지 **실시간으로** 확인할 수 있습니다.

<img src="https://via.placeholder.com/800x400/dbeafe/1e40af?text=Step+2%3A+%ED%8D%BC%EC%84%BC%ED%83%80%EC%9D%BC+%ED%99%95%EC%9D%B8" alt="Step 2 Screenshot" width="100%" />

**표시 정보:**
- 🏆 **상위 퍼센타일** (대형 표시)
- 📊 소득 그룹 분류
- 📈 평균 대비 비율
- 🎯 중위값 대비 위치
- 💎 성취 단계별 이모지

---

### Step 3: 상세 분석 및 목표 설정

상세한 분석 결과와 함께 **스마트한 목표**를 설정하고 달성 방법을 확인하세요.

<img src="https://via.placeholder.com/800x400/f0fdf4/16a34a?text=Step+3%3A+%EC%83%81%EC%84%B8+%EB%B6%84%EC%84%9D+%EB%B0%8F+%EB%AA%A9%ED%91%9C+%EC%84%A4%EC%A0%95" alt="Step 3 Screenshot" width="100%" />

**상세 기능:**
- 🎯 **AI 추천 목표**: 현실적이고 달성 가능한 다음 단계 제안
- 💰 **필요 추가 소득**: 정확한 금액 계산
- 📊 **데이터 신뢰성**: 공식 통계 출처 명시
- 🌍 **국가 간 비교**: 동일 퍼센타일 기준 환산

## 🛠 기술 스택

### Frontend Framework
```typescript
// Next.js 14 with App Router
"next": "^14.0.0"
"react": "^18.0.0"
"typescript": "^5.0.0"
```

### Styling & Animation
```css
/* Tailwind CSS + Custom Design System */
"tailwindcss": "^3.0.0"
"framer-motion": "^10.0.0"
```

### State Management
```javascript
// Zustand for lightweight state management
"zustand": "^4.0.0"
```

### Core Technologies

| 기술 | 용도 | 버전 |
|------|------|------|
| **Next.js** | React 프레임워크 | 14.x |
| **TypeScript** | 타입 안전성 | 5.x |
| **Tailwind CSS** | 스타일링 | 3.x |
| **Framer Motion** | 애니메이션 | 10.x |
| **Zustand** | 상태 관리 | 4.x |

## 📁 프로젝트 구조

```
paylens/
├── 🎯 app/                    # Next.js App Router
│   ├── analyze/              # 분석 페이지
│   │   └── page.tsx          # 메인 분석 인터페이스
│   ├── globals.css           # 전역 스타일 & 다크모드 오버라이드
│   ├── layout.tsx            # 루트 레이아웃
│   └── page.tsx              # 홈페이지
├── 🧩 components/            # 재사용 컴포넌트
│   ├── charts/              # 📊 차트 & 데이터 시각화
│   │   ├── PercentileDisplay.tsx    # 메인 퍼센타일 표시
│   │   └── PercentileChart.tsx      # 상세 차트
│   ├── forms/               # 📝 입력 폼
│   │   └── SalaryInput.tsx          # 연봉 입력 컴포넌트
│   └── layout/              # 🏗️ 레이아웃
│       ├── Header.tsx              # 헤더 & 언어 토글
│       └── Footer.tsx              # 푸터 & 데이터 출처
├── 🎣 hooks/                 # 커스텀 훅
│   └── useTranslation.ts     # 다국어 지원 훅
├── 📚 lib/                   # 유틸리티 라이브러리
│   ├── calculations/         # 퍼센타일 계산 로직
│   └── utils/               # 포맷팅 & 변환 함수
├── 🗂️ stores/                # 상태 관리
│   └── language.ts          # 언어 설정 스토어
├── 🌐 translations/          # 다국어 지원
│   └── index.ts             # 한국어/영어 번역
├── 📝 types/                 # TypeScript 타입
└── 📊 data/                  # 통계 데이터
    └── korea-income-percentile.json
```

## 💻 개발 환경 설정

### 🔧 필수 요구사항
- **Node.js** 18.0 이상
- **npm** 또는 **yarn**

### ⚡ 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/paylens.git
cd paylens

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 확인
# 🌐 http://localhost:3000
```

### 🚀 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드된 애플리케이션 실행
npm start

# 코드 품질 검사
npm run lint
npm run type-check
```

### 🔧 개발 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (hot reload) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run type-check` | TypeScript 타입 검사 |

## 📊 데이터 신뢰성

PayLens는 **정부 공식 데이터만** 사용하여 정확하고 신뢰할 수 있는 분석을 제공합니다.

<table>
<thead>
<tr>
<th>🌐 국가</th>
<th>📊 데이터 소스</th>
<th>📅 연도</th>
<th>👥 범위</th>
<th>✅ 신뢰도</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>🇰🇷 한국</strong></td>
<td>국세청 근로소득 백분위 자료</td>
<td>2024년</td>
<td>대한민국 전체 근로소득자</td>
<td>🔒 정부 공식</td>
</tr>
<tr>
<td><strong>🇺🇸 미국</strong></td>
<td>US Census Bureau</td>
<td>2024년</td>
<td>미국 전체 가구소득</td>
<td>🔒 연방정부 공식</td>
</tr>
</tbody>
</table>

### 📈 데이터 업데이트 주기
- **연 1회 업데이트** (정부 통계 발표 시기에 맞춰)
- **자동 검증 시스템** 구축
- **데이터 출처 투명성** 보장

## 🌐 이중 언어 지원

PayLens는 **한국어와 영어**를 완벽하게 지원합니다:

### 🔄 주요 특징
- **실시간 언어 전환**: 헤더 토글 버튼으로 즉시 전환
- **완전한 번역**: UI 요소, 메시지, 데이터 레이블 모두 번역
- **일관된 경험**: 선택한 언어로 모든 컨텐츠 통일
- **지역화**: 통화 단위, 숫자 포맷 등 현지화 적용

### 🎨 UI/UX 특징

```css
/* 디자인 시스템 */
:root {
  /* Primary Colors */
  --primary-500: #3B82F6;    /* 메인 블루 */
  --secondary-500: #8B5CF6;   /* 서브 퍼플 */

  /* Neutral Palette */
  --gray-50: #F9FAFB;        /* 배경 */
  --gray-900: #111827;       /* 텍스트 */
}
```

### 🎨 디자인 특징
- **🌟 모던한 그라데이션**: 세련된 컬러 스킴
- **🔮 글래스모피즘**: 반투명 효과와 블러
- **📱 완전 반응형**: 모바일/태블릿/데스크톱 최적화
- **⚡ 부드러운 애니메이션**: Framer Motion 활용
- **♿ 웹 접근성**: WCAG 가이드라인 준수

## 🌍 브라우저 지원

| 브라우저 | 지원 버전 | 상태 |
|----------|-----------|------|
| 🌐 Chrome | 80+ | ✅ 완전 지원 |
| 🦊 Firefox | 75+ | ✅ 완전 지원 |
| 🍎 Safari | 13+ | ✅ 완전 지원 |
| 🔷 Edge | 80+ | ✅ 완전 지원 |

## 🤝 기여하기

PayLens 프로젝트에 기여해주세요!

### 📋 기여 절차

1. **Fork** 저장소를 포크합니다
2. **Branch** 기능 브랜치를 생성합니다
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** 변경사항을 커밋합니다
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** 브랜치에 푸시합니다
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **PR** Pull Request를 생성합니다

### 🐛 버그 신고
- [Issues 페이지](https://github.com/your-username/paylens/issues)에서 버그를 신고해주세요
- 가능한 한 상세한 정보를 제공해주세요

### 💡 기능 제안
- 새로운 기능 아이디어가 있으시면 Issues에 제안해주세요
- 커뮤니티와 함께 논의하고 발전시켜나가요

## 📄 라이선스

이 프로젝트는 **MIT 라이선스** 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👥 개발팀

<table>
<tr>
<td align="center">
<strong>🎨 Kelly</strong><br>
기획 및 디자인<br>
<em>Product Owner</em>
</td>
<td align="center">
<strong>🤖 Claude</strong><br>
개발 및 구현<br>
<em>Full-Stack Developer</em>
</td>
</tr>
</table>

## 📞 연락처

- **이메일**: contact@paylens.com
- **웹사이트**: [paylens.com](https://paylens.com)
- **GitHub**: [github.com/your-username/paylens](https://github.com/your-username/paylens)

---

<div align="center">

### 🎉 PayLens로 당신의 소득 위치를 명확하게 파악하세요! 💎

**정확한 데이터 · 신뢰할 수 있는 분석 · 현실적인 목표**

[![GitHub stars](https://img.shields.io/github/stars/your-username/paylens?style=social)](https://github.com/your-username/paylens)
[![GitHub forks](https://img.shields.io/github/forks/your-username/paylens?style=social)](https://github.com/your-username/paylens)

Made with ❤️ by **Kelly & Claude**

</div>
