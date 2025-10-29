import { AssetsSummary } from "@/components/ui/AssetsSummary";
import { Navigation } from "@/components/ui/Navigation";
import {
  type AssetFilters,
  getAssetsSummary,
  getFilteredAssets,
} from "@/data/assetFiltering";
import {
  getAssetClasses,
  getAssetExchanges,
} from "@/turso/tables/assets/selectAssets";
import { ServerAssetsTable } from "../../../ui/ServerAssetsTable";
import { ServerSearchAndFilters } from "../../../ui/ServerSearchAndFilters";

interface AssetsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function parseSearchParams(
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>,
): Promise<{
  filters: AssetFilters;
  sortBy: "symbol" | "name" | "exchange" | "class";
  sortOrder: "asc" | "desc";
  page: number;
}> {
  const params = await searchParams;
  const filters: AssetFilters = {};

  // Parse search term
  if (params.search && typeof params.search === "string") {
    filters.search = params.search;
  }

  // Parse exchange filter
  if (params.exchange && typeof params.exchange === "string") {
    filters.exchange = params.exchange;
  }

  // Parse class filter
  if (params.class && typeof params.class === "string") {
    filters.class = params.class;
  }

  // Parse boolean filters
  if (params.tradable === "true") filters.tradable = true;
  if (params.marginable === "true") filters.marginable = true;
  if (params.shortable === "true") filters.shortable = true;
  if (params.fractionable === "true") filters.fractionable = true;

  // Parse sorting
  const sortBy =
    typeof params.sortBy === "string" &&
    ["symbol", "name", "exchange", "class"].includes(params.sortBy)
      ? (params.sortBy as "symbol" | "name" | "exchange" | "class")
      : "symbol";

  const sortOrder =
    typeof params.sortOrder === "string" &&
    ["asc", "desc"].includes(params.sortOrder)
      ? (params.sortOrder as "asc" | "desc")
      : "asc";

  // Parse page
  const page =
    typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1;

  return { filters, sortBy, sortOrder, page };
}

export async function AssetsPage({ searchParams }: AssetsPageProps) {
  const { filters, sortBy, sortOrder, page } =
    await parseSearchParams(searchParams);

  // Load all data in parallel
  const [summary, exchanges, classes, result] = await Promise.all([
    getAssetsSummary(),
    getAssetExchanges(),
    getAssetClasses(),
    getFilteredAssets({
      filters,
      sortBy,
      sortOrder,
      page,
      limit: 50,
    }),
  ]);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Available Assets
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Discover and analyze securities across multiple exchanges
            </p>
          </div>

          {/* Summary Dashboard */}
          <AssetsSummary summary={summary} />

          {/* Search and Filters */}
          <ServerSearchAndFilters
            exchanges={exchanges}
            classes={classes}
            currentFilters={filters}
            currentSort={{ sortBy, sortOrder }}
          />

          {/* Assets Table */}
          <div className="mb-8">
            <ServerAssetsTable result={result} currentPage={page} />
          </div>
        </div>
      </div>
    </>
  );
}
