'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Zustand and Chart.js
const ClientAnalyzePage = dynamic(() => import('@/components/ClientAnalyzePage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-400">Loading...</div>
        </div>
      </div>
    </div>
  )
});

export default function AnalyzePage() {
  return <ClientAnalyzePage />;
}