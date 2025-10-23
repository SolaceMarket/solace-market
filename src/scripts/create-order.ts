import { createOrder } from "@/alpaca/trading/createOrder";

const order = await createOrder("d0833dbb-27fb-4e17-ae54-a330c5e7956e", {
  symbol: "AAPL",
  qty: "2",
  side: "buy",
  type: "limit",
  limit_price: "150",
  time_in_force: "gtc",
});
console.log("Created order:", order);
