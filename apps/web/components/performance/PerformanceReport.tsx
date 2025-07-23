import React, { useState, useEffect } from 'react';
import { performanceReportService } from '../../lib/services/performance-reports';
import { LineChart } from '../charts/LineChart';
import { MetricCard } from '../ui/MetricCard';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface PerformanceReportProps {
  period: 'daily' | 'weekly' | 'monthly';
  className?: string;
}

export function PerformanceReport({ period, className = '' }: PerformanceReportProps) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, [period]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const newReport = await performanceReportService.generateReport(period);
      setReport(newReport);
      setError(null);
    } catch (err) {
      setError('Fehler beim Laden des Performance-Reports');
      console.error('Error loading performance report:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!report) {
    return null;
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'improving':
        return 'bg-green-100 text-green-800';
      case 'stable':
        return 'bg-blue-100 text-blue-800';
      case 'degrading':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMetricValue = (value: number, metric: string) => {
    switch (metric) {
      case 'FCP':
      case 'LCP':
      case 'FID':
        return `${value.toFixed(0)}ms`;
      case 'CLS':
        return value.toFixed(3);
      case 'size':
        return `${(value / (1024 * 1024)).toFixed(2)}MB`;
      case 'percentage':
        return `${(value * 100).toFixed(1)}%`;
      default:
        return value.toFixed(2);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Overview</h2>
            <p className="text-gray-500">
              {new Date(report.startDate).toLocaleDateString()} -{' '}
              {new Date(report.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className={getGradeColor(report.summary.grade)}>
              Grade {report.summary.grade}
            </Badge>
            <Badge className={getStatusColor(report.summary.status)}>
              {report.summary.status.charAt(0).toUpperCase() + report.summary.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Performance Score"
            value={`${(report.summary.score * 100).toFixed(1)}%`}
            trend={report.summary.status}
            description="Overall application performance score"
          />
          <MetricCard
            title="Error Rate"
            value={`${((report.errors.total / 100) * 100).toFixed(2)}%`}
            trend={report.errors.total > 10 ? 'negative' : 'positive'}
            description={`${report.errors.unique} unique errors affecting ${report.errors.impactedUsers} users`}
          />
          <MetricCard
            title="Cache Hit Rate"
            value={`${(report.resources.cacheHitRate * 100).toFixed(1)}%`}
            trend={report.resources.cacheHitRate > 0.8 ? 'positive' : 'negative'}
            description="Percentage of resource requests served from cache"
          />
          <MetricCard
            title="Resource Load Time"
            value={formatMetricValue(report.resources.loadTime.current, 'FCP')}
            trend={report.resources.loadTime.change < 0 ? 'positive' : 'negative'}
            description={`${Math.abs(report.resources.loadTime.change).toFixed(1)}% change`}
          />
        </div>
      </Card>

      {/* Web Vitals Section */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Web Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(report.webVitals).map(([metric, data]: [string, any]) => (
            <MetricCard
              key={metric}
              title={metric}
              value={formatMetricValue(data.current, metric)}
              trend={data.change < 0 ? 'positive' : 'negative'}
              description={`${Math.abs(data.change).toFixed(1)}% change`}
              footer={`p75: ${formatMetricValue(data.p75, metric)}`}
            />
          ))}
        </div>
      </Card>

      {/* Trends Section */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Trends</h3>
        <div className="h-80">
          <LineChart
            data={report.trends.performance.map((point: any) => ({
              x: new Date(point.timestamp),
              y: point.value * 100,
            }))}
            xAxis="Time"
            yAxis="Score"
          />
        </div>
      </Card>

      {/* Optimization Suggestions */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Optimization Suggestions
        </h3>
        <div className="space-y-4">
          {report.optimization.suggestions.map((suggestion: any) => (
            <div
              key={suggestion.ruleId}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{suggestion.ruleName}</h4>
                <Badge
                  className={
                    suggestion.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : suggestion.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }
                >
                  {suggestion.priority}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                Potential impact: {(suggestion.potentialImpact * 100).toFixed(1)}%
              </p>
              <div className="flex items-center space-x-2">
                <Badge className="bg-gray-100 text-gray-800">
                  {suggestion.complexity}
                </Badge>
                <Badge
                  className={
                    suggestion.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : suggestion.status === 'in_progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                >
                  {suggestion.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
