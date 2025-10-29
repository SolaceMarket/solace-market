"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { getSwapAssets } from "@/data/mockAssets";
import type { AssetData } from "@/types/assets";
import { getAssetLogo } from "../shared/AssetLogo";
import { LeverageVisualizer } from "./LeverageVisualizer";

interface LeverageTabProps {
  asset: AssetData;
  onTradeComplete: () => void;
}

type TradeDirection = "buy" | "sell";

export function LeverageTab({ asset, onTradeComplete }: LeverageTabProps) {
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

      alert(
        `Successfully opened ${leverage}x leverage ${tradeDirection} position for ${tradeAmount} ${asset.symbol} using ${collateralAsset} as collateral!`,
      );
      onTradeComplete();
    } catch (error) {
      console.error("Trade failed:", error);
      alert("Trade failed. Please try again.");
    } finally {
      setIsTrading(false);
    }
  };

  const getCollateralRequired = () => {
    const amount = parseFloat(tradeAmount || "0");
    const baseRate = 0.5; // Mock exchange rate
    return (amount * baseRate) / leverage;
  };

  const getPositionValue = () => {
    const amount = parseFloat(tradeAmount || "0");
    const baseRate = 0.5;
    return amount * baseRate * leverage;
  };

  return (
    <div className="space-y-4">
      {/* Buy/Sell Direction */}
      <div>
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
            Buy Long
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
            Sell Short
          </button>
        </div>
      </div>

      {/* Leverage Selection */}
      <div>
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

      {/* Leverage Visualizer */}
      <LeverageVisualizer
        leverage={leverage}
        onLeverageChange={setLeverage}
        tradeAmount={parseFloat(tradeAmount || "0")}
        collateralRequired={getCollateralRequired()}
        positionValue={getPositionValue()}
        tradeDirection={tradeDirection}
      />

      {/* Collateral Selection */}
      <div>
        <div className="block text-gray-400 text-sm mb-2">Collateral Asset</div>
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
      <div>
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

      {/* Collateral Required */}
      <div>
        <div className="block text-gray-400 text-sm mb-2">
          Collateral Required
        </div>
        <div className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              {getAssetLogo(allAssets[collateralAsset]?.logo || "solana")}
            </div>
            <span className="text-white font-semibold">{collateralAsset}</span>
          </div>
          <span className="text-white text-lg font-semibold">
            {getCollateralRequired().toFixed(4)}
          </span>
        </div>
      </div>

      {/* Leverage Trade Info */}
      <div className="p-3 bg-slate-700 rounded-lg">
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

      {/* Quick Amount Buttons */}
      <div>
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
          : `${tradeDirection === "buy" ? "Buy" : "Sell"} ${asset.symbol} ${leverage}x`}
      </button>

      {/* Transaction Info */}
      <div className="text-xs text-gray-400 space-y-1">
        <div className="flex justify-between">
          <span>Exchange Rate:</span>
          <span>
            1 {asset.symbol} = 0.5 {collateralAsset}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Trading Fee:</span>
          <span>0.1%</span>
        </div>
        <div className="flex justify-between">
          <span>Network Fee:</span>
          <span>~0.001 {collateralAsset}</span>
        </div>
      </div>
    </div>
  );
}
