"use client";

import { AlertTriangle, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { getSwapAssets } from "@/data/mockAssets";
import type { AssetData } from "@/types/assets";

interface TradingInterfaceProps {
  asset: AssetData;
  onTradeComplete: () => void;
  embedded?: boolean;
}

type TradingMode = "spot" | "leverage";
type TradeDirection = "buy" | "sell";

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

export function TradingInterface({
  asset,
  onTradeComplete,
  embedded = false,
}: TradingInterfaceProps) {
  const [tradingMode, setTradingMode] = useState<TradingMode>("spot");
  const [tradeDirection, setTradeDirection] = useState<TradeDirection>("buy");
  const [tradeAmount, setTradeAmount] = useState<string>("1");
  const [leverage, setLeverage] = useState<number>(2);
  const [collateralAsset, setCollateralAsset] = useState<string>("SOL");
  const [isTrading, setIsTrading] = useState(false);

  const allAssets = getSwapAssets();
  const availableCollateral = Object.keys(allAssets).filter(
    (symbol) => symbol !== asset.symbol,
  );

  const handleTradeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow decimals for trading
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setTradeAmount(value);
    }
  };

  const handleTrade = async () => {
    if (!tradeAmount || tradeAmount === "0") {
      alert("Please enter a valid amount");
      return;
    }

    setIsTrading(true);

    try {
      // Simulate trade transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (tradingMode === "spot") {
        alert(
          `Successfully ${tradeDirection === "buy" ? "bought" : "sold"} ${tradeAmount} ${asset.symbol} using ${collateralAsset}!`,
        );
      } else {
        alert(
          `Successfully opened ${leverage}x leverage ${tradeDirection} position for ${tradeAmount} ${asset.symbol} using ${collateralAsset} as collateral!`,
        );
      }
      onTradeComplete();
    } catch (error) {
      console.error("Trade failed:", error);
      alert("Trade failed. Please try again.");
    } finally {
      setIsTrading(false);
    }
  };

  const getEstimatedCost = () => {
    const amount = parseFloat(tradeAmount || "0");
    const baseRate = 0.5; // Mock exchange rate

    if (tradingMode === "leverage") {
      return (amount * baseRate) / leverage;
    }
    return amount * baseRate;
  };

  const getPositionValue = () => {
    const amount = parseFloat(tradeAmount || "0");
    const baseRate = 0.5;

    if (tradingMode === "leverage") {
      return amount * baseRate * leverage;
    }
    return amount * baseRate;
  };

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
              onClick={() => setTradingMode("spot")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                tradingMode === "spot"
                  ? "bg-slate-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Spot Trade
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
          {tradingMode === "spot"
            ? `Trade ${asset.symbol}`
            : `Leverage Trade ${asset.symbol}`}
        </h3>

        {/* Buy/Sell Direction */}
        <div className="mb-4">
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setTradeDirection("buy")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                tradeDirection === "buy"
                  ? "bg-green-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Buy {tradingMode === "leverage" ? "Long" : ""}
            </button>
            <button
              type="button"
              onClick={() => setTradeDirection("sell")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                tradeDirection === "sell"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sell {tradingMode === "leverage" ? "Short" : ""}
            </button>
          </div>
        </div>

        {/* Leverage Selection (only for leverage mode) */}
        {tradingMode === "leverage" && (
          <div className="mb-4">
            <div className="block text-gray-400 text-sm mb-2">Leverage</div>
            <div className="flex space-x-2">
              {[2, 5, 10, 20].map((lev) => (
                <button
                  key={lev}
                  type="button"
                  onClick={() => setLeverage(lev)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    leverage === lev
                      ? "bg-blue-600 text-white"
                      : "bg-slate-600 text-gray-300 hover:bg-slate-500"
                  }`}
                >
                  {lev}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Collateral Selection */}
        <div className="mb-4">
          <div className="block text-gray-400 text-sm mb-2">
            {tradingMode === "leverage" ? "Collateral Asset" : "Pay With"}
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <select
              value={collateralAsset}
              onChange={(e) => setCollateralAsset(e.target.value)}
              className="bg-transparent text-white w-full outline-none"
            >
              {availableCollateral.map((symbol) => (
                <option key={symbol} value={symbol} className="bg-slate-700">
                  {symbol} - {allAssets[symbol].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label
            htmlFor="trade-amount"
            className="block text-gray-400 text-sm mb-2"
          >
            {tradeDirection === "buy" ? "Buy Amount" : "Sell Amount"}
          </label>
          <div className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                {getAssetLogo(asset.logo)}
              </div>
              <span className="text-white font-semibold">{asset.symbol}</span>
            </div>
            <input
              id="trade-amount"
              type="text"
              value={tradeAmount}
              onChange={handleTradeAmountChange}
              placeholder="0.00"
              className="bg-transparent text-white text-lg font-semibold text-right outline-none w-32"
            />
          </div>
        </div>

        {/* Cost/Collateral Required */}
        <div className="mb-4">
          <div className="block text-gray-400 text-sm mb-2">
            {tradingMode === "leverage" ? "Collateral Required" : "Total Cost"}
          </div>
          <div className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                {getAssetLogo(allAssets[collateralAsset]?.logo || "solana")}
              </div>
              <span className="text-white font-semibold">
                {collateralAsset}
              </span>
            </div>
            <span className="text-white text-lg font-semibold">
              {getEstimatedCost().toFixed(4)}
            </span>
          </div>
        </div>

        {/* Leverage Trade Info */}
        {tradingMode === "leverage" && (
          <div className="mb-4 p-3 bg-slate-700 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
              <div className="text-xs text-gray-300 space-y-1">
                <div className="flex justify-between">
                  <span>Position Value:</span>
                  <span>
                    {getPositionValue().toFixed(2)} {collateralAsset}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Liquidation Risk:</span>
                  <span className="text-red-400">High</span>
                </div>
                <p className="text-yellow-400 text-xs mt-2">
                  ⚠️ Leverage trading involves significant risk of loss
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Amount Buttons */}
        <div className="mb-6">
          <p className="text-gray-400 text-sm mb-2">Quick amounts:</p>
          <div className="flex space-x-2">
            {["0.1", "0.5", "1", "5"].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setTradeAmount(amount)}
                className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Trade Button */}
        <button
          type="button"
          onClick={handleTrade}
          disabled={isTrading || !tradeAmount || tradeAmount === "0"}
          className={`w-full font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed ${
            tradeDirection === "buy"
              ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white"
              : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white"
          }`}
        >
          {isTrading
            ? "Processing..."
            : `${tradeDirection === "buy" ? "Buy" : "Sell"} ${asset.symbol}${tradingMode === "leverage" ? ` ${leverage}x` : ""}`}
        </button>

        {/* Transaction Info */}
        <div className="mt-4 text-xs text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Exchange Rate:</span>
            <span>
              1 {asset.symbol} = 0.5 {collateralAsset}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Trading Fee:</span>
            <span>{tradingMode === "leverage" ? "0.1%" : "0.05%"}</span>
          </div>
          <div className="flex justify-between">
            <span>Network Fee:</span>
            <span>~0.001 {collateralAsset}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
