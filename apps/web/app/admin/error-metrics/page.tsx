import { ErrorMetricsDashboard } from '../../../components/error/dashboard/ErrorMetricsDashboard';

export const metadata = {
  title: 'Error Metrics Dashboard - Admin',
  description: 'Überwachung und Analyse von Fehlern und Performance-Metriken',
};

export default function ErrorMetricsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <ErrorMetricsDashboard />
      </div>
    </div>
  );
}
