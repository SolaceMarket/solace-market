"use client";

import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { AssetData } from "@/types/assets";

interface SwapInterfaceProps {
  asset: AssetData;
  onSwapComplete: () => void;
  embedded?: boolean;
}

function getAssetLogo(
  logoType: string,
  width: number = 24,
  height: number = 24,
) {
  switch (logoType) {
    case "apple":
      return (
        <Image
          src="/logos/apple.svg"
          alt="Apple Logo"
          {...{ width, height }}
          className="w-6 h-6"
        />
      );
    case "bitcoin":
      return (
        <Image
          src="/logos/bitcoin.svg"
          alt="Bitcoin Logo"
          {...{ width, height }}
          className="w-6 h-6"
        />
      );
    case "microsoft":
      return (
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          aria-label="Microsoft Logo"
        >
          <title>Microsoft Logo</title>
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M13 1h10v10H13z" />
          <path fill="#05a6f0" d="M1 13h10v10H1z" />
          <path fill="#ffba08" d="M13 13h10v10H13z" />
        </svg>
      );
    case "google":
      return (
        <svg viewBox="0 0 24 24" className="w-6 h-6" aria-label="Google Logo">
          <title>Google Logo</title>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      );
    case "solana":
      return (
        <Image
          src="/logos/solana.svg"
          alt="Solana Logo"
          {...{ width, height }}
          className="w-6 h-6"
        />
      );
    default:
      return (
        <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
          ?
        </div>
      );
  }
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
                <Image
                  src="/logos/solana.svg"
                  alt="Solana Logo"
                  width={24}
                  height={24}
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
                {getAssetLogo(asset.logo)}
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
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">Quick amounts:</p>
          <div className="flex space-x-2">
            {["1", "5", "10", "25"].map((amount) => (
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
