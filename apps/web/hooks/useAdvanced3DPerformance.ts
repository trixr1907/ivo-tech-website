'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';

interface Performance3DMetrics {
  // Basis-Metriken
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;

  // Speicher-Metriken
  memoryUsage: number;
  textureMemory: number;
  geometryMemory: number;

  // 3D-spezifische Metriken
  activeObjects: number;
  visibleObjects: number;
  frustrumCulled: number;

  // Audio-Metriken (4D)
  audioLatency: number;
  audioBufferHealth: number;
  frequencyPeaks: number[];

  // Performance-Status
  performanceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  bottleneckType: 'cpu' | 'gpu' | 'memory' | 'audio' | 'none';
  optimizationSuggestions: string[];
}

interface PerformanceThresholds {
  fps: { excellent: number; good: number; fair: number; poor: number };
  frameTime: { excellent: number; good: number; fair: number; poor: number };
  memory: { excellent: number; good: number; fair: number; poor: number };
}

const defaultThresholds: PerformanceThresholds = {
  fps: { excellent: 60, good: 45, fair: 30, poor: 15 },
  frameTime: { excellent: 16.67, good: 22.22, fair: 33.33, poor: 66.67 },
  memory: { excellent: 100, good: 250, fair: 500, poor: 1000 },
};

export function useAdvanced3DPerformance() {
  const [metrics, setMetrics] = useState<Performance3DMetrics>({
    fps: 0,
    frameTime: 0,
    drawCalls: 0,
    triangles: 0,
    memoryUsage: 0,
    textureMemory: 0,
    geometryMemory: 0,
    activeObjects: 0,
    visibleObjects: 0,
    frustrumCulled: 0,
    audioLatency: 0,
    audioBufferHealth: 100,
    frequencyPeaks: [],
    performanceGrade: 'A',
    bottleneckType: 'none',
    optimizationSuggestions: [],
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const frameTimesRef = useRef<number[]>([]);
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);

  // WebGL-Kontext für GPU-Metriken
  const [glContext, setGlContext] = useState<WebGLRenderingContext | null>(
    null
  );

  useEffect(() => {
    // WebGL-Kontext erfassen
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setGlContext(gl);
    }

    // Performance Observer für detaillierte Metriken
    if ('PerformanceObserver' in window) {
      performanceObserverRef.current = new PerformanceObserver(list => {
        const entries = list.getEntries();
        // Verarbeite Performance-Einträge
        entries.forEach(entry => {
          if (entry.entryType === 'measure') {
            // Custom Measurements verarbeiten
          }
        });
      });

      performanceObserverRef.current.observe({
        entryTypes: ['measure', 'navigation', 'resource'],
      });
    }

    return () => {
      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect();
      }
    };
  }, []);

  // Hauptupdate-Funktion für Metriken
  const updateMetrics = useCallback(
    (state?: any, delta?: number) => {
      const now = performance.now();
      const deltaTime = now - lastTimeRef.current;

      frameCountRef.current++;

      // FPS-Berechnung (über 1 Sekunde)
      if (deltaTime >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / deltaTime);

        // Frame-Zeit-Durchschnitt
        const avgFrameTime =
          frameTimesRef.current.reduce((a, b) => a + b, 0) /
            frameTimesRef.current.length || 0;

        // GPU-Metriken (wenn WebGL verfügbar)
        let drawCalls = 0;
        const triangles = 0;
        if (glContext && state?.gl) {
          const ext = state.gl.getExtension('WEBGL_debug_renderer_info');
          if (ext) {
            drawCalls = state.gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || 0;
          }
        }

        // Speicher-Metriken
        const memInfo = (performance as any).memory;
        const memoryUsage = memInfo
          ? Math.round(memInfo.usedJSHeapSize / 1048576)
          : 0;

        // 3D-Szenen-Metriken
        const sceneMetrics = extractSceneMetrics(state);

        // Performance-Bewertung
        const grade = calculatePerformanceGrade(fps, avgFrameTime, memoryUsage);
        const bottleneck = detectBottleneck(fps, avgFrameTime, memoryUsage);
        const suggestions = generateOptimizationSuggestions(
          fps,
          memoryUsage,
          bottleneck
        );

        setMetrics(prev => ({
          ...prev,
          fps,
          frameTime: avgFrameTime,
          drawCalls,
          triangles,
          memoryUsage,
          ...sceneMetrics,
          performanceGrade: grade,
          bottleneckType: bottleneck,
          optimizationSuggestions: suggestions,
        }));

        // Reset für nächste Messung
        frameCountRef.current = 0;
        lastTimeRef.current = now;
        frameTimesRef.current = [];
      }

      // Frame-Zeit sammeln
      if (delta) {
        frameTimesRef.current.push(delta * 1000);
        if (frameTimesRef.current.length > 60) {
          frameTimesRef.current.shift();
        }
      }
    },
    [glContext]
  );

  // Audio-Performance-Updates
  const updateAudioMetrics = useCallback(
    (audioContext?: AudioContext, analyserNode?: AnalyserNode) => {
      if (!audioContext || !analyserNode) return;

      const bufferHealth =
        (audioContext.currentTime / audioContext.baseLatency) * 100;
      const latency = audioContext.baseLatency * 1000; // in ms

      // Frequenz-Peaks analysieren
      const frequencyData = new Uint8Array(analyserNode.frequencyBinCount);
      analyserNode.getByteFrequencyData(frequencyData);

      const peaks: number[] = [];
      for (let i = 0; i < frequencyData.length; i += 10) {
        if (frequencyData[i] > 128) {
          peaks.push(i);
        }
      }

      setMetrics(prev => ({
        ...prev,
        audioLatency: latency,
        audioBufferHealth: Math.min(100, bufferHealth),
        frequencyPeaks: peaks,
      }));
    },
    []
  );

  // 3D-Szenen-Metriken extrahieren
  const extractSceneMetrics = (state: any) => {
    if (!state || !state.scene) {
      return {
        activeObjects: 0,
        visibleObjects: 0,
        frustrumCulled: 0,
        textureMemory: 0,
        geometryMemory: 0,
      };
    }

    let activeObjects = 0;
    let visibleObjects = 0;
    let textureMemory = 0;
    let geometryMemory = 0;

    state.scene.traverse((child: any) => {
      activeObjects++;

      if (child.visible) {
        visibleObjects++;
      }

      // Geometrie-Speicher schätzen
      if (child.geometry) {
        const positions = child.geometry.attributes.position;
        if (positions) {
          geometryMemory += positions.array.length * 4; // Float32 = 4 bytes
        }
      }

      // Textur-Speicher schätzen
      if (child.material && child.material.map) {
        const texture = child.material.map;
        if (texture.image) {
          textureMemory += texture.image.width * texture.image.height * 4; // RGBA
        }
      }
    });

    return {
      activeObjects,
      visibleObjects,
      frustrumCulled: activeObjects - visibleObjects,
      textureMemory: Math.round(textureMemory / 1048576), // MB
      geometryMemory: Math.round(geometryMemory / 1048576), // MB
    };
  };

  // Performance-Bewertung
  const calculatePerformanceGrade = (
    fps: number,
    frameTime: number,
    memory: number
  ): Performance3DMetrics['performanceGrade'] => {
    const fpsScore =
      fps >= 60 ? 4 : fps >= 45 ? 3 : fps >= 30 ? 2 : fps >= 15 ? 1 : 0;
    const frameScore =
      frameTime <= 16.67
        ? 4
        : frameTime <= 22.22
          ? 3
          : frameTime <= 33.33
            ? 2
            : frameTime <= 66.67
              ? 1
              : 0;
    const memoryScore =
      memory <= 100
        ? 4
        : memory <= 250
          ? 3
          : memory <= 500
            ? 2
            : memory <= 1000
              ? 1
              : 0;

    const avgScore = (fpsScore + frameScore + memoryScore) / 3;

    if (avgScore >= 3.5) return 'A';
    if (avgScore >= 2.5) return 'B';
    if (avgScore >= 1.5) return 'C';
    if (avgScore >= 0.5) return 'D';
    return 'F';
  };

  // Engpass-Erkennung
  const detectBottleneck = (
    fps: number,
    frameTime: number,
    memory: number
  ): Performance3DMetrics['bottleneckType'] => {
    if (memory > 500) return 'memory';
    if (frameTime > 33.33) return 'cpu';
    if (fps < 30) return 'gpu';
    return 'none';
  };

  // Optimierungs-Vorschläge
  const generateOptimizationSuggestions = (
    fps: number,
    memory: number,
    bottleneck: string
  ): string[] => {
    const suggestions: string[] = [];

    if (bottleneck === 'memory') {
      suggestions.push('Reduziere Texturauflösung');
      suggestions.push('Implementiere Texture-Streaming');
      suggestions.push('Verwende Geometrie-Instancing');
    }

    if (bottleneck === 'cpu') {
      suggestions.push('Optimiere Animationslogik');
      suggestions.push('Reduziere JavaScript-Berechnungen pro Frame');
      suggestions.push('Implementiere Object-Pooling');
    }

    if (bottleneck === 'gpu') {
      suggestions.push('Reduziere Polygon-Anzahl');
      suggestions.push('Optimiere Shader-Komplexität');
      suggestions.push('Implementiere Level-of-Detail (LOD)');
    }

    if (fps < 45) {
      suggestions.push('Aktiviere Frustum Culling');
      suggestions.push('Reduziere Post-Processing-Effekte');
    }

    return suggestions;
  };

  // Optimierungs-Aktionen
  const optimizePerformance = useCallback((action: string) => {
    switch (action) {
      case 'reduceLOD':
        // LOD-Level reduzieren
        break;
      case 'cullObjects':
        // Objekte außerhalb des Sichtfelds entfernen
        break;
      case 'compressTextures':
        // Texturen komprimieren
        break;
      case 'disableEffects':
        // Post-Processing-Effekte deaktivieren
        break;
    }
  }, []);

  return {
    metrics,
    updateMetrics,
    updateAudioMetrics,
    optimizePerformance,
    thresholds: defaultThresholds,
  };
}
