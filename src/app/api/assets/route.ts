import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAllAssets } from "@/data/mockAssets";

// Use centralized mock data
const allAssets = getAllAssets();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // If no query, return all assets with pagination
    if (!query) {
      const paginatedAssets = allAssets.slice(offset, offset + limit);
      return NextResponse.json({
        success: true,
        data: paginatedAssets,
        total: allAssets.length,
        hasMore: offset + limit < allAssets.length,
      });
    }

    // Search assets by symbol, name, or category
    const filteredAssets = allAssets.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query) ||
        asset.category.toLowerCase().includes(query) ||
        asset.market.toLowerCase().includes(query),
    );

    // Apply pagination to filtered results
    const paginatedResults = filteredAssets.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedResults,
      total: filteredAssets.length,
      hasMore: offset + limit < filteredAssets.length,
      query,
    });
  } catch (error) {
    console.error("Assets API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch assets",
      },
      { status: 500 },
    );
  }
}
