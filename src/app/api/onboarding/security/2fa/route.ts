import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authMiddleware";
import { saveSecurity, updateOnboardingStep, getUser } from "@/lib/tursoUsers";
import type {
  SecuritySetupRequest,
  SecuritySetupResponse,
  UserSecurity,
  TwoFAMethod,
} from "@/types/onboarding";

// Generate backup codes for 2FA
function generateBackupCodes(): string[] {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    // Generate 8-character alphanumeric codes
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  return codes;
}

// Mock 2FA setup
async function setup2FA(
  method: TwoFAMethod,
  credential?: string,
): Promise<{ success: boolean; secret?: string; backupCodes: string[] }> {
  // Simulate 2FA setup
  await new Promise((resolve) => setTimeout(resolve, 100));

  const backupCodes = generateBackupCodes();

  if (method === "totp") {
    // For TOTP, we'd normally generate a secret and return QR code
    const secret =
      "MOCK_TOTP_SECRET_" + Math.random().toString(36).substring(2);
    console.log("Mock TOTP setup", { secret: secret.substring(0, 10) + "..." });

    return {
      success: true,
      secret,
      backupCodes,
    };
  } else if (method === "webauthn") {
    // For WebAuthn, we'd normally validate the credential
    console.log("Mock WebAuthn setup", { credentialProvided: !!credential });

    return {
      success: true,
      backupCodes,
    };
  }

  return {
    success: false,
    backupCodes: [],
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

    const body: SecuritySetupRequest = await request.json();

    // Validate request
    if (body.uid !== uid) {
      return NextResponse.json(
        { error: "Forbidden", message: "UID mismatch" },
        { status: 403 },
      );
    }

    if (!body.method || !["webauthn", "totp"].includes(body.method)) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: "Valid 2FA method is required (webauthn or totp)",
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

    if (!user.onboarding.completedSteps.includes("broker")) {
      return NextResponse.json(
        {
          error: "Precondition failed",
          message: "Brokerage account setup must be completed first",
        },
        { status: 412 },
      );
    }

    // Setup 2FA with mock provider
    const setupResult = await setup2FA(body.method, body.credential);

    if (!setupResult.success) {
      return NextResponse.json(
        { error: "Setup failed", message: "2FA setup failed" },
        { status: 422 },
      );
    }

    const now = new Date().toISOString();
    const securityData: UserSecurity = {
      twoFA: {
        method: body.method,
        enabled: true,
        enabledAt: now,
      },
    };

    // Save security data
    await saveSecurity(uid, securityData);

    // Update onboarding step
    await updateOnboardingStep(uid, "security", true);

    // TODO: Fire analytics event
    console.log("2FA enabled", {
      uid,
      method: body.method,
    });

    const response: SecuritySetupResponse = {
      success: true,
      security: securityData,
      backupCodes: setupResult.backupCodes,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Security setup error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to setup security",
      },
      { status: 500 },
    );
  }
}

// Allow skipping 2FA setup (with warning)
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request);
    if (!("uid" in authResult)) {
      return authResult; // Return the error response
    }
    const { uid } = authResult;

    // Just update the onboarding step without setting up 2FA
    await updateOnboardingStep(uid, "security", true);

    console.log("2FA setup skipped", { uid });

    return NextResponse.json({
      success: true,
      message: "2FA setup skipped",
    });
  } catch (error) {
    console.error("Skip 2FA error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to skip 2FA setup",
      },
      { status: 500 },
    );
  }
}
