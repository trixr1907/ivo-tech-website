'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NeonCard, NeonButton } from '../ui/neon-ui';
import { useAdvanced3DPerformance } from '../../hooks/useAdvanced3DPerformance';

interface PerformanceChartProps {
  data: number[];
  label: string;
  color: string;
  unit: string;
  threshold?: number;
}

function PerformanceChart({
  data,
  label,
  color,
  unit,
  threshold,
}: PerformanceChartProps) {
  const maxValue = Math.max(...data, threshold || 0);
  const minValue = Math.min(...data, 0);
  const range = maxValue - minValue || 1;

  return (
    <div className="relative h-32 overflow-hidden rounded-lg bg-gray-900 p-3">
      <div className="mb-2 flex items-start justify-between">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-xs text-gray-400">
          {data[data.length - 1]?.toFixed(1)}
          {unit}
        </span>
      </div>

      {/* Chart Area */}
      <div className="relative h-20">
        {/* Threshold Line */}
        {threshold && (
          <div
            className="absolute w-full border-t border-dashed border-yellow-500 opacity-50"
            style={{
              bottom: `${((threshold - minValue) / range) * 100}%`,
            }}
          />
        )}

        {/* Chart Path */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={data
              .map(
                (value, index) =>
                  `${(index / (data.length - 1)) * 100},${100 - ((value - minValue) / range) * 100}`
              )
              .join(' ')}
          />
          <polyline
            fill={`${color}20`}
            stroke="none"
            points={[
              ...data.map(
                (value, index) =>
                  `${(index / (data.length - 1)) * 100},${100 - ((value - minValue) / range) * 100}`
              ),
              `100,100`,
              `0,100`,
            ].join(' ')}
          />
        </svg>
      </div>
    </div>
  );
}

function PerformanceGrade({ grade }: { grade: 'A' | 'B' | 'C' | 'D' | 'F' }) {
  const gradeColors = {
    A: 'text-green-400 bg-green-400/20 border-green-400/30',
    B: 'text-blue-400 bg-blue-400/20 border-blue-400/30',
    C: 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30',
    D: 'text-orange-400 bg-orange-400/20 border-orange-400/30',
    F: 'text-red-400 bg-red-400/20 border-red-400/30',
  };

  const gradeDescriptions = {
    A: 'Exzellent',
    B: 'Gut',
    C: 'Durchschnitt',
    D: 'Suboptimal',
    F: 'Kritisch',
  };

  return (
    <div
      className={`inline-flex items-center rounded-lg border px-4 py-2 ${gradeColors[grade]}`}
    >
      <div className="mr-2 text-2xl font-bold">{grade}</div>
      <div className="text-sm">{gradeDescriptions[grade]}</div>
    </div>
  );
}

function BottleneckIndicator({
  type,
}: {
  type: 'cpu' | 'gpu' | 'memory' | 'audio' | 'none';
}) {
  const bottleneckConfig = {
    cpu: { icon: '🧠', label: 'CPU Bottleneck', color: 'text-red-400' },
    gpu: { icon: '🎮', label: 'GPU Bottleneck', color: 'text-orange-400' },
    memory: {
      icon: '💾',
      label: 'Memory Bottleneck',
      color: 'text-yellow-400',
    },
    audio: { icon: '🎵', label: 'Audio Bottleneck', color: 'text-purple-400' },
    none: { icon: '✅', label: 'Keine Engpässe', color: 'text-green-400' },
  };

  const config = bottleneckConfig[type];

  return (
    <div className={`flex items-center space-x-2 ${config.color}`}>
      <span className="text-lg">{config.icon}</span>
      <span className="font-medium">{config.label}</span>
    </div>
  );
}

export function Advanced3DPerformanceDashboard() {
  const {
    metrics,
    /* updateMetrics, updateAudioMetrics, */ optimizePerformance,
    thresholds,
  } = useAdvanced3DPerformance();
  const [fpsHistory, setFpsHistory] = useState<number[]>([]);
  const [memoryHistory, setMemoryHistory] = useState<number[]>([]);
  const [frameTimeHistory, setFrameTimeHistory] = useState<number[]>([]);
  const [isAutoOptimize, setIsAutoOptimize] = useState(false);

  // Historische Daten sammeln
  useEffect(() => {
    const updateHistory = () => {
      setFpsHistory(prev => [...prev.slice(-29), metrics.fps]);
      setMemoryHistory(prev => [...prev.slice(-29), metrics.memoryUsage]);
      setFrameTimeHistory(prev => [...prev.slice(-29), metrics.frameTime]);
    };

    const interval = setInterval(updateHistory, 1000);
    return () => clearInterval(interval);
  }, [metrics]);

  // Auto-Optimierung
  useEffect(() => {
    if (
      (isAutoOptimize && metrics.performanceGrade === 'D') ||
      metrics.performanceGrade === 'F'
    ) {
      if (metrics.bottleneckType === 'gpu') {
        optimizePerformance('reduceLOD');
      } else if (metrics.bottleneckType === 'memory') {
        optimizePerformance('compressTextures');
      }
    }
  }, [
    metrics.performanceGrade,
    metrics.bottleneckType,
    isAutoOptimize,
    optimizePerformance,
  ]);

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <NeonCard
        title="3D Performance Monitor"
        subtitle="Echtzeit-Analyse der 3D/4D Komponenten"
        variant="primary"
        elevation={2}
        interactive={false}
      >
        <div className="space-y-6">
          {/* Grade & Bottleneck */}
          <div className="flex items-center justify-between">
            <PerformanceGrade grade={metrics.performanceGrade} />
            <BottleneckIndicator type={metrics.bottleneckType} />
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-lg bg-gray-800 p-3">
              <div className="mb-1 text-sm text-gray-400">FPS</div>
              <div
                className={`text-2xl font-bold ${
                  metrics.fps >= thresholds.fps.excellent
                    ? 'text-green-400'
                    : metrics.fps >= thresholds.fps.good
                      ? 'text-blue-400'
                      : metrics.fps >= thresholds.fps.fair
                        ? 'text-yellow-400'
                        : 'text-red-400'
                }`}
              >
                {metrics.fps}
              </div>
            </div>

            <div className="rounded-lg bg-gray-800 p-3">
              <div className="mb-1 text-sm text-gray-400">Frame Time</div>
              <div
                className={`text-2xl font-bold ${
                  metrics.frameTime <= thresholds.frameTime.excellent
                    ? 'text-green-400'
                    : metrics.frameTime <= thresholds.frameTime.good
                      ? 'text-blue-400'
                      : metrics.frameTime <= thresholds.frameTime.fair
                        ? 'text-yellow-400'
                        : 'text-red-400'
                }`}
              >
                {metrics.frameTime.toFixed(1)}ms
              </div>
            </div>

            <div className="rounded-lg bg-gray-800 p-3">
              <div className="mb-1 text-sm text-gray-400">Memory</div>
              <div
                className={`text-2xl font-bold ${
                  metrics.memoryUsage <= thresholds.memory.excellent
                    ? 'text-green-400'
                    : metrics.memoryUsage <= thresholds.memory.good
                      ? 'text-blue-400'
                      : metrics.memoryUsage <= thresholds.memory.fair
                        ? 'text-yellow-400'
                        : 'text-red-400'
                }`}
              >
                {metrics.memoryUsage}MB
              </div>
            </div>

            <div className="rounded-lg bg-gray-800 p-3">
              <div className="mb-1 text-sm text-gray-400">Objects</div>
              <div className="text-2xl font-bold text-cyan-400">
                {metrics.visibleObjects}/{metrics.activeObjects}
              </div>
            </div>
          </div>
        </div>
      </NeonCard>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <NeonCard title="FPS Verlauf" variant="secondary" interactive={false}>
          <PerformanceChart
            data={fpsHistory}
            label="Frames per Second"
            color="#00ff00"
            unit=" fps"
            threshold={thresholds.fps.good}
          />
        </NeonCard>

        <NeonCard title="Memory Usage" variant="secondary" interactive={false}>
          <PerformanceChart
            data={memoryHistory}
            label="Speicherverbrauch"
            color="#ff0080"
            unit=" MB"
            threshold={thresholds.memory.fair}
          />
        </NeonCard>

        <NeonCard title="Frame Time" variant="secondary" interactive={false}>
          <PerformanceChart
            data={frameTimeHistory}
            label="Frame-Zeit"
            color="#0080ff"
            unit=" ms"
            threshold={thresholds.frameTime.fair}
          />
        </NeonCard>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 3D Scene Metrics */}
        <NeonCard title="3D Scene Analyse" variant="accent" interactive={false}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Active Objects:</span>
                <span className="ml-2 font-mono text-white">
                  {metrics.activeObjects}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Visible Objects:</span>
                <span className="ml-2 font-mono text-green-400">
                  {metrics.visibleObjects}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Culled Objects:</span>
                <span className="ml-2 font-mono text-red-400">
                  {metrics.frustrumCulled}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Draw Calls:</span>
                <span className="ml-2 font-mono text-yellow-400">
                  {metrics.drawCalls}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Texture Memory:</span>
                <span className="ml-2 font-mono text-purple-400">
                  {metrics.textureMemory}MB
                </span>
              </div>
              <div>
                <span className="text-gray-400">Geometry Memory:</span>
                <span className="ml-2 font-mono text-cyan-400">
                  {metrics.geometryMemory}MB
                </span>
              </div>
            </div>
          </div>
        </NeonCard>

        {/* Audio Metrics (4D) */}
        <NeonCard
          title="Audio Performance (4D)"
          variant="accent"
          interactive={false}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Audio Latency:</span>
                <span className="ml-2 font-mono text-white">
                  {metrics.audioLatency.toFixed(1)}ms
                </span>
              </div>
              <div>
                <span className="text-gray-400">Buffer Health:</span>
                <span
                  className={`ml-2 font-mono ${
                    metrics.audioBufferHealth > 80
                      ? 'text-green-400'
                      : metrics.audioBufferHealth > 60
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }`}
                >
                  {metrics.audioBufferHealth.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-400">Frequency Peaks:</span>
                <span className="ml-2 font-mono text-pink-400">
                  {metrics.frequencyPeaks.length}
                </span>
              </div>
            </div>

            {/* Frequency Visualization */}
            <div className="relative h-16 overflow-hidden rounded-lg bg-gray-900">
              <div className="flex h-full items-end space-x-1 p-2">
                {metrics.frequencyPeaks.slice(0, 20).map((peak, index) => (
                  <motion.div
                    key={index}
                    className="min-w-[2px] rounded-t bg-gradient-to-t from-pink-500 to-purple-400"
                    initial={{ height: 0 }}
                    animate={{ height: `${(peak / 255) * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </NeonCard>
      </div>

      {/* Optimization Suggestions */}
      {metrics.optimizationSuggestions.length > 0 && (
        <NeonCard
          title="Performance-Optimierungen"
          variant="ghost"
          interactive={false}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Erkannte Optimierungsmöglichkeiten:
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Auto-Optimierung:</span>
                <NeonButton
                  size="sm"
                  variant={isAutoOptimize ? 'primary' : 'ghost'}
                  onClick={() => setIsAutoOptimize(!isAutoOptimize)}
                >
                  {isAutoOptimize ? 'EIN' : 'AUS'}
                </NeonButton>
              </div>
            </div>

            <div className="grid gap-2">
              {metrics.optimizationSuggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-800 p-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-sm text-white">{suggestion}</span>
                  <NeonButton
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      console.log(`Applying optimization: ${suggestion}`)
                    }
                  >
                    Anwenden
                  </NeonButton>
                </motion.div>
              ))}
            </div>
          </div>
        </NeonCard>
      )}
    </div>
  );
}
