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

export interface AdminUser {
  uid: string;
  email: string;
  createdAt: string;
  locale: string;
  jurisdiction: string;
  onboarding: {
    currentStep: string;
    completed: boolean;
    completedAt?: string;
    lastActivityAt: string;
  };
  profile?: {
    firstName: string;
    lastName: string;
    country: string;
  };
  wallet?: {
    chain: string;
    publicKey: string;
    verifiedAt: string;
  };
  kyc?: {
    provider: string;
    status: string;
    lastCheckedAt: string;
  };
  broker?: {
    provider: string;
    subAccountId: string;
    status: string;
  };
}

export interface AlpacaAccountInfo {
  alpacaAccount: {
    id: string;
    accountNumber: string;
    status: string;
    cryptoStatus: string;
    kycSummary: string;
    currency: string;
    lastEquity: string;
    createdAt: string;
    userId: string | null;
  };
  user: {
    uid: string;
    email: string;
  } | null;
  contact: {
    emailAddress: string;
    phoneNumber: string;
    city: string;
    state: string;
    country: string;
  } | null;
  identity: {
    givenName: string;
    familyName: string;
    dateOfBirth: string;
  } | null;
}

export interface UserFilters {
  search: string;
  status: string;
  jurisdiction: string;
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
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
