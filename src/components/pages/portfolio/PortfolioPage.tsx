import Link from "next/link";
import { AssetAllocationChart } from "@/components/ui/data/AssetAllocationChart";
import { Navigation } from "@/components/ui/layout/Navigation";
import { PortfolioHoldingsTable } from "@/components/ui/portfolio/PortfolioHoldingsTable";
import { PortfolioOverview } from "@/components/ui/portfolio/PortfolioOverview";
import { RecentTransactions } from "@/components/ui/portfolio/RecentTransactions";
import { getPortfolioSummary } from "@/data/portfolioAnalytics";
import { getPortfoliosByUserId } from "@/data/portfolioService";

interface PortfolioPageProps {
  userId: string;
  portfolioId?: string;
}

export async function PortfolioPage({
  userId,
  portfolioId,
}: PortfolioPageProps) {
  // Get user's portfolios
  const portfolios = await getPortfoliosByUserId(userId);

  if (portfolios.length === 0) {
    return <EmptyPortfolioState />;
  }

  // Use first portfolio if no specific portfolio ID provided
  const selectedPortfolioId = portfolioId || portfolios[0].id;

  // Get portfolio summary
  const summary = await getPortfolioSummary(selectedPortfolioId, userId);

  if (!summary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Portfolio Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The requested portfolio could not be found.
          </p>
          <Link
            href="/portfolio"
            className="mt-4 inline-block text-blue-600 hover:text-blue-900"
          >
            Return to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Selector */}
        {portfolios.length > 1 && (
          <div className="mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Portfolios
                  </h2>
                  <select
                    defaultValue={selectedPortfolioId}
                    className="block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => {
                      if (e.target.value !== selectedPortfolioId) {
                        window.location.href = `/portfolio/${e.target.value}`;
                      }
                    }}
                  >
                    {portfolios.map((portfolio) => (
                      <option key={portfolio.id} value={portfolio.id}>
                        {portfolio.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Link
                  href="/portfolio/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Portfolio
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Overview */}
        <div className="mb-8">
          <PortfolioOverview summary={summary} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Holdings and Transactions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Holdings Table */}
            <PortfolioHoldingsTable holdings={summary.holdings} />

            {/* Recent Transactions */}
            <RecentTransactions transactions={summary.recent_transactions} />
          </div>

          {/* Right Column - Analytics */}
          <div className="space-y-8">
            {/* Asset Allocation */}
            <AssetAllocationChart allocation={summary.allocation} />

            {/* Quick Actions */}
            <QuickActionsCard portfolioId={selectedPortfolioId} />

            {/* Portfolio Stats */}
            <PortfolioStatsCard summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyPortfolioState() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div
        className="flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Your Portfolio
            </h2>
            <p className="text-gray-600 mb-6">
              Start tracking your investments by creating your first portfolio.
            </p>

            <div className="space-y-3">
              <Link
                href="/portfolio/new"
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Your First Portfolio
              </Link>

              <Link
                href="/assets"
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Assets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionsCard({ portfolioId }: { portfolioId: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Link
          href={`/portfolio/${portfolioId}/add-transaction`}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Transaction
        </Link>

        <Link
          href={`/portfolio/${portfolioId}/transactions`}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7l2 2 4-4"
            />
          </svg>
          View All Transactions
        </Link>

        <Link
          href={`/portfolio/${portfolioId}/settings`}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Portfolio Settings
        </Link>
      </div>
    </div>
  );
}

import type { PortfolioSummary } from "@/data/portfolioTypes";

function PortfolioStatsCard({ summary }: { summary: PortfolioSummary }) {
  const { portfolio, holdings, performance } = summary;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  };

  const stats = [
    { label: "Total Holdings", value: holdings.length.toString() },
    { label: "Cash Available", value: formatCurrency(portfolio.cash_balance) },
    {
      label: "Total Invested",
      value: formatCurrency(performance.total_invested),
    },
    {
      label: "Largest Position",
      value: holdings.length > 0 ? holdings[0].symbol : "N/A",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Portfolio Stats
      </h3>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex justify-between items-center">
            <div className="text-sm text-gray-600">{stat.label}</div>
            <div className="text-sm font-medium text-gray-900">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
