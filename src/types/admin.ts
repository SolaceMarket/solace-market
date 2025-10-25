export interface UserData {
  uid: string;
  email: string;
  profile?: {
    firstName: string;
    lastName: string;
    country: string;
  };
  broker?: {
    provider: string;
    subAccountId: string;
    status: string;
  };
  onboarding: {
    completed: boolean;
  };
}

export interface TradeFormData {
  side: "buy" | "sell";
  type: "market" | "limit" | "stop" | "stop_limit";
  qty: string;
  limit_price?: string;
  stop_price?: string;
  time_in_force: "day" | "gtc" | "ioc" | "fok";
  extended_hours: boolean;
}

export interface TradeRequest extends TradeFormData {
  userId: string;
  symbol: string;
}

export interface TradeResponse {
  success: boolean;
  order: {
    id: string;
    symbol: string;
    side: string;
    qty: string;
    type: string;
    status: string;
    created_at: string;
    limit_price?: string;
    stop_price?: string;
    time_in_force: string;
  };
  message: string;
}

export interface UsersResponse {
  users: UserData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
