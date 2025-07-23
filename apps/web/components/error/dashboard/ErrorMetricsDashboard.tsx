'use client';

import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface MetricsSummary {
  components: Array<{
    componentName: string;
    errorCount: number;
    recoveryCount: number;
    recoveryTime: number;
    timestamp: string;
  }>;
  errors: Array<{
    errorType: string;
    componentStack?: string;
    recoveryAttempts: number;
    userActions: string[];
    timestamp: string;
  }>;
  webVitals: Array<{
    name: string;
    value: number;
    timestamp: string;
  }>;
  summary: {
    totalErrors: number;
    totalRecoveries: number;
    averageRecoveryTime: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const ErrorMetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/analytics/performance?range=${timeRange}`);
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Metriken');
      }
      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Lade Metriken...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">Fehler beim Laden der Metriken: {error}</p>
        <button
          onClick={fetchMetrics}
          className="mt-2 rounded bg-red-100 px-4 py-2 text-red-800 hover:bg-red-200"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const errorsByType = metrics.errors.reduce((acc, error) => {
    acc[error.errorType] = (acc[error.errorType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(errorsByType).map(([name, value]) => ({
    name,
    value,
  }));

  const timeSeriesData = metrics.components
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((item) => ({
      timestamp: new Date(item.timestamp).toLocaleTimeString(),
      errors: item.errorCount,
      recoveries: item.recoveryCount,
    }));

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Fehler-Metriken Dashboard</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-lg border p-2"
        >
          <option value="1h">Letzte Stunde</option>
          <option value="24h">Letzter Tag</option>
          <option value="7d">Letzte Woche</option>
          <option value="30d">Letzter Monat</option>
        </select>
      </div>

      {/* Zusammenfassung */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">Gesamtfehler</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {metrics.summary.totalErrors}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">
            Wiederherstellungen
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {metrics.summary.totalRecoveries}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700">
            Durchschnittliche Wiederherstellungszeit
          </h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {Math.round(metrics.summary.averageRecoveryTime)}ms
          </p>
        </div>
      </div>

      {/* Fehler-Zeitreihe */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Fehler über Zeit</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="errors"
                stackId="1"
                stroke="#f87171"
                fill="#fca5a5"
                name="Fehler"
              />
              <Area
                type="monotone"
                dataKey="recoveries"
                stackId="1"
                stroke="#34d399"
                fill="#6ee7b7"
                name="Wiederherstellungen"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Fehlerverteilung */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Fehlerverteilung</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    value,
                    index,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = 25 + innerRadius + (outerRadius - innerRadius);
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#666"
                        textAnchor={x > cx ? 'start' : 'end'}
                        dominantBaseline="central"
                      >
                        {pieData[index].name} ({value})
                      </text>
                    );
                  }}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Letzte Fehler */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Letzte Fehler</h2>
          <div className="max-h-80 overflow-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="border-b p-2 text-left">Fehlertyp</th>
                  <th className="border-b p-2 text-left">Zeit</th>
                  <th className="border-b p-2 text-left">Versuche</th>
                </tr>
              </thead>
              <tbody>
                {metrics.errors.slice(-10).map((error, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border-b p-2">{error.errorType}</td>
                    <td className="border-b p-2">
                      {new Date(error.timestamp).toLocaleString()}
                    </td>
                    <td className="border-b p-2">{error.recoveryAttempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
