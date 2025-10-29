interface QuickStatsProps {
  stats: {
    totalAssets: number;
    tradableAssets: number;
    inactiveAssets: number;
    marginableAssets: number;
    shortableAssets: number;
    fractionableAssets: number;
    tradabilityRate: number;
  };
}

export function QuickStats({ stats }: QuickStatsProps) {
  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercentage = (num: number) => `${num.toFixed(1)}%`;

  const quickStats = [
    {
      label: "Total Assets",
      value: formatNumber(stats.totalAssets),
      icon: "📊",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Active Trading",
      value: formatNumber(stats.tradableAssets),
      icon: "📈",
      color: "bg-green-50 text-green-700",
    },
    {
      label: "Margin Trading",
      value: formatNumber(stats.marginableAssets),
      icon: "💰",
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      label: "Short Selling",
      value: formatNumber(stats.shortableAssets),
      icon: "📉",
      color: "bg-red-50 text-red-700",
    },
    {
      label: "Fractional",
      value: formatNumber(stats.fractionableAssets),
      icon: "🧩",
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Tradability",
      value: formatPercentage(stats.tradabilityRate),
      icon: "⚡",
      color: "bg-indigo-50 text-indigo-700",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
      <div className="space-y-4">
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm ${stat.color}`}
              >
                {stat.icon}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {stat.label}
              </span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
