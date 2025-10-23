import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "@/firebase/getAuthenticatedAppForUser";
import { createPortfolio } from "@/data/portfolioService";
import type { CreatePortfolioRequest } from "@/data/portfolioTypes";

export async function POST(request: NextRequest) {
  try {
    const { currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreatePortfolioRequest;

    // Validate required fields
    if (!body.name || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: "Portfolio name is required" },
        { status: 400 },
      );
    }

    // Create the portfolio
    const portfolio = await createPortfolio(currentUser.uid, {
      name: body.name.trim(),
      description: body.description?.trim(),
      initial_cash: body.initial_cash || 0,
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // This would be implemented to get user's portfolios
    // For now, just return success
    return NextResponse.json({ message: "Portfolio API is working" });
  } catch (error) {
    console.error("Error accessing portfolios:", error);
    return NextResponse.json(
      { error: "Failed to access portfolios" },
      { status: 500 },
    );
  }
}
