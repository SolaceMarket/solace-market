import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { client } from "@/turso/database";
import { verifyAdminAccess } from "@/lib/adminMiddleware";

// Get paginated assets with search and filters
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication and authorization
    const adminResult = await verifyAdminAccess(request);
    if (!adminResult.isValid && adminResult.error) {
      return adminResult.error;
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const search = searchParams.get("search") || "";
    const assetClass = searchParams.get("class") || "";
    const exchange = searchParams.get("exchange") || "";
    const status = searchParams.get("status") || "";
    const tradable = searchParams.get("tradable") || "";

    const offset = (page - 1) * limit;

    // Build SQL query with filters
    let whereClause = "";
    const args: (string | number | boolean)[] = [];
    const conditions: string[] = [];

    if (search) {
      conditions.push("(symbol LIKE ? OR name LIKE ? OR id LIKE ?)");
      args.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (assetClass) {
      conditions.push("class = ?");
      args.push(assetClass);
    }

    if (exchange) {
      conditions.push("exchange = ?");
      args.push(exchange);
    }

    if (status) {
      conditions.push("status = ?");
      args.push(status);
    }

    if (tradable) {
      conditions.push("tradable = ?");
      args.push(tradable === "true" ? 1 : 0);
    }

    if (conditions.length > 0) {
      whereClause = " WHERE " + conditions.join(" AND ");
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM assets${whereClause}`;
    const countResult = await client.execute({
      sql: countQuery,
      args: args,
    });
    const total = countResult.rows[0].total as number;

    // Get paginated assets
    const assetsQuery = `
      SELECT * FROM assets${whereClause} 
      ORDER BY updated_at DESC, symbol ASC
      LIMIT ? OFFSET ?
    `;
    const assetsResult = await client.execute({
      sql: assetsQuery,
      args: [...args, limit, offset],
    });

    const assets = assetsResult.rows.map((row) => ({
      id: row.id,
      class: row.class,
      exchange: row.exchange,
      symbol: row.symbol,
      name: row.name,
      status: row.status,
      tradable: Boolean(row.tradable),
      marginable: Boolean(row.marginable),
      maintenanceMarginRequirement: Number(
        row.maintenance_margin_requirement || 0,
      ),
      marginRequirementLong: row.margin_requirement_long || "0",
      marginRequirementShort: row.margin_requirement_short || "0",
      shortable: row.shortable ? Boolean(row.shortable) : undefined,
      easyToBorrow: row.easy_to_borrow
        ? Boolean(row.easy_to_borrow)
        : undefined,
      fractionable: row.fractionable ? Boolean(row.fractionable) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json({
      assets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin assets list error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to fetch assets" },
      { status: 500 },
    );
  }
}
