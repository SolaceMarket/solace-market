import Link from "next/link";
import type { AssetListResult } from "@/data/assetFiltering";

interface ServerAssetsTableProps {
  result: AssetListResult;
  currentPage: number;
}

function PaginationLink({
  href,
  children,
  isActive = false,
  isDisabled = false,
}: {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
}) {
  if (isDisabled) {
    return (
      <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-white border border-gray-300 cursor-not-allowed">
        {children}
      </span>
    );
  }

  if (isActive) {
    return (
      <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
    >
      {children}
    </Link>
  );
}

export function ServerAssetsTable({
  result,
  currentPage,
}: ServerAssetsTableProps) {
  const { assets, totalCount, totalPages } = result;

  const currentUrl =
    typeof window !== "undefined" ? window.location.search : "";
  const baseParams = new URLSearchParams(currentUrl);

  const generatePageUrlServer = (page: number) => {
    const params = new URLSearchParams(baseParams);
    params.set("page", page.toString());
    return `/assets?${params.toString()}`;
  };

  const limit = 50; // Default limit used in the component

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Assets ({totalCount.toLocaleString()})
          </h3>
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * limit + 1).toLocaleString()} to{" "}
            {Math.min(currentPage * limit, totalCount).toLocaleString()} of{" "}
            {totalCount.toLocaleString()} results
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Symbol
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Exchange
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Class
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Features
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.map((asset, index) => (
              <tr
                key={asset.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/assets/${asset.symbol}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-900"
                  >
                    {asset.symbol}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{asset.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/exchanges/${asset.exchange}`}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    {asset.exchange}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {asset.class}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {asset.tradable && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Tradable
                      </span>
                    )}
                    {asset.marginable && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Marginable
                      </span>
                    )}
                    {asset.shortable && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Shortable
                      </span>
                    )}
                    {asset.fractionable && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Fractionable
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <PaginationLink
              href={generatePageUrlServer(Math.max(1, currentPage - 1))}
              isDisabled={currentPage <= 1}
            >
              Previous
            </PaginationLink>
            <PaginationLink
              href={generatePageUrlServer(
                Math.min(totalPages, currentPage + 1),
              )}
              isDisabled={currentPage >= totalPages}
            >
              Next
            </PaginationLink>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <PaginationLink
                  href={generatePageUrlServer(Math.max(1, currentPage - 1))}
                  isDisabled={currentPage <= 1}
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </PaginationLink>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <PaginationLink
                      key={pageNum}
                      href={generatePageUrlServer(pageNum)}
                      isActive={pageNum === currentPage}
                    >
                      {pageNum}
                    </PaginationLink>
                  );
                })}

                <PaginationLink
                  href={generatePageUrlServer(
                    Math.min(totalPages, currentPage + 1),
                  )}
                  isDisabled={currentPage >= totalPages}
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </PaginationLink>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
