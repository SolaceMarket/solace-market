"use client";

import type { BaseCurrency, BaseCurrencyFiltersProps } from "../types";

const BASE_CURRENCIES: BaseCurrency[] = [
  { symbol: "BTC", name: "Bitcoin", icon: "₿", color: "orange" },
  { symbol: "SOL", name: "Solana", icon: "◎", color: "purple" },
  { symbol: "USDC", name: "USD Coin", icon: "💵", color: "blue" },
  { symbol: "USDT", name: "Tether", icon: "💚", color: "green" },
];

export function BaseCurrencyFilters({
  filters,
  onFilterChange,
  onResetPagination,
}: BaseCurrencyFiltersProps) {
  const handleCurrencyClick = (currency: BaseCurrency) => {
    // Search for assets that include this currency in their symbol (e.g., BTC/USD, SOL/BTC, etc.)
    onFilterChange({
      search: currency.symbol,
      class: "crypto",
    });
    // Reset pagination when using filters
    onResetPagination();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Filter by Base Currency
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Click to filter assets tradable against these currencies
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
        {BASE_CURRENCIES.map((currency) => {
          const isActive =
            filters.search === currency.symbol && filters.class === "crypto";
          return (
            <button
              key={currency.symbol}
              type="button"
              onClick={() => handleCurrencyClick(currency)}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 group ${
                isActive
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
              }`}
            >
              <div className="text-3xl mb-2">{currency.icon}</div>
              <div
                className={`text-base font-semibold ${
                  isActive
                    ? "text-blue-700"
                    : "text-gray-900 group-hover:text-blue-600"
                }`}
              >
                {currency.symbol}
              </div>
              <div
                className={`text-sm mt-1 ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-blue-500"
                }`}
              >
                Trading pairs with {currency.symbol}
              </div>
              <div
                className={`text-xs px-3 py-1.5 rounded-full mt-2 ${
                  currency.color === "orange"
                    ? isActive
                      ? "bg-orange-200 text-orange-800"
                      : "bg-orange-100 text-orange-700 group-hover:bg-orange-200"
                    : currency.color === "purple"
                      ? isActive
                        ? "bg-purple-200 text-purple-800"
                        : "bg-purple-100 text-purple-700 group-hover:bg-purple-200"
                      : currency.color === "green"
                        ? isActive
                          ? "bg-green-200 text-green-800"
                          : "bg-green-100 text-green-700 group-hover:bg-green-200"
                        : isActive
                          ? "bg-blue-200 text-blue-800"
                          : "bg-blue-100 text-blue-700 group-hover:bg-blue-200"
                }`}
              >
                Filter Pairs
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
