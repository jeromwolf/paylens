'use client';

import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative mt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Decorative wave */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden -translate-y-full">
        <svg
          className="relative block w-full h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.77,102.31,124.73,78.38,184.51,67.71,237,58.41,280.27,61.38,321.39,56.44Z"
            className="fill-gray-900"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center">
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
              <span className="text-xl font-bold">PayLens</span>
            </div>
            <p className="text-gray-200 max-w-md mb-4">
              {t('footerDescription')}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                className="text-gray-200 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/analyze" className="text-gray-200 hover:text-white transition-colors">
                  {t('incomeAnalysis')}
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-200 hover:text-white transition-colors">
                  {t('serviceIntro')}
                </a>
              </li>
              <li>
                <a href="/data" className="text-gray-200 hover:text-white transition-colors">
                  {t('dataSources')}
                </a>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('dataSources')}</h3>
            <ul className="space-y-2">
              <li className="text-gray-200 text-sm">
                {t('koreaData')}
              </li>
              <li className="text-gray-200 text-sm">
                {t('usaData')}
              </li>
              <li className="text-gray-200 text-sm">
                {t('latestData')}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              {t('copyright')}
            </p>
            <p className="text-gray-300 text-xs mt-2 md:mt-0">
              {t('madeWith')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}