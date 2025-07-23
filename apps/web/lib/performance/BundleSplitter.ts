// Bundle Splitting Konfiguration für Next.js
import { isDynamicRoute } from 'next/dist/shared/lib/router/utils';

interface BundleConfig {
  path: string;
  priority: 'high' | 'medium' | 'low';
  preload?: boolean;
  prefetch?: boolean;
}

export const routeBundles: BundleConfig[] = [
  // High Priority Routes - Sofort laden
  { path: '/', priority: 'high', preload: true },
  { path: '/portfolio', priority: 'high', prefetch: true },
  
  // Medium Priority Routes - Prefetch wenn möglich
  { path: '/blog', priority: 'medium', prefetch: true },
  { path: '/about', priority: 'medium', prefetch: true },
  
  // Low Priority Routes - Lazy Loading
  { path: '/impressum', priority: 'low' },
  { path: '/datenschutz', priority: 'low' },
];

// Dynamische Import-Konfigurationen für Components
export const componentBundles = {
  // UI Components
  MainLayout: () => import('../../components/layouts/MainLayout'),
  NavigationHeader: () => import('../../components/ui/NavigationHeader'),
  Footer: () => import('../../components/ui/Footer'),

  // Feature Components
  Blog: {
    List: () => import('../../components/blog/BlogList'),
    Detail: () => import('../../components/blog/BlogDetail'),
  },

  // 3D Components (hohe Bundle-Größe)
  ThreeD: {
    Scene: () => import('../../components/three/Scene3D'),
    Effects: () => import('../../components/three/effects/Effects'),
  },
};

// Helper für optimiertes Code-Splitting
export function getBundleConfig(path: string): BundleConfig {
  // Exakte Route finden
  const exactMatch = routeBundles.find(bundle => bundle.path === path);
  if (exactMatch) return exactMatch;

  // Dynamische Route matchen
  if (isDynamicRoute(path)) {
    const dynamicMatch = routeBundles.find(bundle => 
      isDynamicRoute(bundle.path) && 
      bundle.path.split('/')[1] === path.split('/')[1]
    );
    if (dynamicMatch) return dynamicMatch;
  }

  // Default Config für unbekannte Routes
  return {
    path,
    priority: 'low',
    prefetch: false,
    preload: false,
  };
}

// Chunk Loading Optimierung
export function optimizeChunkLoading(currentPath: string) {
  const currentBundle = getBundleConfig(currentPath);

  // Preload aktuelle Route
  if (currentBundle.preload) {
    // Preload main chunk
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = `/_next/static/chunks/pages${currentPath}.js`;
    document.head.appendChild(link);
  }

  // Prefetch verwandte Routes
  routeBundles
    .filter(bundle => 
      bundle.prefetch && 
      bundle.priority !== 'low' &&
      bundle.path !== currentPath
    )
    .forEach(bundle => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/_next/static/chunks/pages${bundle.path}.js`;
      document.head.appendChild(link);
    });
}

// Worker für Chunk Prefetching
export function initChunkPrefetchWorker() {
  if (typeof window === 'undefined') return;

  const worker = new Worker(
    new URL('../../workers/chunk-prefetch.worker.ts', import.meta.url)
  );

  worker.postMessage({
    type: 'INIT',
    bundles: routeBundles
      .filter(bundle => bundle.prefetch)
      .map(bundle => bundle.path),
  });

  return worker;
}

// Analytics für Chunk Loading
export function trackChunkPerformance() {
  if (typeof window === 'undefined') return;

  performance.getEntriesByType('resource')
    .filter(entry => entry.name.includes('/_next/static/chunks/'))
    .forEach(chunk => {
      console.info(`Chunk loaded: ${chunk.name}`, {
        duration: chunk.duration,
        size: chunk.encodedBodySize,
        type: chunk.initiatorType,
      });
    });
}
