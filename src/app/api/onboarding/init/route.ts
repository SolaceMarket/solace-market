import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authMiddleware";
import { createUser, getUser } from "@/lib/tursoUsers";
import type {
  InitOnboardingRequest,
  InitOnboardingResponse,
  Locale,
} from "@/types/onboarding";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request);
    if (!("uid" in authResult)) {
      return authResult; // Return the error response
    }
    const { uid } = authResult;

    const body: InitOnboardingRequest = await request.json();

    // Validate request
    if (!body.email) {
      return NextResponse.json(
        { error: "Validation error", message: "Email is required" },
        { status: 400 },
      );
    }

    // Ensure the UID matches the authenticated user
    if (body.uid !== uid) {
      return NextResponse.json(
        { error: "Forbidden", message: "UID mismatch" },
        { status: 403 },
      );
    }

    // Determine locale from request or default to German
    const locale: Locale = body.locale || "de";

    // Create or get existing user (idempotent)
    let user = await getUser(uid);

    if (!user) {
      user = await createUser(uid, body.email, locale);

      // TODO: Fire analytics event
      console.log("Onboarding started", { uid, email: body.email, locale });
    } else {
      console.log("Onboarding state retrieved", {
        uid,
        currentStep: user.onboarding.currentStep,
      });
    }

    const response: InitOnboardingResponse = {
      success: true,
      user,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Onboarding init error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to initialize onboarding",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request);
    if (!("uid" in authResult)) {
      return authResult; // Return the error response
    }
    const { uid } = authResult;

    // Get existing user
    const user = await getUser(uid);

    if (!user) {
      return NextResponse.json(
        { error: "Not found", message: "User not found" },
        { status: 404 },
      );
    }

    const response: InitOnboardingResponse = {
      success: true,
      user,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get onboarding state error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to get onboarding state",
      },
      { status: 500 },
    );
  }
}
