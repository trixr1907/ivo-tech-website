// Mock axios before importing the component
jest.mock('axios');
import axios from 'axios';
const mockAxios = axios as jest.Mocked<typeof axios>;

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { CryptoDashboard } from '../../../components/dashboard/CryptoDashboard';

const mockCryptoData = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 45000,
    price_change_percentage_24h: 2.5,
    price_change_24h: 1000,
    market_cap: 850000000000,
    total_volume: 25000000000,
    image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    sparkline_in_7d: {
      price: [44000, 44500, 45000, 45500, 45000],
    },
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 3000,
    price_change_percentage_24h: -1.2,
    price_change_24h: -36,
    market_cap: 380000000000,
    total_volume: 15000000000,
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    sparkline_in_7d: {
      price: [3050, 3020, 3000, 2980, 3000],
    },
  },
];

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: any) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe('CryptoDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful API response
    mockAxios.get.mockResolvedValue({ data: mockCryptoData });
  });

  describe('Rendering', () => {
    test('renders loading state initially', () => {
      render(<CryptoDashboard />);
      const loadingElement = screen.getByTestId('loading-spinner');
      expect(loadingElement).toBeInTheDocument();
    });

    test('renders dashboard header', async () => {
      render(<CryptoDashboard />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Live.*Crypto.*Dashboard/i);
        expect(
          screen.getByText(/Echtzeit-Kryptowährungsdaten/i)
        ).toBeInTheDocument();
      });
    });

    test('renders crypto cards after loading', async () => {
      render(<CryptoDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Bitcoin')).toBeInTheDocument();
        expect(screen.getByText('Ethereum')).toBeInTheDocument();
        expect(screen.getByText('BTC')).toBeInTheDocument();
        expect(screen.getByText('ETH')).toBeInTheDocument();
      });
    });

    test('renders market summary', async () => {
      render(<CryptoDashboard />);

      await waitFor(() => {
        expect(screen.getByText('Market Summary')).toBeInTheDocument();
        expect(screen.getByText('Gainers')).toBeInTheDocument();
        expect(screen.getByText('Losers')).toBeInTheDocument();
        expect(screen.getByText('Total Market Cap')).toBeInTheDocument();
        expect(screen.getByText('24h Volume')).toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    test('makes API call to CoinGecko on mount', async () => {
      render(<CryptoDashboard />);

      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalledWith(
          expect.stringContaining(
            'https://api.coingecko.com/api/v3/coins/markets'
          )
        );
      });
    });

    test('handles API error gracefully', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('API Error'));

      render(<CryptoDashboard />);

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to fetch crypto data/i)
        ).toBeInTheDocument();
      });
    });

    test('displays correct price formatting', async () => {
      render(<CryptoDashboard />);

      await waitFor(() => {
        // Should format prices as USD currency with German locale
        expect(screen.getByText('45.000,00 $')).toBeInTheDocument();
        expect(screen.getByText('3.000,00 $')).toBeInTheDocument();
      });
    });

    test('displays correct percentage changes', async () => {
      render(<CryptoDashboard />);

      await waitFor(() => {
        expect(screen.getByText('↗2,50%')).toBeInTheDocument();
        expect(screen.getByText('↘1,20%')).toBeInTheDocument();
      });
    });
  });

  describe('Interactivity', () => {
    test('selects crypto when card is clicked', async () => {
      render(<CryptoDashboard />);

      await waitFor(() => {
        const ethereumCard = screen.getByText('Ethereum').closest('div');
        if (ethereumCard) {
          fireEvent.click(ethereumCard);
          expect(screen.getByText(/Ethereum Price Chart/i)).toBeInTheDocument();
        }
      });
    });

    test('shows chart for selected crypto', async () => {
      render(<CryptoDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
        expect(screen.getByTestId('area-chart')).toBeInTheDocument();
      });
    });
  });

  describe('Data Processing', () => {
    test('calculates market summary correctly', async () => {
      render(<CryptoDashboard />);

      await waitFor(() => {
        // 1 gainer (Bitcoin with +2.5%)
        const gainers = screen.getByText('Gainers');
        expect(gainers.previousElementSibling).toHaveTextContent('1');
        
        // 1 loser (Ethereum with -1.2%)
        const losers = screen.getByText('Losers');
        expect(losers.previousElementSibling).toHaveTextContent('1');
      });
    });

    test('formats market cap correctly', async () => {
      render(<CryptoDashboard />);

      await waitFor(() => {
        expect(screen.getByText('$850,00B')).toBeInTheDocument();
        expect(screen.getByText('$380,00B')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('shows error message when API fails', async () => {
      mockAxios.get.mockRejectedValueOnce(new Error('Network Error'));

      render(<CryptoDashboard />);

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to fetch crypto data/i)
        ).toBeInTheDocument();
      });
    });

    test('handles missing image URLs gracefully', async () => {
      const dataWithMissingImages = [
        {
          ...mockCryptoData[0],
          image: '',
        },
      ];

      mockAxios.get.mockResolvedValueOnce({ data: dataWithMissingImages });

      render(<CryptoDashboard />);

      await waitFor(() => {
        const images = screen.getAllByRole('img');
        expect(images[0]).toHaveAttribute('src', '/crypto-placeholder.png');
      });
    });
  });

  describe('Performance', () => {
    test('updates data at regular intervals', async () => {
      jest.useFakeTimers();

      render(<CryptoDashboard />);

      // Initial API call
      expect(mockAxios.get).toHaveBeenCalledTimes(1);

      // Fast-forward 30 seconds
      jest.advanceTimersByTime(30000);

      await waitFor(() => {
        expect(mockAxios.get).toHaveBeenCalledTimes(2);
      });

      jest.useRealTimers();
    });

    test('cleans up intervals on unmount', () => {
      jest.useFakeTimers();
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

      const { unmount } = render(<CryptoDashboard />);
      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('Responsive Design', () => {
    test('renders correctly on mobile viewport', async () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<CryptoDashboard />);

      await waitFor(() => {
        const grid = screen.getByTestId('crypto-grid');
        expect(grid).toHaveClass('grid-cols-1');
      });
    });
  });
});
