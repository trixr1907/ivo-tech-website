'use client';

import { lazy, Suspense } from 'react';

// Aggressive Bundle Splitting für kritische vs. nicht-kritische Komponenten
const Critical3DComponents = {
  // Nur essenzielle 3D-Komponenten für First Load (inline definiert)
  BasicScene: () => <BasicScene3D />,
  MinimalLogo: () => <MinimalLogo3D />,
};

const NonCritical3DComponents = {
  // Schwere 3D-Komponenten für Lazy Loading
  AdvancedScene: lazy(() =>
    import('../3d/EpicScene3D').then(module => ({ default: module.default }))
  ),
  FullLogo: lazy(() =>
    import('../3d/AnimatedLogo4D').then(module => ({
      default: module.AnimatedLogo4D || module.default,
    }))
  ),
  CyberpunkFX: lazy(() =>
    import('../3d/CyberpunkFXDemo').then(module => ({
      default: module.default,
    }))
  ),
  // ParticleEffects temporär entfernt - problematischer Import
};

// Ultraminimale 3D-Komponente für First Load
function BasicScene3D() {
  return (
    <div className="flex h-96 w-full items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
      <div className="animate-pulse text-2xl font-bold text-white">
        IVO-TECH
      </div>
    </div>
  );
}

// Minimales Logo ohne Heavy Dependencies
function MinimalLogo3D() {
  return (
    <div className="relative mx-auto h-32 w-32">
      <div className="animate-spin-slow absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-600 opacity-20"></div>
      <div className="absolute inset-2 flex items-center justify-center rounded-lg bg-black">
        <span className="font-mono text-sm text-cyan-400">IVO</span>
      </div>
    </div>
  );
}

// Adaptive Component Loader basierend auf Performance
interface AdaptiveLoaderProps {
  priority: 'critical' | 'normal' | 'low';
  component:
    | keyof typeof Critical3DComponents
    | keyof typeof NonCritical3DComponents;
  fallback?: React.ReactNode;
  className?: string;
}

export function AdaptiveComponentLoader({
  priority,
  component,
  fallback,
  className = '',
}: AdaptiveLoaderProps) {
  // Performance-basierte Entscheidung
  const shouldLoadHeavy = () => {
    if (typeof window === 'undefined') return false;

    const connection = (navigator as any).connection;
    const isSlowConnection =
      connection &&
      (connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g');

    const isLowMemory =
      (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;

    return !isSlowConnection && !isLowMemory;
  };

  const getComponent = () => {
    const Component =
      priority === 'critical'
        ? Critical3DComponents[component as keyof typeof Critical3DComponents]
        : NonCritical3DComponents[
            component as keyof typeof NonCritical3DComponents
          ];

    if (!Component) {
      // Fallback to basic component
      return priority === 'critical'
        ? BasicScene3D
        : () => <div>Component not found</div>;
    }

    return Component;
  };

  const Component = getComponent();

  const defaultFallback = (
    <div className={`animate-pulse rounded-lg bg-slate-800 ${className}`}>
      <div className="flex h-full items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    </div>
  );

  // Für kritische Komponenten: Immer laden
  // Für nicht-kritische: Nur bei guter Performance
  if (priority !== 'critical' && !shouldLoadHeavy()) {
    return (
      <div className={className}>
        <BasicScene3D />
      </div>
    );
  }

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <div className={className}>
        <Component />
      </div>
    </Suspense>
  );
}

// Performance Monitor für Bundle Size Tracking
export function BundlePerformanceMonitor() {
  if (typeof window === 'undefined') return null;

  const getLoadTimes = () => {
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;
    const paintTimes = performance.getEntriesByType('paint');

    return {
      domContentLoaded: Math.round(
        navigation.domContentLoadedEventEnd - navigation.startTime
      ),
      firstPaint:
        paintTimes.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint:
        paintTimes.find(p => p.name === 'first-contentful-paint')?.startTime ||
        0,
    };
  };

  const metrics = getLoadTimes();

  return (
    <div className="fixed bottom-4 left-4 rounded bg-black/80 p-2 font-mono text-xs text-green-400">
      <div>DOMContentLoaded: {metrics.domContentLoaded}ms</div>
      <div>First Paint: {Math.round(metrics.firstPaint)}ms</div>
      <div>FCP: {Math.round(metrics.firstContentfulPaint)}ms</div>
    </div>
  );
}

// Export basic components for critical path
export { BasicScene3D, MinimalLogo3D };
