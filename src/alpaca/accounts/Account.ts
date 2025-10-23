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

export interface Contact {
  email_address: string;
  phone_number: string;
  street_address: string[];
  unit: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface Identity {
  given_name: string;
  family_name: string;
  date_of_birth: string;
  tax_id: string;
  tax_id_type: string;
  country_of_citizenship: string;
  country_of_birth: string;
  country_of_tax_residence: string;
  funding_source: string[];
  annual_income_min: string;
  annual_income_max: string;
  total_net_worth_min: string;
  total_net_worth_max: string;
  liquid_net_worth_min: string;
  liquid_net_worth_max: string;
  liquidity_needs: "does_not_matter";
  investment_experience_with_stocks: "over_5_years";
  investment_experience_with_options: "over_5_years";
  risk_tolerance: "conservative";
  investment_objective: "market_speculation";
  investment_time_horizon: "more_than_10_years";
  marital_status: "MARRIED";
  number_of_dependents: 5;
}

export interface Disclosures {
  is_control_person: boolean;
  is_affiliated_exchange_or_finra: boolean;
  is_politically_exposed: boolean;
  immediate_family_exposed: boolean;
}

export interface Agreement {
  agreement: string;
  signed_at: string;
  ip_address: string;
  revision?: string;
}

export interface Document {
  document_type: string;
  document_sub_type: string;
  content: string;
  mime_type: string;
}

export interface TrustedContact {
  given_name: string;
  family_name: string;
  email_address: string;
}
