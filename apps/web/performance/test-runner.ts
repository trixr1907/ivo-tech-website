import { chromium, Browser, Page } from 'playwright';
import { performance } from 'perf_hooks';
import fs from 'fs/promises';
import path from 'path';

interface PerformanceMetrics {
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  TTI: number; // Time to Interactive
  TBT: number; // Total Blocking Time
  errorRecoveryTime: number; // Zeit zur Fehlerwiederherstellung
  memoryUsage: number; // Speichernutzung
  jsHeapSize: number; // JavaScript Heap-Größe
}

interface TestResult {
  name: string;
  metrics: PerformanceMetrics;
  timestamp: string;
  pass: boolean;
  threshold: {
    FCP: number;
    LCP: number;
    FID: number;
    CLS: number;
    TTI: number;
    TBT: number;
    errorRecoveryTime: number;
  };
}

class PerformanceTestRunner {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private results: TestResult[] = [];
  
  private readonly thresholds = {
    FCP: 1000, // 1s
    LCP: 2500, // 2.5s
    FID: 100,  // 100ms
    CLS: 0.1,  // 0.1
    TTI: 3500, // 3.5s
    TBT: 300,  // 300ms
    errorRecoveryTime: 1000, // 1s
  };

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    this.page = await this.browser.newPage();

    // Performance Observer Setup
    await this.page.addInitScript(() => {
      window.performanceMetrics = {
        FCP: 0,
        LCP: 0,
        FID: 0,
        CLS: 0,
        TTI: 0,
        TBT: 0,
      };

      // First Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        window.performanceMetrics.FCP = entries[0].startTime;
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        window.performanceMetrics.LCP = entries[entries.length - 1].startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        window.performanceMetrics.FID = entries[0].processingStart - entries[0].startTime;
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          window.performanceMetrics.CLS += entry.value;
        }
      }).observe({ entryTypes: ['layout-shift'] });
    });
  }

  async runTest(name: string, url: string): Promise<void> {
    if (!this.page) throw new Error('Browser nicht initialisiert');

    const startTime = performance.now();
    await this.page.goto(url, { waitUntil: 'networkidle' });

    // Simuliere Fehler
    await this.page.click('[data-testid="trigger-error"]');
    
    // Warte auf ErrorBoundary
    await this.page.waitForSelector('[role="alert"]');

    // Messe Wiederherstellungszeit
    const recoveryStart = performance.now();
    await this.page.click('text=Erneut versuchen');
    await this.page.waitForSelector('[data-testid="app-content"]');
    const recoveryTime = performance.now() - recoveryStart;

    // Sammle Metriken
    const metrics = await this.page.evaluate(() => {
      const performance = window.performance;
      const memory = (performance as any).memory || {};
      
      return {
        ...window.performanceMetrics,
        memoryUsage: memory.usedJSHeapSize || 0,
        jsHeapSize: memory.totalJSHeapSize || 0,
        errorRecoveryTime: 0, // Wird später gesetzt
      };
    });

    metrics.errorRecoveryTime = recoveryTime;

    // Prüfe Metriken gegen Schwellenwerte
    const pass = Object.entries(this.thresholds).every(
      ([key, threshold]) => metrics[key as keyof PerformanceMetrics] <= threshold
    );

    // Speichere Ergebnis
    this.results.push({
      name,
      metrics,
      timestamp: new Date().toISOString(),
      pass,
      threshold: this.thresholds,
    });
  }

  async generateReport(): Promise<void> {
    const reportDir = path.join(process.cwd(), 'performance/reports');
    await fs.mkdir(reportDir, { recursive: true });

    const reportPath = path.join(
      reportDir,
      `performance-report-${new Date().toISOString().replace(/:/g, '-')}.json`
    );

    const report = {
      summary: {
        totalTests: this.results.length,
        passedTests: this.results.filter((r) => r.pass).length,
        averageMetrics: this.calculateAverageMetrics(),
      },
      results: this.results,
      timestamp: new Date().toISOString(),
    };

    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  }

  private calculateAverageMetrics(): PerformanceMetrics {
    const sum = this.results.reduce(
      (acc, result) => {
        Object.entries(result.metrics).forEach(([key, value]) => {
          acc[key as keyof PerformanceMetrics] += value;
        });
        return acc;
      },
      {
        FCP: 0,
        LCP: 0,
        FID: 0,
        CLS: 0,
        TTI: 0,
        TBT: 0,
        errorRecoveryTime: 0,
        memoryUsage: 0,
        jsHeapSize: 0,
      }
    );

    const count = this.results.length;
    return Object.entries(sum).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value / count,
      }),
      {} as PerformanceMetrics
    );
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

export const performanceTestRunner = new PerformanceTestRunner();
