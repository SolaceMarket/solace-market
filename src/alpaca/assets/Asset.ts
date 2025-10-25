export interface Asset {
  id: string;
  class: string;
  exchange: string;
  symbol: string;
  name: string;
  status: string;
  tradable: boolean;
  marginable: boolean;
  maintenance_margin_requirement: number;
  margin_requirement_long: string;
  margin_requirement_short: string;
  shortable: boolean;
  easy_to_borrow: boolean;
  fractionable: boolean;
  // Specific attribute flags
  ptp_no_exception: boolean;
  ptp_with_exception: boolean;
  ipo: boolean;
  has_options: boolean;
  options_late_close: boolean;
  // Timestamp fields
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
