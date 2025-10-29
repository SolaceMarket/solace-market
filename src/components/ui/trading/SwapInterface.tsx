"use client";

import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import type { AssetData } from "@/types/assets";
import { AssetLogo } from "../shared/AssetLogo";
import { QuickAmountButtons } from "../shared/QuickAmountButtons";

interface SwapInterfaceProps {
  asset: AssetData;
  onSwapComplete: () => void;
  embedded?: boolean;
}

export function SwapInterface({
  asset,
  onSwapComplete,
  embedded = false,
}: SwapInterfaceProps) {
  const [swapAmount, setSwapAmount] = useState<string>("1");
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwapAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow integers (no decimals)
    if (value === "" || /^\d+$/.test(value)) {
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
        `Successfully swapped ${swapAmount} SOL for ${swapAmount} ${asset.symbol}!`,
      );
      onSwapComplete();
    } catch (error) {
      console.error("Swap failed:", error);
      alert("Swap failed. Please try again.");
    } finally {
      setIsSwapping(false);
    }
  };

  const estimatedSOLCost = parseFloat(swapAmount || "0") * 0.5; // Mock exchange rate

  return (
    <div className={!embedded ? "" : "p-6"}>
      <div
        className={`bg-slate-800 p-6 ${!embedded ? "" : "rounded-lg border border-slate-600"}`}
      >
        <h3 className="text-xl font-semibold text-white mb-6">
          Swap SOL for {asset.symbol}
        </h3>

        {/* From SOL */}
        <div className="mb-4">
          <div className="block text-gray-400 text-sm mb-2">You Pay</div>
          <div className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <AssetLogo
                  src="/logos/solana.svg"
                  alt="Solana Logo"
                  className="w-6 h-6"
                />
              </div>
              <span className="text-white font-semibold">SOL</span>
            </div>
            <span className="text-white text-lg font-semibold">
              {estimatedSOLCost.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Swap Arrow */}
        <div className="flex justify-center mb-4">
          <div className="bg-slate-600 rounded-full p-2">
            <ArrowUpDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* To Asset */}
        <div className="mb-6">
          <label
            htmlFor="swap-amount"
            className="block text-gray-400 text-sm mb-2"
          >
            You Receive
          </label>
          <div className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <AssetLogo
                  src={asset.logo}
                  alt={`${asset.symbol} logo`}
                  className="w-6 h-6"
                />
              </div>
              <span className="text-white font-semibold">{asset.symbol}</span>
            </div>
            <input
              id="swap-amount"
              type="text"
              value={swapAmount}
              onChange={handleSwapAmountChange}
              placeholder="0"
              className="bg-transparent text-white text-lg font-semibold text-right outline-none w-24"
            />
          </div>
        </div>

        {/* Amount Input Helper */}
        {/* <QuickAmountButtons
          amounts={["1", "5", "10", "25"]}
          onAmountSelect={setSwapAmount}
          label="Quick amounts:"
          className="mb-6"
        /> */}

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
        <div className="mt-4 text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Exchange Rate:</span>
            <span>1 {asset.symbol} = 0.5 SOL</span>
          </div>
          <div className="flex justify-between">
            <span>Network Fee:</span>
            <span>~0.001 SOL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
