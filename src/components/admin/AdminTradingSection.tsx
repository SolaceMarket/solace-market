"use client";

import { useState } from "react";
import type { Asset } from "@/alpaca/assets/Asset";
import { Alert } from "@/components/ui/forms/Alert";
import { useExecuteTrade } from "@/hooks/useAdminQueries";
import type { TradeFormData, UserData } from "@/types/admin";
import { AdminTradingDisclaimer } from "./AdminTradingDisclaimer";
import { AssetTradingInfo } from "./AssetTradingInfo";
import { TradingForm } from "./TradingForm";
import { UserSelector } from "./UserSelector";

interface AdminTradingSectionProps {
  asset: Asset;
}

export function AdminTradingSection({ asset }: AdminTradingSectionProps) {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeTradeMutation = useExecuteTrade();

  const handleTradeSubmit = async (tradeData: TradeFormData) => {
    if (!selectedUser) {
      setError("Please select a user first");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const result = await executeTradeMutation.mutateAsync({
        userId: selectedUser.uid,
        symbol: asset.symbol,
        ...tradeData,
      });

      setSuccess(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          🛡️ Admin Trading Panel
        </h2>
        <p className="text-sm text-gray-600">
          Execute trades on behalf of users for <strong>{asset.symbol}</strong>
        </p>
        <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
          <strong>Admin Only:</strong> This section is only visible to
          administrators. Use with caution and ensure proper authorization.
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-4">
          <Alert type="error" message={error} onClose={clearMessages} />
        </div>
      )}

      {success && (
        <div className="mb-4">
          <Alert type="success" message={success} onClose={clearMessages} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Selection */}
        <div>
          <UserSelector
            selectedUser={selectedUser}
            onUserSelect={setSelectedUser}
            disabled={executeTradeMutation.isPending}
          />
        </div>

        {/* Trading Form */}
        <div>
          {selectedUser ? (
            <TradingForm
              asset={asset}
              selectedUser={selectedUser}
              onSubmit={handleTradeSubmit}
              disabled={!selectedUser}
              loading={executeTradeMutation.isPending}
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-gray-400 text-4xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a User First
              </h3>
              <p className="text-sm text-gray-600">
                Choose a user from the dropdown above to enable the trading
                form.
              </p>
            </div>
          )}
        </div>
      </div>

      <AssetTradingInfo asset={asset} />
      <AdminTradingDisclaimer />
    </div>
  );
}
