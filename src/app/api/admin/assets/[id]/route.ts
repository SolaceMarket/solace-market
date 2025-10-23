import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { client } from "@/turso/database";
import { verifyAdminAccess } from "@/lib/adminMiddleware";

// Get single asset by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Verify admin authentication and authorization
    const adminResult = await verifyAdminAccess(request);
    if (!adminResult.isValid && adminResult.error) {
      return adminResult.error;
    }

    const assetId = params.id;
    if (!assetId) {
      return NextResponse.json(
        { error: "Bad Request", message: "Asset ID is required" },
        { status: 400 },
      );
    }

    // Get asset by ID
    const assetQuery = "SELECT * FROM assets WHERE id = ?";
    const assetResult = await client.execute({
      sql: assetQuery,
      args: [assetId],
    });

    if (assetResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Not Found", message: "Asset not found" },
        { status: 404 },
      );
    }

    const row = assetResult.rows[0];
    const asset = {
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
      attributes: row.attributes || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    return NextResponse.json({ asset });
  } catch (error) {
    console.error("Admin asset details error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch asset details",
      },
      { status: 500 },
    );
  }
}
