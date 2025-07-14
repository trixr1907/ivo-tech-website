'use client';

import { useEffect, useState } from 'react';

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
    let animationId: number;
    let lastTime = performance.now();
    let frameCount = 0;

    // FPS Tracking
    const trackFPS = (currentTime: number) => {
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }
      animationId = requestAnimationFrame(trackFPS);
    };

    // Memory Usage
    const trackMemory = () => {
      if ('memory' in performance) {
        const memory = Math.round((performance as any).memory.usedJSHeapSize / 1048576);
        setMetrics(prev => ({ ...prev, memory }));
      }
    };

    // Network Latency (estimated)
    const trackLatency = async () => {
      try {
        const startTime = performance.now();
        await fetch('/api/ping', { method: 'HEAD' }).catch(() => {});
        const latency = Math.round(performance.now() - startTime);
        setMetrics(prev => ({ ...prev, latency }));
      } catch {
        setMetrics(prev => ({ ...prev, latency: 12 })); // fallback
      }
    };

    // Page Load Time
    const trackLoadTime = () => {
      if (document.readyState === 'complete') {
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
          const loadTime = Math.round(navigationEntry.loadEventEnd - navigationEntry.fetchStart);
          setMetrics(prev => ({ ...prev, loadTime }));
        }
      }
    };

    // Start tracking
    animationId = requestAnimationFrame(trackFPS);
    trackMemory();
    trackLatency();
    trackLoadTime();

    // Update intervals
    const memoryInterval = setInterval(trackMemory, 5000);
    const latencyInterval = setInterval(trackLatency, 10000);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(memoryInterval);
      clearInterval(latencyInterval);
    };
  }, []);

  return metrics;
}
