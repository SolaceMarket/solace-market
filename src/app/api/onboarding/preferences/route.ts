import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authMiddleware";
import {
  savePreferences,
  updateOnboardingStep,
  getUser,
} from "@/lib/tursoUsers";
import type {
  PreferencesRequest,
  PreferencesResponse,
  UserPreferences,
  Theme,
  DefaultQuote,
} from "@/types/onboarding";

function validatePreferences(preferences: unknown): boolean {
  if (!preferences || typeof preferences !== "object") return false;

  const prefs = preferences as Record<string, unknown>;

  // Check required boolean fields
  const booleanFields = [
    "news",
    "orderFills",
    "riskAlerts",
    "statements",
    "hintsEnabled",
  ];
  for (const field of booleanFields) {
    if (typeof prefs[field] !== "boolean") {
      return false;
    }
  }

  // Validate theme
  const validThemes: Theme[] = ["dark", "light"];
  if (!validThemes.includes(prefs.theme as Theme)) {
    return false;
  }

  // Validate default quote
  const validQuotes: DefaultQuote[] = ["USDC", "EUR", "USD"];
  if (!validQuotes.includes(prefs.defaultQuote as DefaultQuote)) {
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request);
    if (!("uid" in authResult)) {
      return authResult; // Return the error response
    }
    const { uid } = authResult;

    const body: PreferencesRequest = await request.json();

    // Validate request
    if (body.uid !== uid) {
      return NextResponse.json(
        { error: "Forbidden", message: "UID mismatch" },
        { status: 403 },
      );
    }

    if (!validatePreferences(body.preferences)) {
      return NextResponse.json(
        { error: "Validation error", message: "Invalid preferences data" },
        { status: 400 },
      );
    }

    // Verify user exists and required steps are completed
    const user = await getUser(uid);
    if (!user) {
      return NextResponse.json(
        { error: "Not found", message: "User not found" },
        { status: 404 },
      );
    }

    if (!user.onboarding.completedSteps.includes("security")) {
      return NextResponse.json(
        {
          error: "Precondition failed",
          message: "Security setup must be completed first",
        },
        { status: 412 },
      );
    }

    // Save preferences
    await savePreferences(uid, body.preferences);

    // Update onboarding step
    await updateOnboardingStep(uid, "preferences", true);

    // TODO: Fire analytics event
    console.log("Preferences saved", {
      uid,
      theme: body.preferences.theme,
      defaultQuote: body.preferences.defaultQuote,
      notifications: {
        news: body.preferences.news,
        orderFills: body.preferences.orderFills,
        riskAlerts: body.preferences.riskAlerts,
        statements: body.preferences.statements,
      },
    });

    const response: PreferencesResponse = {
      success: true,
      preferences: body.preferences,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Preferences error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to save preferences",
      },
      { status: 500 },
    );
  }
}

// Get current preferences
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request);
    if (!("uid" in authResult)) {
      return authResult; // Return the error response
    }
    const { uid } = authResult;

    // Get user preferences
    const user = await getUser(uid);
    if (!user) {
      return NextResponse.json(
        { error: "Not found", message: "User not found" },
        { status: 404 },
      );
    }

    // Return default preferences if not set
    const defaultPreferences: UserPreferences = {
      news: true,
      orderFills: true,
      riskAlerts: true,
      statements: true,
      theme: "dark",
      defaultQuote: "USDC",
      hintsEnabled: true,
    };

    const preferences = user.preferences || defaultPreferences;

    const response: PreferencesResponse = {
      success: true,
      preferences,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get preferences error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to get preferences",
      },
      { status: 500 },
    );
  }
}
