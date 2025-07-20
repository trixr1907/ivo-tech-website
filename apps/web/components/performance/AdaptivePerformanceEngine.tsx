'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAdvanced3DPerformance } from '../../hooks/useAdvanced3DPerformance';

interface PerformanceRule {
  id: string;
  condition: (metrics: any) => boolean;
  action: () => void;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  cooldown: number; // ms before rule can trigger again
  lastTriggered: number;
}

interface OptimizationState {
  lodLevel: number; // 0-4, higher = lower detail
  renderScale: number; // 0.5-1.0
  shadowQuality: 'off' | 'low' | 'medium' | 'high';
  postProcessingEnabled: boolean;
  particleCount: number; // multiplier 0-1
  textureQuality: 'low' | 'medium' | 'high';
  antiAliasing: boolean;
  frustumCulling: boolean;
  occlusionCulling: boolean;
}

const defaultOptimizationState: OptimizationState = {
  lodLevel: 0,
  renderScale: 1.0,
  shadowQuality: 'high',
  postProcessingEnabled: true,
  particleCount: 1.0,
  textureQuality: 'high',
  antiAliasing: true,
  frustumCulling: true,
  occlusionCulling: false,
};

export function AdaptivePerformanceEngine() {
  const { metrics } = useAdvanced3DPerformance();
  const [optimizationState, setOptimizationState] = useState<OptimizationState>(defaultOptimizationState);
  const [isEnabled, setIsEnabled] = useState(true);
  const [performanceHistory, setPerformanceHistory] = useState<number[]>([]);

  // Kritische Optimierungen
  const applyCriticalOptimizations = useCallback(() => {
    setOptimizationState(prev => ({
      ...prev,
      lodLevel: Math.min(4, prev.lodLevel + 2),
      renderScale: Math.max(0.5, prev.renderScale - 0.2),
      shadowQuality: 'off',
      postProcessingEnabled: false,
      particleCount: Math.max(0.2, prev.particleCount - 0.3),
      antiAliasing: false,
    }));
    console.log('🚨 Critical optimizations applied');
  }, []);

  // FPS-Optimierungen
  const applyFPSOptimizations = useCallback(() => {
    setOptimizationState(prev => ({
      ...prev,
      lodLevel: Math.min(3, prev.lodLevel + 1),
      renderScale: Math.max(0.7, prev.renderScale - 0.1),
      shadowQuality: prev.shadowQuality === 'high' ? 'medium' : prev.shadowQuality === 'medium' ? 'low' : 'off',
      particleCount: Math.max(0.5, prev.particleCount - 0.2),
    }));
    console.log('⚡ FPS optimizations applied');
  }, []);

  // Speicher-Optimierungen
  const applyMemoryOptimizations = useCallback(() => {
    setOptimizationState(prev => ({
      ...prev,
      textureQuality: prev.textureQuality === 'high' ? 'medium' : 'low',
      lodLevel: Math.min(3, prev.lodLevel + 1),
      occlusionCulling: true,
    }));
    console.log('💾 Memory optimizations applied');
  }, []);

  // GPU-Optimierungen
  const applyGPUOptimizations = useCallback(() => {
    setOptimizationState(prev => ({
      ...prev,
      postProcessingEnabled: false,
      antiAliasing: false,
      shadowQuality: prev.shadowQuality === 'high' ? 'medium' : 'low',
    }));
    console.log('🎮 GPU optimizations applied');
  }, []);

  // Draw-Call-Optimierungen
  const applyDrawCallOptimizations = useCallback(() => {
    setOptimizationState(prev => ({
      ...prev,
      frustumCulling: true,
      occlusionCulling: true,
      particleCount: Math.max(0.6, prev.particleCount - 0.2),
    }));
    console.log('📊 Draw call optimizations applied');
  }, []);

  // Qualitäts-Recovery
  const recoverQuality = useCallback(() => {
    setOptimizationState(prev => {
      const canRecover = performanceHistory.slice(-5).every(fps => fps > 45);
      if (!canRecover) return prev;

      return {
        ...prev,
        lodLevel: Math.max(0, prev.lodLevel - 1),
        renderScale: Math.min(1.0, prev.renderScale + 0.05),
        shadowQuality:
          prev.shadowQuality === 'off' ? 'low' : prev.shadowQuality === 'low' ? 'medium' : prev.shadowQuality,
        postProcessingEnabled: prev.lodLevel <= 1,
        particleCount: Math.min(1.0, prev.particleCount + 0.1),
        antiAliasing: prev.lodLevel <= 1,
      };
    });
    console.log('🌟 Quality recovery applied');
  }, [performanceHistory]);

  // Performance Rules definieren
  const createPerformanceRules = useCallback(
    (): PerformanceRule[] => [
      {
        id: 'critical_fps_drop',
        condition: m => m.fps < 15,
        action: () => applyCriticalOptimizations(),
        description: 'Kritischer FPS-Einbruch erkannt - Notfall-Optimierungen',
        priority: 'critical',
        cooldown: 5000,
        lastTriggered: 0,
      },
      {
        id: 'low_fps',
        condition: m => m.fps < 30 && m.fps >= 15,
        action: () => applyFPSOptimizations(),
        description: 'Niedrige FPS - Reduziere Rendering-Qualität',
        priority: 'high',
        cooldown: 3000,
        lastTriggered: 0,
      },
      {
        id: 'high_memory_usage',
        condition: m => m.memoryUsage > 500,
        action: () => applyMemoryOptimizations(),
        description: 'Hoher Speicherverbrauch - Reduziere Texturen/Geometrie',
        priority: 'high',
        cooldown: 5000,
        lastTriggered: 0,
      },
      {
        id: 'gpu_bottleneck',
        condition: m => m.bottleneckType === 'gpu',
        action: () => applyGPUOptimizations(),
        description: 'GPU-Bottleneck - Reduziere Shader-Komplexität',
        priority: 'medium',
        cooldown: 4000,
        lastTriggered: 0,
      },
      {
        id: 'high_draw_calls',
        condition: m => m.drawCalls > 200,
        action: () => applyDrawCallOptimizations(),
        description: 'Zu viele Draw-Calls - Aktiviere Batching',
        priority: 'medium',
        cooldown: 3000,
        lastTriggered: 0,
      },
      {
        id: 'good_performance_recovery',
        condition: m => m.fps > 45,
        action: () => recoverQuality(),
        description: 'Performance wieder stabil - Qualität erhöhen',
        priority: 'low',
        cooldown: 10000,
        lastTriggered: 0,
      },
    ],
    [
      applyCriticalOptimizations,
      applyFPSOptimizations,
      applyMemoryOptimizations,
      applyGPUOptimizations,
      applyDrawCallOptimizations,
      recoverQuality,
    ]
  );

  // Performance-History aktualisieren
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceHistory(prev => [...prev.slice(-19), metrics.fps]);
    }, 1000);
    return () => clearInterval(interval);
  }, [metrics.fps]);

  // Rule-Engine
  useEffect(() => {
    if (!isEnabled || !metrics) return;

    const rules = createPerformanceRules();
    const now = Date.now();

    rules.forEach(rule => {
      if (rule.condition(metrics) && now - rule.lastTriggered > rule.cooldown) {
        rule.action();
        rule.lastTriggered = now;

        // Event dispatchen für externe Systeme
        window.dispatchEvent(
          new CustomEvent('performance-optimization', {
            detail: { rule: rule.id, description: rule.description },
          })
        );
      }
    });
  }, [metrics, isEnabled, createPerformanceRules]);

  // Optimierungen anwenden (extern verfügbar)
  const applyOptimizations = useCallback((newState: Partial<OptimizationState>) => {
    setOptimizationState(prev => ({ ...prev, ...newState }));
  }, []);

  // Reset zu Defaults
  const resetOptimizations = useCallback(() => {
    setOptimizationState(defaultOptimizationState);
  }, []);

  // Performance-Budget-System
  const getPerformanceBudget = useCallback(() => {
    const targetFPS = 60;
    const currentFPS = metrics.fps || 0;
    const frameTime = 1000 / targetFPS; // 16.67ms für 60fps
    const currentFrameTime = metrics.frameTime || 0;

    return {
      fps: {
        target: targetFPS,
        current: currentFPS,
        budget: Math.max(0, targetFPS - currentFPS),
      },
      frameTime: {
        target: frameTime,
        current: currentFrameTime,
        budget: Math.max(0, currentFrameTime - frameTime),
      },
      memory: {
        target: 250, // MB
        current: metrics.memoryUsage || 0,
        budget: Math.max(0, 250 - (metrics.memoryUsage || 0)),
      },
    };
  }, [metrics]);

  // Adaptives Profiling
  const getAdaptiveProfile = useCallback(() => {
    const avgFPS = performanceHistory.reduce((a, b) => a + b, 0) / performanceHistory.length;

    if (avgFPS >= 55) return 'ultra';
    if (avgFPS >= 45) return 'high';
    if (avgFPS >= 30) return 'medium';
    if (avgFPS >= 20) return 'low';
    return 'potato';
  }, [performanceHistory]);

  // Public API für externe Komponenten
  const api = {
    optimizationState,
    isEnabled,
    setIsEnabled,
    applyOptimizations,
    resetOptimizations,
    getPerformanceBudget,
    getAdaptiveProfile,
    performanceHistory,
  };

  // Global verfügbar machen
  useEffect(() => {
    (window as any).AdaptivePerformanceEngine = api;
  }, [api]);

  return null; // Unsichtbare Engine-Komponente
}

// Hook für externe Nutzung
export function useAdaptivePerformance() {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    const checkAPI = () => {
      if ((window as any).AdaptivePerformanceEngine) {
        setApi((window as any).AdaptivePerformanceEngine);
      }
    };

    checkAPI();
    const interval = setInterval(checkAPI, 100);

    return () => clearInterval(interval);
  }, []);

  return api;
}
