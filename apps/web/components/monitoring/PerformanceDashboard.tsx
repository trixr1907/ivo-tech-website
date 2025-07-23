'use client';

import React, { useEffect, useState } from 'react';
import { performanceTestSystem } from '../../lib/performance/PerformanceTestSystem';
import { performanceManager } from '../../lib/performance/PerformanceManager';

interface PerformanceData {
  webVitals: {
    fcp: number;
    lcp: number;
    fid: number;
    cls: number;
    ttfb: number;
  };
  resources: {
    count: number;
    size: number;
    loadTime: number;
  };
  memory: {
    jsHeapSize: number;
    domNodes: number;
  };
  rendering: {
    componentCount: number;
    averageRenderTime: number;
  };
}

export function PerformanceDashboard() {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    webVitals: { fcp: 0, lcp: 0, fid: 0, cls: 0, ttfb: 0 },
    resources: { count: 0, size: 0, loadTime: 0 },
    memory: { jsHeapSize: 0, domNodes: 0 },
    rendering: { componentCount: 0, averageRenderTime: 0 },
  });

  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Performance Daten sammeln
    const updatePerformanceData = () => {
      const metrics = performanceTestSystem.generateReport();
      
      setPerformanceData({
        webVitals: {
          fcp: metrics.fcp,
          lcp: metrics.lcp,
          fid: metrics.fid,
          cls: metrics.cls,
          ttfb: metrics.ttfb,
        },
        resources: {
          count: metrics.resourceCount,
          size: metrics.resourceSize,
          loadTime: performanceManager.collectMetrics().loadComplete || 0,
        },
        memory: {
          jsHeapSize: metrics.jsHeapSize,
          domNodes: metrics.domNodes,
        },
        rendering: {
          componentCount: document.getElementsByTagName('*').length,
          averageRenderTime: metrics.renderTime,
        },
      });

      setRecommendations(performanceTestSystem.getRecommendations());
    };

    // Initial Update
    updatePerformanceData();

    // Regelmäßiges Update
    const interval = setInterval(updatePerformanceData, 5000);

    return () => clearInterval(interval);
  }, []);

  // Score Berechnung
  const calculateScore = (data: PerformanceData): number => {
    let score = 100;

    // Web Vitals Score
    if (data.webVitals.lcp > 2500) score -= 20;
    if (data.webVitals.fid > 100) score -= 15;
    if (data.webVitals.cls > 0.1) score -= 15;

    // Resource Score
    if (data.resources.size > 5000000) score -= 10;
    if (data.resources.loadTime > 5000) score -= 10;

    // Memory Score
    if (data.memory.jsHeapSize > 100000000) score -= 15;
    if (data.memory.domNodes > 1500) score -= 15;

    return Math.max(0, score);
  };

  const score = calculateScore(performanceData);

  return (
    <div className="rounded-lg bg-gray-900 p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Performance Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div
            className={`text-2xl font-bold ${
              score > 80
                ? 'text-green-400'
                : score > 60
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}
          >
            {score}/100
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
          >
            {showDetails ? 'Weniger Details' : 'Mehr Details'}
          </button>
        </div>
      </div>

      {/* Web Vitals */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-gray-800 p-4">
          <div className="text-sm text-gray-400">First Contentful Paint</div>
          <div className="text-xl font-bold text-white">
            {(performanceData.webVitals.fcp / 1000).toFixed(2)}s
          </div>
        </div>
        <div className="rounded-lg bg-gray-800 p-4">
          <div className="text-sm text-gray-400">Largest Contentful Paint</div>
          <div className="text-xl font-bold text-white">
            {(performanceData.webVitals.lcp / 1000).toFixed(2)}s
          </div>
        </div>
        <div className="rounded-lg bg-gray-800 p-4">
          <div className="text-sm text-gray-400">First Input Delay</div>
          <div className="text-xl font-bold text-white">
            {performanceData.webVitals.fid.toFixed(2)}ms
          </div>
        </div>
        <div className="rounded-lg bg-gray-800 p-4">
          <div className="text-sm text-gray-400">Cumulative Layout Shift</div>
          <div className="text-xl font-bold text-white">
            {performanceData.webVitals.cls.toFixed(3)}
          </div>
        </div>
      </div>

      {/* Erweiterte Details */}
      {showDetails && (
        <>
          {/* Resource Metrics */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              Resource Metrics
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-gray-800 p-4">
                <div className="text-sm text-gray-400">Resource Count</div>
                <div className="text-xl font-bold text-white">
                  {performanceData.resources.count}
                </div>
              </div>
              <div className="rounded-lg bg-gray-800 p-4">
                <div className="text-sm text-gray-400">Total Size</div>
                <div className="text-xl font-bold text-white">
                  {(performanceData.resources.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              <div className="rounded-lg bg-gray-800 p-4">
                <div className="text-sm text-gray-400">Load Time</div>
                <div className="text-xl font-bold text-white">
                  {(performanceData.resources.loadTime / 1000).toFixed(2)}s
                </div>
              </div>
            </div>
          </div>

          {/* Memory & DOM */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-white">
              Memory & DOM
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-800 p-4">
                <div className="text-sm text-gray-400">JS Heap Size</div>
                <div className="text-xl font-bold text-white">
                  {(performanceData.memory.jsHeapSize / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              <div className="rounded-lg bg-gray-800 p-4">
                <div className="text-sm text-gray-400">DOM Nodes</div>
                <div className="text-xl font-bold text-white">
                  {performanceData.memory.domNodes}
                </div>
              </div>
            </div>
          </div>

          {/* Empfehlungen */}
          {recommendations.length > 0 && (
            <div className="rounded-lg bg-gray-800 p-4">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Optimierungsempfehlungen
              </h3>
              <ul className="list-inside list-disc space-y-2 text-gray-300">
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
