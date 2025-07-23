import { PrismaClient } from '@prisma/client';
import { cache } from 'react';
import { performanceManager } from '../performance/PerformanceManager';

class PrismaCacheManager {
  private static instance: PrismaCacheManager;
  private prisma: PrismaClient;
  private cache: Map<string, { data: any; timestamp: number }>;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 Minuten

  private constructor() {
    this.prisma = new PrismaClient();
    this.cache = new Map();

    // Middleware für Performance Monitoring
    this.prisma.$use(async (params, next) => {
      const start = performance.now();
      const result = await next(params);
      const duration = performance.now() - start;

      // Log langsame Queries
      if (duration > 100) {
        console.warn(`Slow query (${duration}ms):`, {
          model: params.model,
          action: params.action,
          args: params.args,
        });
      }

      return result;
    });
  }

  static getInstance(): PrismaCacheManager {
    if (!PrismaCacheManager.instance) {
      PrismaCacheManager.instance = new PrismaCacheManager();
    }
    return PrismaCacheManager.instance;
  }

  // Cache-Key Generator
  private generateCacheKey(model: string, action: string, args: any): string {
    return `${model}:${action}:${JSON.stringify(args)}`;
  }

  // Cache Validation
  private isValidCache(timestamp: number, ttl: number): boolean {
    return Date.now() - timestamp < ttl;
  }

  // Cached Query Execution
  private async executeWithCache<T>(
    model: string,
    action: string,
    args: any,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    const cacheKey = this.generateCacheKey(model, action, args);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp, ttl)) {
      return cached.data as T;
    }

    const result = await (this.prisma as any)[model][action](args);
    this.cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return result;
  }

  // React Server Component Cache
  public readonly getBlogPosts = cache(async (page: number = 1, limit: number = 10) => {
    return this.executeWithCache('post', 'findMany', {
      where: { published: true },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        categories: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  });

  // Optimierte Batch-Operationen
  public async batchGetPosts(ids: string[]) {
    return this.executeWithCache('post', 'findMany', {
      where: {
        id: { in: ids },
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
  }

  // Cache Invalidierung
  public invalidateCache(model: string, action?: string) {
    if (action) {
      const pattern = `${model}:${action}:`;
      for (const key of this.cache.keys()) {
        if (key.startsWith(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Invalidiere alle Einträge für das Model
      for (const key of this.cache.keys()) {
        if (key.startsWith(`${model}:`)) {
          this.cache.delete(key);
        }
      }
    }
  }

  // Cache Warmup
  public async warmupCache() {
    // Hole häufig benötigte Daten
    await Promise.all([
      this.getBlogPosts(1, 10), // Erste Seite der Blog-Posts
      this.executeWithCache('category', 'findMany', {
        where: { posts: { some: {} } },
      }),
    ]);
  }

  // Cache Cleanup
  public cleanupCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (!this.isValidCache(value.timestamp, this.DEFAULT_TTL)) {
        this.cache.delete(key);
      }
    }
  }

  // Automatische Cache-Bereinigung
  public startAutoCleanup(interval: number = 15 * 60 * 1000) { // 15 Minuten
    setInterval(() => this.cleanupCache(), interval);
  }

  // Performance Optimierte Queries
  public async getOptimizedPosts(options: {
    page: number;
    limit: number;
    includeAuthor?: boolean;
    includeCategories?: boolean;
  }) {
    const { page, limit, includeAuthor = true, includeCategories = true } = options;

    return this.executeWithCache('post', 'findMany', {
      where: { published: true },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: includeAuthor ? {
          select: {
            name: true,
            image: true,
          },
        } : false,
        categories: includeCategories,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}

export const prismaCacheManager = PrismaCacheManager.getInstance();
