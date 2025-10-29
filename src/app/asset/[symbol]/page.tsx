import { AssetSwapPage } from "@/components/pages/AssetSwapPage";

interface AssetPageProps {
  params: Promise<{ symbol: string }>;
}

export default async function AssetPage({ params }: AssetPageProps) {
  const { symbol } = await params;
  return <AssetSwapPage symbol={symbol} />;
}
