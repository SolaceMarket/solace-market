import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authMiddleware";
import { updateOnboardingStep, getUser } from "@/lib/tursoUsers";
import type { UpdateStepRequest, UpdateStepResponse } from "@/types/onboarding";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request);
    if (!("uid" in authResult)) {
      return authResult; // Return the error response
    }
    const { uid } = authResult;

    const body: UpdateStepRequest = await request.json();

    // Validate request
    if (body.uid !== uid) {
      return NextResponse.json(
        { error: "Forbidden", message: "UID mismatch" },
        { status: 403 },
      );
    }

    if (!body.step) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Step is required",
        },
        { status: 400 },
      );
    }

    // Verify user exists
    const user = await getUser(uid);
    if (!user) {
      return NextResponse.json(
        { error: "Not found", message: "User not found" },
        { status: 404 },
      );
    }

    // Update onboarding step
    await updateOnboardingStep(uid, body.step, body.completed || false);

    // Get updated user data
    const updatedUser = await getUser(uid);
    if (!updatedUser) {
      throw new Error("Failed to retrieve updated user");
    }

    const response: UpdateStepResponse = {
      success: true,
      currentStep: updatedUser.onboarding.currentStep,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Update step error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to update onboarding step",
      },
      { status: 500 },
    );
  }
}
