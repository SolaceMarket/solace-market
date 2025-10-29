"use client";

import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import type { AssetData } from "@/types/assets";
import { TradingChart } from "../charts/TradingChart";

interface ExpandablePriceDisplayProps {
  asset: AssetData;
}

export function ExpandablePriceDisplay({ asset }: ExpandablePriceDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="space-y-4">
      {/* Clickable Price Display */}
      <button
        type="button"
        onClick={toggleExpanded}
        className="flex items-center justify-between w-full group hover:bg-slate-700/30 p-3 rounded-lg transition-all duration-200"
      >
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-white">{asset.price}</span>
          <span
            className={`text-lg font-semibold flex items-center space-x-1 ${
              asset.isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {asset.isPositive ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            <span>{asset.change}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 text-gray-400 group-hover:text-white transition-colors">
          <BarChart3 className="w-5 h-5" />
          <span className="text-sm">View Chart</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Expandable Chart */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pt-2">
          <TradingChart
            asset={asset}
            height={350}
            className="border border-slate-600"
          />
        </div>
      </div>
    </div>
  );
}
