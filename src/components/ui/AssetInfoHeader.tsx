"use client";

import type { AssetData } from "@/types/assets";
import { AssetLogo } from "./shared/AssetLogo";

interface AssetInfoHeaderProps {
  asset: AssetData;
  embedded?: boolean;
}

export function AssetInfoHeader({
  asset,
  embedded = false,
}: AssetInfoHeaderProps) {
  return (
    <div className={embedded ? "" : "p-6 border-b border-slate-700"}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
          <AssetLogo
            src={asset.logo}
            alt={`${asset.name} logo`}
            className="w-16 h-16"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{asset.name}</h2>
          <p className="text-gray-400">{asset.symbol}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <span className="text-3xl font-bold text-white">{asset.price}</span>
        <span
          className={`text-lg font-semibold ${
            asset.isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {asset.change}
        </span>
      </div>

      <p className="text-gray-300 text-sm leading-relaxed">
        {asset.description}
      </p>
    </div>
  );
}
