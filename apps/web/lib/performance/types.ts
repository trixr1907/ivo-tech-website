export interface PerformanceMetrics {
  // Web Vitals
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte

  // Resource Metrics
  resourceCount: number;
  resourceSize: number;
  requestDuration: number;
  downloadSpeed: number;

  // Memory & DOM
  jsHeapSize: number;
  domNodes: number;
  framesPerSecond: number;
  gpuUsage: number;
}

export interface PerformanceRecommendation {
  type: 'warning' | 'error' | 'info';
  message: string;
  score: number;
  priority: number;
  category: 'webVitals' | 'resources' | 'memory' | 'rendering';
  action?: string;
}

export interface PerformanceConfig {
  thresholds: {
    webVitals: {
      fcp: number;
      lcp: number;
      fid: number;
      cls: number;
      ttfb: number;
    };
    resources: {
      maxCount: number;
      maxSize: number;
      maxRequestDuration: number;
      minDownloadSpeed: number;
    };
    memory: {
      maxHeapSize: number;
      maxDomNodes: number;
    };
    rendering: {
      minFramesPerSecond: number;
      maxGpuUsage: number;
    };
  };
  monitoring: {
    interval: number;
    enableLogging: boolean;
    saveToLocalStorage: boolean;
  };
}

// Standard Performance Konfiguration
export const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  thresholds: {
    webVitals: {
      fcp: 1800, // 1.8s
      lcp: 2500, // 2.5s
      fid: 100, // 100ms
      cls: 0.1, // 0.1
      ttfb: 600, // 600ms
    },
    resources: {
      maxCount: 50,
      maxSize: 5000000, // 5MB
      maxRequestDuration: 3000, // 3s
      minDownloadSpeed: 1000000, // 1 MB/s
    },
    memory: {
      maxHeapSize: 100000000, // 100MB
      maxDomNodes: 1500,
    },
    rendering: {
      minFramesPerSecond: 30, // 30 FPS
      maxGpuUsage: 80, // 80%
    },
  },
  monitoring: {
    interval: 1000, // 1s
    enableLogging: true,
    saveToLocalStorage: true,
  },
};
