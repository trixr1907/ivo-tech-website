export interface BinanceApiResponse {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  volume: string;
  quoteVolume: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  lastQty: string;
}

export interface CoingeckoApiResponse {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_24h_vol: number;
  };
}

export interface WebSocketMessage {
  data: string;
}
