import { headers } from "@/alpaca/config";
import type { Order } from "@/alpaca/trading/Order";
import { accountOrdersUrl } from "./ordersConfig";

export const createOrder = async (
  accountId: string,
  order: Pick<
    Order,
    "symbol" | "qty" | "side" | "type" | "limit_price" | "time_in_force"
  >,
) => {
  const orderResponse = await fetch(accountOrdersUrl(accountId), {
    method: "POST",
    headers,
    body: JSON.stringify(order),
  });

  const orderData = (await orderResponse.json()) as Order;

  return orderData;
};
