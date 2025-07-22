'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

interface PriceHistory {
  timestamp: number;
  price: number;
}

const cryptoIds = [
  'bitcoin',
  'ethereum',
  'binancecoin',
  'solana',
  'cardano',
  'avalanche-2',
  'polkadot',
  'chainlink',
];

export function CryptoDashboard() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('bitcoin');
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch crypto data
  const fetchCryptoData = async () => {
    try {
      setError(null);
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h`
      );

      setCryptoData(response.data);
      setLastUpdate(new Date());
      setLoading(false);

      // Update price history for selected crypto
      const selected = response.data.find(
        (crypto: CryptoData) => crypto.id === selectedCrypto
      );
      if (selected && selected.sparkline_in_7d) {
        const history = selected.sparkline_in_7d.price.map(
          (price: number, index: number) => ({
            timestamp:
              Date.now() -
              (selected.sparkline_in_7d!.price.length - index) * 60 * 60 * 1000,
            price: price,
          })
        );
        setPriceHistory(history);
      }
    } catch (err) {
      setError('Failed to fetch crypto data. Using demo data.');
      setLoading(false);

      // Fallback demo data
      setCryptoData([
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 45000 + Math.random() * 1000,
          price_change_percentage_24h: (Math.random() - 0.5) * 10,
          price_change_24h: (Math.random() - 0.5) * 2000,
          market_cap: 850000000000,
          total_volume: 25000000000,
          image:
            'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          current_price: 3000 + Math.random() * 200,
          price_change_percentage_24h: (Math.random() - 0.5) * 8,
          price_change_24h: (Math.random() - 0.5) * 150,
          market_cap: 380000000000,
          total_volume: 15000000000,
          image:
            'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        },
      ]);
    }
  };

  // Fetch data on component mount and set up polling
  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCrypto]);

  // Generate mock real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceHistory(prev => {
        const newPoint = {
          timestamp: Date.now(),
          price:
            prev[prev.length - 1]?.price * (0.995 + Math.random() * 0.01) ||
            45000,
        };
        return [...prev.slice(-100), newPoint]; // Keep last 100 points
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="mb-4 font-mono text-sm text-cyan-400">
          $ crypto --live
        </div>
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          Live{' '}
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Crypto
          </span>{' '}
          Dashboard
        </h2>
        <p className="mt-2 text-gray-400">
          Echtzeit-Kryptowährungsdaten • Letzte Aktualisierung:{' '}
          {lastUpdate.toLocaleTimeString('de-DE')}
        </p>
        {error && (
          <div className="mt-2 rounded bg-orange-500/10 px-3 py-1 text-sm text-orange-400">
            ⚠️ {error}
          </div>
        )}
      </motion.div>

      {/* Crypto Cards Grid */}
      <div
        data-testid="crypto-grid"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {cryptoData.map((crypto, index) => (
          <motion.div
            key={crypto.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => setSelectedCrypto(crypto.id)}
            className={`group cursor-pointer rounded-2xl border p-6 transition-all hover:shadow-2xl ${
              selectedCrypto === crypto.id
                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={crypto.image || '/crypto-placeholder.png'}
                  alt={crypto.name}
                  className="h-8 w-8 rounded-full"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMzMzc2QUIiLz48L3N2Zz4=';
                  }}
                />
                <div>
                  <h3 className="font-bold text-white">{crypto.name}</h3>
                  <p className="text-sm uppercase text-gray-400">
                    {crypto.symbol}
                  </p>
                </div>
              </div>

              <motion.div
                animate={{
                  color:
                    crypto.price_change_percentage_24h >= 0
                      ? '#10b981'
                      : '#ef4444',
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.5 }}
                className="text-right"
              >
                <div className="text-lg font-bold">
                  {crypto.price_change_percentage_24h >= 0 ? '↗' : '↘'}
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </div>
              </motion.div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="text-2xl font-bold text-white">
                  {formatPrice(crypto.current_price)}
                </div>
                <div
                  className={`text-sm ${crypto.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {crypto.price_change_24h >= 0 ? '+' : ''}
                  {formatPrice(crypto.price_change_24h)}
                </div>
              </div>

              <div className="border-t border-gray-700 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Market Cap:</span>
                  <span className="text-gray-200">
                    {formatMarketCap(crypto.market_cap)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Volume:</span>
                  <span className="text-gray-200">
                    {formatMarketCap(crypto.total_volume)}
                  </span>
                </div>
              </div>
            </div>

            {selectedCrypto === crypto.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-2 top-2"
              >
                <div className="h-3 w-3 animate-pulse rounded-full bg-blue-500" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Price Chart */}
      <AnimatePresence>
        {priceHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border border-gray-700 bg-gray-800/30 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {cryptoData.find(c => c.id === selectedCrypto)?.name ||
                  'Selected'}{' '}
                Price Chart
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span>Live Data</span>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceHistory}>
                  <defs>
                    <linearGradient
                      id="priceGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={value =>
                      new Date(value).toLocaleTimeString('de-DE', {
                        timeStyle: 'short',
                      })
                    }
                    stroke="#9ca3af"
                  />
                  <YAxis
                    domain={['dataMin - 100', 'dataMax + 100']}
                    tickFormatter={value => `$${value.toFixed(0)}`}
                    stroke="#9ca3af"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#ffffff',
                    }}
                    labelFormatter={value =>
                      new Date(value).toLocaleString('de-DE')
                    }
                    formatter={(value: number) => [formatPrice(value), 'Preis']}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Market Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-gray-700 bg-gray-800/30 p-6"
      >
        <h3 className="mb-4 text-xl font-bold text-white">Market Summary</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {cryptoData.filter(c => c.price_change_percentage_24h > 0).length}
            </div>
            <div className="text-sm text-gray-400">Gainers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {cryptoData.filter(c => c.price_change_percentage_24h < 0).length}
            </div>
            <div className="text-sm text-gray-400">Losers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {formatMarketCap(
                cryptoData.reduce((sum, c) => sum + c.market_cap, 0)
              )}
            </div>
            <div className="text-sm text-gray-400">Total Market Cap</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {formatMarketCap(
                cryptoData.reduce((sum, c) => sum + c.total_volume, 0)
              )}
            </div>
            <div className="text-sm text-gray-400">24h Volume</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
