import { getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { client } from "@/turso/database";

/**
 * List of admin email addresses
 * In production, consider moving this to environment variables
 * or implementing a proper role-based system
 */
const ADMIN_EMAILS = [
  "admin@solace-market.com",
  "oliver@solace-market.com",
  "solace.market@olimo.me",
];

/**
 * Admin role verification using Turso database
 * Queries the users table to get email for the given UID
 *
 * @param uid - Firebase user UID
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export async function isAdminByDatabase(uid: string): Promise<boolean> {
  try {
    const result = await client.execute({
      sql: "SELECT email FROM users WHERE uid = ?",
      args: [uid],
    });

    if (result.rows.length === 0) return false;

    const email = result.rows[0].email as string;
    return ADMIN_EMAILS.includes(email);
  } catch (error) {
    console.error("Admin check error (database):", error);
    return false;
  }
}

/**
 * Admin role verification using Firebase Auth
 * Gets email directly from Firebase user record
 *
 * @param uid - Firebase user UID
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export async function isAdminByFirebase(uid: string): Promise<boolean> {
  try {
    const adminApp = getApps().length > 0 ? getApps()[0] : getApp();
    const userRecord = await getAuth(adminApp).getUser(uid);
    return ADMIN_EMAILS.includes(userRecord.email || "");
  } catch (error) {
    console.error("Admin check error (firebase):", error);
    return false;
  }
}

/**
 * Default admin check function
 * Uses database method as default for consistency with existing codebase
 *
 * @param uid - Firebase user UID
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export const isAdmin = isAdminByDatabase;

/**
 * Admin authentication middleware configuration
 */
export const ADMIN_CONFIG = {
  emails: ADMIN_EMAILS,
  // Methods available for admin checking
  methods: {
    database: isAdminByDatabase,
    firebase: isAdminByFirebase,
  },
  // Default method
  default: isAdminByDatabase,
} as const;
