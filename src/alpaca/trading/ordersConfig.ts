import { baseUrl } from "@/alpaca/config";

export const accountOrdersUrl = (accountId: string) =>
  `${baseUrl}/v1/trading/accounts/${accountId}/orders`;
