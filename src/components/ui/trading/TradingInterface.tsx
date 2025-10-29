"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import { useState } from "react";
import type { AssetData } from "@/types/assets";
import { ChartTab } from "./ChartTab";
import { LeverageTab } from "./LeverageTab";
import { SwapTab } from "./SwapTab";

interface TradingInterfaceProps {
  asset: AssetData;
  onTradeComplete: () => void;
  embedded?: boolean;
}

type TradingMode = "chart" | "swap" | "leverage";

export function TradingInterface({
  asset,
  onTradeComplete,
  embedded = false,
}: TradingInterfaceProps) {
  const [tradingMode, setTradingMode] = useState<TradingMode>("chart");

  return (
    <div className={!embedded ? "p-6" : ""}>
      {/* Desktop container with max width and centering */}
      <div className="w-full max-w-4xl mx-auto">
        <div
          className={`bg-slate-800 p-6 ${!embedded ? "rounded-lg border border-slate-600" : ""}`}
        >
          {/* Trading Mode Tabs */}
          <div className="mb-6">
            <div className="flex bg-slate-700 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setTradingMode("chart")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  tradingMode === "chart"
                    ? "bg-slate-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-center space-x-1">
                  <BarChart3 className="w-4 h-4" />
                  <span>Chart</span>
                </div>
              </button>
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

          {/* Render appropriate tab component */}
          {tradingMode === "chart" && <ChartTab asset={asset} />}
          {tradingMode === "swap" && (
            <SwapTab asset={asset} onSwapComplete={onTradeComplete} />
          )}
          {tradingMode === "leverage" && (
            <LeverageTab asset={asset} onTradeComplete={onTradeComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
