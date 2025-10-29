"use client";

import { TrendingUp } from "lucide-react";
import { useState } from "react";
import type { AssetData } from "@/types/assets";
import { LeverageTab } from "./trading/LeverageTab";
import { SwapTab } from "./trading/SwapTab";

interface TradingInterfaceProps {
  asset: AssetData;
  onTradeComplete: () => void;
  embedded?: boolean;
}

type TradingMode = "swap" | "leverage";

export function TradingInterface({
  asset,
  onTradeComplete,
  embedded = false,
}: TradingInterfaceProps) {
  const [tradingMode, setTradingMode] = useState<TradingMode>("swap");

  return (
    <div className={!embedded ? "p-6" : ""}>
      <div
        className={`bg-slate-800 p-6 ${!embedded ? "rounded-lg border border-slate-600" : ""}`}
      >
        {/* Trading Mode Tabs */}
        <div className="mb-6">
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setTradingMode("swap")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                tradingMode === "swap"
                  ? "bg-slate-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Swap
            </button>
            <button
              type="button"
              onClick={() => setTradingMode("leverage")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                tradingMode === "leverage"
                  ? "bg-slate-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>Leverage</span>
              </div>
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-6">
          {tradingMode === "swap"
            ? `Swap for ${asset.symbol}`
            : `Leverage Trade ${asset.symbol}`}
        </h3>

        {/* Render appropriate tab component */}
        {tradingMode === "swap" ? (
          <SwapTab asset={asset} onSwapComplete={onTradeComplete} />
        ) : (
          <LeverageTab asset={asset} onTradeComplete={onTradeComplete} />
        )}
      </div>
    </div>
  );
}
