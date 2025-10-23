import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authMiddleware";
import { saveBroker, updateOnboardingStep, getUser } from "@/lib/tursoUsers";
import type {
  BrokerSubaccountRequest,
  BrokerSubaccountResponse,
  UserBroker,
  BrokerStatus,
} from "@/types/onboarding";

// Mock broker sub-account creation
async function createBrokerSubaccount(
  uid: string,
  user: { jurisdiction?: string },
): Promise<{ subAccountId: string; status: BrokerStatus }> {
  // Simulate API call to broker partner
  const subAccountId = `sub_${uid}_${Date.now()}`;

  // Mock different outcomes based on user profile
  let status: BrokerStatus = "active";

  // Simulate some accounts needing review
  const requiresReview = Math.random() < 0.3; // 30% chance
  if (requiresReview) {
    status = "pending_review";
  }

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  console.log("Mock broker subaccount created", {
    uid,
    subAccountId,
    status,
    jurisdiction: user.jurisdiction,
  });

  return {
    subAccountId,
    status,
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

    const body: BrokerSubaccountRequest = await request.json();

    // Validate request
    if (body.uid !== uid) {
      return NextResponse.json(
        { error: "Forbidden", message: "UID mismatch" },
        { status: 403 },
      );
    }

    if (
      typeof body.consentDataSharing !== "boolean" ||
      typeof body.consentOmnibus !== "boolean"
    ) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Both consent fields are required",
        },
        { status: 400 },
      );
    }

    // Check that both consents are given
    if (!body.consentDataSharing || !body.consentOmnibus) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Both consents must be accepted",
        },
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

    // if (!user.onboarding.completedSteps.includes("wallet")) {
    //   return NextResponse.json(
    //     {
    //       error: "Precondition failed",
    //       message: "Wallet setup must be completed first",
    //     },
    //     { status: 412 },
    //   );
    // }

    // KYC should be approved for brokerage account
    if (user.kyc?.status !== "approved") {
      return NextResponse.json(
        {
          error: "Precondition failed",
          message: "KYC approval required for brokerage account",
        },
        { status: 412 },
      );
    }

    // Create broker sub-account with mock provider
    const brokerResult = await createBrokerSubaccount(uid, user);

    const now = new Date().toISOString();
    const brokerData: UserBroker = {
      provider: "mock",
      subAccountId: brokerResult.subAccountId,
      status: brokerResult.status,
      createdAt: now,
      lastSyncAt: now,
    };

    // Save broker data
    await saveBroker(uid, brokerData);

    // Update onboarding step (complete even if pending review)
    // await updateOnboardingStep(uid, "broker", true);

    // TODO: Fire analytics event
    console.log("Broker subaccount created", {
      uid,
      subAccountId: brokerResult.subAccountId,
      status: brokerResult.status,
    });

    const response: BrokerSubaccountResponse = {
      success: true,
      broker: brokerData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Broker subaccount error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to create brokerage sub-account",
      },
      { status: 500 },
    );
  }
}
