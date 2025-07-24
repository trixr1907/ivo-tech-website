import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { useCryptoApi } from '../../../hooks/useCryptoApi';
import { CryptoPrice } from '../../../types/crypto';

const WEBSOCKET_URL = 'wss://stream.binance.com:9443/ws/!ticker@arr';
const API_BASE_URL = 'https://api.binance.com/api/v3';
const FALLBACK_API_URL = 'https://api.coingecko.com/api/v3';

export const CryptoDashboard: React.FC = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verbindung zum WebSocket
  const { data: wsData, error: wsError } = useWebSocket(WEBSOCKET_URL, {
    onMessage: data => {
      // Binance Websocket Daten verarbeiten
      const cryptoPrices = data.map((ticker: any) => ({
        symbol: ticker.s,
        name: ticker.s.replace('USDT', ''), // Symbol ohne USDT suffix
        price: parseFloat(ticker.c),
        change24h: parseFloat(ticker.P),
        volume24h: parseFloat(ticker.v),
        lastUpdated: new Date().toISOString(),
      }));
      setPrices(cryptoPrices);
    },
  });

  // REST API Hook für Fallback und initiale Daten
  const {
    fetchPrices,
    data: apiData,
    error: apiError,
  } = useCryptoApi({
    baseUrl: API_BASE_URL,
    fallbackUrl: FALLBACK_API_URL,
  });

  useEffect(() => {
    // Initial load from REST API
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        await fetchPrices();
        setIsLoading(false);
      } catch (err) {
        setError('Fehler beim Laden der initialen Daten');
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [fetchPrices]);

  // Error handling
  useEffect(() => {
    if (wsError) {
      setError('WebSocket Verbindungsfehler - Fallback auf REST API');
      // Bei WebSocket Fehler: Polling via REST API
      const pollInterval = setInterval(() => {
        fetchPrices();
      }, 10000); // Alle 10 Sekunden aktualisieren

      return () => clearInterval(pollInterval);
    }
  }, [wsError, fetchPrices]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-xl text-yellow-400">
          Lade Kryptowährungsdaten...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    );
  }

  const displayPrices = prices.length > 0 ? prices : apiData;

  return (
    <div className="crypto-dashboard rounded-2xl border border-yellow-500/30 bg-black/20 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayPrices?.map(crypto => (
          <div
            key={crypto.symbol}
            className="crypto-card rounded-lg border border-yellow-500/20 bg-black/40 p-4 shadow-lg transition-all hover:border-yellow-500/40 hover:shadow-yellow-500/10"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-yellow-400">
                {crypto.name}
              </h3>
              <span className="text-sm text-gray-400">{crypto.symbol}</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold text-white">
                $
                {Number(crypto.price).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div
                className={`mt-1 text-sm ${Number(crypto.change24h) >= 0 ? 'text-green-400' : 'text-red-400'}`}
              >
                {Number(crypto.change24h) >= 0 ? '↗' : '↘'} {crypto.change24h}
                %
              </div>
            </div>
            {crypto.volume24h && (
              <div className="mt-2 text-sm text-gray-400">
                Vol 24h: $
                {Number(crypto.volume24h).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
            )}
            <div className="mt-2 text-xs text-gray-500">
              Zuletzt aktualisiert:{' '}
              {new Date(crypto.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
