import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { isAdminByDatabase, isAdminByFirebase } from "./adminAuth";
import * as admin from "firebase-admin";
import serviceAccount from "@/solace-market-test-firebase-adminsdk-fbsvc-8963049c79.json";

/**
 * Admin verification result
 */
export interface AdminVerificationResult {
  uid: string;
  isValid: boolean;
  error?: NextResponse;
}

/**
 * Admin middleware configuration options
 */
export interface AdminMiddlewareOptions {
  /**
   * Method to use for admin verification
   * - 'database': Check email from Turso database (default)
   * - 'firebase': Check email from Firebase Auth
   */
  method?: "database" | "firebase";

  /**
   * Custom error messages
   */
  messages?: {
    unauthorized?: string;
    forbidden?: string;
    internalError?: string;
  };
}

/**
 * Extract and verify Firebase auth token from request headers
 *
 * @param request - Next.js request object
 * @returns Promise<{ uid: string; error?: NextResponse }>
 */
async function verifyAuthToken(
  request: NextRequest,
): Promise<{ uid: string; error?: NextResponse }> {
  try {
    // Check authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return {
        uid: "",
        error: NextResponse.json(
          { error: "Unauthorized", message: "Missing authentication token" },
          { status: 401 },
        ),
      };
    }

    const token = authHeader.substring(7);

    // Initialize Firebase Admin
    const apps = getApps();
    const adminApp =
      apps.length > 0
        ? apps[0]
        : initializeApp({
            credential: admin.credential.cert(
              serviceAccount as admin.ServiceAccount,
            ),
          });

    // Verify token
    const auth = getAuth(adminApp);
    const decodedToken = await auth.verifyIdToken(token);

    return { uid: decodedToken.uid };
  } catch (error) {
    console.error("Token verification error:", error);
    return {
      uid: "",
      error: NextResponse.json(
        { error: "Unauthorized", message: "Invalid authentication token" },
        { status: 401 },
      ),
    };
  }
}

/**
 * Verify admin access for a user
 *
 * @param uid - Firebase user UID
 * @param method - Method to use for admin verification
 * @returns Promise<{ isAdmin: boolean; error?: NextResponse }>
 */
async function checkAdminPermissions(
  uid: string,
  method: "database" | "firebase" = "database",
): Promise<{ isAdmin: boolean; error?: NextResponse }> {
  try {
    const adminCheck =
      method === "firebase" ? isAdminByFirebase : isAdminByDatabase;
    const isAdminUser = await adminCheck(uid);

    if (!isAdminUser) {
      return {
        isAdmin: false,
        error: NextResponse.json(
          { error: "Forbidden", message: "Admin access required" },
          { status: 403 },
        ),
      };
    }

    return { isAdmin: true };
  } catch (error) {
    console.error("Admin verification error:", error);
    return {
      isAdmin: false,
      error: NextResponse.json(
        {
          error: "Internal server error",
          message: "Failed to verify admin access",
        },
        { status: 500 },
      ),
    };
  }
}

/**
 * Complete admin authentication and authorization middleware
 *
 * @param request - Next.js request object
 * @param options - Configuration options
 * @returns Promise<AdminVerificationResult>
 */
export async function verifyAdminAccess(
  request: NextRequest,
  options: AdminMiddlewareOptions = {},
): Promise<AdminVerificationResult> {
  const { method = "database" } = options;

  // Step 1: Verify authentication token
  const tokenResult = await verifyAuthToken(request);
  if (tokenResult.error) {
    return {
      uid: "",
      isValid: false,
      error: tokenResult.error,
    };
  }

  // Step 2: Verify admin access
  const adminResult = await checkAdminPermissions(tokenResult.uid, method);
  if (adminResult.error) {
    return {
      uid: tokenResult.uid,
      isValid: false,
      error: adminResult.error,
    };
  }

  return {
    uid: tokenResult.uid,
    isValid: true,
  };
}

/**
 * Higher-order function to wrap admin routes with authentication
 *
 * @param handler - Route handler function
 * @param options - Middleware options
 * @returns Wrapped route handler
 */
export function withAdminAuth<T extends unknown[]>(
  handler: (
    request: NextRequest,
    result: AdminVerificationResult,
    ...args: T
  ) => Promise<NextResponse>,
  options: AdminMiddlewareOptions = {},
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const verificationResult = await verifyAdminAccess(request, options);

    if (!verificationResult.isValid && verificationResult.error) {
      return verificationResult.error;
    }

    return handler(request, verificationResult, ...args);
  };
}

/**
 * Legacy support: Simple admin verification function
 * Use verifyAdminAccess for new code
 *
 * @deprecated Use verifyAdminAccess instead
 */
export async function requireAdminAuth(
  request: NextRequest,
): Promise<{ uid: string; error?: NextResponse }> {
  const result = await verifyAdminAccess(request);
  return {
    uid: result.uid,
    error: result.error,
  };
}
