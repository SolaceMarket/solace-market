#!/usr/bin/env tsx

/**
 * Test script to verify Turso database setup and user operations
 */

import { client } from "@/turso/database";
import {
  createUser,
  getUser,
  saveConsents,
  saveProfile,
} from "@/lib/tursoUsers";
import type { UserConsents, UserProfile } from "@/types/onboarding";

async function main() {
  console.log("🔄 Testing Turso database setup...");

  try {
    // Test 1: Check database connection
    console.log("\n1. Testing database connection...");
    const result = await client.execute("SELECT 1 as test");
    console.log("✅ Database connection successful:", result.rows[0]);

    // Test 2: Check if users table exists
    console.log("\n2. Checking users table...");
    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
    );
    if (tables.rows.length === 0) {
      console.log("❌ Users table not found");
      return;
    }
    console.log("✅ Users table exists");

    // Test 3: Create a test user
    console.log("\n3. Creating test user...");
    const testUid = "test-user-" + Date.now();
    const testEmail = `test+${Date.now()}@example.com`;

    const user = await createUser(testUid, testEmail, "de");
    console.log("✅ User created:", {
      uid: user.uid,
      email: user.email,
      currentStep: user.onboarding.currentStep,
    });

    // Test 4: Retrieve the user
    console.log("\n4. Retrieving user...");
    const retrievedUser = await getUser(testUid);
    if (!retrievedUser) {
      console.log("❌ Failed to retrieve user");
      return;
    }
    console.log("✅ User retrieved:", {
      uid: retrievedUser.uid,
      email: retrievedUser.email,
      currentStep: retrievedUser.onboarding.currentStep,
    });

    // Test 5: Save consents
    console.log("\n5. Saving consents...");
    const consents: UserConsents = {
      tos: {
        version: "1.0",
        acceptedAt: new Date().toISOString(),
      },
      privacy: {
        version: "1.0",
        acceptedAt: new Date().toISOString(),
      },
      risk: {
        version: "1.0",
        acceptedAt: new Date().toISOString(),
      },
    };

    await saveConsents(testUid, consents);
    console.log("✅ Consents saved");

    // Test 6: Save profile
    console.log("\n6. Saving profile...");
    const profile: UserProfile = {
      firstName: "Test",
      lastName: "User",
      dob: "1990-01-01",
      country: "DE",
      taxResidency: "DE",
      address: "Test Address 123, 12345 Test City",
      phone: "+49123456789",
      experience: "intermediate",
    };

    await saveProfile(testUid, profile, "DE");
    console.log("✅ Profile saved");

    // Test 7: Verify data persistence
    console.log("\n7. Verifying data persistence...");
    const finalUser = await getUser(testUid);
    if (!finalUser) {
      console.log("❌ Failed to retrieve final user");
      return;
    }

    console.log("✅ Final user state:", {
      uid: finalUser.uid,
      email: finalUser.email,
      hasConsents: !!finalUser.consents,
      hasProfile: !!finalUser.profile,
      jurisdiction: finalUser.jurisdiction,
    });

    // Test 8: Clean up (delete test user)
    console.log("\n8. Cleaning up test data...");
    await client.execute({
      sql: "DELETE FROM users WHERE uid = ?",
      args: [testUid],
    });
    console.log("✅ Test user deleted");

    console.log("\n🎉 All tests passed! Turso migration is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

main().catch(console.error);
