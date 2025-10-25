import type { Asset } from "@/alpaca/assets/Asset";
import { baseUrl, headers } from "@/alpaca/config";

export const getAssets = async () => {
  /**
   * Excerpt from Alpaca docs:
   * https://docs.alpaca.markets/docs/broker-api-faq#how-often-does-alpaca-refresh-the-assets-master
   *
   * --------------------------------------------------
   * How often does Alpaca refresh the assets master?
   * --------------------------------------------------
   *
   * Alpaca refreshes the assets master 3 times per day.
   * The 3 refresh times are outside of market hours,
   * with the last refresh scheduled at 8:20 AM ET.
   *
   * If you are storing the list of assets locally,
   * we recommend refreshing it from Alpaca at least
   * once per day, preferably after 8:20 AM ET but
   * before 9:30 AM ET.
   */

  const assetsUrl = `${baseUrl}/v1/assets`;
  const assetsResponse = await fetch(assetsUrl, {
    method: "GET",
    headers,
  });
  const assetsData = (await assetsResponse.json()) as Asset[];

  return assetsData;
};
