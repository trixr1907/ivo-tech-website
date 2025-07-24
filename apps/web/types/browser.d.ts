interface Performance {
  memory?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
}

interface Navigator {
  getBattery(): Promise<{
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
    addEventListener: (type: string, listener: (ev: Event) => any) => void;
    removeEventListener: (type: string, listener: (ev: Event) => any) => void;
  }>;
}
