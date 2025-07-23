import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PerformanceReport } from '../../../components/performance/PerformanceReport';
import { performanceReportService } from '../../../lib/services/performance-reports';

// Mock der abhängigen Services
jest.mock('../../../lib/services/performance-reports');

describe('PerformanceReport', () => {
  const mockReport = {
    period: 'daily',
    startDate: '2025-07-22T20:00:00Z',
    endDate: '2025-07-23T20:00:00Z',
    summary: {
      score: 0.85,
      grade: 'B',
      status: 'improving',
    },
    webVitals: {
      FCP: {
        current: 1200,
        previous: 1300,
        change: -7.69,
        threshold: { good: 1000, poor: 3000 },
        p75: 1250,
      },
      LCP: {
        current: 2800,
        previous: 3000,
        change: -6.67,
        threshold: { good: 2500, poor: 4000 },
        p75: 2900,
      },
      FID: {
        current: 100,
        previous: 110,
        change: -9.09,
        threshold: { good: 100, poor: 300 },
        p75: 105,
      },
      CLS: {
        current: 0.15,
        previous: 0.18,
        change: -16.67,
        threshold: { good: 0.1, poor: 0.25 },
        p75: 0.16,
      },
    },
    resources: {
      totalSize: 2500000,
      loadTime: {
        current: 850,
        previous: 900,
        change: -5.56,
        threshold: { good: 800, poor: 2000 },
      },
      cacheHitRate: 0.85,
      compression: {
        enabled: true,
        savings: 1200000,
      },
    },
    errors: {
      total: 5,
      unique: 2,
      impactedUsers: 3,
      topErrors: [
        {
          message: 'Test Error 1',
          count: 3,
          firstSeen: '2025-07-23T10:00:00Z',
          lastSeen: '2025-07-23T11:00:00Z',
          impactedUsers: 2,
        },
        {
          message: 'Test Error 2',
          count: 2,
          firstSeen: '2025-07-23T12:00:00Z',
          lastSeen: '2025-07-23T12:30:00Z',
          impactedUsers: 1,
        },
      ],
    },
    optimization: {
      suggestions: [
        {
          ruleId: 'COMPRESS_IMAGES',
          ruleName: 'Optimize Image Compression',
          priority: 'high',
          potentialImpact: 0.3,
          complexity: 'easy',
          status: 'pending',
        },
        {
          ruleId: 'CACHE_ASSETS',
          ruleName: 'Implement Asset Caching',
          priority: 'medium',
          potentialImpact: 0.2,
          complexity: 'medium',
          status: 'in_progress',
        },
      ],
      potentialImpact: {
        performance: 0.4,
        reliability: 0.3,
        userExperience: 0.3,
      },
    },
    trends: {
      performance: [
        { timestamp: '2025-07-23T18:00:00Z', value: 0.86 },
        { timestamp: '2025-07-23T19:00:00Z', value: 0.85 },
        { timestamp: '2025-07-23T20:00:00Z', value: 0.87 },
      ],
      errors: [
        { timestamp: '2025-07-23T18:00:00Z', value: 2 },
        { timestamp: '2025-07-23T19:00:00Z', value: 1 },
        { timestamp: '2025-07-23T20:00:00Z', value: 2 },
      ],
      resources: [
        { timestamp: '2025-07-23T18:00:00Z', value: 870 },
        { timestamp: '2025-07-23T19:00:00Z', value: 850 },
        { timestamp: '2025-07-23T20:00:00Z', value: 830 },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (performanceReportService.generateReport as jest.Mock).mockResolvedValue(mockReport);
  });

  it('should render loading state initially', () => {
    render(<PerformanceReport period="daily" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render error state when report generation fails', async () => {
    (performanceReportService.generateReport as jest.Mock).mockRejectedValue(
      new Error('Failed to generate report')
    );

    render(<PerformanceReport period="daily" />);

    await waitFor(() => {
      expect(screen.getByText(/Fehler beim Laden/)).toBeInTheDocument();
    });
  });

  it('should render performance report when data is loaded', async () => {
    render(<PerformanceReport period="daily" />);

    await waitFor(() => {
      // Überprüfe Header
expect(screen.getByText('Performance-Übersicht')).toBeInTheDocument();
      expect(screen.getByText(`Note ${mockReport.summary.grade}`)).toBeInTheDocument();

      // Überprüfe Web Vitals
      expect(screen.getByText('Core Web Vitals')).toBeInTheDocument();
      Object.keys(mockReport.webVitals).forEach((metric) => {
        expect(screen.getByText(metric)).toBeInTheDocument();
      });

      // Überprüfe Performance Trends
      expect(screen.getByText('Performance-Trends')).toBeInTheDocument();

      // Überprüfe Optimierungsvorschläge
      expect(screen.getByText('Optimierungsvorschläge')).toBeInTheDocument();
      mockReport.optimization.suggestions.forEach((suggestion) => {
        expect(screen.getByText(suggestion.ruleName)).toBeInTheDocument();
      });
    });
  });

  it('should update report when period changes', async () => {
    const { rerender } = render(<PerformanceReport period="daily" />);

    await waitFor(() => {
      expect(performanceReportService.generateReport).toHaveBeenCalledWith('daily');
    });

    rerender(<PerformanceReport period="weekly" />);

    await waitFor(() => {
      expect(performanceReportService.generateReport).toHaveBeenCalledWith('weekly');
    });
  });
});
