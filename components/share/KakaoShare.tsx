'use client';

import { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

interface KakaoShareProps {
  title: string;
  description: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  className?: string;
  income?: number;
  percentile?: number;
  country?: 'KR' | 'US';
}

declare global {
  interface Window {
    Kakao: any;
  }
}

export default function KakaoShare({
  title,
  description,
  imageUrl,
  buttonText = '카카오톡 공유',
  buttonLink,
  className = '',
  income,
  percentile,
  country = 'KR'
}: KakaoShareProps) {
  useEffect(() => {
    // Kakao SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      // 실제 앱 키로 교체 필요
      const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY || 'your_kakao_app_key_here';
      window.Kakao.init(kakaoKey);
    }
  }, []);

  const shareToKakao = () => {
    if (!window.Kakao) {
      alert('카카오톡 공유 기능을 사용할 수 없습니다.');
      return;
    }

    const formatSalary = (amount: number, country: 'KR' | 'US') => {
      if (country === 'KR') {
        return `${amount.toLocaleString()}만원`;
      } else {
        return `$${amount.toLocaleString()}`;
      }
    };

    // 동적 메시지 생성
    let shareTitle = title;
    let shareDescription = description;

    if (income && percentile) {
      const higherThan = (100 - percentile).toFixed(1);
      const salaryText = formatSalary(income, country);

      shareTitle = `💰 연봉 ${salaryText}은 상위 ${higherThan}%!`;
      shareDescription = `📊 PayLens 연봉 분석 결과\n\n` +
        `${country === 'KR' ? '🇰🇷 한국' : '🇺🇸 미국'} 기준 상위 ${higherThan}%\n` +
        `${higherThan <= 10 ? '🏆 상위 10% 달성!' : higherThan <= 30 ? '⭐ 중상위권 진입!' : '💪 평균 이상!'}\n\n` +
        `지금 바로 당신의 연봉 순위도 확인해보세요!`;
    }

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'text',
        text: shareTitle,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
        buttons: [
          {
            title: buttonLink ? '내 자산 순위 확인하기' : '내 연봉 순위 확인하기',
            link: {
              mobileWebUrl: buttonLink || 'https://paylens-kappa.vercel.app/analyze',
              webUrl: buttonLink || 'https://paylens-kappa.vercel.app/analyze',
            },
          },
        ],
      });
    } catch (error) {
      console.error('카카오톡 공유 실패:', error);
      alert('카카오톡 공유 중 오류가 발생했습니다.');
    }
  };

  return (
    <button
      onClick={shareToKakao}
      className={`inline-flex items-center gap-2 px-6 py-3 bg-[#FEE500] hover:bg-[#FDD835] text-black font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg ${className}`}
    >
      <MessageSquare className="w-5 h-5" />
      {buttonText}
    </button>
  );
}