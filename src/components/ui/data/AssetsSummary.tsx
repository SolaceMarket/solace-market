interface AssetsSummaryProps {
  summary: {
    total: number;
    tradable: number;
    marginable: number;
    shortable: number;
    fractionable: number;
    exchangeBreakdown: { exchange: string; count: number }[];
    classBreakdown: { class: string; count: number }[];
  };
}

export function AssetsSummary({ summary }: AssetsSummaryProps) {
  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (value: number, total: number) =>
    `${((value / total) * 100).toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Key Statistics */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Asset Overview
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {formatNumber(summary.total)}
              </div>
              <div className="text-sm text-gray-600">Total Assets</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {formatNumber(summary.tradable)}
              </div>
              <div className="text-sm text-gray-600">Tradable Assets</div>
              <div className="text-xs text-gray-500">
                {formatPercentage(summary.tradable, summary.total)}
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {formatNumber(summary.marginable)}
              </div>
              <div className="text-sm text-gray-600">Marginable</div>
              <div className="text-xs text-gray-500">
                {formatPercentage(summary.marginable, summary.total)}
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {formatNumber(summary.shortable)}
              </div>
              <div className="text-sm text-gray-600">Shortable</div>
              <div className="text-xs text-gray-500">
                {formatPercentage(summary.shortable, summary.total)}
              </div>
            </div>
          </div>

          {/* Feature Availability */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Feature Availability
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tradable Assets</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(summary.tradable / summary.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {formatPercentage(summary.tradable, summary.total)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Margin Trading</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{
                        width: `${(summary.marginable / summary.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {formatPercentage(summary.marginable, summary.total)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Short Selling</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${(summary.shortable / summary.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {formatPercentage(summary.shortable, summary.total)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fractional Shares</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(summary.fractionable / summary.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {formatPercentage(summary.fractionable, summary.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="space-y-6">
        {/* Top Exchanges */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Exchanges
          </h3>
          <div className="space-y-3">
            {summary.exchangeBreakdown.slice(0, 5).map((item) => (
              <div
                key={item.exchange}
                className="flex items-center justify-between"
              >
                <a
                  href={`/exchanges/${item.exchange}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {item.exchange}
                </a>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(item.count / summary.exchangeBreakdown[0].count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-12 text-right">
                    {formatNumber(item.count)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a
              href="/exchanges"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all exchanges →
            </a>
          </div>
        </div>

        {/* Asset Classes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Asset Classes
          </h3>
          <div className="space-y-3">
            {summary.classBreakdown.map((item) => (
              <div
                key={item.class}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-700 font-medium capitalize">
                  {item.class.replace("_", " ")}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(item.count / summary.classBreakdown[0].count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 w-12 text-right">
                    {formatNumber(item.count)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
