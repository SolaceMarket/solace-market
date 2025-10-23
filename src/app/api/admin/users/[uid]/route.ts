import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import {
  getUser,
  updateOnboardingStep,
  saveProfile,
  saveWallet,
} from "@/lib/tursoUsers";
import type {
  OnboardingStep,
  UserProfile,
  UserWallet,
} from "@/types/onboarding";
import { verifyAdminAccess } from "@/lib/adminMiddleware";
import * as admin from "firebase-admin";
import serviceAccount from "@/solace-market-test-firebase-adminsdk-fbsvc-8963049c79.json";

// Get detailed user information
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> },
) {
  try {
    // Verify admin authentication and authorization (using Firebase method for this route)
    const adminResult = await verifyAdminAccess(request, {
      method: "firebase",
    });
    if (!adminResult.isValid && adminResult.error) {
      return adminResult.error;
    }

    // Initialize Firebase Admin for additional operations
    const apps = getApps();
    const adminApp =
      apps.length > 0
        ? apps[0]
        : initializeApp({
            credential: admin.credential.cert(
              serviceAccount as admin.ServiceAccount,
            ),
          });

    const { uid } = await params;

    // Get user from Turso
    const user = await getUser(uid);
    if (!user) {
      return NextResponse.json(
        { error: "Not Found", message: "User not found" },
        { status: 404 },
      );
    }

    // Get Firebase user record for additional details
    let firebaseUser = null;
    try {
      firebaseUser = await getAuth(adminApp).getUser(uid);
    } catch (error) {
      console.error("Error fetching Firebase user:", error);
    }

    // Get Alpaca account info (if available)
    // TODO: Implement Alpaca API integration
    const alpacaAccount = null;

    const detailedUser = {
      ...user,
      firebase: firebaseUser
        ? {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            disabled: firebaseUser.disabled,
            metadata: {
              creationTime: firebaseUser.metadata.creationTime,
              lastSignInTime: firebaseUser.metadata.lastSignInTime,
              lastRefreshTime: firebaseUser.metadata.lastRefreshTime,
            },
            providerData: firebaseUser.providerData.map((p) => ({
              uid: p.uid,
              email: p.email,
              providerId: p.providerId,
            })),
            customClaims: firebaseUser.customClaims,
          }
        : null,
      alpaca: alpacaAccount
        ? {
            // TODO: Add Alpaca account details when API integration is ready
            accountId: "placeholder",
            status: "unknown",
          }
        : null,
    };

    return NextResponse.json({ user: detailedUser });
  } catch (error) {
    console.error("Admin user detail error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch user details",
      },
      { status: 500 },
    );
  }
}

// Update user information
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> },
) {
  try {
    // Verify admin authentication and authorization (using Firebase method for this route)
    const adminResult = await verifyAdminAccess(request, {
      method: "firebase",
    });
    if (!adminResult.isValid && adminResult.error) {
      return adminResult.error;
    }

    // Initialize Firebase Admin for additional operations
    const apps = getApps();
    const adminApp =
      apps.length > 0
        ? apps[0]
        : initializeApp({
            credential: admin.credential.cert(
              serviceAccount as admin.ServiceAccount,
            ),
          });

    const { uid } = await params;
    const body = await request.json();

    // Get current user
    const user = await getUser(uid);
    if (!user) {
      return NextResponse.json(
        { error: "Not Found", message: "User not found" },
        { status: 404 },
      );
    }

    // Handle different update operations
    const { action, data } = body;

    switch (action) {
      case "updateProfile":
        await saveProfile(uid, data as UserProfile, user.jurisdiction);
        break;

      case "updateWallet":
        await saveWallet(uid, data as UserWallet);
        break;

      case "resetOnboarding":
        await updateOnboardingStep(uid, "welcome", false);
        break;

      case "setOnboardingStep":
        await updateOnboardingStep(
          uid,
          data.step as OnboardingStep,
          data.completed || false,
        );
        break;

      case "updateFirebaseUser":
        // Update Firebase user record
        try {
          await getAuth(adminApp).updateUser(uid, data);
        } catch (error) {
          console.error("Error updating Firebase user:", error);
          throw new Error("Failed to update Firebase user");
        }
        break;

      default:
        return NextResponse.json(
          { error: "Bad Request", message: `Unknown action: ${action}` },
          { status: 400 },
        );
    }

    // Return updated user
    const updatedUser = await getUser(uid);
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to update user" },
      { status: 500 },
    );
  }
}
