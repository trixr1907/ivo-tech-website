import { useState, useCallback } from 'react';
import { CryptoPrice } from '../types/crypto';

interface CryptoApiOptions {
  baseUrl: string;
  fallbackUrl: string;
}

interface CryptoApiHookResult {
  data: CryptoPrice[] | null;
  error: Error | null;
  fetchPrices: () => Promise<void>;
}

// In-Memory Cache
const cache = {
  data: null as CryptoPrice[] | null,
  timestamp: 0,
  TTL: 60000, // 1 Minute Cache-Dauer
};

export const useCryptoApi = (
  options: CryptoApiOptions
): CryptoApiHookResult => {
  const { baseUrl, fallbackUrl } = options;
  const [data, setData] = useState<CryptoPrice[] | null>(cache.data);
  const [error, setError] = useState<Error | null>(null);

  const fetchFromBinance = async (): Promise<CryptoPrice[]> => {
    const response = await fetch(`${baseUrl}/ticker/24hr`);
    if (!response.ok) throw new Error('Binance API Fehler');

    const rawData = await response.json();
    return rawData
      .filter((item: any) => item.symbol.endsWith('USDT'))
      .map((item: any) => ({
        symbol: item.symbol,
        name: item.symbol.replace('USDT', ''),
        price: parseFloat(item.lastPrice),
        change24h: parseFloat(item.priceChangePercent),
        volume24h: parseFloat(item.volume),
        lastUpdated: new Date().toISOString(),
      }));
  };

  const fetchFromCoingecko = async (): Promise<CryptoPrice[]> => {
    const response = await fetch(
      `${fallbackUrl}/simple/price?ids=bitcoin,ethereum,binancecoin,ripple,cardano,solana,polkadot&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true`
    );
    if (!response.ok) throw new Error('Coingecko API Fehler');

    const data = await response.json();
    return Object.entries(data).map(([id, details]: [string, any]) => ({
      symbol: id.toUpperCase(),
      name: id.charAt(0).toUpperCase() + id.slice(1),
      price: details.usd,
      change24h: details.usd_24h_change,
      volume24h: details.usd_24h_vol,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const fetchPrices = useCallback(async () => {
    // Cache-Check
    if (cache.data && Date.now() - cache.timestamp < cache.TTL) {
      setData(cache.data);
      return;
    }

    setError(null);
    try {
      // Versuche zuerst Binance
      let prices = await fetchFromBinance();

      // Fallback zu Coingecko bei Fehler
      if (!prices || prices.length === 0) {
        prices = await fetchFromCoingecko();
      }

      // Cache aktualisieren
      cache.data = prices;
      cache.timestamp = Date.now();

      setData(prices);
    } catch (err) {
      setError(err as Error);
      // Bei Fehler: Versuche Coingecko als Fallback
      try {
        const fallbackPrices = await fetchFromCoingecko();
        cache.data = fallbackPrices;
        cache.timestamp = Date.now();
        setData(fallbackPrices);
        setError(null);
      } catch (fallbackErr) {
        setError(new Error('Alle API-Endpoints nicht erreichbar'));
      }
    }
  }, [baseUrl, fallbackUrl]);

  return { data, error, fetchPrices };
};
