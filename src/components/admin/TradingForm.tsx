"use client";

import { useState } from "react";
import type { Asset } from "@/alpaca/assets/Asset";
import type { UserData, TradeFormData } from "@/types/admin";

interface TradingFormProps {
  asset: Asset;
  selectedUser: UserData;
  onSubmit: (tradeData: TradeFormData) => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}

export function TradingForm({
  asset,
  selectedUser,
  onSubmit,
  disabled = false,
  loading = false,
}: TradingFormProps) {
  const [formData, setFormData] = useState<TradeFormData>({
    side: "buy",
    type: "market",
    qty: "",
    time_in_force: "day",
    extended_hours: false,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TradeFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TradeFormData, string>> = {};

    // Validate quantity
    const qty = parseFloat(formData.qty);
    if (!formData.qty || Number.isNaN(qty) || qty <= 0) {
      newErrors.qty = "Please enter a valid quantity";
    } else if (!asset.fractionable && qty % 1 !== 0) {
      newErrors.qty = "This asset does not support fractional shares";
    }

    // Validate limit price for limit orders
    if (formData.type === "limit" || formData.type === "stop_limit") {
      const limitPrice = parseFloat(formData.limit_price || "");
      if (
        !formData.limit_price ||
        Number.isNaN(limitPrice) ||
        limitPrice <= 0
      ) {
        newErrors.limit_price = "Please enter a valid limit price";
      }
    }

    // Validate stop price for stop orders
    if (formData.type === "stop" || formData.type === "stop_limit") {
      const stopPrice = parseFloat(formData.stop_price || "");
      if (!formData.stop_price || Number.isNaN(stopPrice) || stopPrice <= 0) {
        newErrors.stop_price = "Please enter a valid stop price";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        side: "buy",
        type: "market",
        qty: "",
        time_in_force: "day",
        extended_hours: false,
      });
      setErrors({});
    } catch (error) {
      console.error("Trade submission error:", error);
    }
  };

  const updateFormData = (
    field: keyof TradeFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const displayName = (user: UserData) => {
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user.email;
  };

  const estimatedValue = () => {
    const qty = parseFloat(formData.qty || "0");
    if (Number.isNaN(qty) || qty <= 0) return "0.00";

    // For market orders, use current price estimation
    // For limit orders, use limit price
    let price = 0;
    if (formData.type === "limit" || formData.type === "stop_limit") {
      price = parseFloat(formData.limit_price || "0");
    } else {
      // Use some estimated market price (in real app, this would come from live data)
      price = 150; // Placeholder price
    }

    return (qty * price).toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Execute Trade
        </h3>
        <div className="text-sm text-gray-600">
          Trading <strong>{asset.symbol}</strong> for{" "}
          <strong>{displayName(selectedUser)}</strong>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Account: {selectedUser.broker?.subAccountId} • Provider:{" "}
          {selectedUser.broker?.provider}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Buy/Sell Toggle */}
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            Order Side
          </div>
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => updateFormData("side", "buy")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md border ${
                formData.side === "buy"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => updateFormData("side", "sell")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md border-l-0 border ${
                formData.side === "sell"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Sell
            </button>
          </div>
        </div>

        {/* Order Type */}
        <div>
          <label
            htmlFor="order-type"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Order Type
          </label>
          <select
            id="order-type"
            value={formData.type}
            onChange={(e) =>
              updateFormData("type", e.target.value as TradeFormData["type"])
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="market">Market Order</option>
            <option value="limit">Limit Order</option>
            <option value="stop">Stop Order</option>
            <option value="stop_limit">Stop Limit Order</option>
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Quantity
            {asset.fractionable && (
              <span className="text-xs text-gray-500 ml-1">
                (fractional shares allowed)
              </span>
            )}
          </label>
          <input
            id="quantity"
            type="number"
            step={asset.fractionable ? "0.0001" : "1"}
            min="0"
            value={formData.qty}
            onChange={(e) => updateFormData("qty", e.target.value)}
            placeholder="Enter quantity"
            className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.qty ? "border-red-300" : "border-gray-300"
            }`}
          />
          {errors.qty && (
            <p className="mt-1 text-sm text-red-600">{errors.qty}</p>
          )}
        </div>

        {/* Limit Price (for limit and stop_limit orders) */}
        {(formData.type === "limit" || formData.type === "stop_limit") && (
          <div>
            <label
              htmlFor="limit-price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Limit Price ($)
            </label>
            <input
              id="limit-price"
              type="number"
              step="0.01"
              min="0"
              value={formData.limit_price || ""}
              onChange={(e) => updateFormData("limit_price", e.target.value)}
              placeholder="Enter limit price"
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.limit_price ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.limit_price && (
              <p className="mt-1 text-sm text-red-600">{errors.limit_price}</p>
            )}
          </div>
        )}

        {/* Stop Price (for stop and stop_limit orders) */}
        {(formData.type === "stop" || formData.type === "stop_limit") && (
          <div>
            <label
              htmlFor="stop-price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Stop Price ($)
            </label>
            <input
              id="stop-price"
              type="number"
              step="0.01"
              min="0"
              value={formData.stop_price || ""}
              onChange={(e) => updateFormData("stop_price", e.target.value)}
              placeholder="Enter stop price"
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.stop_price ? "border-red-300" : "border-gray-300"
              }`}
            />
            {errors.stop_price && (
              <p className="mt-1 text-sm text-red-600">{errors.stop_price}</p>
            )}
          </div>
        )}

        {/* Time in Force */}
        <div>
          <label
            htmlFor="time-in-force"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Time in Force
          </label>
          <select
            id="time-in-force"
            value={formData.time_in_force}
            onChange={(e) =>
              updateFormData(
                "time_in_force",
                e.target.value as TradeFormData["time_in_force"],
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="day">Day (Good for Day)</option>
            <option value="gtc">GTC (Good Till Canceled)</option>
            <option value="ioc">IOC (Immediate or Cancel)</option>
            <option value="fok">FOK (Fill or Kill)</option>
          </select>
        </div>

        {/* Extended Hours */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="extended_hours"
            checked={formData.extended_hours}
            onChange={(e) => updateFormData("extended_hours", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="extended_hours"
            className="ml-2 block text-sm text-gray-700"
          >
            Allow extended hours trading
          </label>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Order Summary
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Action:</span>
              <span
                className={`font-medium ${formData.side === "buy" ? "text-green-600" : "text-red-600"}`}
              >
                {formData.side.toUpperCase()} {formData.qty || "0"} shares
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Symbol:</span>
              <span className="font-medium">{asset.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Type:</span>
              <span className="font-medium capitalize">
                {formData.type.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Value:</span>
              <span className="font-medium">${estimatedValue()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">For User:</span>
              <span className="font-medium">{displayName(selectedUser)}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={disabled || loading || !formData.qty}
          className={`w-full px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            formData.side === "buy"
              ? "bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white"
              : "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
          } disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
          {loading
            ? "Placing Order..."
            : `Place ${formData.side.toUpperCase()} Order`}
        </button>

        {/* Warning Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="text-xs text-yellow-700">
            <strong>⚠️ Admin Trading Notice:</strong> You are placing an order on
            behalf of another user. Ensure you have proper authorization and
            that all trade details are correct before submitting.
          </div>
        </div>
      </form>
    </div>
  );
}
