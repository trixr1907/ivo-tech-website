'use client';

import React, {
  useState,
  useEffect,
  lazy,
  ComponentType,
} from 'react';
import { WebGLPowerPreference } from 'three';
import {
  isLowEndDevice,
  prefersReducedMotion,
  getPerformanceBudget,
} from '../../lib/utils';
import { SVGLogoFallback } from '../ui/SVGLogoFallback';

// Lazy Loading für schwere 3D-Komponenten
const AnimatedLogo4D = lazy(() => import('./AnimatedLogo4D'));
const EpicScene3D = lazy(() => import('./EpicScene3D'));
const ParallaxStarfield = lazy(() => import('./ParallaxStarfield'));

interface Adaptive3DContainerProps {
  /** Komponente die geladen werden soll */
  component: '3d-logo' | 'epic-scene' | 'starfield';
  /** Fallback-Optionen */
  fallbackComponent?: ComponentType<any>;
  /** Props für die 3D-Komponente */
  componentProps?: any;
  /** Container-Styling */
  className?: string;
  /** Force SVG Fallback */
  forceSVGFallback?: boolean;
  /** Enable Performance Monitoring */
  enablePerformanceMonitoring?: boolean;
}

interface DeviceCapabilities {
  canHandle3D: boolean;
  canHandleAnimations: boolean;
  shouldUseLowPoly: boolean;
  recommendedFPS: number;
  maxParticles: number;
}

// Vereinfachte Error Boundary - temporär deaktiviert

/**
 * Hauptkomponente für adaptives 3D-Rendering
 */
