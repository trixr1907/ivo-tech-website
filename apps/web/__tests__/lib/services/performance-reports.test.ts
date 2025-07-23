import { performanceReportService } from '../../../lib/services/performance-reports';
import { performanceTrendService } from '../../../lib/services/performance-trends';
import { monitoringThresholds, alertingThresholds } from '../../../config/monitoring.config';

// Mock der abhängigen Services
jest.mock('../../../lib/services/performance-trends');
jest.mock('../../../lib/services/performance-monitoring');

describe('PerformanceReportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateReport', () => {
    it('should generate a daily performance report', async () => {
      // Mock-Daten für Web Vitals
      const mockWebVitalsData = {
        FCP: [1000, 1200, 1100],
        LCP: [2500, 2800, 2600],
        FID: [100, 120, 110],
        CLS: [0.1, 0.15, 0.12],
      };

      // Mock-Daten für Ressourcen
      const mockResourceData = {
        resourceSize: [500000, 520000, 510000],
        resourceLoadTime: [800, 850, 820],
        cacheHitRate: [0.8, 0.85, 0.82],
        compressionEnabled: [1],
        compressionSavings: [250000, 260000, 255000],
      };

      // Mock der Fehler-Daten
      const mockErrors = [
        {
          message: 'Test Error 1',
          timestamp: '2025-07-23T10:00:00Z',
          userId: 'user1',
          stack: 'Error stack 1',
        },
        {
          message: 'Test Error 2',
          timestamp: '2025-07-23T11:00:00Z',
          userId: 'user2',
          stack: 'Error stack 2',
        },
      ];

      // Setup der Mocks
      (performanceTrendService.getTrendPoints as jest.Mock).mockImplementation(
        (metrics) => {
          if (metrics.includes('score')) {
            return { score: [0.85, 0.87, 0.86] };
          }
          if (metrics.includes('errorRate')) {
            return { errorRate: [0.02, 0.03, 0.025] };
          }
          if (metrics.includes('resourceLoadTime')) {
            return { resourceLoadTime: mockResourceData.resourceLoadTime };
          }
          if (metrics.includes('compressionEnabled')) {
            return {
              compressionEnabled: mockResourceData.compressionEnabled,
              compressionSavings: mockResourceData.compressionSavings,
            };
          }
          return mockWebVitalsData;
        }
      );

      (performanceTrendService.getErrors as jest.Mock).mockResolvedValue(
        mockErrors
      );

      // Test der Report-Generierung
      const endDate = '2025-07-23T20:00:00Z';
      const report = await performanceReportService.generateReport('daily', endDate);

      // Überprüfung der grundlegenden Report-Struktur
      expect(report).toHaveProperty('period', 'daily');
      expect(report).toHaveProperty('startDate');
      expect(report).toHaveProperty('endDate', endDate);
      expect(report).toHaveProperty('summary');
      expect(report).toHaveProperty('webVitals');
      expect(report).toHaveProperty('resources');
      expect(report).toHaveProperty('errors');
      expect(report).toHaveProperty('optimization');
      expect(report).toHaveProperty('trends');

      // Überprüfung der Web Vitals
      expect(report.webVitals).toHaveProperty('FCP');
      expect(report.webVitals).toHaveProperty('LCP');
      expect(report.webVitals).toHaveProperty('FID');
      expect(report.webVitals).toHaveProperty('CLS');

      // Überprüfung der Ressourcen-Metriken
      expect(report.resources).toHaveProperty('totalSize');
      expect(report.resources).toHaveProperty('loadTime');
      expect(report.resources).toHaveProperty('cacheHitRate');
      expect(report.resources).toHaveProperty('compression');

      // Überprüfung der Fehler-Analyse
      expect(report.errors).toHaveProperty('total', 2);
      expect(report.errors).toHaveProperty('unique', 2);
      expect(report.errors).toHaveProperty('impactedUsers', 2);
      expect(report.errors.topErrors).toHaveLength(2);

      // Überprüfung der Trends
      expect(report.trends).toHaveProperty('performance');
      expect(report.trends).toHaveProperty('errors');
      expect(report.trends).toHaveProperty('resources');
    });
  });

  describe('calculateMetricSummary', () => {
    it('should calculate correct metric summary', () => {
      const values = [100, 120, 110, 130, 115];
      const threshold = { good: 100, poor: 200 };

      const summary = performanceReportService['calculateMetricSummary'](
        values,
        threshold
      );

      expect(summary).toEqual({
        current: 115,
        previous: 130,
        change: -11.538461538461538,
        threshold: { good: 100, poor: 200 },
        p75: 120,
        p90: 130,
        p95: 130,
      });
    });
  });

  describe('calculateGrade', () => {
    it('should return correct grades for different scores', () => {
      const testCases = [
        { score: 0.95, expected: 'A' },
        { score: 0.85, expected: 'B' },
        { score: 0.75, expected: 'C' },
        { score: 0.65, expected: 'D' },
        { score: 0.55, expected: 'F' },
      ];

      testCases.forEach(({ score, expected }) => {
        const grade = performanceReportService['calculateGrade'](score);
        expect(grade).toBe(expected);
      });
    });
  });

  describe('determineStatus', () => {
    it('should determine correct status based on score changes', () => {
      const testCases = [
        { current: 0.9, previous: 0.8, expected: 'improving' },
        { current: 0.8, previous: 0.9, expected: 'degrading' },
        { current: 0.85, previous: 0.84, expected: 'stable' },
      ];

      testCases.forEach(({ current, previous, expected }) => {
        const status = performanceReportService['determineStatus'](
          current,
          previous
        );
        expect(status).toBe(expected);
      });
    });
  });

  describe('normalizeMetric', () => {
    it('should normalize metrics correctly', () => {
      const testCases = [
        {
          value: 1000,
          threshold: { good: 1000, poor: 3000 },
          expected: 1,
        },
        {
          value: 3000,
          threshold: { good: 1000, poor: 3000 },
          expected: 0,
        },
        {
          value: 2000,
          threshold: { good: 1000, poor: 3000 },
          expected: 0.5,
        },
      ];

      testCases.forEach(({ value, threshold, expected }) => {
        const normalized = performanceReportService['normalizeMetric'](
          value,
          threshold
        );
        expect(normalized).toBe(expected);
      });
    });
  });

  describe('calculatePerformanceScore', () => {
    it('should calculate overall performance score correctly', () => {
      const webVitals = {
        FCP: { current: 1000, threshold: { good: 1000, poor: 3000 } },
        LCP: { current: 2500, threshold: { good: 2000, poor: 4000 } },
        FID: { current: 100, threshold: { good: 100, poor: 300 } },
        CLS: { current: 0.1, threshold: { good: 0.1, poor: 0.25 } },
      };

      const resources = {
        loadTime: { current: 800, threshold: { good: 500, poor: 1500 } },
      };

      const errors = { total: 5 };

      const score = performanceReportService['calculatePerformanceScore'](
        webVitals as any,
        resources as any,
        errors
      );

      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(1);
    });
  });
});
