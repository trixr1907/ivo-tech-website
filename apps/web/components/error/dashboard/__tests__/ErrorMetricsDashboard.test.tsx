import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ErrorMetricsDashboard } from '../ErrorMetricsDashboard';

// Mock fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock Recharts wegen der SVG-Rendering-Probleme in Tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
}));

const mockMetricsData = {
  components: [
    {
      componentName: 'ErrorBoundary',
      errorCount: 5,
      recoveryCount: 3,
      recoveryTime: 1500,
      timestamp: '2025-07-23T12:00:00Z',
    },
  ],
  errors: [
    {
      errorType: 'TypeError',
      componentStack: 'Error\n at Component',
      recoveryAttempts: 2,
      userActions: ['reset', 'reload'],
      timestamp: '2025-07-23T12:00:00Z',
    },
  ],
  webVitals: [
    {
      name: 'LCP',
      value: 2500,
      timestamp: '2025-07-23T12:00:00Z',
    },
  ],
  summary: {
    totalErrors: 5,
    totalRecoveries: 3,
    averageRecoveryTime: 1500,
  },
};

describe('ErrorMetricsDashboard', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('zeigt Ladezustand an', () => {
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));
    render(<ErrorMetricsDashboard />);
    expect(screen.getByText('Lade Metriken...')).toBeInTheDocument();
  });

  it('zeigt Fehlermeldung bei fehlgeschlagenem API-Aufruf', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Fehler'));
    render(<ErrorMetricsDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText(/Fehler beim Laden der Metriken/)
      ).toBeInTheDocument();
    });
  });

  it('lädt und zeigt Metriken an', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMetricsData,
    });

    render(<ErrorMetricsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Fehler-Metriken Dashboard')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument(); // totalErrors
      expect(screen.getByText('3')).toBeInTheDocument(); // totalRecoveries
      expect(screen.getByText('1500ms')).toBeInTheDocument(); // averageRecoveryTime
    });
  });

  it('aktualisiert Zeitbereich bei Auswahl', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockMetricsData,
    });

    render(<ErrorMetricsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Letzter Tag')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '7d' } });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('range=7d')
    );
  });

  it('zeigt Fehlerverteilung korrekt an', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMetricsData,
    });

    render(<ErrorMetricsDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Fehlerverteilung')).toBeInTheDocument();
      expect(screen.getByText(/TypeError/)).toBeInTheDocument();
    });
  });

  it('ist barrierefrei', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMetricsData,
    });

    const { container } = render(<ErrorMetricsDashboard />);

    await waitFor(() => {
      // Prüfe ARIA-Attribute und Rollen
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Fehler-Metriken Dashboard/ })).toBeInTheDocument();
    });
  });
});
