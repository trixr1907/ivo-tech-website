'use client';

import React, { Suspense, lazy, useState, useEffect } from 'react';

// Lazy Loading für verschiedene 3D-Komponenten
const OptimizedEpicScene3D = lazy(() => import('./OptimizedEpicScene3D'));
const AnimatedLogo4D = lazy(() => import('../AnimatedLogo4D'));
const ParallaxStarfield = lazy(() => import('../ParallaxStarfield'));

interface Lazy3DContainerProps {
  component: '3d-scene' | 'logo-4d' | 'starfield';
  fallbackType?: 'spinner' | 'skeleton' | 'minimal';
  enableIntersectionObserver?: boolean;
  priority?: 'high' | 'low';
  className?: string;
  [key: string]: any;
}

// Verschiedene Loading-Fallbacks
const LoadingFallbacks = {
  spinner: () => (
    <div className="flex h-full w-full items-center justify-center bg-black/10 backdrop-blur">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
      <span className="ml-4 text-cyan-400 font-mono text-sm">Loading 3D Scene...</span>
    </div>
  ),
  skeleton: () => (
    <div className="h-full w-full bg-gradient-to-br from-slate-900 to-slate-800 animate-pulse">
      <div className="flex items-center justify-center h-full">
        <div className="space-y-4 w-64">
          <div className="h-4 bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-700 rounded w-5/6"></div>
          <div className="h-4 bg-slate-700 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  ),
  minimal: () => (
    <div className="h-full w-full bg-black/5 flex items-center justify-center">
      <div className="text-slate-400 font-mono text-sm">Loading...</div>
    </div>
  ),
};

// Intersection Observer Hook für Lazy Loading
function useIntersectionObserver(ref: React.RefObject<HTMLElement | null>, options?: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      setHasBeenVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasBeenVisible) {
        setIsVisible(true);
        setHasBeenVisible(true);
        observer.disconnect();
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasBeenVisible, options]);

  return { isVisible, hasBeenVisible };
}

// Performance Monitor Component
function PerformanceMonitor({ enabled }: { enabled: boolean }) {
  const [metrics, setMetrics] = useState({ 
    memory: 0, 
    fps: 60,
    loadTime: 0 
  });

  useEffect(() => {
    if (!enabled) return;

    const startTime = performance.now();
    let frameCount = 0;
    let lastTime = startTime;

    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const memory = (performance as any).memory 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) 
          : 0;

        setMetrics({
          fps,
          memory,
          loadTime: Math.round(currentTime - startTime),
        });

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measurePerformance);
    };

    const rafId = requestAnimationFrame(measurePerformance);
    return () => cancelAnimationFrame(rafId);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="absolute top-2 left-2 bg-black/80 text-white p-2 rounded font-mono text-xs space-y-1">
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memory}MB</div>
      <div>Load: {metrics.loadTime}ms</div>
    </div>
  );
}

export function Lazy3DContainer({
  component,
  fallbackType = 'spinner',
  enableIntersectionObserver = true,
  priority = 'low',
  className = 'w-full h-96',
  ...props
}: Lazy3DContainerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { isVisible } = useIntersectionObserver(
    containerRef, 
    enableIntersectionObserver ? undefined : { threshold: 0 }
  );
  
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(false);
  const [componentLoaded, setComponentLoaded] = useState(false);

  // Preload bei high priority
  useEffect(() => {
    if (priority === 'high') {
      const loadComponent = async () => {
        switch (component) {
          case '3d-scene':
            await import('./OptimizedEpicScene3D');
            break;
          case 'logo-4d':
            await import('../AnimatedLogo4D');
            break;
          case 'starfield':
            await import('../ParallaxStarfield');
            break;
        }
        setComponentLoaded(true);
      };
      loadComponent();
    }
  }, [component, priority]);

  const shouldLoad = enableIntersectionObserver ? isVisible : true;
  const FallbackComponent = LoadingFallbacks[fallbackType];

  const renderComponent = () => {
    if (!shouldLoad && priority === 'low') {
      return <FallbackComponent />;
    }

    const errorBoundary = (error: Error) => (
      <div className="h-full w-full bg-red-900/20 flex items-center justify-center">
        <div className="text-red-400 font-mono text-sm">
          3D Loading Error: {error.message}
        </div>
      </div>
    );

    switch (component) {
      case '3d-scene':
        return (
          <Suspense fallback={<FallbackComponent />}>
            <OptimizedEpicScene3D {...props} />
          </Suspense>
        );
      case 'logo-4d':
        return (
          <Suspense fallback={<FallbackComponent />}>
            <AnimatedLogo4D {...props} />
          </Suspense>
        );
      case 'starfield':
        return (
          <Suspense fallback={<FallbackComponent />}>
            <ParallaxStarfield {...props} />
          </Suspense>
        );
      default:
        return <FallbackComponent />;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {renderComponent()}
      
      {/* Performance Monitor Toggle */}
      <div className="absolute bottom-2 right-2">
        <button
          onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
          className="bg-black/60 hover:bg-black/80 text-white px-2 py-1 rounded text-xs font-mono"
          title="Toggle Performance Monitor"
        >
          📊
        </button>
      </div>

      <PerformanceMonitor enabled={showPerformanceMonitor} />
    </div>
  );
}

export default Lazy3DContainer;
