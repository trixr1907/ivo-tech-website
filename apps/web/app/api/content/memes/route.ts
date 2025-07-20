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
    'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=300', // 15min cache
  };

  try {
    // Rate Limiting - 100 requests per hour per IP
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';
    if (!rateLimiter.canMakeRequest(clientIP, 100, 60 * 60 * 1000)) {
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
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50); // Max 50 items
    const cacheKey = `memes_${limit}`;

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData, { headers: corsHeaders });
    }

    // Fetch from Imgur API
    const imgurApiKey = process.env.IMGUR_CLIENT_ID;
    if (!imgurApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Imgur API key not configured',
        },
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    const aggregator = new ContentAggregator(imgurApiKey);
    const result = await aggregator.getAllContent({ memes: limit });

    if (!result.memes.success) {
      return NextResponse.json(result.memes, {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Cache the result
    setCachedData(cacheKey, result.memes, 15); // 15 minutes

    return NextResponse.json(result.memes, { headers: corsHeaders });
  } catch (error) {
    console.error('Memes API Error:', error);
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
