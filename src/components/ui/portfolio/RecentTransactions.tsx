import Link from "next/link";
import type { TransactionWithAsset } from "@/data/portfolioTypes";

interface RecentTransactionsProps {
  transactions: TransactionWithAsset[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatQuantity = (value: number) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "buy":
        return "bg-green-100 text-green-800";
      case "sell":
        return "bg-red-100 text-red-800";
      case "dividend":
        return "bg-blue-100 text-blue-800";
      case "deposit":
        return "bg-yellow-100 text-yellow-800";
      case "withdrawal":
        return "bg-orange-100 text-orange-800";
      case "fee":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Recent Transactions
        </h3>
        <div className="text-center text-gray-500 py-8">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <p>No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Transactions
          </h3>
          <Link
            href="/portfolio/transactions"
            className="text-sm text-blue-600 hover:text-blue-900"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Transaction Type Badge */}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}
                >
                  {getTransactionTypeLabel(transaction.type)}
                </span>

                {/* Transaction Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    {transaction.symbol && (
                      <Link
                        href={`/assets/${transaction.symbol}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-900"
                      >
                        {transaction.symbol}
                      </Link>
                    )}
                    {transaction.asset_name && (
                      <span className="text-sm text-gray-500 truncate max-w-[200px]">
                        {transaction.asset_name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 mt-1">
                    {transaction.quantity > 0 && (
                      <span className="text-xs text-gray-500">
                        Qty: {formatQuantity(transaction.quantity)}
                      </span>
                    )}
                    {transaction.price > 0 && (
                      <span className="text-xs text-gray-500">
                        @ {formatCurrency(transaction.price)}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatDate(transaction.transaction_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transaction Value */}
              <div className="text-right">
                <div
                  className={`text-sm font-medium ${
                    transaction.type === "buy" ||
                    transaction.type === "withdrawal" ||
                    transaction.type === "fee"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {transaction.type === "buy" ||
                  transaction.type === "withdrawal" ||
                  transaction.type === "fee"
                    ? "-"
                    : "+"}
                  {formatCurrency(Math.abs(transaction.total_value))}
                </div>
                {transaction.fee > 0 && (
                  <div className="text-xs text-gray-500">
                    Fee: {formatCurrency(transaction.fee)}
                  </div>
                )}
              </div>
            </div>

            {/* Transaction Notes */}
            {transaction.notes && (
              <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded p-2">
                {transaction.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View All Link */}
      {transactions.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <Link
            href="/portfolio/transactions"
            className="w-full text-center block text-sm text-blue-600 hover:text-blue-900 font-medium"
          >
            View All Transactions →
          </Link>
        </div>
      )}
    </div>
  );
}
