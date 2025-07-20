import { NextRequest, NextResponse } from 'next/server';
import { ContentAggregator, getCachedData, setCachedData, RateLimiter } from '../../../../lib/contentProviders';

// Edge Runtime für low-latency
export const runtime = 'edge';

const rateLimiter = new RateLimiter();

export async function GET(request: NextRequest): Promise<NextResponse> {
  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600', // 20min cache für Gaming News
  };

  try {
    // Rate Limiting - 120 requests per hour per IP
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    if (!rateLimiter.canMakeRequest(clientIP, 120, 60 * 60 * 1000)) {
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
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 25); // Max 25 items
    const cacheKey = `gaming_news_${limit}`;

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData, { headers: corsHeaders });
    }

    // Fetch from IGN API
    const aggregator = new ContentAggregator();
    const result = await aggregator.getAllContent({ gaming: limit });

    if (!result.gaming.success) {
      return NextResponse.json(result.gaming, {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Cache the result
    setCachedData(cacheKey, result.gaming, 20); // 20 minutes für Gaming News

    return NextResponse.json(result.gaming, { headers: corsHeaders });
  } catch (error) {
    console.error('Gaming News API Error:', error);
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
