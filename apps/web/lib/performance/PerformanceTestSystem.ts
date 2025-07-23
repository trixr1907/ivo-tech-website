import { performanceManager } from './PerformanceManager';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  jsHeapSize: number; // JS Heap Size
  domNodes: number; // DOM Nodes Count
  resourceCount: number; // Resource Count
  resourceSize: number; // Total Resource Size
  renderTime: number; // Component Render Time
}

interface ComponentMetrics {
  name: string;
  renderTime: number;
  rerenderCount: number;
  memoryDelta: number;
}

class PerformanceTestSystem {
  private static instance: PerformanceTestSystem;
  private metrics: Map<string, PerformanceMetrics>;
  private componentMetrics: Map<string, ComponentMetrics[]>;

  private constructor() {
    this.metrics = new Map();
    this.componentMetrics = new Map();
    this.initializeWebVitalsTracking();
  }

  static getInstance(): PerformanceTestSystem {
    if (!PerformanceTestSystem.instance) {
      PerformanceTestSystem.instance = new PerformanceTestSystem();
    }
    return PerformanceTestSystem.instance;
  }

  // Web Vitals Tracking
  private initializeWebVitalsTracking() {
    if (typeof window === 'undefined') return;

    // First Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const fcp = entries[0];
        this.updateMetric('FCP', fcp.startTime);
      }
    }).observe({ type: 'paint', buffered: true });

    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const lcp = entries[entries.length - 1];
        this.updateMetric('LCP', lcp.startTime);
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        this.updateMetric('FID', entry.processingStart - entry.startTime);
      });
    }).observe({ type: 'first-input', buffered: true });

    // Layout Shifts
    new PerformanceObserver((entryList) => {
      let cumulativeScore = 0;
      entryList.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cumulativeScore += entry.value;
        }
      });
      this.updateMetric('CLS', cumulativeScore);
    }).observe({ type: 'layout-shift', buffered: true });
  }

  // Metrik Updates
  private updateMetric(key: string, value: number) {
    const metrics = this.metrics.get(key) || {} as PerformanceMetrics;
    this.metrics.set(key, {
      ...metrics,
      [key.toLowerCase()]: value,
    });
  }

  // Component Performance Tracking
  public trackComponent(name: string, startTime: number) {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    const metrics = this.componentMetrics.get(name) || [];
    
    metrics.push({
      name,
      renderTime,
      reenderCount: metrics.length + 1,
      memoryDelta: (performance as any).memory?.usedJSHeapSize || 0,
    });

    this.componentMetrics.set(name, metrics);

    // Performance Warning
    if (renderTime > 16.67) { // 60fps threshold
      console.warn(`Performance warning: ${name} took ${renderTime}ms to render`);
    }
  }

  // Resource Loading Performance
  public trackResourceLoading() {
    if (typeof window === 'undefined') return;

    const resources = performance.getEntriesByType('resource');
    let totalSize = 0;
    let totalTime = 0;

    resources.forEach(resource => {
      totalSize += resource.encodedBodySize;
      totalTime += resource.duration;
    });

    this.updateMetric('ResourceCount', resources.length);
    this.updateMetric('ResourceSize', totalSize);
    this.updateMetric('ResourceLoadTime', totalTime);
  }

  // 3D Performance Tracking
  public track3DPerformance(
    frameTime: number,
    triangleCount: number,
    drawCalls: number
  ) {
    const metrics = {
      frameTime,
      triangleCount,
      drawCalls,
      fps: 1000 / frameTime,
    };

    this.metrics.set('3D', metrics as any);

    // Performance Warnings
    if (frameTime > 16.67) {
      console.warn('3D Performance Warning: Low FPS', metrics);
    }
    if (drawCalls > 1000) {
      console.warn('3D Performance Warning: High draw call count', metrics);
    }
  }

  // Memory Leak Detection
  public async detectMemoryLeaks(
    component: string,
    iterations: number = 10
  ): Promise<boolean> {
    const measurements: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const beforeMemory = (performance as any).memory?.usedJSHeapSize;
      // Simulate component lifecycle
      await new Promise(resolve => setTimeout(resolve, 100));
      const afterMemory = (performance as any).memory?.usedJSHeapSize;
      
      measurements.push(afterMemory - beforeMemory);
    }

    // Analyze memory growth pattern
    const consistentGrowth = measurements.every((m, i) => 
      i === 0 || m >= measurements[i - 1]
    );

    if (consistentGrowth) {
      console.error(`Potential memory leak detected in ${component}`);
      return true;
    }

    return false;
  }

  // Performance Report Generation
  public generateReport(): PerformanceMetrics {
    return {
      fcp: this.metrics.get('FCP')?.fcp || 0,
      lcp: this.metrics.get('LCP')?.lcp || 0,
      fid: this.metrics.get('FID')?.fid || 0,
      cls: this.metrics.get('CLS')?.cls || 0,
      ttfb: performance.timing.responseStart - performance.timing.navigationStart,
      jsHeapSize: (performance as any).memory?.usedJSHeapSize || 0,
      domNodes: document.getElementsByTagName('*').length,
      resourceCount: this.metrics.get('ResourceCount')?.resourceCount || 0,
      resourceSize: this.metrics.get('ResourceSize')?.resourceSize || 0,
      renderTime: this.metrics.get('RenderTime')?.renderTime || 0,
    };
  }

  // Performance Recommendations
  public getRecommendations(): string[] {
    const metrics = this.generateReport();
    const recommendations: string[] = [];

    if (metrics.lcp > 2500) {
      recommendations.push('Optimize Largest Contentful Paint');
    }
    if (metrics.fid > 100) {
      recommendations.push('Improve First Input Delay');
    }
    if (metrics.cls > 0.1) {
      recommendations.push('Reduce Cumulative Layout Shift');
    }
    if (metrics.resourceSize > 5000000) {
      recommendations.push('Optimize resource size');
    }
    if (metrics.domNodes > 1500) {
      recommendations.push('Reduce DOM size');
    }

    return recommendations;
  }
}

export const performanceTestSystem = PerformanceTestSystem.getInstance();
