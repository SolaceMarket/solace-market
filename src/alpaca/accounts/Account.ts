// Basic Alpaca Account structure (from accounts.json)
export interface AlpacaAccount {
  id: string;
  account_number: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "CLOSED" | "ACCOUNT_CLOSED";
  crypto_status: "ACTIVE" | "INACTIVE" | "PENDING" | "ACCOUNT_CLOSED";
  kyc_results: KYCResults;
  currency: string;
  last_equity: string;
  created_at: string;
  account_type: string;
  trading_type: string;
  enabled_assets: string[];
  investment_objective: string;
  investment_time_horizon: string;
  risk_tolerance: string;
  liquidity_needs: string;
}

// Detailed Alpaca Account structure with all fields (from detailed account endpoint)
export interface AlpacaAccountDetailed extends AlpacaAccount {
  contact: Contact;
  identity: Identity;
  disclosures: Disclosures;
  agreements: Agreement[];
  documents: Document[];
  trusted_contact: TrustedContact;
  trading_configurations: unknown | null;
}

export interface KYCResults {
  reject: Record<string, unknown>;
  accept: Record<string, unknown>;
  indeterminate: Record<string, unknown>;
  summary: "pass" | "fail" | "pending";
}

export interface Contact {
  email_address: string;
  phone_number: string;
  street_address: string[];
  local_street_address?: string | null;
  unit: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Identity {
  given_name: string;
  family_name: string;
  date_of_birth: string;
  country_of_citizenship: string;
  country_of_birth: string;
  marital_status: string;
  number_of_dependents: number;
  investment_experience_with_stocks: string;
  investment_experience_with_options: string;
  risk_tolerance: string;
  investment_objective: string;
  investment_time_horizon: string;
  liquidity_needs: string;
  party_type: string;
  tax_id_type: string;
  country_of_tax_residence: string;
  funding_source: string[];
  annual_income_min: string;
  annual_income_max: string;
  liquid_net_worth_min: string;
  liquid_net_worth_max: string;
  total_net_worth_min: string;
  total_net_worth_max: string;
}

export interface Disclosures {
  is_control_person: boolean;
  is_affiliated_exchange_or_finra: boolean;
  is_affiliated_exchange_or_iiroc?: boolean | null;
  is_politically_exposed: boolean;
  immediate_family_exposed: boolean;
  is_discretionary: boolean;
}

export interface Agreement {
  agreement: string;
  signed_at: string;
  ip_address: string;
  revision: string;
  account_id?: string;
}

export interface Document {
  document_type: string;
  document_sub_type: string;
  id: string;
  content: string;
  created_at: string;
}

export interface TrustedContact {
  given_name: string;
  family_name: string;
  email_address: string;
}

// Legacy interface for backward compatibility
export interface Account {
  account_type: string;
  primary_account_holder_id: string;
  id: string;
  contact: Contact;
  identity: Identity;
  disclosures: Disclosures;
  agreements: Agreement[];
  documents: Document[];
  trusted_contact: TrustedContact;
  enabled_assets: string[];
}
