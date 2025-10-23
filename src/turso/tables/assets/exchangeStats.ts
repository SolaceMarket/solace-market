import { client } from "@/turso/database";

export interface ExchangeStats {
  totalAssets: number;
  tradableAssets: number;
  inactiveAssets: number;
  assetClasses: { class: string; count: number }[];
  tradabilityRate: number;
  marginableAssets: number;
  shortableAssets: number;
  fractionableAssets: number;
  easyToBorrowAssets: number;
}

export interface ExchangeRanking {
  exchange: string;
  totalAssets: number;
  tradableAssets: number;
  tradabilityRate: number;
  rank: number;
}

export const getExchangeStats = async (
  exchange: string,
): Promise<ExchangeStats> => {
  // Get total assets count
  const totalAssetsQuery = await client.execute(
    "SELECT COUNT(*) as count FROM assets WHERE exchange = ?",
    [exchange],
  );
  const totalAssets = totalAssetsQuery.rows[0].count as number;

  // Get tradable assets count
  const tradableAssetsQuery = await client.execute(
    "SELECT COUNT(*) as count FROM assets WHERE exchange = ? AND tradable = 1 AND status = 'active'",
    [exchange],
  );
  const tradableAssets = tradableAssetsQuery.rows[0].count as number;

  // Get inactive assets count
  const inactiveAssetsQuery = await client.execute(
    "SELECT COUNT(*) as count FROM assets WHERE exchange = ? AND status = 'inactive'",
    [exchange],
  );
  const inactiveAssets = inactiveAssetsQuery.rows[0].count as number;

  // Get asset classes distribution
  const assetClassesQuery = await client.execute(
    "SELECT class, COUNT(*) as count FROM assets WHERE exchange = ? GROUP BY class ORDER BY count DESC",
    [exchange],
  );
  const assetClasses = assetClassesQuery.rows.map((row) => ({
    class: row.class as string,
    count: row.count as number,
  }));

  // Get marginable assets count
  const marginableAssetsQuery = await client.execute(
    "SELECT COUNT(*) as count FROM assets WHERE exchange = ? AND marginable = 1",
    [exchange],
  );
  const marginableAssets = marginableAssetsQuery.rows[0].count as number;

  // Get shortable assets count
  const shortableAssetsQuery = await client.execute(
    "SELECT COUNT(*) as count FROM assets WHERE exchange = ? AND shortable = 1",
    [exchange],
  );
  const shortableAssets = shortableAssetsQuery.rows[0].count as number;

  // Get fractionable assets count
  const fractionableAssetsQuery = await client.execute(
    "SELECT COUNT(*) as count FROM assets WHERE exchange = ? AND fractionable = 1",
    [exchange],
  );
  const fractionableAssets = fractionableAssetsQuery.rows[0].count as number;

  // Get easy to borrow assets count
  const easyToBorrowAssetsQuery = await client.execute(
    "SELECT COUNT(*) as count FROM assets WHERE exchange = ? AND easy_to_borrow = 1",
    [exchange],
  );
  const easyToBorrowAssets = easyToBorrowAssetsQuery.rows[0].count as number;

  const tradabilityRate =
    totalAssets > 0 ? (tradableAssets / totalAssets) * 100 : 0;

  return {
    totalAssets,
    tradableAssets,
    inactiveAssets,
    assetClasses,
    tradabilityRate,
    marginableAssets,
    shortableAssets,
    fractionableAssets,
    easyToBorrowAssets,
  };
};

export const getExchangeRankings = async (): Promise<ExchangeRanking[]> => {
  const rankingsQuery = await client.execute(`
    SELECT 
      exchange,
      COUNT(*) as total_assets,
      SUM(CASE WHEN tradable = 1 AND status = 'active' THEN 1 ELSE 0 END) as tradable_assets
    FROM assets 
    GROUP BY exchange 
    ORDER BY total_assets DESC
  `);

  const rankings = rankingsQuery.rows.map((row, index) => {
    const totalAssets = row.total_assets as number;
    const tradableAssets = row.tradable_assets as number;
    const tradabilityRate =
      totalAssets > 0 ? (tradableAssets / totalAssets) * 100 : 0;

    return {
      exchange: row.exchange as string,
      totalAssets,
      tradableAssets,
      tradabilityRate,
      rank: index + 1,
    };
  });

  return rankings;
};

export const getExchangeComparison = async (exchange: string) => {
  const rankings = await getExchangeRankings();
  const currentExchange = rankings.find((r) => r.exchange === exchange);
  const totalExchanges = rankings.length;

  return {
    currentRank: currentExchange?.rank || 0,
    totalExchanges,
    rankings: rankings.slice(0, 10), // Top 10 exchanges
  };
};
