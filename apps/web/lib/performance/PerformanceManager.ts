// Performance Manager für zentrale Optimierungen
import { cache } from 'react';

interface CacheConfig {
  maxAge: number;
  revalidate?: 'tag' | 'path' | 'layout' | 'segment';
}

interface ImageOptimizationConfig {
  quality?: number;
  sizes?: string[];
  priority?: boolean;
}

class PerformanceManager {
  private static instance: PerformanceManager;
  private constructor() {}

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  // Cache-Strategie für Server-Komponenten
  createServerCache = cache(async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    config?: CacheConfig
  ): Promise<T> => {
    try {
      return await fetchFn();
    } catch (error) {
      console.error(`Cache error for key ${key}:`, error);
      throw error;
    }
  });

  // Optimierte Image Loading Strategie
  getImageOptimization(path: string, config?: ImageOptimizationConfig) {
    return {
      src: path,
      quality: config?.quality || 75,
      sizes: config?.sizes || [
        '(max-width: 640px) 100vw',
        '(max-width: 1024px) 50vw',
        '33vw',
      ],
      priority: config?.priority || false,
      loading: config?.priority ? 'eager' : 'lazy',
    };
  }

  // Route Prefetching Strategie
  prefetchRoutes(routes: string[]) {
    if (typeof window === 'undefined') return;

    routes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }

  // Performance Metrics Sammlung
  collectMetrics() {
    if (typeof window === 'undefined') return {};

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    return {
      timeToFirstByte: navigation.responseStart - navigation.requestStart,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
      domComplete: navigation.domComplete,
      loadComplete: navigation.loadEventEnd,
      memoryUsage: (performance as any).memory?.usedJSHeapSize,
    };
  }

  // Chunk Loading Optimierung
  optimizeChunkLoading() {
    if (typeof window === 'undefined') return;

    // Prefetch wichtige Chunks
    const prefetchChunks = [
      '/_next/static/chunks/main',
      '/_next/static/chunks/framework',
      '/_next/static/chunks/app',
    ];

    prefetchChunks.forEach(chunk => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'script';
      link.href = chunk;
      document.head.appendChild(link);
    });
  }

  // Resource Hints Optimierung
  addResourceHints(resources: { url: string; type: 'prefetch' | 'preload' | 'preconnect' }[]) {
    if (typeof window === 'undefined') return;

    resources.forEach(({ url, type }) => {
      const link = document.createElement('link');
      link.rel = type;
      if (type === 'preconnect') {
        link.crossOrigin = 'anonymous';
      }
      link.href = url;
      document.head.appendChild(link);
    });
  }

  // Service Worker Registration für Offline Support
  async registerServiceWorker() {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registered:', registration);
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    }
  }
}

export const performanceManager = PerformanceManager.getInstance();
