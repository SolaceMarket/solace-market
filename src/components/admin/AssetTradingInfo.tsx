"use client";

import type { Asset } from "@/alpaca/assets/Asset";

interface AssetTradingInfoProps {
  asset: Asset;
}

export function AssetTradingInfo({ asset }: AssetTradingInfoProps) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        Asset Trading Information
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <dt className="text-gray-500">Status</dt>
          <dd
            className={`font-medium ${
              asset.status === "active" && asset.tradable
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {asset.status === "active" && asset.tradable
              ? "Tradable"
              : "Not Tradable"}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Marginable</dt>
          <dd
            className={`font-medium ${
              asset.marginable ? "text-green-600" : "text-gray-600"
            }`}
          >
            {asset.marginable ? "Yes" : "No"}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Shortable</dt>
          <dd
            className={`font-medium ${
              asset.shortable ? "text-green-600" : "text-gray-600"
            }`}
          >
            {asset.shortable ? "Yes" : "No"}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Fractionable</dt>
          <dd
            className={`font-medium ${
              asset.fractionable ? "text-green-600" : "text-gray-600"
            }`}
          >
            {asset.fractionable ? "Yes" : "No"}
          </dd>
        </div>
      </div>
    </div>
  );
}
