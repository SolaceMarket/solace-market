import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authMiddleware";
import { saveConsents, updateOnboardingStep, getUser } from "@/lib/tursoUsers";
import type {
  ConsentRequest,
  ConsentResponse,
  UserConsents,
} from "@/types/onboarding";
import { ONBOARDING_CONFIG } from "@/types/onboarding";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request);
    if (!("uid" in authResult)) {
      return authResult; // Return the error response
    }
    const { uid } = authResult;

    const body: ConsentRequest = await request.json();

    // Validate request
    if (body.uid !== uid) {
      return NextResponse.json(
        { error: "Forbidden", message: "UID mismatch" },
        { status: 403 },
      );
    }

    if (
      !body.consents ||
      typeof body.consents.tos !== "boolean" ||
      typeof body.consents.privacy !== "boolean" ||
      typeof body.consents.risk !== "boolean"
    ) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "All consent fields are required",
        },
        { status: 400 },
      );
    }

    // Check that all consents are accepted (true)
    if (!body.consents.tos || !body.consents.privacy || !body.consents.risk) {
      return NextResponse.json(
        { error: "Validation error", message: "All consents must be accepted" },
        { status: 400 },
      );
    }

    // Verify user exists and is on correct step
    const user = await getUser(uid);
    if (!user) {
      return NextResponse.json(
        { error: "Not found", message: "User not found" },
        { status: 404 },
      );
    }

    const now = new Date().toISOString();
    const consents: UserConsents = {
      tos: {
        version: ONBOARDING_CONFIG.LEGAL_VERSIONS.tosVersion,
        acceptedAt: now,
      },
      privacy: {
        version: ONBOARDING_CONFIG.LEGAL_VERSIONS.privacyVersion,
        acceptedAt: now,
      },
      risk: {
        version: ONBOARDING_CONFIG.LEGAL_VERSIONS.riskVersion,
        acceptedAt: now,
      },
    };

    // Save consents
    await saveConsents(uid, consents);

    // Update onboarding step
    await updateOnboardingStep(uid, "consents", true);

    // TODO: Fire analytics event
    console.log("Consents accepted", {
      uid,
      versions: ONBOARDING_CONFIG.LEGAL_VERSIONS,
    });

    const response: ConsentResponse = {
      success: true,
      consents,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Consent error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to save consents",
      },
      { status: 500 },
    );
  }
}
