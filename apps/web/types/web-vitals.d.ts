declare module 'web-vitals' {
  export interface Metric {
    id: string;
    name: 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB';
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta: number;
    entries: PerformanceEntry[];
  }

  export type ReportHandler = (metric: Metric) => void;

  export function getCLS(onReport: ReportHandler, reportAllChanges?: boolean): void;
  export function getFCP(onReport: ReportHandler): void;
  export function getFID(onReport: ReportHandler): void;
  export function getLCP(onReport: ReportHandler, reportAllChanges?: boolean): void;
  export function getTTFB(onReport: ReportHandler): void;
}
