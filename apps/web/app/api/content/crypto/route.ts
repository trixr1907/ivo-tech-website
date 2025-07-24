import { NextRequest, NextResponse } from 'next/server';
import {
  ContentAggregator,
  getCachedData,
  setCachedData,
  RateLimiter,
} from '../../../../lib/contentProviders';

// Edge Runtime für low-latency
export const runtime = 'edge';

const rateLimiter = new RateLimiter();

export async function GET(request: NextRequest): Promise<NextResponse> {
  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300', // 10min cache für News
  };

  try {
    // Rate Limiting - 150 requests per hour per IP (News werden öfter abgerufen)
    const clientIP =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'anonymous';
    if (!rateLimiter.canMakeRequest(clientIP, 150, 60 * 60 * 1000)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Try again later.',
        },
        {
          status: 429,
          headers: corsHeaders,
        }
      );
    }

    // Query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 30); // Max 30 items
    const cacheKey = `crypto_news_${limit}`;

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData, { headers: corsHeaders });
    }

    // Fetch from CoinTelegraph API
    const aggregator = new ContentAggregator();
    const result = await aggregator.getAllContent({ crypto: limit });

    if (!result.crypto.success) {
      return NextResponse.json(result.crypto, {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Cache the result
    setCachedData(cacheKey, result.crypto, 10); // 10 minutes für News

    return NextResponse.json(result.crypto, { headers: corsHeaders });
  } catch (error) {
    console.error('Crypto News API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
