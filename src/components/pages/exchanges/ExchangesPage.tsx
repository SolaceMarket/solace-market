import { AssetExchanges } from "@/components/pages/assets/AssetsPage/AssetExchanges";
import { getAssetExchanges } from "@/turso/tables/assets/selectAssets";

export async function ExchangesPage() {
  const assetExchanges = await getAssetExchanges();

  return <AssetExchanges {...{ exchanges: assetExchanges }} />;
}
