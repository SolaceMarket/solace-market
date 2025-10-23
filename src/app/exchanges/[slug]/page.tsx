import { ExchangePage } from "@/components/pages/exchanges/ExchangePage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ExchangePage name={slug} />;
}
