import { PerformanceTrends } from '../../../components/performance/PerformanceTrends';

export const metadata = {
  title: 'Performance-Trends | Admin',
  description: 'Analyse und Visualisierung von Performance-Trends',
};

export default function PerformanceTrendsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Performance-Trends</h1>
          <p className="mt-2 text-gray-600">
            Analyse und Visualisierung von Performance-Metriken über Zeit
          </p>
        </div>

        <PerformanceTrends />
      </div>
    </div>
  );
}
