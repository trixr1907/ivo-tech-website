export interface BinanceTickerResponse {
  s: string;      // Symbol
  c: string;      // Current price
  P: string;      // Price change percent
  v: string;      // Volume
  q: string;      // Quote volume
  h: string;      // High price
  l: string;      // Low price
  o: string;      // Open price
  n: number;      // Number of trades
}
