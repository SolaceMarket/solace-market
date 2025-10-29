"use client";

import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { getSwapAssets } from "@/data/mockAssets";
import type { AssetData } from "@/types/assets";
import { getAssetLogo } from "../shared/AssetLogo";

interface SwapTabProps {
  asset: AssetData;
  onSwapComplete: () => void;
}

export function SwapTab({ asset, onSwapComplete }: SwapTabProps) {
  const [swapAmount, setSwapAmount] = useState<string>("1");
  const [sourceAsset, setSourceAsset] = useState<string>("SOL");
  const [isSwapping, setIsSwapping] = useState(false);

  const allAssets = getSwapAssets();
  const availableAssets = Object.keys(allAssets).filter(
    (symbol) => symbol !== asset.symbol,
  );

  const handleSwapAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow decimals for swapping
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setSwapAmount(value);
    }
  };

  const handleSwap = async () => {
    if (!swapAmount || swapAmount === "0") {
      alert("Please enter a valid amount");
      return;
    }

    setIsSwapping(true);

    try {
      // Simulate swap transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(
        `Successfully swapped ${swapAmount} ${sourceAsset} for ${swapAmount} ${asset.symbol}!`,
      );
      onSwapComplete();
    } catch (error) {
      console.error("Swap failed:", error);
      alert("Swap failed. Please try again.");
    } finally {
      setIsSwapping(false);
    }
  };

  const estimatedCost = parseFloat(swapAmount || "0") * 0.5; // Mock exchange rate

  return (
    <div className="space-y-4">
      {/* From Asset */}
      <div>
        <div className="block text-gray-400 text-sm mb-2">You Pay</div>
        <div className="bg-slate-700 rounded-lg p-4">
          <select
            value={sourceAsset}
            onChange={(e) => setSourceAsset(e.target.value)}
            className="bg-transparent text-white w-full outline-none"
          >
            {availableAssets.map((symbol) => (
              <option key={symbol} value={symbol} className="bg-slate-700">
                {symbol} - {allAssets[symbol].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cost Display */}
      <div>
        <div className="block text-gray-400 text-sm mb-2">Amount to Pay</div>
        <div className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              {getAssetLogo(allAssets[sourceAsset]?.logo || "solana")}
            </div>
            <span className="text-white font-semibold">{sourceAsset}</span>
          </div>
          <span className="text-white text-lg font-semibold">
            {estimatedCost.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center">
        <div className="bg-slate-600 rounded-full p-2">
          <ArrowUpDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* To Asset */}
      <div>
        <label
          htmlFor="swap-amount"
          className="block text-gray-400 text-sm mb-2"
        >
          You Receive
        </label>
        <div className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              {getAssetLogo(asset.logo)}
            </div>
            <span className="text-white font-semibold">{asset.symbol}</span>
          </div>
          <input
            id="swap-amount"
            type="text"
            value={swapAmount}
            onChange={handleSwapAmountChange}
            placeholder="0.00"
            className="bg-transparent text-white text-lg font-semibold text-right outline-none w-32"
          />
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div>
        <p className="text-gray-400 text-sm mb-2">Quick amounts:</p>
        <div className="flex space-x-2">
          {["0.1", "0.5", "1", "5"].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setSwapAmount(amount)}
              className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              {amount}
            </button>
          ))}
        </div>
      </div>

      {/* Swap Button */}
      <button
        type="button"
        onClick={handleSwap}
        disabled={isSwapping || !swapAmount || swapAmount === "0"}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
      >
        {isSwapping ? "Swapping..." : `Swap for ${asset.symbol}`}
      </button>

      {/* Transaction Info */}
      <div className="text-xs text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>Exchange Rate:</span>
          <span>
            1 {asset.symbol} = 0.5 {sourceAsset}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Trading Fee:</span>
          <span>0.05%</span>
        </div>
        <div className="flex justify-between">
          <span>Network Fee:</span>
          <span>~0.001 {sourceAsset}</span>
        </div>
      </div>
    </div>
  );
}
