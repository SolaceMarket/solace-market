import type { InsertUser } from "@/database/drizzle";

/**
 * Test utilities for database testing
 */

export class TestDataGenerator {
  private static counter = 0;

  /**
   * Generate a unique test user
   */
  static generateUser(overrides: Partial<InsertUser> = {}): InsertUser {
    this.counter++;
    const timestamp = Date.now();

    return {
      uid: `test-user-${this.counter}-${timestamp}`,
      email: `test-${this.counter}-${timestamp}@example.com`,
      createdAt: new Date().toISOString(),
      onboardingStartedAt: new Date().toISOString(),
      onboardingLastActivityAt: new Date().toISOString(),
      ...overrides,
    };
  }

  /**
   * Generate a unique test email
   */
  static generateEmail(): string {
    this.counter++;
    return `test-${this.counter}-${Date.now()}@example.com`;
  }

  /**
   * Generate a unique test UID
   */
  static generateUid(): string {
    this.counter++;
    return `test-uid-${this.counter}-${Date.now()}`;
  }

  /**
   * Reset counter (useful for test isolation)
   */
  static resetCounter(): void {
    this.counter = 0;
  }
}

/**
 * Test cleanup utilities
 */
export class TestCleanup {
  private static createdUserIds: string[] = [];

  /**
   * Track a user for cleanup
   */
  static trackUser(uid: string): void {
    this.createdUserIds.push(uid);
  }

  /**
   * Clean up all tracked users
   */
  static async cleanupUsers(): Promise<void> {
    const { UsersDAO } = await import("@/database/drizzle");

    for (const uid of this.createdUserIds) {
      try {
        await UsersDAO.delete(uid);
      } catch (error) {
        console.warn(`Failed to cleanup user ${uid}:`, error);
      }
    }

    this.createdUserIds = [];
  }

  /**
   * Get all tracked user IDs
   */
  static getTrackedUserIds(): string[] {
    return [...this.createdUserIds];
  }
}
