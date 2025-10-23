import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authMiddleware";
import { saveKYC, updateOnboardingStep, getUser } from "@/lib/tursoUsers";
import type {
  KYCStatusRequest,
  KYCStatusResponse,
  UserKYC,
  KYCStatus,
} from "@/types/onboarding";

// Mock KYC status check
async function checkKYCStatus(
  uid: string,
  sessionId?: string,
): Promise<{ status: KYCStatus; rejectionReason?: string }> {
  // Simulate API call to KYC provider
  console.log("Checking KYC status", { uid, sessionId });

  // For mock purposes, randomly transition pending to approved/rejected
  const outcomes: KYCStatus[] = [
    "pending",
    "approved",
    "rejected",
    "requires_more",
  ];
  const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];

  const result: { status: KYCStatus; rejectionReason?: string } = {
    status: randomOutcome,
  };

  if (randomOutcome === "rejected") {
    result.rejectionReason =
      "Document quality insufficient - please provide clearer images";
  }

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return result;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request);
    if (!("uid" in authResult)) {
      return authResult; // Return the error response
    }
    const { uid } = authResult;

    const body: KYCStatusRequest = await request.json();

    // Validate request
    if (body.uid !== uid) {
      return NextResponse.json(
        { error: "Forbidden", message: "UID mismatch" },
        { status: 403 },
      );
    }

    // Verify user exists and has started KYC
    const user = await getUser(uid);
    if (!user) {
      return NextResponse.json(
        { error: "Not found", message: "User not found" },
        { status: 404 },
      );
    }

    if (!user.kyc) {
      return NextResponse.json(
        { error: "Precondition failed", message: "KYC not started" },
        { status: 412 },
      );
    }

    // Check KYC status with mock provider
    const statusResult = await checkKYCStatus(uid, body.sessionId);

    const now = new Date().toISOString();
    const updatedKyc: UserKYC = {
      ...user.kyc,
      status: statusResult.status,
      lastCheckedAt: now,
    };

    // Add timestamps based on status
    if (statusResult.status === "approved" && !user.kyc.approvedAt) {
      updatedKyc.approvedAt = now;
    } else if (statusResult.status === "rejected") {
      updatedKyc.rejectedAt = now;
      updatedKyc.rejectionReason = statusResult.rejectionReason;
    }

    // Save updated KYC data
    await saveKYC(uid, updatedKyc);

    // Update onboarding step if approved
    if (
      statusResult.status === "approved" &&
      !user.onboarding.completedSteps.includes("kyc")
    ) {
      await updateOnboardingStep(uid, "kyc", true);
    }

    // TODO: Fire analytics event
    console.log("KYC status checked", {
      uid,
      status: statusResult.status,
      rejectionReason: statusResult.rejectionReason,
    });

    const response: KYCStatusResponse = {
      success: true,
      status: statusResult.status,
      lastCheckedAt: now,
      rejectionReason: statusResult.rejectionReason,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("KYC status error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to check KYC status",
      },
      { status: 500 },
    );
  }
}
