'use client';

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { performanceTrendService } from '../../lib/services/performance-trends';

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
  }>;
}

interface TrendSummaryProps {
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

const SeverityBadge: React.FC<{ severity: 'high' | 'medium' | 'low' }> = ({
  severity,
}) => {
  const colors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  };

  return (
    <span
      className={`${colors[severity]} text-white text-xs px-2 py-1 rounded-full ml-2`}
    >
      {severity}
    </span>
  );
};

const TrendSummary: React.FC<TrendSummaryProps> = ({
  regressions,
  improvements,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3 text-red-600">
        Regressionen {regressions.length > 0 && `(${regressions.length})`}
      </h3>
      {regressions.length === 0 ? (
        <p className="text-gray-500">Keine Regressionen gefunden</p>
      ) : (
        <ul className="space-y-2">
          {regressions.map((regression, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-1 border-b"
            >
              <span className="font-medium">{regression.metric}</span>
              <div className="flex items-center">
                <span className="text-red-500">
                  -{regression.change.toFixed(2)}%
                </span>
                <SeverityBadge severity={regression.severity} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3 text-green-600">
        Verbesserungen {improvements.length > 0 && `(${improvements.length})`}
      </h3>
      {improvements.length === 0 ? (
        <p className="text-gray-500">Keine Verbesserungen gefunden</p>
      ) : (
        <ul className="space-y-2">
          {improvements.map((improvement, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-1 border-b"
            >
              <span className="font-medium">{improvement.metric}</span>
              <span className="text-green-500">
                +{improvement.change.toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

export const PerformanceTrends: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [analysis, setAnalysis] = useState<{
    regressions: TrendSummaryProps['regressions'];
    improvements: TrendSummaryProps['improvements'];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [data, trends] = await Promise.all([
          performanceTrendService.generateChartData(),
          performanceTrendService.analyzeTrends(),
        ]);

        setChartData(data);
        if (trends) {
          setAnalysis({
            regressions: trends.regressions,
            improvements: trends.improvements,
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Fehler beim Laden der Daten'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!chartData || !analysis) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        <p>Nicht genügend Daten für eine Trendanalyse verfügbar.</p>
      </div>
    );
  }

  const formattedData = chartData.labels.map((label, index) => ({
    date: label,
    ...chartData.datasets.reduce(
      (acc, dataset) => ({
        ...acc,
        [dataset.label]: dataset.data[index],
      }),
      {}
    ),
  }));

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-6">Performance-Trends</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {chartData.datasets.map((dataset, index) => (
                <Line
                  key={dataset.label}
                  type="monotone"
                  dataKey={dataset.label}
                  stroke={`hsl(${(index * 360) / chartData.datasets.length}, 70%, 50%)`}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <TrendSummary
        regressions={analysis.regressions}
        improvements={analysis.improvements}
      />
    </div>
  );
};
