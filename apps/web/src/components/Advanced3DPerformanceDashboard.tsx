import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

interface PerformanceMetrics {
  gpuUsage: number;
  memoryUsage: number;
  frameTime: number;
}

const Advanced3DPerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    gpuUsage: 0,
    memoryUsage: 0,
    frameTime: 0,
  });

  // GPU-Auslastung messen
  const measureGPUUsage = async () => {
    try {
      if ('gpu' in navigator) {
        // @ts-ignore - Experimentelles Feature
        const adapter = await navigator.gpu.requestAdapter();
        const usage = await adapter?.requestStatistics();
        return usage?.utilizationPercentage || 0;
      }
      return 0;
    } catch (error) {
      console.error('GPU-Messung fehlgeschlagen:', error);
      return 0;
    }
  };

  // Memory-Usage messen
  const measureMemoryUsage = () => {
    try {
      if ('memory' in performance) {
        // @ts-ignore
        const memory = performance.memory;
        return (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      }
      return 0;
    } catch (error) {
      console.error('Memory-Messung fehlgeschlagen:', error);
      return 0;
    }
  };

  // Frame-Timing messen
  const measureFrameTiming = () => {
    return performance.now() - lastFrameTime;
  };

  let lastFrameTime = performance.now();

  // Performance-Logging
  const logPerformanceMetrics = (metrics: PerformanceMetrics) => {
    console.log('[Performance Monitor]', {
      timestamp: new Date().toISOString(),
      ...metrics,
    });

    // Optional: Metrics an einen Server senden
    // await fetch('/api/performance-metrics', {
    //   method: 'POST',
    //   body: JSON.stringify(metrics),
    // });
  };

  useEffect(() => {
    let animationFrameId: number;

    const updateMetrics = async () => {
      const newMetrics = {
        gpuUsage: await measureGPUUsage(),
        memoryUsage: measureMemoryUsage(),
        frameTime: measureFrameTiming(),
      };

      setMetrics(newMetrics);
      logPerformanceMetrics(newMetrics);

      lastFrameTime = performance.now();
      animationFrameId = requestAnimationFrame(updateMetrics);
    };

    updateMetrics();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="performance-dashboard">
      <h2>3D Performance Monitor</h2>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>GPU-Auslastung</h3>
          <div className="metric-value">{metrics.gpuUsage.toFixed(1)}%</div>
        </div>
        <div className="metric-card">
          <h3>Memory-Usage</h3>
          <div className="metric-value">{metrics.memoryUsage.toFixed(1)}%</div>
        </div>
        <div className="metric-card">
          <h3>Frame-Time</h3>
          <div className="metric-value">{metrics.frameTime.toFixed(1)}ms</div>
        </div>
      </div>
      <style jsx>{`
        .performance-dashboard {
          padding: 20px;
          background: #1a1a1a;
          border-radius: 8px;
          color: #ffffff;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 20px;
        }

        .metric-card {
          background: #2a2a2a;
          padding: 15px;
          border-radius: 6px;
          text-align: center;
        }

        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: #00ff00;
        }
      `}</style>
    </div>
  );
};

export default Advanced3DPerformanceDashboard;
