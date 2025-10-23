export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  total_value: number;
  day_change_value: number;
  day_change_percent: number;
  total_return_value: number;
  total_return_percent: number;
  cash_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Holding {
  id: string;
  portfolio_id: string;
  asset_id: string;
  symbol: string;
  quantity: number;
  average_cost: number;
  current_price: number;
  market_value: number;
  unrealized_pl: number;
  unrealized_pl_percent: number;
  day_change_value: number;
  day_change_percent: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  portfolio_id: string;
  asset_id: string;
  symbol: string;
  type: "buy" | "sell" | "deposit" | "withdrawal" | "dividend" | "fee";
  quantity: number;
  price: number;
  total_value: number;
  fee: number;
  notes?: string;
  transaction_date: string;
  created_at: string;
}

export interface PortfolioSummary {
  portfolio: Portfolio;
  holdings: HoldingWithAsset[];
  recent_transactions: TransactionWithAsset[];
  performance: PortfolioPerformance;
  allocation: AssetAllocation[];
}

export interface HoldingWithAsset extends Holding {
  asset_name: string;
  asset_class: string;
  asset_exchange: string;
}

export interface TransactionWithAsset extends Transaction {
  asset_name: string;
  asset_class: string;
  asset_exchange: string;
}

export interface PortfolioPerformance {
  total_invested: number;
  current_value: number;
  total_return: number;
  total_return_percent: number;
  day_change: number;
  day_change_percent: number;
  week_change: number;
  week_change_percent: number;
  month_change: number;
  month_change_percent: number;
  year_change: number;
  year_change_percent: number;
  best_performer: {
    symbol: string;
    name: string;
    return_percent: number;
  } | null;
  worst_performer: {
    symbol: string;
    name: string;
    return_percent: number;
  } | null;
}

export interface AssetAllocation {
  category: string;
  value: number;
  percentage: number;
  count: number;
}

export interface CreatePortfolioRequest {
  name: string;
  description?: string;
  initial_cash?: number;
}

export interface CreateTransactionRequest {
  portfolio_id: string;
  asset_id: string;
  type: Transaction["type"];
  quantity: number;
  price: number;
  fee?: number;
  notes?: string;
  transaction_date?: string;
}

export interface UpdateHoldingRequest {
  quantity: number;
  average_cost: number;
}
