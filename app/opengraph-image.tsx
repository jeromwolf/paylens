import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'PayLens - 내 연봉은 상위 몇%?';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 30,
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
          >
            <span style={{ fontSize: 50 }}>💰</span>
          </div>
          <h1
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: 'white',
              margin: 0,
              letterSpacing: -2,
            }}
          >
            PayLens
          </h1>
        </div>

        {/* Main Text */}
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: 'white',
            margin: '0 0 20px 0',
            textAlign: 'center',
          }}
        >
          내 연봉은 상위 몇%?
        </h2>

        {/* Sub Text */}
        <p
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.9)',
            margin: '0 0 50px 0',
            textAlign: 'center',
          }}
        >
          한국과 미국의 연봉 순위를 바로 확인하세요
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
              gap: 10,
              background: 'rgba(255,255,255,0.2)',
              padding: '15px 25px',
              borderRadius: 50,
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ fontSize: 24 }}>🇰🇷</span>
            <span style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>
              한국 데이터
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(255,255,255,0.2)',
              padding: '15px 25px',
              borderRadius: 50,
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ fontSize: 24 }}>🇺🇸</span>
            <span style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>
              미국 데이터
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(255,255,255,0.2)',
              padding: '15px 25px',
              borderRadius: 50,
              backdropFilter: 'blur(10px)',
            }}
          >
            <span style={{ fontSize: 24 }}>📊</span>
            <span style={{ color: 'white', fontSize: 20, fontWeight: 600 }}>
              실시간 분석
            </span>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 500,
          }}
        >
          paylens-kappa.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}