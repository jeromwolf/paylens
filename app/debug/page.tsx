'use client';

import { useState } from 'react';
import { calculatePercentile } from '@/lib/calculations/percentile';
import PercentileDisplay from '@/components/charts/PercentileDisplay';

export default function DebugPage() {
  const [income, setIncome] = useState(5000);
  const [country, setCountry] = useState<'korea' | 'us'>('korea');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleCalculate = () => {
    try {
      setError('');
      console.log('Calculating for:', { income, country });
      const res = calculatePercentile(income, country);
      console.log('Result:', res);
      setResult(res);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Unknown error');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Debug Page</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Input</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value as 'korea' | 'us')}
              className="border p-2 rounded w-full"
            >
              <option value="korea">Korea</option>
              <option value="us">US</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Income ({country === 'korea' ? '만원' : 'USD'})
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="border p-2 rounded w-full"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Calculate
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          Error: {error}
        </div>
      )}

      {result && (
        <>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Raw Result</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">PercentileDisplay Component</h2>
            <PercentileDisplay result={result} />
          </div>
        </>
      )}
    </div>
  );
}