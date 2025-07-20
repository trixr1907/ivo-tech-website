'use client';

import { useEffect, useState } from 'react';

// Safe import for reportError
let reportError: ((error: Error, context?: any) => void) | undefined;
try {
  const monitoring = require('../components/monitoring/MonitoringProvider');
  reportError = monitoring.reportError;
} catch (error) {
  // MonitoringProvider not available, use fallback
  reportError = undefined;
}

interface PerformanceMetrics {
  fps: number;
  memory: number;
  latency: number;
  loadTime: number;
}

export function usePerformance(): PerformanceMetrics {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    latency: 0,
    loadTime: 0,
  });

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof performance === 'undefined') {
      return;
    }

    let animationId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    // FPS Tracking
    const trackFPS = (currentTime: number) => {
      try {
        frameCount++;
        if (currentTime - lastTime >= 1000) {
          const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          setMetrics(prev => ({ ...prev, fps }));
          frameCount = 0;
          lastTime = currentTime;
        }
        if (typeof requestAnimationFrame !== 'undefined') {
          animationId = requestAnimationFrame(trackFPS);
        }
      } catch (error) {
        // Log the error for further investigation
        console.error('Error tracking FPS:', error);
        
        // Report the error using a monitoring tool
        if (typeof reportError === 'function') {
          reportError(new Error('Error tracking FPS'), { component: 'usePerformance' });
        }
        
        // Set fallback values
        setMetrics(prev => ({ ...prev, fps: 30 }));
      }
    };

    // Memory Usage
    const trackMemory = () => {
      try {
        if (typeof performance !== 'undefined' && 'memory' in performance) {
          const memory = Math.round((performance as any).memory.usedJSHeapSize / 1048576);
          setMetrics(prev => ({ ...prev, memory }));
        }
      } catch (error) {
        console.error('Error tracking memory usage:', error);
        if (typeof reportError === 'function') {
          reportError(new Error('Error tracking memory usage'), { component: 'usePerformance' });
        }
        
        // Set fallback value
        setMetrics(prev => ({ ...prev, memory: 0 }));
      }
    };

    // Page Load Time
    const trackLoadTime = () => {
      try {
        if (typeof document !== 'undefined' && typeof performance !== 'undefined' && document.readyState === 'complete') {
          const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigationEntry) {
            const loadTime = Math.round(navigationEntry.loadEventEnd - navigationEntry.fetchStart);
            setMetrics(prev => ({ ...prev, loadTime }));
          }
        }
      } catch (error) {
        console.error('Error tracking page load time:', error);
        if (typeof reportError === 'function') {
          reportError(new Error('Error tracking page load time'), { component: 'usePerformance' });
        }
        
        // Set fallback value
        setMetrics(prev => ({ ...prev, loadTime: 0 }));
      }
    };

    // Start tracking
    if (typeof requestAnimationFrame !== 'undefined') {
      animationId = requestAnimationFrame(trackFPS);
    }
    trackMemory();
    trackLoadTime();

    // Set initial latency value
    setMetrics(prev => ({ ...prev, latency: 15 }));

    // Update intervals
    const memoryInterval = setInterval(trackMemory, 5000);

    return () => {
      if (typeof cancelAnimationFrame !== 'undefined' && animationId) {
        cancelAnimationFrame(animationId);
      }
      clearInterval(memoryInterval);
    };
  }, []);

  return metrics;
}
