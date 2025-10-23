import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { client } from "@/turso/database";
import { verifyAdminAccess } from "@/lib/adminMiddleware";

// Get paginated users with filters
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
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const jurisdiction = searchParams.get("jurisdiction") || "";

    const offset = (page - 1) * limit;

    // Build SQL query with filters
    let whereClause = "";
    const args: (string | number)[] = [];
    const conditions: string[] = [];

    if (search) {
      conditions.push(
        "(email LIKE ? OR uid LIKE ? OR wallet_public_key LIKE ?)",
      );
      args.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status) {
      if (status === "completed") {
        conditions.push("onboarding_completed = 1");
      } else if (status === "in-progress") {
        conditions.push("onboarding_completed = 0");
      } else {
        conditions.push("onboarding_current_step = ?");
        args.push(status);
      }
    }

    if (jurisdiction) {
      conditions.push("jurisdiction = ?");
      args.push(jurisdiction);
    }

    if (conditions.length > 0) {
      whereClause = " WHERE " + conditions.join(" AND ");
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users${whereClause}`;
    const countResult = await client.execute({
      sql: countQuery,
      args: args,
    });
    const total = countResult.rows[0].total as number;

    // Get paginated users
    const usersQuery = `
      SELECT * FROM users${whereClause} 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    const usersResult = await client.execute({
      sql: usersQuery,
      args: [...args, limit, offset],
    });

    const users = usersResult.rows.map((row) => ({
      uid: row.uid,
      email: row.email,
      createdAt: row.created_at,
      locale: row.locale,
      jurisdiction: row.jurisdiction,
      onboarding: {
        currentStep: row.onboarding_current_step,
        completed: Boolean(row.onboarding_completed),
        completedAt: row.onboarding_completed_at,
        lastActivityAt: row.onboarding_last_activity_at,
      },
      profile: row.profile_first_name
        ? {
            firstName: row.profile_first_name,
            lastName: row.profile_last_name,
            country: row.profile_country,
          }
        : null,
      wallet: row.wallet_public_key
        ? {
            chain: row.wallet_chain,
            publicKey: row.wallet_public_key,
            verifiedAt: row.wallet_verified_at,
          }
        : null,
      kyc: row.kyc_provider
        ? {
            provider: row.kyc_provider,
            status: row.kyc_status,
            lastCheckedAt: row.kyc_last_checked_at,
          }
        : null,
      broker: row.broker_provider
        ? {
            provider: row.broker_provider,
            subAccountId: row.broker_sub_account_id,
            status: row.broker_status,
          }
        : null,
    }));

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin users list error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
