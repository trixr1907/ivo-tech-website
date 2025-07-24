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
    'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=300', // 15min cache
  };

  try {
    // Rate Limiting - 200 requests per hour per IP für Feed
    const clientIP =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'anonymous';
    if (!rateLimiter.canMakeRequest(clientIP, 200, 60 * 60 * 1000)) {
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
    const totalLimit = Math.min(
      parseInt(searchParams.get('limit') || '15'),
      50
    ); // Max 50 items
    const includeMemesParam = searchParams.get('memes');
    const includeCryptoParam = searchParams.get('crypto');
    const includeGamingParam = searchParams.get('gaming');

    // Standard: alle Kategorien aktiviert, außer explizit deaktiviert
    const includeMemes = includeMemesParam !== 'false';
    const includeCrypto = includeCryptoParam !== 'false';
    const includeGaming = includeGamingParam !== 'false';

    const cacheKey = `mixed_feed_${totalLimit}_${includeMemes}_${includeCrypto}_${includeGaming}`;

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData, { headers: corsHeaders });
    }

    // Berechne Limits pro Kategorie basierend auf aktivierten Kategorien
    const activeCategories = [
      includeMemes,
      includeCrypto,
      includeGaming,
    ].filter(Boolean).length;
    if (activeCategories === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one content category must be enabled',
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const perCategory = Math.ceil(totalLimit / activeCategories);

    // Content aggregator mit optionalem Imgur API Key
    const imgurApiKey = includeMemes ? process.env.IMGUR_CLIENT_ID : undefined;
    const aggregator = new ContentAggregator(imgurApiKey);

    // Bestimme Limits für jede Kategorie
    // const limits = {
    //   memes: includeMemes ? perCategory : 0,
    //   crypto: includeCrypto ? perCategory : 0,
    //   gaming: includeGaming ? perCategory : 0
    // };

    // Fetch mixed content
    const result = await aggregator.getMixedFeed(totalLimit);

    if (!result.success) {
      return NextResponse.json(result, {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Filtere nach gewünschten Kategorien
    let filteredData = result.data || [];
    if (!includeMemes) {
      filteredData = filteredData.filter(item => item.category !== 'meme');
    }
    if (!includeCrypto) {
      filteredData = filteredData.filter(item => item.category !== 'crypto');
    }
    if (!includeGaming) {
      filteredData = filteredData.filter(item => item.category !== 'gaming');
    }

    const finalResult = {
      ...result,
      data: filteredData.slice(0, totalLimit),
      meta: {
        totalItems: filteredData.length,
        categories: {
          memes: filteredData.filter(item => item.category === 'meme').length,
          crypto: filteredData.filter(item => item.category === 'crypto')
            .length,
          gaming: filteredData.filter(item => item.category === 'gaming')
            .length,
        },
        requestedLimit: totalLimit,
        includedCategories: {
          memes: includeMemes,
          crypto: includeCrypto,
          gaming: includeGaming,
        },
      },
    };

    // Cache the result
    setCachedData(cacheKey, finalResult, 15); // 15 minutes

    return NextResponse.json(finalResult, { headers: corsHeaders });
  } catch (error) {
    console.error('Mixed Feed API Error:', error);
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
