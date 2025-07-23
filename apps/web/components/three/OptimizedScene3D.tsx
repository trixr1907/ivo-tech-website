'use client';

import React, { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { performanceManager } from '../../lib/performance/PerformanceManager';

// Dynamische Imports für 3D-Komponenten
const Scene3D = dynamic(() => import('./Scene3D'), {
  ssr: false,
  loading: () => <Scene3DFallback />,
});

const Effects = dynamic(() => import('./effects/Effects'), {
  ssr: false,
});

const PostProcessingPipeline = dynamic(
  () => import('./cyberpunk-fx/effects/PostProcessingPipeline'),
  { ssr: false }
);

// Performance Monitor
const PerformanceMonitor = dynamic(
  () => import('../monitoring/Advanced3DPerformanceDashboard'),
  { ssr: false }
);

interface OptimizedScene3DProps {
  quality?: 'low' | 'medium' | 'high';
  enableEffects?: boolean;
  enablePostProcessing?: boolean;
  showPerformanceMonitor?: boolean;
}

function Scene3DFallback() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
        <div className="space-y-4 text-center">
          <div className="h-32 w-32 animate-pulse rounded-full bg-blue-500/20" />
          <div className="text-sm text-gray-400">
            Lade 3D-Umgebung...
          </div>
        </div>
      </div>
    </div>
  );
}

const OptimizedScene3D: React.FC<OptimizedScene3DProps> = ({
  quality = 'high',
  enableEffects = true,
  enablePostProcessing = true,
  showPerformanceMonitor = false,
}) => {
  const [perfMetrics, setPerfMetrics] = useState({
    fps: 60,
    memory: 0,
    frameTime: 0,
  });

  // Performance Monitoring
  useEffect(() => {
    if (!showPerformanceMonitor) return;

    let rafId: number;
    let lastTime = performance.now();
    let frames = 0;

    const measure = () => {
      frames++;
      const now = performance.now();
      
      if (now - lastTime >= 1000) {
        setPerfMetrics({
          fps: Math.round(frames * 1000 / (now - lastTime)),
          memory: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0,
          frameTime: (now - lastTime) / frames,
        });
        
        frames = 0;
        lastTime = now;
      }

      rafId = requestAnimationFrame(measure);
    };

    measure();
    return () => cancelAnimationFrame(rafId);
  }, [showPerformanceMonitor]);

  // Qualitätseinstellungen basierend auf Performance
  const qualitySettings = {
    low: {
      shadowMapSize: 1024,
      maxLights: 4,
      particles: 1000,
      renderScale: 0.75,
    },
    medium: {
      shadowMapSize: 2048,
      maxLights: 8,
      particles: 2000,
      renderScale: 1.0,
    },
    high: {
      shadowMapSize: 4096,
      maxLights: 16,
      particles: 4000,
      renderScale: 1.0,
    },
};

  // Adaptive Quality basierend auf FPS
  useEffect(() => {
    if (perfMetrics.fps < 30 && quality !== 'low') {
      console.warn('Performance warning: Reducing 3D quality settings');
      // Hier könnte man die Qualität dynamisch anpassen
    }
  }, [perfMetrics.fps, quality]);

  return (
    <div className="relative h-full w-full">
      <Suspense fallback={<Scene3DFallback />}>
        <Scene3D settings={qualitySettings[quality]}>
          {enableEffects && <Effects />}
          {enablePostProcessing && <PostProcessingPipeline />}
        </Scene3D>
      </Suspense>

      {showPerformanceMonitor && (
        <div className="absolute bottom-4 left-4 rounded-lg bg-black/80 p-4 font-mono text-xs text-white">
          <div>FPS: {perfMetrics.fps}</div>
          <div>Memory: {Math.round(perfMetrics.memory)}MB</div>
          <div>Frame Time: {Math.round(perfMetrics.frameTime)}ms</div>
        </div>
      )}
    </div>
  );
};

export default OptimizedScene3D;
