import { basePath } from '../../config';

interface TrendDataPoint {
  timestamp: string;
  metrics: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    fcp: number;
    lcp: number;
    cls: number;
    tbt: number;
    errorRecoveryTime: number;
    memoryUsage: number;
  };
  commit?: {
    hash: string;
    message: string;
    author: string;
  };
}

interface TrendAnalysis {
  current: TrendDataPoint;
  previous: TrendDataPoint | null;
  changes: {
    [K in keyof TrendDataPoint['metrics']]: {
      value: number;
      percentage: number;
      improved: boolean;
    };
  };
  regressions: Array<{
    metric: string;
    severity: 'high' | 'medium' | 'low';
    change: number;
  }>;
  improvements: Array<{
    metric: string;
    change: number;
  }>;
}

class PerformanceTrendService {
  private static instance: PerformanceTrendService;
  private readonly storagePath: string;
  private readonly maxDataPoints = 100; // Maximale Anzahl von Datenpunkten für Trends

  private constructor() {
    this.storagePath = `${basePath}/api/performance-trends`;
  }

  public static getInstance(): PerformanceTrendService {
    if (!PerformanceTrendService.instance) {
      PerformanceTrendService.instance = new PerformanceTrendService();
    }
    return PerformanceTrendService.instance;
  }

  /**
   * Speichert einen neuen Performance-Datenpunkt
   */
  public async saveTrendPoint(data: TrendDataPoint): Promise<void> {
    const response = await fetch(`${this.storagePath}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save trend point');
    }
  }

  /**
   * Analysiert Trends und erkennt Regressionen
   */
  public async analyzeTrends(): Promise<TrendAnalysis | null> {
    const dataPoints = await this.loadTrendPoints();
    if (dataPoints.length < 2) return null;

    const current = dataPoints[dataPoints.length - 1];
    const previous = dataPoints[dataPoints.length - 2];

    const changes = {} as TrendAnalysis['changes'];
    const regressions: TrendAnalysis['regressions'] = [];
    const improvements: TrendAnalysis['improvements'] = [];

    // Berechne Änderungen für jede Metrik
    for (const [key, value] of Object.entries(current.metrics)) {
      const prevValue = previous.metrics[key as keyof TrendDataPoint['metrics']];
      const change = value - prevValue;
      const percentage = (change / prevValue) * 100;

      changes[key as keyof TrendDataPoint['metrics']] = {
        value: change,
        percentage,
        improved: change > 0,
      };

      // Erkenne Regressionen
      if (change < 0) {
        const severity = this.calculateRegressionSeverity(key, percentage);
        if (severity) {
          regressions.push({
            metric: key,
            severity,
            change: Math.abs(percentage),
          });
        }
      }

      // Erkenne Verbesserungen
      if (change > 0) {
        improvements.push({
          metric: key,
          change: percentage,
        });
      }
    }

    return {
      current,
      previous,
      changes,
      regressions,
      improvements,
    };
  }

  /**
   * Generiert eine Zusammenfassung der Performance-Trends
   */
  public async generateTrendSummary(): Promise<string> {
    const analysis = await this.analyzeTrends();
    if (!analysis) return 'Nicht genügend Daten für Trendanalyse';

    const { regressions, improvements } = analysis;
    
    let summary = '## 📈 Performance Trend Analyse\n\n';

    if (regressions.length > 0) {
      summary += '### ⚠️ Erkannte Regressionen\n';
      regressions.forEach(({ metric, severity, change }) => {
        summary += `- ${metric}: ${change.toFixed(2)}% Verschlechterung (${severity})\n`;
      });
      summary += '\n';
    }

    if (improvements.length > 0) {
      summary += '### ✅ Verbesserungen\n';
      improvements.forEach(({ metric, change }) => {
        summary += `- ${metric}: ${change.toFixed(2)}% Verbesserung\n`;
      });
    }

    return summary;
  }

  /**
   * Generiert Chart-Daten für Visualisierungen
   */
  public async generateChartData(): Promise<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
    }>;
  }> {
    const dataPoints = await this.loadTrendPoints();
    const metrics = Object.keys(dataPoints[0]?.metrics || {});

    return {
      labels: dataPoints.map(point => {
        const date = new Date(point.timestamp);
        return date.toLocaleDateString();
      }),
      datasets: metrics.map(metric => ({
        label: metric,
        data: dataPoints.map(point => point.metrics[metric as keyof TrendDataPoint['metrics']]),
      })),
    };
  }

  private async loadTrendPoints(): Promise<TrendDataPoint[]> {
    const response = await fetch(`${this.storagePath}/load`);
    if (!response.ok) {
      throw new Error('Failed to load trend points');
    }
    const data = await response.json();
    return data.trendPoints;
  }

  private calculateRegressionSeverity(
    metric: string,
    change: number
  ): 'high' | 'medium' | 'low' | null {
    const absChange = Math.abs(change);
    
    // Metrik-spezifische Schwellenwerte
    const thresholds = {
      performance: { high: 10, medium: 5 },
      accessibility: { high: 5, medium: 2 },
      bestPractices: { high: 5, medium: 2 },
      seo: { high: 5, medium: 2 },
      fcp: { high: 20, medium: 10 },
      lcp: { high: 20, medium: 10 },
      cls: { high: 0.1, medium: 0.05 },
      tbt: { high: 30, medium: 15 },
      errorRecoveryTime: { high: 30, medium: 15 },
      memoryUsage: { high: 20, medium: 10 },
    };

    const metricThresholds = thresholds[metric as keyof typeof thresholds];
    if (!metricThresholds) return null;

    if (absChange >= metricThresholds.high) return 'high';
    if (absChange >= metricThresholds.medium) return 'medium';
    return 'low';
  }
}

export const performanceTrendService = PerformanceTrendService.getInstance();
