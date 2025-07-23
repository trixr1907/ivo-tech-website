import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import Stats from 'stats.js';

interface PerformanceMetrics {
  fps: number;
  memory: {
    geometries: number;
    textures: number;
    programs: number;
    drawCalls: number;
  };
  render: {
    triangles: number;
    points: number;
    lines: number;
  };
  gpu: {
    memory: number;
    usage: number;
  };
}

interface PerformanceConfig {
  enableStats?: boolean;
  enableMemoryMonitor?: boolean;
  enableGPUMonitor?: boolean;
  targetFPS?: number;
  adaptiveQuality?: boolean;
  onPerformanceDrop?: (metrics: PerformanceMetrics) => void;
  onQualityAdjust?: (quality: 'low' | 'medium' | 'high' | 'ultra') => void;
}

interface PerformanceMonitorProps extends PerformanceConfig {
  children?: React.ReactNode;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  children,
  enableStats = true,
  enableMemoryMonitor = true,
  enableGPUMonitor = true,
  targetFPS = 60,
  adaptiveQuality = true,
  onPerformanceDrop,
  onQualityAdjust
}) => {
  const { gl, scene } = useThree();
  const stats = useRef<Stats>();
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const [currentQuality, setCurrentQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>('medium');

  // Initialize Stats.js
  useEffect(() => {
    if (enableStats) {
      stats.current = new Stats();
      stats.current.showPanel(0); // 0: fps, 1: ms, 2: mb
      document.body.appendChild(stats.current.dom);

      return () => {
        document.body.removeChild(stats.current!.dom);
      };
    }
  }, [enableStats]);

  // Performance monitoring
  const getPerformanceMetrics = (): PerformanceMetrics => {
    const info = gl.info;
    const memory = (performance as any).memory || {};
    
    return {
      fps: frameCount.current,
      memory: {
        geometries: info.memory.geometries,
        textures: info.memory.textures,
        programs: info.programs?.length || 0,
        drawCalls: info.render.calls
      },
      render: {
        triangles: info.render.triangles,
        points: info.render.points,
        lines: info.render.lines
      },
      gpu: {
        memory: memory.totalJSHeapSize || 0,
        usage: memory.usedJSHeapSize || 0
      }
    };
  };

  // Quality adjustment based on performance
  const adjustQuality = (metrics: PerformanceMetrics) => {
    if (!adaptiveQuality) return;

    const currentFPS = metrics.fps;
    let newQuality = currentQuality;

    if (currentFPS < targetFPS * 0.5) {
      newQuality = 'low';
    } else if (currentFPS < targetFPS * 0.75) {
      newQuality = 'medium';
    } else if (currentFPS < targetFPS * 0.9) {
      newQuality = 'high';
    } else {
      newQuality = 'ultra';
    }

    if (newQuality !== currentQuality) {
      setCurrentQuality(newQuality);
      onQualityAdjust?.(newQuality);
    }
  };

  // Scene optimization
  const optimizeScene = () => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        // Optimize geometries
        if (object.geometry instanceof THREE.BufferGeometry) {
          object.geometry.computeBoundingSphere();
          object.geometry.computeBoundingBox();
        }

        // Optimize materials
        if (object.material instanceof THREE.Material) {
          object.material.dispose();
        }
      }
    });

    // Force garbage collection if available
    if (typeof window.gc === 'function') {
      window.gc();
    }
  };

  // Frame monitoring
  useFrame((state, delta) => {
    if (stats.current) {
      stats.current.begin();
    }

    // Calculate FPS
    frameCount.current++;
    const currentTime = performance.now();
    if (currentTime - lastTime.current >= 1000) {
      const metrics = getPerformanceMetrics();

      if (metrics.fps < targetFPS) {
        onPerformanceDrop?.(metrics);
        adjustQuality(metrics);
      }

      // Reset counters
      frameCount.current = 0;
      lastTime.current = currentTime;

      // Optimize scene if memory usage is high
      if (enableMemoryMonitor && metrics.gpu.usage > 0.8 * metrics.gpu.memory) {
        optimizeScene();
      }
    }

    if (stats.current) {
      stats.current.end();
    }
  });

  return <>{children}</>;
};

export default PerformanceMonitor;

// Performance presets
export const performancePresets = {
  balanced: {
    enableStats: true,
    enableMemoryMonitor: true,
    enableGPUMonitor: true,
    targetFPS: 60,
    adaptiveQuality: true
  },
  quality: {
    enableStats: true,
    enableMemoryMonitor: true,
    enableGPUMonitor: true,
    targetFPS: 30,
    adaptiveQuality: false
  },
  performance: {
    enableStats: true,
    enableMemoryMonitor: true,
    enableGPUMonitor: true,
    targetFPS: 90,
    adaptiveQuality: true
  }
} as const;
