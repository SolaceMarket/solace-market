import { baseUrl } from "@/alpaca/config";

export const accountsUrl = `${baseUrl}/v1/accounts`;
export const accountUrl = (accountId: string) =>
  `${baseUrl}/v1/accounts/urn:uuid:${accountId}`;
