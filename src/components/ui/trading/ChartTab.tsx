"use client";

import type { AssetData } from "@/types/assets";
import { TradingChart } from "../charts/TradingChart";

interface ChartTabProps {
  asset: AssetData;
}

export function ChartTab({ asset }: ChartTabProps) {
  return (
    <div className="space-y-6">
      <TradingChart asset={asset} height={450} />

      {/* Additional chart features could be added here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-700 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">24h Volume</h4>
          <p className="text-lg font-bold text-white">$2.4M</p>
          <p className="text-sm text-green-400">+12.5%</p>
        </div>

        <div className="bg-slate-700 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Market Cap</h4>
          <p className="text-lg font-bold text-white">$125.8M</p>
          <p className="text-sm text-red-400">-2.1%</p>
        </div>

        <div className="bg-slate-700 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Supply</h4>
          <p className="text-lg font-bold text-white">1.2B</p>
          <p className="text-sm text-gray-400">Total</p>
        </div>
      </div>
    </div>
  );
}
