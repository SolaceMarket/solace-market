import { getStatusBadge, getBooleanBadge } from "../utils";
import type { AssetComponentProps } from "../types";

export default function AssetTradingInfo({ asset }: AssetComponentProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Trading Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </div>
          {getStatusBadge(asset.status)}
        </div>
        <div className="space-y-2">
          <div className="block text-sm font-medium text-gray-700">
            Trading Features
          </div>
          <div className="flex flex-wrap gap-2">
            {getBooleanBadge(asset.tradable, "Tradable")}
            {getBooleanBadge(asset.marginable, "Marginable")}
            {getBooleanBadge(asset.shortable, "Shortable")}
            {getBooleanBadge(asset.easyToBorrow, "Easy to Borrow")}
            {getBooleanBadge(asset.fractionable, "Fractionable")}
          </div>
        </div>
      </div>
    </div>
  );
}
