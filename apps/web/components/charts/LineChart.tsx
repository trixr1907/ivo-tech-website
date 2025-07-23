import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Registriere die benötigten ChartJS-Komponenten
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface DataPoint {
  x: Date;
  y: number;
}

interface LineChartProps {
  data: DataPoint[];
  xAxis?: string;
  yAxis?: string;
  className?: string;
}

export function LineChart({
  data,
  xAxis = '',
  yAxis = '',
  className = '',
}: LineChartProps) {
  const chartData = useMemo(
    () => ({
      datasets: [
        {
          data: data,
          borderColor: 'rgb(59, 130, 246)', // blue-500
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 4,
        },
      ],
    }),
    [data]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index' as const,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#1f2937',
          bodyColor: '#1f2937',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          padding: 12,
          boxPadding: 4,
          usePointStyle: true,
          callbacks: {
            title: (context: any) => {
              return new Date(context[0].parsed.x).toLocaleString();
            },
          },
        },
      },
      scales: {
        x: {
          type: 'time' as const,
          time: {
            unit: 'hour' as const,
            displayFormats: {
              hour: 'HH:mm',
              day: 'MMM d',
              week: 'MMM d',
              month: 'MMM yyyy',
            },
          },
          title: {
            display: !!xAxis,
            text: xAxis,
          },
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: !!yAxis,
            text: yAxis,
          },
          grid: {
            color: '#f3f4f6',
          },
        },
      },
    }),
    [xAxis, yAxis]
  );

  return (
    <div className={`w-full h-full min-h-[200px] ${className}`}>
      <Line data={chartData} options={options} />
    </div>
  );
}
