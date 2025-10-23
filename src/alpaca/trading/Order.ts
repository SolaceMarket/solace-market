export interface Order {
  id: string;
  symbol: string;
  client_order_id: string;
  created_at: string;
  updated_at: string;
  submitted_at: string;
  filled_at: string;
  expired_at: string;
  canceled_at: string;
  failed_at: string;
  replaced_at: string;
  replaced_by: string;
  replaces: string;
  asset_id: string;
  asset_class: string;
  notional: string;
  qty: string;
  filled_qty: string;
  filled_avg_price: string;
  order_class: string;
  order_type: string;
  type: string;
  side: string;
  time_in_force: string;
  limit_price: string;
  stop_price: string;
  status: string;
  extended_hours: boolean;
  legs: Leg[];
  trail_price: string;
  trail_percent: string;
  hwm: string;
  commission: string;
  commission_bps: string;
  swap_rate: string;
  swap_fee_bps: string;
  usd: Usd;
}

export interface Leg {
  value: string;
}

// biome-ignore lint/suspicious/noEmptyInterface: Leave it for future use
export interface Usd {}
