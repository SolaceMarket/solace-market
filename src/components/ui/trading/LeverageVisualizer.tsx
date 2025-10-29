"use client";

import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface LeverageVisualizerProps {
  leverage: number;
  onLeverageChange: (newLeverage: number) => void;
  tradeAmount: number;
  collateralRequired: number;
  positionValue: number;
  tradeDirection: "buy" | "sell";
}

export function LeverageVisualizer({
  leverage,
  onLeverageChange,
  tradeAmount,
  collateralRequired,
  positionValue,
  tradeDirection,
}: LeverageVisualizerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const minLeverage = 1;
  const maxLeverage = 50;

  // Calculate position on the slider (0-100%)
  const sliderPosition =
    ((leverage - minLeverage) / (maxLeverage - minLeverage)) * 100;

  // Calculate risk level based on leverage
  const getRiskLevel = (lev: number) => {
    if (lev <= 2)
      return { level: "Low", color: "text-green-400", bgColor: "bg-green-500" };
    if (lev <= 5)
      return {
        level: "Medium",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500",
      };
    if (lev <= 10)
      return {
        level: "High",
        color: "text-orange-400",
        bgColor: "bg-orange-500",
      };
    return { level: "Extreme", color: "text-red-400", bgColor: "bg-red-500" };
  };

  const risk = getRiskLevel(leverage);

  // Calculate potential profit/loss percentages
  const profitLoss5Percent = tradeAmount * 0.05 * leverage;
  const profitLoss10Percent = tradeAmount * 0.1 * leverage;

  // Calculate leverage from mouse position (optimized)
  const calculateLeverageFromPosition = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return leverage;

      const rect = sliderRef.current.getBoundingClientRect();
      const position = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      const newLeverage = Math.round(1 + position * 49); // Direct calculation: 1 to 50

      return Math.max(1, Math.min(50, newLeverage));
    },
    [leverage],
  );

  // Mouse event handlers (optimized for performance)
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setIsDragging(true);

      const newLeverage = calculateLeverageFromPosition(event.clientX);
      if (newLeverage !== leverage) {
        onLeverageChange(newLeverage);
      }
    },
    [calculateLeverageFromPosition, onLeverageChange, leverage],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging) return;

      const newLeverage = calculateLeverageFromPosition(event.clientX);
      if (newLeverage !== leverage) {
        onLeverageChange(newLeverage);
      }
    },
    [isDragging, calculateLeverageFromPosition, onLeverageChange, leverage],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch event handlers for mobile (optimized)
  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      event.preventDefault();
      setIsDragging(true);

      const touch = event.touches[0];
      const newLeverage = calculateLeverageFromPosition(touch.clientX);
      if (newLeverage !== leverage) {
        onLeverageChange(newLeverage);
      }
    },
    [calculateLeverageFromPosition, onLeverageChange, leverage],
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!isDragging) return;

      event.preventDefault();
      const touch = event.touches[0];
      const newLeverage = calculateLeverageFromPosition(touch.clientX);
      if (newLeverage !== leverage) {
        onLeverageChange(newLeverage);
      }
    },
    [isDragging, calculateLeverageFromPosition, onLeverageChange, leverage],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      let newLeverage = leverage;

      switch (event.key) {
        case "ArrowLeft":
        case "ArrowDown":
          newLeverage = Math.max(1, leverage - 1);
          break;
        case "ArrowRight":
        case "ArrowUp":
          newLeverage = Math.min(50, leverage + 1);
          break;
        case "Home":
          newLeverage = 1;
          break;
        case "End":
          newLeverage = 50;
          break;
        case "PageDown":
          newLeverage = Math.max(1, leverage - 5);
          break;
        case "PageUp":
          newLeverage = Math.min(50, leverage + 5);
          break;
        default:
          return;
      }

      event.preventDefault();
      onLeverageChange(newLeverage);
    },
    [leverage, onLeverageChange],
  );

  // Add global event listeners for drag functionality (optimized)
  useEffect(() => {
    if (isDragging) {
      const handleMouseMoveThrottled = (event: MouseEvent) => {
        requestAnimationFrame(() => handleMouseMove(event));
      };

      const handleTouchMoveThrottled = (event: TouchEvent) => {
        requestAnimationFrame(() => handleTouchMove(event));
      };

      document.addEventListener("mousemove", handleMouseMoveThrottled, {
        passive: false,
      });
      document.addEventListener("mouseup", handleMouseUp, { passive: true });
      document.addEventListener("touchmove", handleTouchMoveThrottled, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd, { passive: true });

      // Prevent text selection during drag
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
      document.body.style.cursor = "grabbing";

      return () => {
        document.removeEventListener("mousemove", handleMouseMoveThrottled);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMoveThrottled);
        document.removeEventListener("touchend", handleTouchEnd);
        document.body.style.userSelect = "";
        document.body.style.webkitUserSelect = "";
        document.body.style.cursor = "";
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  return (
    <div className="bg-slate-700 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Leverage Visualizer</span>
        </h4>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${risk.color} bg-slate-600`}
        >
          Risk: {risk.level}
        </div>
      </div>

      {/* Interactive Leverage Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Leverage Multiplier</span>
          <span className="text-white text-2xl font-bold">{leverage}x</span>
        </div>

        <div
          ref={sliderRef}
          className="relative select-none touch-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onKeyDown={handleKeyDown}
          role="slider"
          aria-valuemin={minLeverage}
          aria-valuemax={maxLeverage}
          aria-valuenow={leverage}
          aria-label="Leverage multiplier"
          tabIndex={0}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            willChange: isDragging ? "transform" : "auto",
          }}
        >
          {/* Slider Track */}
          <div className="h-6 bg-slate-600 rounded-full relative overflow-hidden">
            {/* Risk zones background */}
            <div className="absolute inset-0 flex">
              <div className="w-1/12 bg-green-500 opacity-30"></div>
              <div className="w-2/12 bg-yellow-500 opacity-30"></div>
              <div className="w-4/12 bg-orange-500 opacity-30"></div>
              <div className="w-5/12 bg-red-500 opacity-30"></div>
            </div>

            {/* Progress fill */}
            <div
              className={`absolute inset-y-0 left-0 ${risk.bgColor} opacity-60 transition-none`}
              style={{ width: `${sliderPosition}%` }}
            ></div>
          </div>

          {/* Slider thumb indicator */}
          <div
            className={`absolute top-0 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-slate-300 transform -translate-x-1/2 transition-none pointer-events-none ${isDragging ? "scale-110 cursor-grabbing" : "hover:scale-105 cursor-grab"}`}
            style={{
              left: `${sliderPosition}%`,
              transform: `translateX(-50%) ${isDragging ? "scale(1.1)" : ""}`,
              transition: isDragging ? "none" : "transform 0.1s ease-out",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-2 h-2 rounded-full ${risk.bgColor}`}></div>
            </div>
          </div>
        </div>

        {/* Risk zone labels */}
        <div className="flex justify-between text-xs text-gray-400">
          <span>Safe</span>
          <span>Moderate</span>
          <span>Risky</span>
          <span>Extreme</span>
        </div>
      </div>

      {/* Position Visualization */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-600 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-2">Your Investment</div>
          <div className="text-white text-lg font-semibold">
            ${collateralRequired.toFixed(2)}
          </div>
          <div className="text-gray-400 text-xs">Collateral Required</div>
        </div>

        <div className="bg-slate-600 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-2">Position Size</div>
          <div className="text-white text-lg font-semibold">
            ${positionValue.toFixed(2)}
          </div>
          <div className={`text-xs ${risk.color}`}>{leverage}x leveraged</div>
        </div>
      </div>

      {/* Profit/Loss Scenarios */}
      <div className="space-y-3">
        <div className="text-gray-300 text-sm font-medium">
          Profit/Loss Scenarios
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-600 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">+5% price move</span>
              {tradeDirection === "buy" ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
            <div
              className={`text-sm font-semibold ${tradeDirection === "buy" ? "text-green-400" : "text-red-400"}`}
            >
              {tradeDirection === "buy" ? "+" : "-"}$
              {Math.abs(profitLoss5Percent).toFixed(2)}
            </div>
          </div>

          <div className="bg-slate-600 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">+10% price move</span>
              {tradeDirection === "buy" ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
            <div
              className={`text-sm font-semibold ${tradeDirection === "buy" ? "text-green-400" : "text-red-400"}`}
            >
              {tradeDirection === "buy" ? "+" : "-"}$
              {Math.abs(profitLoss10Percent).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-600 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">-5% price move</span>
              {tradeDirection === "buy" ? (
                <TrendingDown className="w-4 h-4 text-red-400" />
              ) : (
                <TrendingUp className="w-4 h-4 text-green-400" />
              )}
            </div>
            <div
              className={`text-sm font-semibold ${tradeDirection === "buy" ? "text-red-400" : "text-green-400"}`}
            >
              {tradeDirection === "buy" ? "-" : "+"}$
              {Math.abs(profitLoss5Percent).toFixed(2)}
            </div>
          </div>

          <div className="bg-slate-600 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">-10% price move</span>
              {tradeDirection === "buy" ? (
                <TrendingDown className="w-4 h-4 text-red-400" />
              ) : (
                <TrendingUp className="w-4 h-4 text-green-400" />
              )}
            </div>
            <div
              className={`text-sm font-semibold ${tradeDirection === "buy" ? "text-red-400" : "text-green-400"}`}
            >
              {tradeDirection === "buy" ? "-" : "+"}$
              {Math.abs(profitLoss10Percent).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Liquidation Warning */}
      {leverage > 10 && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-300">
            <div className="font-medium mb-1">High Liquidation Risk</div>
            <div className="text-xs text-red-400">
              At {leverage}x leverage, a {((100 / leverage) * 0.8).toFixed(1)}%
              adverse price movement could liquidate your position.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
