export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h?: number;
  marketCap?: number;
  lastUpdated: string;
}
