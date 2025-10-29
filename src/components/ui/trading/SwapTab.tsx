"use client";

import {
  AlertTriangle,
  ArrowUpDown,
  Building2,
  ChevronDown,
  ChevronUp,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useCollateralAssets } from "@/hooks/useCollateralAssets";
import type { AssetData } from "@/types/assets";
import { PortfolioCollateralSearchModal } from "../PortfolioCollateralSearchModal";
import { AssetLogo } from "../shared/AssetLogo";

interface CollateralAsset {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  logo: string;
  category: string;
  market: string;
  description: string;
  balance: number;
  usdValue: number;
  collateralRatio: number;
  maxCollateralValue: number;
  location: "wallet" | "exchange";
  transferTime: string | null;
  canTransferForTrading: boolean;
}

interface SwapTabProps {
  asset: AssetData;
  onSwapComplete: () => void;
}

export function SwapTab({ asset, onSwapComplete }: SwapTabProps) {
  const [swapAmount, setSwapAmount] = useState<string>("1");
  const [sourceAsset, setSourceAsset] = useState<string>("SOL");
  const [selectedCollateralAsset, setSelectedCollateralAsset] =
    useState<CollateralAsset | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [showFeeDetails, setShowFeeDetails] = useState(false);

  // Fetch collateral assets for auto-selecting SOL
  const { assets: collateralAssets } = useCollateralAssets();

  // Auto-select SOL if available and no asset is currently selected
  useEffect(() => {
    if (!selectedCollateralAsset && collateralAssets.length > 0) {
      const solAsset = collateralAssets.find((asset) => asset.symbol === "SOL");
      if (solAsset) {
        setSelectedCollateralAsset(solAsset);
        setSourceAsset(solAsset.symbol);
      }
    }
  }, [collateralAssets, selectedCollateralAsset]);

  const handleSwapAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow decimals for swapping
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setSwapAmount(value);
    }
  };

  const handleCollateralAssetSelect = (selectedAsset: CollateralAsset) => {
    setSelectedCollateralAsset(selectedAsset);
    setSourceAsset(selectedAsset.symbol);
  };

  const handleSwap = async () => {
    if (!swapAmount || swapAmount === "0") {
      alert("Please enter a valid amount");
      return;
    }

    if (!selectedCollateralAsset) {
      alert("Please select a collateral asset");
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

  // Calculate fees based on asset location
  const calculateFees = (asset: CollateralAsset | null, amount: number) => {
    if (!asset) return { total: 0, breakdown: [] };

    const baseAmount = amount * 0.9995;
    const tradingFee = amount * 0.0005;
    const routingFee = amount * 0.0001;

    const breakdown = [
      { label: "Base Amount", amount: baseAmount, symbol: asset.symbol },
      {
        label: "Trading Fee (0.05%)",
        amount: tradingFee,
        symbol: asset.symbol,
      },
      { label: "Routing Fee", amount: routingFee, symbol: asset.symbol },
    ];

    // Add network fee only for wallet assets
    if (asset.location === "wallet") {
      const networkFee = 0.001;
      breakdown.push({
        label: "Network Fee",
        amount: networkFee,
        symbol: asset.symbol,
      });
      return {
        total: baseAmount + tradingFee + routingFee + networkFee,
        breakdown,
      };
    }

    return {
      total: baseAmount + tradingFee + routingFee,
      breakdown,
    };
  };

  const feeCalculation = calculateFees(selectedCollateralAsset, estimatedCost);

  // Check if selected asset can be used for trading
  const canProceedWithSwap =
    !selectedCollateralAsset ||
    selectedCollateralAsset.location === "exchange" ||
    selectedCollateralAsset.canTransferForTrading;

  return (
    <div className="space-y-4">
      {/* SIMPLIFIED VERSION - One Step Payment with Portfolio Assets */}
      {/* Pay With (Portfolio Asset Search + Amount) */}
      <div>
        <div className="block text-gray-400 text-sm mb-2">
          Pay With (From Your Portfolio)
        </div>
        <div className="bg-slate-700 rounded-lg overflow-hidden">
          {/* Asset Selection Button */}
          <button
            type="button"
            onClick={() => setIsAssetModalOpen(true)}
            className="w-full p-4 hover:bg-slate-600 transition-colors focus:ring-2 focus:ring-green-500 outline-none"
          >
            {selectedCollateralAsset ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <AssetLogo
                      src={selectedCollateralAsset.logo}
                      alt={`${selectedCollateralAsset.symbol} logo`}
                      className="w-6 h-6"
                    />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">
                        {selectedCollateralAsset.symbol}
                      </span>
                      <div className="flex items-center space-x-1">
                        {selectedCollateralAsset.location === "wallet" ? (
                          <Wallet className="w-3 h-3 text-blue-400" />
                        ) : (
                          <Building2 className="w-3 h-3 text-green-400" />
                        )}
                        <span className="text-xs text-gray-400">
                          {selectedCollateralAsset.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">
                      Balance: {selectedCollateralAsset.balance.toFixed(4)} ($
                      {selectedCollateralAsset.usdValue.toFixed(2)})
                    </div>
                    {/* Transfer warning for wallet assets that can't be used for trading */}
                    {selectedCollateralAsset.location === "wallet" &&
                      !selectedCollateralAsset.canTransferForTrading && (
                        <div className="flex items-center space-x-1 text-amber-400 text-xs mt-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>
                            Transfer to exchange required (
                            {selectedCollateralAsset.transferTime})
                          </span>
                        </div>
                      )}
                    {/* Transfer time info for wallet assets that can be used */}
                    {selectedCollateralAsset.location === "wallet" &&
                      selectedCollateralAsset.canTransferForTrading && (
                        <div className="text-gray-500 text-xs mt-1">
                          Transfer time: {selectedCollateralAsset.transferTime}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">
                  Select asset from your portfolio...
                </span>
                <div className="text-gray-400">Browse</div>
              </div>
            )}
          </button>

          {/* Total Amount Row - separated by border */}
          {selectedCollateralAsset && (
            <div className="border-t border-slate-600 p-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Total:</span>
                <div className="flex items-center space-x-2">
                  <span className="text-white text-lg font-semibold">
                    {feeCalculation.total.toFixed(4)}{" "}
                    {selectedCollateralAsset.symbol}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowFeeDetails(!showFeeDetails)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {showFeeDetails ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fee Details Collapsible */}
          {selectedCollateralAsset && showFeeDetails && (
            <div className="border-t border-slate-600 p-4 space-y-2 text-sm">
              {feeCalculation.breakdown.map((fee) => (
                <div
                  key={fee.label}
                  className="flex justify-between text-gray-300"
                >
                  <span>{fee.label}:</span>
                  <span>
                    {fee.amount.toFixed(6)} {fee.symbol}
                  </span>
                </div>
              ))}

              {/* Network fee explanation for wallet assets */}
              {selectedCollateralAsset.location === "wallet" && (
                <div className="text-xs text-amber-300 mt-2 p-2 bg-amber-900/20 rounded">
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Network fees apply when using wallet assets</span>
                  </div>
                </div>
              )}

              {/* No network fee notice for exchange assets */}
              {selectedCollateralAsset.location === "exchange" && (
                <div className="text-xs text-green-300 mt-2 p-2 bg-green-900/20 rounded">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-3 h-3" />
                    <span>No network fees - asset is already on exchange</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Transfer Required Information Box */}
      {selectedCollateralAsset &&
        selectedCollateralAsset.location === "wallet" &&
        !selectedCollateralAsset.canTransferForTrading && (
          <div className="bg-amber-900/30 border border-amber-600 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-amber-300 font-semibold mb-2">
                  Transfer Required Before Trading
                </h3>
                <p className="text-amber-200 text-sm mb-3">
                  Your {selectedCollateralAsset.symbol} is currently in your
                  wallet and needs to be transferred to the exchange before it
                  can be used for trading. Due to the long confirmation time (
                  {selectedCollateralAsset.transferTime}), immediate trading is
                  not available.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-amber-200">
                    <span>Transfer Time:</span>
                    <span className="font-medium">
                      {selectedCollateralAsset.transferTime}
                    </span>
                  </div>
                  <div className="flex justify-between text-amber-200">
                    <span>Available Balance:</span>
                    <span className="font-medium">
                      {selectedCollateralAsset.balance.toFixed(4)}{" "}
                      {selectedCollateralAsset.symbol}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-amber-800/30 rounded text-xs text-amber-100">
                  <strong>Recommendation:</strong> Transfer your{" "}
                  {selectedCollateralAsset.symbol} to the exchange in advance,
                  or use assets that are already on the exchange for immediate
                  trading.
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Only show swap components if trading is allowed */}
      {canProceedWithSwap && (
        <>
          {/* 
          ORIGINAL VERSION - Two Step Payment (Commented Out)
          Uncomment the section below and comment out the "SIMPLIFIED VERSION" above to use the original two-step approach:
          
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

          <div>
            <div className="block text-gray-400 text-sm mb-2">Amount to Pay</div>
            <div className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <AssetLogo src={allAssets[sourceAsset]?.logo || "/logos/solana.svg"} alt={`${sourceAsset} logo`} className="w-6 h-6" />
                </div>
                <span className="text-white font-semibold">{sourceAsset}</span>
              </div>
              <span className="text-white text-lg font-semibold">
                {estimatedCost.toFixed(4)}
              </span>
            </div>
          </div>
          */}
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
        </>
      )}
      {/* Portfolio Collateral Search Modal */}
      <PortfolioCollateralSearchModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        onAssetSelect={handleCollateralAssetSelect}
      />
    </div>
  );
}
