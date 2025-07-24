import { useState, useEffect } from 'react';
import { CryptoPrice } from '../types/crypto';

const WEBSOCKET_URL = 'wss://api.example.com/crypto/ws';
const REST_API_URL = 'https://api.example.com/crypto/prices';

export const useCryptoData = () => {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial data load via REST API
    const fetchInitialData = async () => {
      try {
        const response = await fetch(REST_API_URL);
        if (!response.ok) throw new Error('API Fehler');
        const data = await response.json();
        setPrices(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
        setLoading(false);
      }
    };

    // WebSocket Verbindung für Live-Updates
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onmessage = event => {
      const data = JSON.parse(event.data);
      setPrices(data);
    };

    ws.onerror = () => {
      setError('WebSocket Verbindungsfehler');
      // Fallback auf REST API bei WebSocket-Fehler
      const fallbackInterval = setInterval(fetchInitialData, 10000);
      return () => clearInterval(fallbackInterval);
    };

    fetchInitialData();

    return () => {
      ws.close();
    };
  }, []);

  return { prices, loading, error };
};
