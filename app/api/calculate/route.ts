import { NextRequest, NextResponse } from 'next/server';
import { calculatePercentile, getIncomeForPercentile, compareIncome } from '@/lib/calculations/percentile';
import { convertCurrency } from '@/lib/utils/currency';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { income, country, action, targetPercentile, fromCountry, toCountry } = body;

    // Validate input
    if (!income || income <= 0) {
      return NextResponse.json(
        { error: 'Invalid income value' },
        { status: 400 }
      );
    }

    if (!country || !['korea', 'us'].includes(country)) {
      return NextResponse.json(
        { error: 'Invalid country' },
        { status: 400 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'calculate':
        // Calculate percentile for given income
        const result = calculatePercentile(income, country);
        return NextResponse.json({
          success: true,
          data: result
        });

      case 'target':
        // Get income needed for target percentile
        if (!targetPercentile || targetPercentile < 0 || targetPercentile > 100) {
          return NextResponse.json(
            { error: 'Invalid target percentile' },
            { status: 400 }
          );
        }
        const targetIncome = getIncomeForPercentile(targetPercentile, country);
        return NextResponse.json({
          success: true,
          data: {
            targetPercentile,
            targetIncome,
            country
          }
        });

      case 'compare':
        // Compare income between countries
        if (!fromCountry || !toCountry) {
          return NextResponse.json(
            { error: 'Both countries required for comparison' },
            { status: 400 }
          );
        }
        const comparison = compareIncome(income, fromCountry, toCountry);
        return NextResponse.json({
          success: true,
          data: comparison
        });

      case 'convert':
        // Simple currency conversion
        const converted = convertCurrency(
          income,
          country === 'korea' ? 'KRW' : 'USD',
          country === 'korea' ? 'USD' : 'KRW',
          country === 'korea' ? 'manwon' : 'default'
        );
        return NextResponse.json({
          success: true,
          data: {
            original: income,
            converted,
            fromCurrency: country === 'korea' ? 'KRW' : 'USD',
            toCurrency: country === 'korea' ? 'USD' : 'KRW'
          }
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return API information
  return NextResponse.json({
    name: 'PayLens API',
    version: '1.0.0',
    endpoints: {
      calculate: {
        method: 'POST',
        description: 'Calculate income percentile',
        params: {
          income: 'number',
          country: 'korea | us',
          action: 'calculate'
        }
      },
      target: {
        method: 'POST',
        description: 'Get income for target percentile',
        params: {
          targetPercentile: 'number (0-100)',
          country: 'korea | us',
          action: 'target'
        }
      },
      compare: {
        method: 'POST',
        description: 'Compare income between countries',
        params: {
          income: 'number',
          fromCountry: 'korea | us',
          toCountry: 'korea | us',
          action: 'compare'
        }
      },
      convert: {
        method: 'POST',
        description: 'Convert currency',
        params: {
          income: 'number',
          country: 'korea | us',
          action: 'convert'
        }
      }
    },
    dataSource: {
      korea: '국세청 근로소득 백분위 자료 (2024)',
      us: 'US Census Bureau (2024)'
    }
  });
}