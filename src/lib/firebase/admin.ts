/**
 * Firebase Admin SDK utilities
 *
 * Centralized Firebase Admin initialization and app management
 * Following best practices for singleton pattern and secure credential handling
 */

import { getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import * as admin from "firebase-admin";

/**
 * Firebase Admin app singleton
 */
let adminAppInstance: App | null = null;

/**
 * Firebase Admin Auth singleton
 */
let adminAuthInstance: Auth | null = null;

/**
 * Initialize Firebase Admin with service account credentials
 * Uses singleton pattern to ensure only one app instance exists
 *
 * @returns Firebase Admin App instance
 * @throws Error if FIREBASE_SERVICE_ACCOUNT environment variable is not set or invalid
 */
export function initializeFirebaseAdmin(): App {
  // Return existing instance if already initialized
  if (adminAppInstance) {
    return adminAppInstance;
  }

  // Check if an app is already initialized
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminAppInstance = existingApps[0];
    return adminAppInstance;
  }

  // Get service account from environment variable
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountString) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT environment variable is not set. " +
        "Please set it to a stringified JSON of your Firebase service account.",
    );
  }

  try {
    const serviceAccount = JSON.parse(
      serviceAccountString,
    ) as admin.ServiceAccount;

    // Validate required service account fields
    if (
      !serviceAccount.projectId ||
      !serviceAccount.privateKey ||
      !serviceAccount.clientEmail
    ) {
      throw new Error(
        "Invalid service account: missing required fields (projectId, privateKey, or clientEmail)",
      );
    }

    // adminApp = initializeApp({
    //   credential: cert({
    //     projectId: process.env.FIREBASE_PROJECT_ID,
    //     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    //     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    //   }),
    // });

    // Initialize Firebase Admin
    adminAppInstance = initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log(
      `Firebase Admin initialized for project: ${serviceAccount.projectId}`,
    );
    return adminAppInstance;
  } catch (parseError) {
    throw new Error(
      `Failed to parse FIREBASE_SERVICE_ACCOUNT: ${parseError instanceof Error ? parseError.message : "Invalid JSON"}`,
    );
  }
}

/**
 * Get Firebase Admin app instance
 * Initializes the app if not already done
 *
 * @returns Firebase Admin App instance
 */
export function getFirebaseAdminApp(): App {
  if (!adminAppInstance) {
    return initializeFirebaseAdmin();
  }
  return adminAppInstance;
}

/**
 * Get Firebase Admin Auth instance
 * Initializes the app and auth if not already done
 *
 * @returns Firebase Admin Auth instance
 */
export function getFirebaseAdminAuth(): Auth {
  if (!adminAuthInstance) {
    const app = getFirebaseAdminApp();
    adminAuthInstance = getAuth(app);
  }
  return adminAuthInstance;
}

/**
 * Verify Firebase ID token
 *
 * @param idToken - Firebase ID token to verify
 * @returns Promise resolving to decoded token
 * @throws Error if token is invalid
 */
export async function verifyFirebaseToken(idToken: string) {
  const auth = getFirebaseAdminAuth();
  return auth.verifyIdToken(idToken);
}

/**
 * Get Firebase user by UID
 *
 * @param uid - Firebase user UID
 * @returns Promise resolving to Firebase user record
 * @throws Error if user not found
 */
export async function getFirebaseUser(uid: string) {
  const auth = getFirebaseAdminAuth();
  return auth.getUser(uid);
}

/**
 * Update Firebase user
 *
 * @param uid - Firebase user UID
 * @param updateRequest - User update data
 * @returns Promise resolving to updated Firebase user record
 */
export async function updateFirebaseUser(
  uid: string,
  updateRequest: admin.auth.UpdateRequest,
) {
  const auth = getFirebaseAdminAuth();
  return auth.updateUser(uid, updateRequest);
}

/**
 * Reset Firebase Admin instances
 * Useful for testing or when re-initialization is needed
 */
export function resetFirebaseAdmin(): void {
  adminAppInstance = null;
  adminAuthInstance = null;
}

/**
 * Check if Firebase Admin is initialized
 *
 * @returns boolean indicating if Firebase Admin is initialized
 */
export function isFirebaseAdminInitialized(): boolean {
  return adminAppInstance !== null || getApps().length > 0;
}