export function Adaptive3DContainer({
  component,
  fallbackComponent: FallbackComponent,
  componentProps = {},
  className = '',
  forceSVGFallback = false,
  enablePerformanceMonitoring = true,
}: Adaptive3DContainerProps) {
  const [deviceCapabilities, setDeviceCapabilities] =
    useState<DeviceCapabilities>({
      canHandle3D: true,
      canHandleAnimations: true,
      shouldUseLowPoly: false,
      recommendedFPS: 60,
      maxParticles: 500,
    });
  const [showFallback, setShowFallback] = useState(false);
  const [performanceGrade, setPerformanceGrade] = useState<
    'A' | 'B' | 'C' | 'D' | 'F'
  >('A');

  // Device Capabilities Detection
  useEffect(() => {
    const detectCapabilities = async (): Promise<DeviceCapabilities> => {
      const isLowEnd = isLowEndDevice();
      const prefersReduced = prefersReducedMotion();
      const budget = getPerformanceBudget();

      // WebGL-Support prüfen
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      const hasWebGL = !!gl;

      if (!hasWebGL) {
        setShowFallback(true);
        return {
          canHandle3D: false,
          canHandleAnimations: false,
          shouldUseLowPoly: true,
          recommendedFPS: 30,
          maxParticles: 0,
        };
      }

      // GPU-Info abrufen (falls verfügbar)
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : '';

      // Intel HD Graphics = Low-End GPU
      const isLowEndGPU = renderer.includes('Intel') && renderer.includes('HD');

      const capabilities: DeviceCapabilities = {
        canHandle3D: hasWebGL && !forceSVGFallback,
        canHandleAnimations: !prefersReduced,
        shouldUseLowPoly: isLowEnd || isLowEndGPU,
        recommendedFPS: budget.targetFPS,
        maxParticles: budget.maxParticles,
      };

      // Fallback bei sehr schwacher Hardware
      if (isLowEnd && (isLowEndGPU || prefersReduced)) {
        setShowFallback(true);
      }

      return capabilities;
    };

    detectCapabilities().then(setDeviceCapabilities);
  }, [forceSVGFallback]);

  // Performance Monitoring
  useEffect(() => {
    if (!enablePerformanceMonitoring) return;

    let frameCount = 0;
    let lastTime = performance.now();

    const monitorPerformance = (currentTime: number) => {
      frameCount++;

      if (currentTime - lastTime >= 5000) {
        // Jede 5 Sekunden prüfen
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

        // Performance-Grad basierend auf FPS
        let grade: typeof performanceGrade = 'F';
        if (fps >= 55) grade = 'A';
        else if (fps >= 45) grade = 'B';
        else if (fps >= 30) grade = 'C';
        else if (fps >= 20) grade = 'D';

        setPerformanceGrade(grade);

        // Auto-Fallback bei sehr schlechter Performance
        if (fps < 15 && !showFallback) {
          console.warn('Performance kritisch - wechsle zu SVG-Fallback');
          setShowFallback(true);
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(monitorPerformance);
    };

    const rafId = requestAnimationFrame(monitorPerformance);

    return () => cancelAnimationFrame(rafId);
  }, [enablePerformanceMonitoring, showFallback]);

  // Component Selector basierend auf Typ
  const get3DComponent = () => {
    switch (component) {
      case '3d-logo':
        return AnimatedLogo4D;
      case 'epic-scene':
        return EpicScene3D;
      case 'starfield':
        return ParallaxStarfield;
      default:
        return AnimatedLogo4D;
    }
  };

  // Adaptive Props basierend auf Device Capabilities
  const getAdaptiveProps = () => {
    return {
      ...componentProps,
      fpsLimit: deviceCapabilities.recommendedFPS,
      enableParticles: deviceCapabilities.maxParticles > 0,
      enableTimeMorphing: deviceCapabilities.canHandleAnimations,
      enableScanLines: deviceCapabilities.canHandleAnimations,
      lowPoly: deviceCapabilities.shouldUseLowPoly,
      maxParticles: deviceCapabilities.maxParticles,
    };
  };

  // Adaptive Canvas Settings
  const getCanvasSettings = () => {
    const isLowEnd = deviceCapabilities.shouldUseLowPoly;

    return {
      dpr: isLowEnd ? 1 : Math.min(window.devicePixelRatio, 2),
      performance: {
        min: isLowEnd ? 0.2 : 0.5,
        max: isLowEnd ? 0.8 : 1,
        debounce: isLowEnd ? 500 : 200,
      },
      gl: {
        antialias: !isLowEnd,
        alpha: true,
        powerPreference: (isLowEnd
          ? 'low-power'
          : 'high-performance') as WebGLPowerPreference,
        stencil: false,
        depth: true,
      },
      camera: {
        fov: isLowEnd ? 60 : 50,
        near: 0.1,
        far: isLowEnd ? 500 : 1000,
      },
    };
  };


  // Zeige SVG-Fallback wenn nötig
  if (showFallback || !deviceCapabilities.canHandle3D) {
    if (FallbackComponent) {
      return React.createElement(FallbackComponent, componentProps);
    }

    if (component === '3d-logo') {
      return (
        <div className={className}>
          <SVGLogoFallback
            size={componentProps.size || 200}
            colors={componentProps.themeColors}
            onClick={componentProps.onClick}
            enableAnimations={deviceCapabilities.canHandleAnimations}
          />
        </div>
      );
    }

    return (
      <div
        className={`${className} flex items-center justify-center rounded-lg bg-gray-800/50`}
      >
        <div className="text-center text-gray-400">
          <div className="mb-2 text-2xl">📱</div>
          <p className="text-sm">Optimiert für dein Gerät</p>
          <p className="mt-1 text-xs">3D-Inhalte sind deaktiviert</p>
        </div>
      </div>
    );
  }

  const Component3D = get3DComponent();
  const canvasSettings = getCanvasSettings();
  const adaptiveProps = getAdaptiveProps();

  return (
    <div className={`relative ${className}`}>
      {/* Performance Badge (nur in Development) */}
      {process.env.NODE_ENV === 'development' &&
        enablePerformanceMonitoring && (
          <div className="absolute right-2 top-2 z-10 rounded bg-black/80 px-2 py-1 font-mono text-xs text-white">
            Grade: {performanceGrade} | FPS: {deviceCapabilities.recommendedFPS}
          </div>
        )}

      {/* Temporarily disabled due to Canvas issues */}
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-400">3D-Komponente temporär deaktiviert</p>
      </div>

      {/* Mobile Performance Warning */}
      {deviceCapabilities.shouldUseLowPoly && (
        <div className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-yellow-400">
          ⚡ Reduzierte Qualität für bessere Performance
        </div>
      )}
    </div>
  );
}

export default Adaptive3DContainer;
