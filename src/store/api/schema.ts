export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export type LoginRequest = Omit<RegisterRequest, "name">;

export interface User {
  id: number;
  name: string;
  email: string;
  balance: string;
  deposits: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coin {
  id: number;
  externalId: string;
  name: string;
  displayName: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CoinWithQuote extends Coin {
  currentPrice: string;
  dayHigh: string;
  dayLow: string;
  change: string;
  changePercent: string;
}

export interface CoinHistoricalDataRequest {
  coinId: number;
  daysAgo: number;
}

type HistoricalData = [number, number][];
export interface CoinHistoricalData {
  prices: HistoricalData;
  marketCaps: HistoricalData;
  totalVolumes: HistoricalData;
}

export interface Holding {
  id: number;
  userId: number;
  coinId: number;
  shares: string;
  cost: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export enum OrderDirection {
  BUY = "BUY",
  SELL = "SELL",
}

export enum OrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
  STOP = "STOP",
  TRAILING_STOP = "TRAILING_STOP",
}

export interface OrderRequest {
  coinId: number;
  shares?: string;
  price?: string;
  direction: OrderDirection;
  type: OrderType;
}

export interface Order extends OrderRequest {
  id: number;
  userId: number;
  coinId: number;
  filled: boolean;
  sharePrice?: string;
  totalPrice?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface LivePrice {
  coinId: number;
  price: string | null;
}
