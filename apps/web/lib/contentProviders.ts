/**
 * Content Providers für Humor-, Meme- & News-Inhalte
 * Unterstützt Developer Memes (Imgur API), Crypto & Gaming News (CoinTelegraph, IGN)
 */

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  publishedAt: Date;
  source: string;
  category: 'meme' | 'crypto' | 'gaming' | 'tech';
  tags?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  rateLimit?: {
    remaining: number;
    resetTime: number;
  };
}

// Imgur API für Developer Memes
export class ImgurMemeProvider {
  private apiKey: string;
  private baseUrl = 'https://api.imgur.com/3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getDevMemes(limit: number = 10): Promise<ApiResponse<ContentItem[]>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/gallery/search/viral/week/1?q=programming+developer+code+meme`,
        {
          headers: {
            Authorization: `Client-ID ${this.apiKey}`,
            'User-Agent': 'IvoTech-Website/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Imgur API Error: ${response.status}`);
      }

      const result = await response.json();
      const memes: ContentItem[] = result.data
        .filter((item: any) => item.type?.startsWith('image/') && !item.nsfw)
        .slice(0, limit)
        .map((item: any) => ({
          id: item.id,
          title: item.title || 'Developer Meme',
          description: item.description || '',
          url: item.link,
          imageUrl: item.link,
          publishedAt: new Date(item.datetime * 1000),
          source: 'Imgur',
          category: 'meme' as const,
          tags: item.tags || ['programming', 'developer', 'humor'],
        }));

      return {
        success: true,
        data: memes,
        rateLimit: {
          remaining: parseInt(
            response.headers.get('x-ratelimit-userremaining') || '0'
          ),
          resetTime: parseInt(
            response.headers.get('x-ratelimit-userreset') || '0'
          ),
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error fetching memes',
      };
    }
  }
}

// CoinTelegraph API für Crypto News
export class CoinTelegraphProvider {
  private baseUrl = 'https://cointelegraph.com/api/v1';

  async getCryptoNews(limit: number = 10): Promise<ApiResponse<ContentItem[]>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/content?limit=${limit}&offset=0&category=latest-news`,
        {
          headers: {
            'User-Agent': 'IvoTech-Website/1.0',
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`CoinTelegraph API Error: ${response.status}`);
      }

      const result = await response.json();
      const news: ContentItem[] = result.data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        description: item.lead || item.excerpt,
        url: `https://cointelegraph.com${item.url}`,
        imageUrl: item.image?.url
          ? `https://cointelegraph.com${item.image.url}`
          : undefined,
        publishedAt: new Date(item.published),
        source: 'CoinTelegraph',
        category: 'crypto' as const,
        tags: item.tags?.map((tag: any) => tag.name) || [
          'cryptocurrency',
          'blockchain',
        ],
      }));

      return {
        success: true,
        data: news,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error fetching crypto news',
      };
    }
  }
}

// IGN API für Gaming News
export class IGNProvider {
  private baseUrl = 'https://ign-apis.herokuapp.com';

  async getGamingNews(limit: number = 10): Promise<ApiResponse<ContentItem[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/articles?count=${limit}`, {
        headers: {
          'User-Agent': 'IvoTech-Website/1.0',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`IGN API Error: ${response.status}`);
      }

      const result = await response.json();
      const news: ContentItem[] = result.map((item: any) => ({
        id: item.contentId,
        title: item.metadata.headline,
        description: item.metadata.description,
        url: item.url,
        imageUrl: item.thumbnails?.[0]?.url,
        publishedAt: new Date(item.metadata.publishDate),
        source: 'IGN',
        category: 'gaming' as const,
        tags: ['gaming', 'video games', 'entertainment'],
      }));

      return {
        success: true,
        data: news,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error fetching gaming news',
      };
    }
  }
}

// Aggregator für alle Content Provider
export class ContentAggregator {
  private imgurProvider?: ImgurMemeProvider;
  private cryptoProvider: CoinTelegraphProvider;
  private gamingProvider: IGNProvider;

  constructor(imgurApiKey?: string) {
    if (imgurApiKey) {
      this.imgurProvider = new ImgurMemeProvider(imgurApiKey);
    }
    this.cryptoProvider = new CoinTelegraphProvider();
    this.gamingProvider = new IGNProvider();
  }

  async getAllContent(
    limits: { memes?: number; crypto?: number; gaming?: number } = {}
  ): Promise<{
    memes: ApiResponse<ContentItem[]>;
    crypto: ApiResponse<ContentItem[]>;
    gaming: ApiResponse<ContentItem[]>;
  }> {
    const results = await Promise.allSettled([
      this.imgurProvider?.getDevMemes(limits.memes || 5) ||
        Promise.resolve({
          success: false,
          error: 'Imgur API key not configured',
        }),
      this.cryptoProvider.getCryptoNews(limits.crypto || 5),
      this.gamingProvider.getGamingNews(limits.gaming || 5),
    ]);

    return {
      memes:
        results[0].status === 'fulfilled'
          ? results[0].value
          : { success: false, error: 'Failed to fetch memes' },
      crypto:
        results[1].status === 'fulfilled'
          ? results[1].value
          : { success: false, error: 'Failed to fetch crypto news' },
      gaming:
        results[2].status === 'fulfilled'
          ? results[2].value
          : { success: false, error: 'Failed to fetch gaming news' },
    };
  }

  async getMixedFeed(
    totalLimit: number = 15
  ): Promise<ApiResponse<ContentItem[]>> {
    try {
      const perCategory = Math.ceil(totalLimit / 3);
      const allContent = await this.getAllContent({
        memes: perCategory,
        crypto: perCategory,
        gaming: perCategory,
      });

      const mixedItems: ContentItem[] = [];

      // Sammle alle erfolgreichen Items
      if (allContent.memes.success && allContent.memes.data) {
        mixedItems.push(...allContent.memes.data);
      }
      if (allContent.crypto.success && allContent.crypto.data) {
        mixedItems.push(...allContent.crypto.data);
      }
      if (allContent.gaming.success && allContent.gaming.data) {
        mixedItems.push(...allContent.gaming.data);
      }

      // Sortiere nach Datum (neueste zuerst) und limitiere
      const sortedItems = mixedItems
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
        .slice(0, totalLimit);

      return {
        success: true,
        data: sortedItems,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error creating mixed feed',
      };
    }
  }
}

// Cache für Performance
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() > cached.timestamp + cached.ttl) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

export function setCachedData<T>(
  key: string,
  data: T,
  ttlMinutes: number = 15
): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMinutes * 60 * 1000,
  });
}

// Rate Limiting Helper
export class RateLimiter {
  private requests = new Map<string, number[]>();

  canMakeRequest(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    // Entferne alte Requests außerhalb des Fensters
    const validRequests = requests.filter(time => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}
