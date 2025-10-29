"use client";

import {
  ColorType,
  createChart,
  LineSeries,
  type Time,
} from "lightweight-charts";
import { Calendar, Clock, TrendingDown, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AssetData } from "@/types/assets";

interface TradingChartProps {
  asset: AssetData;
  height?: number;
  className?: string;
}

type TimeFrame = "1D" | "1W" | "1M" | "3M" | "1Y";

export function TradingChart({
  asset,
  height = 400,
  className = "",
}: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("1D");
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock price data for demonstration
  const generateMockData = useCallback(
    (timeFrame: TimeFrame) => {
      const now = new Date();
      const data = [];
      let dataPoints: number;
      let intervalMs: number;

      switch (timeFrame) {
        case "1D":
          dataPoints = 24;
          intervalMs = 60 * 60 * 1000; // 1 hour
          break;
        case "1W":
          dataPoints = 7;
          intervalMs = 24 * 60 * 60 * 1000; // 1 day
          break;
        case "1M":
          dataPoints = 30;
          intervalMs = 24 * 60 * 60 * 1000; // 1 day
          break;
        case "3M":
          dataPoints = 90;
          intervalMs = 24 * 60 * 60 * 1000; // 1 day
          break;
        case "1Y":
          dataPoints = 52;
          intervalMs = 7 * 24 * 60 * 60 * 1000; // 1 week
          break;
      }

      const basePrice = parseFloat(asset.price.replace(/[$,]/g, ""));
      let currentPrice = basePrice * 0.9; // Start 10% lower for demo

      for (let i = 0; i < dataPoints; i++) {
        const time = Math.floor(
          (now.getTime() - (dataPoints - i) * intervalMs) / 1000,
        );
        // Add some realistic price movement
        const volatility = 0.02; // 2% volatility
        const change = (Math.random() - 0.5) * volatility * currentPrice;
        currentPrice += change;

        data.push({
          time: time as Time,
          value: currentPrice,
        });
      }

      // Ensure the last price matches the current asset price
      if (data.length > 0) {
        data[data.length - 1].value = basePrice;
      }

      return data;
    },
    [asset.price],
  );

  const timeFrames: TimeFrame[] = ["1D", "1W", "1M", "3M", "1Y"];

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#1e293b" }, // slate-800
        textColor: "#e2e8f0", // slate-200
      },
      grid: {
        vertLines: { color: "#334155" }, // slate-700
        horzLines: { color: "#334155" }, // slate-700
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      rightPriceScale: {
        borderColor: "#475569", // slate-600
      },
      timeScale: {
        borderColor: "#475569", // slate-600
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    });

    // Create line series
    const lineSeries = chart.addSeries(LineSeries, {
      color: asset.isPositive ? "#10b981" : "#ef4444",
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = lineSeries;

    // Load initial data
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const data = generateMockData(selectedTimeFrame);
      lineSeries.setData(data);
      setIsLoading(false);
    };

    loadData();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [asset.isPositive, height, generateMockData, selectedTimeFrame]);

  // Update data when timeframe changes
  useEffect(() => {
    if (!seriesRef.current) return;

    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const data = generateMockData(selectedTimeFrame);
      seriesRef.current?.setData(data);
      setIsLoading(false);
    };

    loadData();
  }, [selectedTimeFrame, generateMockData]);

  const currentPrice = parseFloat(asset.price.replace(/[$,]/g, ""));
  const changeValue = parseFloat(asset.change.replace(/[+\-%$]/g, ""));
  const changePercent = ((changeValue / currentPrice) * 100).toFixed(2);

  return (
    <div className={`bg-slate-800 rounded-lg p-6 ${className}`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold text-white">{asset.symbol}</h3>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">{asset.name}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{asset.price}</div>
            <div
              className={`flex items-center space-x-1 text-sm ${
                asset.isPositive ? "text-green-400" : "text-red-400"
              }`}
            >
              {asset.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {asset.change} ({changePercent}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Time Frame Selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex bg-slate-700 rounded-lg p-1">
          {timeFrames.map((timeFrame) => (
            <button
              key={timeFrame}
              type="button"
              onClick={() => setSelectedTimeFrame(timeFrame)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                selectedTimeFrame === timeFrame
                  ? "bg-slate-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {timeFrame}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>Real-time</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-slate-800/80 flex items-center justify-center z-10 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
              <span>Loading chart data...</span>
            </div>
          </div>
        )}
        <div ref={chartContainerRef} className="rounded-lg overflow-hidden" />
      </div>

      {/* Chart Info */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <div>
          <span>Powered by TradingView</span>
        </div>
      </div>
    </div>
  );
}
