import { NextRequest, NextResponse } from 'next/server';

interface FeedItem {
  title: string;
  description?: string;
  link?: string;
  pubDate?: string;
  source: string;
  positive?: boolean;
}

// Tech & Crypto RSS Feed URLs
const RSS_FEEDS = {
  techcrunch: 'https://techcrunch.com/feed/',
  coindesk: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
  verge: 'https://www.theverge.com/rss/index.xml',
  wired: 'https://www.wired.com/feed/rss',
  ars: 'https://feeds.arstechnica.com/arstechnica/index',
};

// Positive keywords for filtering
const POSITIVE_KEYWORDS = [
  'breakthrough',
  'innovation',
  'advancement',
  'success',
  'achievement',
  'efficient',
  'sustainable',
  'revolutionary',
  'improvement',
  'growth',
  'adoption',
  'milestone',
  'record',
  'promising',
  'solution',
  'breakthrough',
  'develops',
  'launches',
  'enables',
  'enhances',
  'green',
  'clean',
  'renewable',
  'quantum',
  'ai breakthrough',
];

const NEGATIVE_KEYWORDS = [
  'hack',
  'crash',
  'scam',
  'fraud',
  'loss',
  'decline',
  'fall',
  'problem',
  'issue',
  'concern',
  'crisis',
  'fail',
  'danger',
  'risk',
  'threat',
  'vulnerability',
  'attack',
  'breach',
];

async function parseRSSFeed(url: string, source: string): Promise<FeedItem[]> {
  try {
    // Mock RSS parsing for demo - in production, use an RSS parser
    // For now, return sample data that would come from RSS parsing
    const mockData: FeedItem[] = [
      {
        title: 'Revolutionary AI Breakthrough Promises Better Healthcare',
        description: 'New AI system shows 95% accuracy in early disease detection',
        link: 'https://example.com/ai-healthcare',
        pubDate: new Date().toISOString(),
        source,
        positive: true,
      },
      {
        title: 'Sustainable Energy Solutions Reach New Efficiency Records',
        description: 'Solar panels achieve unprecedented 40% efficiency rating',
        link: 'https://example.com/solar-efficiency',
        pubDate: new Date().toISOString(),
        source,
        positive: true,
      },
      {
        title: 'Quantum Computing Makes Major Leap Forward',
        description: 'Breakthrough in quantum error correction brings practical applications closer',
        link: 'https://example.com/quantum-leap',
        pubDate: new Date().toISOString(),
        source,
        positive: true,
      },
      {
        title: 'Blockchain Technology Enhances Supply Chain Transparency',
        description: 'New blockchain implementation reduces fraud by 78% in global supply chains',
        link: 'https://example.com/blockchain-supply',
        pubDate: new Date().toISOString(),
        source,
        positive: true,
      },
      {
        title: 'Neural Interfaces Show Promise for Paralyzed Patients',
        description: 'Clinical trials demonstrate successful brain-computer interface control',
        link: 'https://example.com/neural-interface',
        pubDate: new Date().toISOString(),
        source,
        positive: true,
      },
      {
        title: 'Clean Water Technology Deployed in Remote Areas',
        description: 'Innovative filtration system brings clean water to 10,000 people',
        link: 'https://example.com/clean-water',
        pubDate: new Date().toISOString(),
        source,
        positive: true,
      },
    ];

    return mockData;
  } catch (error) {
    console.error(`Error parsing RSS feed from ${source}:`, error);
    return [];
  }
}

function isPositiveNews(title: string, description: string = ''): boolean {
  const content = (title + ' ' + description).toLowerCase();

  const hasPositive = POSITIVE_KEYWORDS.some(keyword => content.includes(keyword.toLowerCase()));

  const hasNegative = NEGATIVE_KEYWORDS.some(keyword => content.includes(keyword.toLowerCase()));

  return hasPositive && !hasNegative;
}

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(_request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const positiveOnly = searchParams.get('positive') === 'true';

    // Fetch from multiple RSS sources
    const feedPromises = Object.entries(RSS_FEEDS).map(([source, url]) => parseRSSFeed(url, source));

    const feedResults = await Promise.all(feedPromises);
    let allItems = feedResults.flat();

    // Filter for positive news if requested
    if (positiveOnly) {
      allItems = allItems.filter(item => isPositiveNews(item.title, item.description || ''));
    }

    // Sort by publication date (newest first)
    allItems.sort((a, b) => {
      const dateA = new Date(a.pubDate || 0).getTime();
      const dateB = new Date(b.pubDate || 0).getTime();
      return dateB - dateA;
    });

    // Limit results
    const limitedItems = allItems.slice(0, limit);

    return NextResponse.json({
      success: true,
      count: limitedItems.length,
      items: limitedItems,
      lastUpdated: new Date().toISOString(),
      filters: {
        positiveOnly,
        limit,
      },
    });
  } catch (error) {
    console.error('RSS Feed API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch RSS feeds',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
