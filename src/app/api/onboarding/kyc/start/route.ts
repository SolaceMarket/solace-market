import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authMiddleware";
import { saveKYC, updateOnboardingStep, getUser } from "@/lib/tursoUsers";
import type {
  KYCStartRequest,
  KYCStartResponse,
  UserKYC,
  KYCStatus,
} from "@/types/onboarding";

// Mock KYC provider integration
async function startKYCVerification(
  uid: string,
  documents?: Record<string, unknown>,
): Promise<{ sessionId: string; status: KYCStatus }> {
  // Simulate API call to KYC provider
  const sessionId = `kyc_${uid}_${Date.now()}`;

  // Mock random verification outcome for demo
  const outcomes: KYCStatus[] = ["pending", "approved", "requires_more"];
  const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  console.log("Mock KYC started", {
    uid,
    sessionId,
    status: randomOutcome,
    documentsProvided: !!documents,
  });

  return {
    sessionId,
    status: randomOutcome,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request);
    if (!("uid" in authResult)) {
      return authResult; // Return the error response
    }
    const { uid } = authResult;

    const body: KYCStartRequest = await request.json();

    // Validate request
    if (body.uid !== uid) {
      return NextResponse.json(
        { error: "Forbidden", message: "UID mismatch" },
        { status: 403 },
      );
    }

    // Verify user exists and profile is completed
    const user = await getUser(uid);
    if (!user) {
      return NextResponse.json(
        { error: "Not found", message: "User not found" },
        { status: 404 },
      );
    }

    if (!user.onboarding.completedSteps.includes("profile")) {
      return NextResponse.json(
        {
          error: "Precondition failed",
          message: "Profile must be completed first",
        },
        { status: 412 },
      );
    }

    // Start KYC verification with mock provider
    const kycResult = await startKYCVerification(uid, body.documents);

    const now = new Date().toISOString();
    const kycData: UserKYC = {
      provider: "mock",
      status: kycResult.status,
      level: "basic", // Start with basic level for mock
      riskLevel: "low", // Default to low risk for demo
      lastCheckedAt: now,
      submittedAt: now,
      checks: {
        // Initialize basic checks for mock verification
        identity: {
          type: "identity_verification",
          status: kycResult.status,
          checkedAt: now,
          score: kycResult.status === "approved" ? 95 : 75,
          details: "Mock identity verification",
          provider: "mock",
        },
        address: {
          type: "address_verification",
          status: kycResult.status,
          checkedAt: now,
          score: kycResult.status === "approved" ? 90 : 70,
          details: "Mock address verification",
          provider: "mock",
        },
        sanctions: {
          type: "sanctions_screening",
          status: kycResult.status === "approved" ? "approved" : "pending",
          checkedAt: now,
          score: 100, // Clean sanctions record for demo
          details: "No sanctions matches found",
          provider: "mock",
        },
      },
    };

    // If approved immediately, add approval timestamp
    if (kycResult.status === "approved") {
      kycData.approvedAt = now;
    }

    // Save KYC data
    await saveKYC(uid, kycData);

    // Update onboarding step if approved
    if (kycResult.status === "approved") {
      await updateOnboardingStep(uid, "kyc", true);
    }

    // TODO: Fire analytics event
    console.log("KYC submitted", {
      uid,
      sessionId: kycResult.sessionId,
      status: kycResult.status,
    });

    const response: KYCStartResponse = {
      success: true,
      sessionId: kycResult.sessionId,
      status: kycResult.status,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("KYC start error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to start KYC verification",
      },
      { status: 500 },
    );
  }
}
