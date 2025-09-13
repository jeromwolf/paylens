'use client';

import { useState } from 'react';
import { calculatePercentile } from '@/lib/calculations/percentile';

export default function TestPage() {
  const [income, setIncome] = useState(5000);
  const [result, setResult] = useState<any>(null);

  const handleTest = () => {
    const res = calculatePercentile(income, 'korea');
    setResult(res);
    console.log('Result:', res);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Calculation</h1>

      <div className="mb-4">
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleTest}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Calculate
        </button>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}