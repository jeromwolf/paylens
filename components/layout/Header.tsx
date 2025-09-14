'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguageStore } from '@/stores/language';

export default function Header() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-110">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              PayLens
            </span>
          </Link>

          {/* Navigation & Language Toggle */}
          <div className="flex items-center space-x-6">
            {/* Language Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage('ko')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                  language === 'ko'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                한국어
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                English
              </button>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/analyze"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                연봉 분석
              </Link>
              <Link
                href="/wealth"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                세계 랭킹
              </Link>
              <Link
                href="/leaderboard"
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                TOP 50
              </Link>
            </nav>

            {/* CTA Button */}
            <Link
              href="/analyze"
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium hover:shadow-lg transform transition-all hover:scale-105"
            >
              분석하기
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}