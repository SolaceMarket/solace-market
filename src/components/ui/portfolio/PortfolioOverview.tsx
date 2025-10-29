import type { PortfolioSummary } from "@/data/portfolioTypes";

interface PortfolioOverviewProps {
  summary: PortfolioSummary;
}

export function PortfolioOverview({ summary }: PortfolioOverviewProps) {
  const { portfolio, performance } = summary;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getChangeBg = (value: number) => {
    if (value > 0) return "bg-green-50 border-green-200";
    if (value < 0) return "bg-red-50 border-red-200";
    return "bg-gray-50 border-gray-200";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{portfolio.name}</h1>
            {portfolio.description && (
              <p className="text-blue-100 mt-1">{portfolio.description}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {formatCurrency(performance.current_value)}
            </div>
            <div
              className={`flex items-center mt-1 ${
                performance.day_change >= 0 ? "text-green-200" : "text-red-200"
              }`}
            >
              <svg
                className={`w-4 h-4 mr-1 ${
                  performance.day_change >= 0 ? "rotate-0" : "rotate-180"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {formatCurrency(Math.abs(performance.day_change))} (
              {formatPercent(performance.day_change_percent)})
            </div>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Return */}
          <div
            className={`p-4 rounded-lg border ${getChangeBg(performance.total_return)}`}
          >
            <div className="text-sm font-medium text-gray-600">
              Total Return
            </div>
            <div className="mt-1">
              <div
                className={`text-lg font-semibold ${getChangeColor(performance.total_return)}`}
              >
                {formatCurrency(performance.total_return)}
              </div>
              <div
                className={`text-sm ${getChangeColor(performance.total_return)}`}
              >
                {formatPercent(performance.total_return_percent)}
              </div>
            </div>
          </div>

          {/* Day Change */}
          <div
            className={`p-4 rounded-lg border ${getChangeBg(performance.day_change)}`}
          >
            <div className="text-sm font-medium text-gray-600">Today</div>
            <div className="mt-1">
              <div
                className={`text-lg font-semibold ${getChangeColor(performance.day_change)}`}
              >
                {formatCurrency(performance.day_change)}
              </div>
              <div
                className={`text-sm ${getChangeColor(performance.day_change)}`}
              >
                {formatPercent(performance.day_change_percent)}
              </div>
            </div>
          </div>

          {/* Cash Balance */}
          <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
            <div className="text-sm font-medium text-gray-600">Cash</div>
            <div className="mt-1">
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(portfolio.cash_balance)}
              </div>
              <div className="text-sm text-gray-500">Available</div>
            </div>
          </div>

          {/* Total Invested */}
          <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
            <div className="text-sm font-medium text-gray-600">Invested</div>
            <div className="mt-1">
              <div className="text-lg font-semibold text-blue-900">
                {formatCurrency(performance.total_invested)}
              </div>
              <div className="text-sm text-blue-600">Principal</div>
            </div>
          </div>
        </div>

        {/* Performance Timeline */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Performance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-500">1 Week</div>
              <div
                className={`text-sm font-medium ${getChangeColor(performance.week_change)}`}
              >
                {formatPercent(performance.week_change_percent)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">1 Month</div>
              <div
                className={`text-sm font-medium ${getChangeColor(performance.month_change)}`}
              >
                {formatPercent(performance.month_change_percent)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">1 Year</div>
              <div
                className={`text-sm font-medium ${getChangeColor(performance.year_change)}`}
              >
                {formatPercent(performance.year_change_percent)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">All Time</div>
              <div
                className={`text-sm font-medium ${getChangeColor(performance.total_return)}`}
              >
                {formatPercent(performance.total_return_percent)}
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        {(performance.best_performer || performance.worst_performer) && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Top Performers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {performance.best_performer && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {performance.best_performer.symbol}
                      </div>
                      <div className="text-xs text-gray-600">
                        {performance.best_performer.name}
                      </div>
                    </div>
                    <div className="text-green-600 font-semibold">
                      +{performance.best_performer.return_percent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              )}

              {performance.worst_performer && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {performance.worst_performer.symbol}
                      </div>
                      <div className="text-xs text-gray-600">
                        {performance.worst_performer.name}
                      </div>
                    </div>
                    <div className="text-red-600 font-semibold">
                      {performance.worst_performer.return_percent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
