import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authMiddleware";
import {
  saveProfile,
  updateOnboardingStep,
  getUser,
  getJurisdictionFromCountry,
} from "@/lib/tursoUsers";
import type {
  ProfileRequest,
  ProfileResponse,
  ExperienceLevel,
} from "@/types/onboarding";

function validateProfile(profile: unknown): boolean {
  if (!profile || typeof profile !== "object") return false;

  const profileObj = profile as Record<string, unknown>;

  const required = [
    "firstName",
    "lastName",
    "dob",
    "country",
    "taxResidency",
    "address",
    "experience",
  ];
  for (const field of required) {
    if (!profileObj[field] || typeof profileObj[field] !== "string") {
      return false;
    }
  }

  // Validate experience level
  const validExperience: ExperienceLevel[] = [
    "beginner",
    "intermediate",
    "advanced",
  ];
  if (!validExperience.includes(profileObj.experience as ExperienceLevel)) {
    return false;
  }

  // Validate date format (basic check)
  const dobDate = new Date(profileObj.dob as string);
  if (Number.isNaN(dobDate.getTime())) {
    return false;
  }

  // Check age (must be 18+)
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dobDate.getDate())
  ) {
    // Birthday hasn't occurred this year
  }

  if (age < 18) {
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

    const body: ProfileRequest = await request.json();

    // Validate request
    if (body.uid !== uid) {
      return NextResponse.json(
        { error: "Forbidden", message: "UID mismatch" },
        { status: 403 },
      );
    }

    if (!validateProfile(body.profile)) {
      return NextResponse.json(
        {
          error: "Validation error",
          message:
            "Invalid profile data. All required fields must be provided and user must be 18+",
        },
        { status: 400 },
      );
    }

    // Verify user exists and consents are completed
    const user = await getUser(uid);
    if (!user) {
      return NextResponse.json(
        { error: "Not found", message: "User not found" },
        { status: 404 },
      );
    }

    if (!user.onboarding.completedSteps.includes("consents")) {
      return NextResponse.json(
        {
          error: "Precondition failed",
          message: "Consents must be completed first",
        },
        { status: 412 },
      );
    }

    // Auto-determine jurisdiction from country if not provided
    const jurisdiction =
      body.jurisdiction || getJurisdictionFromCountry(body.profile.country);

    // Save profile
    await saveProfile(uid, body.profile, jurisdiction);

    // Update onboarding step
    await updateOnboardingStep(uid, "profile", true);

    // TODO: Fire analytics event
    console.log("Profile saved", {
      uid,
      country: body.profile.country,
      jurisdiction,
      experience: body.profile.experience,
    });

    const response: ProfileResponse = {
      success: true,
      profile: body.profile,
      jurisdiction,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Profile error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to save profile",
      },
      { status: 500 },
    );
  }
}
