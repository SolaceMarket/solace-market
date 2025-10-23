import { client } from "@/turso/database";
import type { Asset } from "@/alpaca/assets/Asset";

export interface AssetFilters {
  search?: string;
  exchange?: string;
  class?: string;
  tradable?: boolean;
  marginable?: boolean;
  shortable?: boolean;
  fractionable?: boolean;
  status?: string;
}

export interface AssetListOptions {
  filters: AssetFilters;
  sortBy: "symbol" | "name" | "exchange" | "class";
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}

export interface AssetListResult {
  assets: Asset[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export const getFilteredAssets = async (
  options: AssetListOptions,
): Promise<AssetListResult> => {
  const { filters, sortBy, sortOrder, page, limit } = options;
  const offset = (page - 1) * limit;

  // Build WHERE clause
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters.search) {
    conditions.push("(symbol LIKE ? OR name LIKE ?)");
    params.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters.exchange) {
    conditions.push("exchange = ?");
    params.push(filters.exchange);
  }

  if (filters.class) {
    conditions.push("class = ?");
    params.push(filters.class);
  }

  if (filters.tradable !== undefined) {
    conditions.push("tradable = ?");
    params.push(filters.tradable ? 1 : 0);
  }

  if (filters.marginable !== undefined) {
    conditions.push("marginable = ?");
    params.push(filters.marginable ? 1 : 0);
  }

  if (filters.shortable !== undefined) {
    conditions.push("shortable = ?");
    params.push(filters.shortable ? 1 : 0);
  }

  if (filters.fractionable !== undefined) {
    conditions.push("fractionable = ?");
    params.push(filters.fractionable ? 1 : 0);
  }

  if (filters.status) {
    conditions.push("status = ?");
    params.push(filters.status);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Get total count
  const countQuery = `SELECT COUNT(*) as count FROM assets ${whereClause}`;
  const countResult = await client.execute(countQuery, params);
  const totalCount = countResult.rows[0].count as number;

  // Get assets with pagination
  const assetsQuery = `
    SELECT * FROM assets 
    ${whereClause} 
    ORDER BY ${sortBy} ${sortOrder.toUpperCase()} 
    LIMIT ? OFFSET ?
  `;
  const assetsResult = await client.execute(assetsQuery, [
    ...params,
    limit,
    offset,
  ]);

  return {
    assets: assetsResult.rows as unknown as Asset[],
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
};

export const getAssetsSummary = async () => {
  const [
    totalCount,
    tradableCount,
    marginableCount,
    shortableCount,
    fractionableCount,
    exchangeCounts,
    classCounts,
  ] = await Promise.all([
    client.execute("SELECT COUNT(*) as count FROM assets"),
    client.execute(
      "SELECT COUNT(*) as count FROM assets WHERE tradable = 1 AND status = 'active'",
    ),
    client.execute("SELECT COUNT(*) as count FROM assets WHERE marginable = 1"),
    client.execute("SELECT COUNT(*) as count FROM assets WHERE shortable = 1"),
    client.execute(
      "SELECT COUNT(*) as count FROM assets WHERE fractionable = 1",
    ),
    client.execute(
      "SELECT exchange, COUNT(*) as count FROM assets GROUP BY exchange ORDER BY count DESC LIMIT 10",
    ),
    client.execute(
      "SELECT class, COUNT(*) as count FROM assets GROUP BY class ORDER BY count DESC",
    ),
  ]);

  return {
    total: totalCount.rows[0].count as number,
    tradable: tradableCount.rows[0].count as number,
    marginable: marginableCount.rows[0].count as number,
    shortable: shortableCount.rows[0].count as number,
    fractionable: fractionableCount.rows[0].count as number,
    exchangeBreakdown: exchangeCounts.rows.map((row) => ({
      exchange: row.exchange as string,
      count: row.count as number,
    })),
    classBreakdown: classCounts.rows.map((row) => ({
      class: row.class as string,
      count: row.count as number,
    })),
  };
};
