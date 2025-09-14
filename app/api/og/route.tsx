import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') || 'PayLens - 내 연봉은 상위 몇%?';
  const description = searchParams.get('description') || '한국과 미국의 연봉 순위를 바로 확인하세요';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Logo and Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 25,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 30,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ fontSize: 60 }}>💰</span>
          </div>
          <h1
            style={{
              fontSize: 90,
              fontWeight: 900,
              color: 'white',
              margin: 0,
              letterSpacing: -3,
              textShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            PayLens
          </h1>
        </div>

        {/* Main Text */}
        <h2
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: 'white',
            margin: '0 0 20px 0',
            textAlign: 'center',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {title}
        </h2>

        {/* Sub Text */}
        <p
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 60px 0',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 30,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'rgba(255,255,255,0.25)',
              padding: '18px 30px',
              borderRadius: 60,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <span style={{ fontSize: 28 }}>🇰🇷</span>
            <span style={{ color: 'white', fontSize: 22, fontWeight: 600 }}>
              한국 데이터
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'rgba(255,255,255,0.25)',
              padding: '18px 30px',
              borderRadius: 60,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <span style={{ fontSize: 28 }}>🇺🇸</span>
            <span style={{ color: 'white', fontSize: 22, fontWeight: 600 }}>
              미국 데이터
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'rgba(255,255,255,0.25)',
              padding: '18px 30px',
              borderRadius: 60,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <span style={{ fontSize: 28 }}>📊</span>
            <span style={{ color: 'white', fontSize: 22, fontWeight: 600 }}>
              실시간 분석
            </span>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 26,
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          paylens-kappa.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}