import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAdminAccess } from "@/lib/adminMiddleware";
import { createOrder } from "@/alpaca/trading/createOrder";

interface TradeRequest {
  userId: string;
  symbol: string;
  side: "buy" | "sell";
  type: "market" | "limit" | "stop" | "stop_limit";
  qty: string;
  limit_price?: string;
  stop_price?: string;
  time_in_force: "day" | "gtc" | "ioc" | "fok";
  extended_hours: boolean;
}

// POST /api/admin/trade - Execute a trade on behalf of a user
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication and authorization
    const adminResult = await verifyAdminAccess(request);
    if (!adminResult.isValid && adminResult.error) {
      return adminResult.error;
    }

    const body = (await request.json()) as TradeRequest;

    // Validate required fields
    if (!body.userId || !body.symbol || !body.side || !body.type || !body.qty) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "userId, symbol, side, type, and qty are required",
        },
        { status: 400 },
      );
    }

    // Validate quantity
    const qty = parseFloat(body.qty);
    if (Number.isNaN(qty) || qty <= 0) {
      return NextResponse.json(
        {
          error: "Invalid quantity",
          message: "Quantity must be a positive number",
        },
        { status: 400 },
      );
    }

    // Validate limit price for limit orders
    if (
      (body.type === "limit" || body.type === "stop_limit") &&
      !body.limit_price
    ) {
      return NextResponse.json(
        {
          error: "Missing limit price",
          message: "Limit price is required for limit and stop-limit orders",
        },
        { status: 400 },
      );
    }

    // Validate stop price for stop orders
    if (
      (body.type === "stop" || body.type === "stop_limit") &&
      !body.stop_price
    ) {
      return NextResponse.json(
        {
          error: "Missing stop price",
          message: "Stop price is required for stop and stop-limit orders",
        },
        { status: 400 },
      );
    }

    // Get user's broker account ID from database
    const { client } = await import("@/turso/database");
    const userResult = await client.execute({
      sql: "SELECT broker_sub_account_id, broker_status FROM users WHERE uid = ?",
      args: [body.userId],
    });

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        {
          error: "User not found",
          message: "The specified user could not be found",
        },
        { status: 404 },
      );
    }

    const user = userResult.rows[0];
    if (!user.broker_sub_account_id || user.broker_status !== "active") {
      return NextResponse.json(
        {
          error: "User broker account not active",
          message: "The user does not have an active broker account",
        },
        { status: 400 },
      );
    }

    // Prepare order data for Alpaca API (matching the Pick interface)
    const orderData: Pick<
      import("@/alpaca/trading/Order").Order,
      "symbol" | "qty" | "side" | "type" | "limit_price" | "time_in_force"
    > = {
      symbol: body.symbol.toUpperCase(),
      qty: body.qty,
      side: body.side,
      type: body.type,
      time_in_force: body.time_in_force,
      limit_price: body.limit_price || "", // Provide default empty string
    };

    // Execute the trade through Alpaca
    const order = await createOrder(
      user.broker_sub_account_id as string,
      orderData,
    );

    // Log the admin trade action
    console.log("Admin trade executed:", {
      adminUid: adminResult.uid,
      userId: body.userId,
      symbol: body.symbol,
      side: body.side,
      qty: body.qty,
      orderId: order.id,
      timestamp: new Date().toISOString(),
    });

    // Return the order details
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        symbol: order.symbol,
        side: order.side,
        qty: order.qty,
        type: order.type,
        status: order.status,
        created_at: order.created_at,
        limit_price: order.limit_price,
        stop_price: order.stop_price,
        time_in_force: order.time_in_force,
      },
      message: `${body.side.toUpperCase()} order for ${body.qty} shares of ${body.symbol} placed successfully`,
    });
  } catch (error) {
    console.error("Admin trade execution error:", error);

    // Handle specific Alpaca API errors
    if (error instanceof Error) {
      // Check if it's an Alpaca API error
      if (error.message.includes("insufficient")) {
        return NextResponse.json(
          {
            error: "Insufficient funds",
            message: "The user account has insufficient funds for this trade",
          },
          { status: 400 },
        );
      }

      if (error.message.includes("not tradable")) {
        return NextResponse.json(
          {
            error: "Asset not tradable",
            message: "The specified asset is not currently tradable",
          },
          { status: 400 },
        );
      }

      if (error.message.includes("market closed")) {
        return NextResponse.json(
          {
            error: "Market closed",
            message: "The market is currently closed for this asset",
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Trade execution failed",
        message: "An error occurred while executing the trade",
      },
      { status: 500 },
    );
  }
}
