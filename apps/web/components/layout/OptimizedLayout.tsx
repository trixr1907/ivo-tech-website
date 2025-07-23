'use client';

import React, { useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { performanceManager } from '../../lib/performance/PerformanceManager';
import { performanceTestSystem } from '../../lib/performance/PerformanceTestSystem';

// Dynamische Imports für große Komponenten
const NavigationHeader = dynamic(() => import('../ui/NavigationHeader'), {
  loading: () => <NavigationSkeleton />,
});

const Footer = dynamic(() => import('../ui/Footer'), {
  loading: () => <FooterSkeleton />,
});

const PerformanceDashboard = dynamic(
  () => import('../monitoring/PerformanceDashboard'),
  { ssr: false }
);

// Fallback Komponenten
function NavigationSkeleton() {
  return (
    <div className="h-16 animate-pulse bg-gray-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-700" />
          <div className="hidden space-x-8 md:flex">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-4 w-20 animate-pulse rounded bg-gray-700"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FooterSkeleton() {
  return (
    <div className="mt-auto bg-gray-800 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 w-24 animate-pulse rounded bg-gray-700" />
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="h-4 w-32 animate-pulse rounded bg-gray-700"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface OptimizedLayoutProps {
  children: React.ReactNode;
  showPerformanceMonitor?: boolean;
}

export function OptimizedLayout({
  children,
  showPerformanceMonitor = process.env.NODE_ENV === 'development',
}: OptimizedLayoutProps) {
  // Performance Monitoring
  useEffect(() => {
    // Chunk Prefetching
    performanceManager.optimizeChunkLoading();

    // Resource Hints
    performanceManager.addResourceHints([
      { url: 'https://fonts.googleapis.com', type: 'preconnect' },
      { url: 'https://api.ivo-tech.com', type: 'preconnect' },
      { url: '/fonts/GeistVF.woff', type: 'preload' },
    ]);

    // Performance Tracking
    const cleanup = performanceTestSystem.track3DPerformance(
      16.67, // Target frame time (60fps)
      10000, // Triangle budget
      100 // Draw call budget
    );

    return () => {
      cleanup;
    };
  }, []);

  // Layout Performance Score
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const renderTime = performance.now() - startTime;
      performanceTestSystem.trackComponent('OptimizedLayout', startTime);

      if (renderTime > 100) {
        console.warn(
          `Layout render time exceeded budget: ${Math.round(renderTime)}ms`
        );
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      <Suspense fallback={<NavigationSkeleton />}>
        <NavigationHeader onLoginClick={() => {}} />
      </Suspense>

      <main className="flex-1">
        {/* Performance Monitor */}
        {showPerformanceMonitor && (
          <div className="fixed bottom-4 right-4 z-50">
            <Suspense fallback={null}>
              <PerformanceDashboard />
            </Suspense>
          </div>
        )}

        {/* Main Content mit Error Boundary */}
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="flex h-screen items-center justify-center">
                <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-white" />
              </div>
            }
          >
            {children}
          </Suspense>
        </ErrorBoundary>
      </main>

      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  );
}

// Error Boundary Komponente
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Layout Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
          <div className="max-w-md text-center">
            <h2 className="mb-4 text-2xl font-bold text-red-500">
              Oops, etwas ist schiefgelaufen!
            </h2>
            <p className="mb-4 text-gray-400">
              Es tut uns leid, aber es ist ein unerwarteter Fehler aufgetreten.
              Bitte laden Sie die Seite neu.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
            >
              Seite neu laden
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 rounded bg-red-900/20 p-4 text-left text-sm text-red-400">
                {this.state.error?.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default OptimizedLayout;
