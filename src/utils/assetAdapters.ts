import type { Asset } from "@/alpaca/assets/Asset";

export interface AssetDetails {
  id: string;
  class: string;
  exchange: string;
  symbol: string;
  name: string;
  status: string;
  tradable: boolean;
  marginable: boolean;
  maintenanceMarginRequirement: number;
  marginRequirementLong: string;
  marginRequirementShort: string;
  shortable?: boolean;
  easyToBorrow?: boolean;
  fractionable?: boolean;
  attributes?: string;
  createdAt: string;
  updatedAt: string;
}

// Type adapter to convert AssetDetails to Asset format
export function assetDetailsToAsset(assetDetails: AssetDetails): Asset {
  return {
    id: assetDetails.id,
    class: assetDetails.class,
    exchange: assetDetails.exchange,
    symbol: assetDetails.symbol,
    name: assetDetails.name,
    status: assetDetails.status,
    tradable: assetDetails.tradable,
    marginable: assetDetails.marginable,
    maintenance_margin_requirement: assetDetails.maintenanceMarginRequirement,
    margin_requirement_long: assetDetails.marginRequirementLong,
    margin_requirement_short: assetDetails.marginRequirementShort,
    shortable: assetDetails.shortable ?? false,
    easy_to_borrow: assetDetails.easyToBorrow ?? false,
    fractionable: assetDetails.fractionable ?? false,
    attributes: assetDetails.attributes ? [assetDetails.attributes] : [],
  };
}
