import type { Asset } from "@/alpaca/assets/Asset";
import { client } from "@/turso/database";

export type Pagination = {
  limit: number;
  offset: number;
};
export const defaultPagination: Pagination = {
  limit: 50,
  offset: 0,
};
export const getAssets = async (pagination: Pagination) => {
  const queriedAssets = await client.execute(
    "SELECT * FROM assets LIMIT ? OFFSET ?;",
    [pagination.limit, pagination.offset],
  );

  const assets = queriedAssets.rows;
  return assets;
};

export const getAssetsByExchange = async (
  exchange: string,
  pagination: Pagination,
) => {
  const queriedAssets = await client.execute(
    "SELECT * FROM assets WHERE exchange = ? LIMIT ? OFFSET ?;",
    [exchange, pagination.limit, pagination.offset],
  );

  const assets = queriedAssets.rows;
  return assets as unknown as Asset[];
};

export const getTradableAssetsByExchange = async (
  exchange: string,
  pagination: Pagination,
) => {
  const queriedAssets = await client.execute(
    "SELECT * FROM assets WHERE exchange = ? AND tradable=1 AND status='active' LIMIT ? OFFSET ?;",
    [exchange, pagination.limit, pagination.offset],
  );

  const assets = queriedAssets.rows;
  return assets as unknown as Asset[];
};

export const getAllAssets = async () => {
  const queriedAssets = await client.execute("SELECT * FROM assets;");

  const assets = queriedAssets.rows;
  return assets;
};

export const getTradableAssetsCount = async () => {
  const queriedAssets = await client.execute(
    "SELECT COUNT(*) as count FROM assets WHERE tradable=1 and status='active';",
  );

  const countRow = queriedAssets.rows[0];
  const count = countRow.count as number;
  return count;
};

export const getDelistingAssetsCount = async () => {
  const queriedAssets = await client.execute(
    "SELECT COUNT(*) as count FROM assets WHERE tradable=0 and status='active';",
  );
  const countRow = queriedAssets.rows[0];
  const count = countRow.count as number;
  return count;
};

export const getDelistedAssetsCount = async () => {
  const queriedAssets = await client.execute(
    "SELECT COUNT(*) as count FROM assets WHERE tradable = 0 AND status = 'inactive';",
  );

  const countRow = queriedAssets.rows[0];
  const count = countRow.count as number;

  return count;
};

export const getDelistedAssets = async () => {
  const assets = await getAssets(defaultPagination);

  // https://docs.alpaca.markets/docs/broker-api-faq#assets-1
  const delistedAssets = assets.filter(
    (row) => row.tradable === 0 && row.status === "inactive",
  );
  return delistedAssets.map((row) => ({ ...row }));
};

export const getAssetClasses = async () => {
  const queriedAssetClasses = await client.execute(
    "SELECT DISTINCT(class) FROM assets;",
  );
  if (queriedAssetClasses.rows.length === 0) {
    throw new Error("No asset classes found");
  }

  const assetClassRows = queriedAssetClasses.rows;

  // assert all rows have class defined and build classes array
  const assetClasses: string[] = [];
  for (const row of assetClassRows) {
    if (!row.class) {
      throw new Error("Some asset classes are missing");
    }
    assetClasses.push(row.class.toString());
  }

  return assetClasses;
};

export const getAssetExchanges = async () => {
  const queriedAssetExchanges = await client.execute(
    "SELECT DISTINCT(exchange) FROM assets;",
  );

  if (queriedAssetExchanges.rows.length === 0) {
    throw new Error("No exchanges found");
  }

  const assetExchangeRows = queriedAssetExchanges.rows;

  // assert all rows have exchange defined and build exchanges array
  const assetExchanges: string[] = [];
  for (const row of assetExchangeRows) {
    if (!row.exchange) {
      throw new Error("Some asset exchanges are missing");
    }
    assetExchanges.push(row.exchange.toString());
  }

  return assetExchanges;
};

export const getAssetsCountByExchange = async (exchange: string) => {
  const queriedAssets = await client.execute(
    "SELECT COUNT(*) as count FROM assets WHERE exchange = ?;",
    [exchange],
  );

  const countRow = queriedAssets.rows[0];
  const count = countRow.count as number;
  return count;
};
