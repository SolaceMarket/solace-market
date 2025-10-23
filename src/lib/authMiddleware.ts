import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

/**
 * Extracts and verifies Firebase ID token from Authorization header
 * @param request - Next.js request object
 * @returns Promise<string | null> - User UID if valid, null if invalid
 */
export async function verifyAuthToken(
  request: NextRequest,
): Promise<string | null> {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const idToken = authHeader.substring(7);
    const adminApp = getApps().length ? getApp() : null;

    if (!adminApp) {
      console.error("Firebase Admin not initialized");
      return null;
    }

    const decodedToken = await getAuth(adminApp).verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

/**
 * Higher-order function that wraps API route handlers with authentication
 * @param handler - The API route handler function
 * @returns Wrapped handler with authentication
 */
export function withAuth<T = unknown>(
  handler: (request: NextRequest, uid: string) => Promise<NextResponse<T>>,
) {
  return async (request: NextRequest): Promise<NextResponse<T>> => {
    const uid = await verifyAuthToken(request);
    if (!uid) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      ) as NextResponse<T>;
    }

    return handler(request, uid);
  };
}

/**
 * Middleware function to verify authentication and return standardized error response
 * @param request - Next.js request object
 * @returns Promise<{ uid: string } | NextResponse> - Success object with uid or error response
 */
export async function requireAuth(
  request: NextRequest,
): Promise<{ uid: string } | NextResponse> {
  const uid = await verifyAuthToken(request);
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return { uid };
}
