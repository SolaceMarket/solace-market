import { AssetPage } from "@/components/pages/assets/AssetPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AssetPage symbol={slug} />;
}
