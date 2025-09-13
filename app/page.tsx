'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import SalaryInput from '@/components/forms/SalaryInput';
import { useRouter } from 'next/navigation';
import useIncomeStore from '@/store/useIncomeStore';
import { useTranslation } from '@/hooks/useTranslation';

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<'korea' | 'us'>('korea');
  const [income, setIncome] = useState(0);
  const { setKoreaIncome, setUsIncome, setSelectedCountry: setStoreCountry } = useIncomeStore();

  const handleAnalyze = () => {
    if (income > 0) {
      if (selectedCountry === 'korea') {
        setKoreaIncome(income);
      } else {
        setUsIncome(income);
      }
      setStoreCountry(selectedCountry);
      router.push('/analyze');
    }
  };

  const features = [
    {
      icon: '📊',
      title: t('accurateData'),
      description: t('accurateDataDesc')
    },
    {
      icon: '🎯',
      title: t('instantCheck'),
      description: t('instantCheckDesc')
    },
    {
      icon: '🌏',
      title: t('globalComparison'),
      description: t('globalComparisonDesc')
    },
    {
      icon: '📈',
      title: t('goalSetting'),
      description: t('goalSettingDesc')
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400 rounded-full blur-3xl opacity-20" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-400 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {t('heroTitlePart1')}
              </span>
              <br />
              <span className="text-gray-800">{t('heroTitlePart2')}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>
          </motion.div>

          {/* Country Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex rounded-xl bg-white shadow-lg p-1 border-2 border-gray-100">
              <button
                onClick={() => setSelectedCountry('korea')}
                className={`px-6 py-3 rounded-lg font-medium transition-all transform ${
                  selectedCountry === 'korea'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg scale-105 border-2 border-primary-200'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
{t('korea')}
              </button>
              <button
                onClick={() => setSelectedCountry('us')}
                className={`px-6 py-3 rounded-lg font-medium transition-all transform ${
                  selectedCountry === 'us'
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg scale-105 border-2 border-primary-200'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
{t('usa')}
              </button>
            </div>
          </motion.div>

          {/* Salary Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SalaryInput
              country={selectedCountry}
              value={income}
              onChange={setIncome}
              onAnalyze={handleAnalyze}
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">2.08M</div>
              <div className="text-sm text-gray-600">{t('analyzedSalaries')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">99.9%</div>
              <div className="text-sm text-gray-600">{t('dataAccuracy')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">2024</div>
              <div className="text-sm text-gray-600">{t('latestDataYear')}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {t('whySpecial')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('reliableServiceDesc')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl p-12 text-center text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('checkNow')}
          </h2>
          <p className="text-lg mb-8 opacity-90">
            {t('quickAndFree')}
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:shadow-xl transform transition-all hover:scale-105"
          >
{t('startAnalysis')}
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}