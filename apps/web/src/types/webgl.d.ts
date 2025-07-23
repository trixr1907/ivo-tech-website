interface GPUAdapter {
  requestStatistics(): Promise<{ utilizationPercentage: number }>;
}

interface GPU {
  requestAdapter(): Promise<GPUAdapter>;
}

interface Navigator {
  gpu: GPU;
}

interface Performance {
  memory: {
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
  };
}
