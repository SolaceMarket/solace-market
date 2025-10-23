import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { UsersDAO } from "@/database/drizzle";
import { TestDataGenerator, TestCleanup } from "@/tests/utils/test-helpers";

describe("UsersDAO", () => {
  beforeEach(() => {
    TestDataGenerator.resetCounter();
  });

  afterEach(async () => {
    await TestCleanup.cleanupUsers();
  });

  describe("Basic CRUD Operations", () => {
    it("should create a new user", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();

      // Act
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      // Assert
      expect(createdUser).toBeDefined();
      expect(createdUser.uid).toBe(userData.uid);
      expect(createdUser.email).toBe(userData.email);
      expect(createdUser.locale).toBe("de"); // default value
      expect(createdUser.jurisdiction).toBe("EU"); // default value
    });

    it("should get user by UID", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      // Act
      const retrievedUser = await UsersDAO.getByUid(createdUser.uid);

      // Assert
      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.uid).toBe(createdUser.uid);
      expect(retrievedUser?.email).toBe(createdUser.email);
    });

    it("should return null for non-existent UID", async () => {
      // Act
      const retrievedUser = await UsersDAO.getByUid("non-existent-uid");

      // Assert
      expect(retrievedUser).toBeNull();
    });

    it("should get user by email", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      // Act
      const retrievedUser = await UsersDAO.getByEmail(createdUser.email);

      // Assert
      expect(retrievedUser).toBeDefined();
      expect(retrievedUser?.uid).toBe(createdUser.uid);
      expect(retrievedUser?.email).toBe(createdUser.email);
    });

    it("should return null for non-existent email", async () => {
      // Act
      const retrievedUser = await UsersDAO.getByEmail(
        "non-existent@example.com",
      );

      // Assert
      expect(retrievedUser).toBeNull();
    });

    it("should update user data", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const updates = {
        locale: "en" as const,
        jurisdiction: "US" as const,
      };

      // Act
      const updatedUser = await UsersDAO.update(createdUser.uid, updates);

      // Assert
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.locale).toBe("en");
      expect(updatedUser?.jurisdiction).toBe("US");
      expect(updatedUser?.updatedAt).not.toBe(createdUser.updatedAt);
    });

    it("should delete user", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);

      // Act
      const deleted = await UsersDAO.delete(createdUser.uid);

      // Assert
      expect(deleted).toBe(true);

      // Verify user is deleted
      const retrievedUser = await UsersDAO.getByUid(createdUser.uid);
      expect(retrievedUser).toBeNull();
    });

    it("should return false when deleting non-existent user", async () => {
      // Act
      const deleted = await UsersDAO.delete("non-existent-uid");

      // Assert
      expect(deleted).toBe(false);
    });
  });

  describe("Onboarding Operations", () => {
    it("should update onboarding status", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const onboardingUpdates = {
        currentStep: "kyc",
        completedSteps: ["welcome", "consents", "profile"],
        completed: false,
        lastActivityAt: new Date().toISOString(),
      };

      // Act
      const updatedUser = await UsersDAO.updateOnboarding(
        createdUser.uid,
        onboardingUpdates,
      );

      // Assert
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.onboardingCurrentStep).toBe("kyc");
      expect(updatedUser?.onboardingCompletedSteps).toBe(
        JSON.stringify(["welcome", "consents", "profile"]),
      );
      expect(updatedUser?.onboardingCompleted).toBe(false);
    });

    it("should mark onboarding as completed", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const completionTime = new Date().toISOString();
      const onboardingUpdates = {
        currentStep: "confirmation",
        completed: true,
        completedAt: completionTime,
        lastActivityAt: completionTime,
      };

      // Act
      const updatedUser = await UsersDAO.updateOnboarding(
        createdUser.uid,
        onboardingUpdates,
      );

      // Assert
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.onboardingCompleted).toBe(true);
      expect(updatedUser?.onboardingCompletedAt).toBe(completionTime);
    });
  });

  describe("KYC Operations", () => {
    it("should update KYC status", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const kycUpdates = {
        provider: "jumio",
        status: "pending",
        submittedAt: new Date().toISOString(),
      };

      // Act
      const updatedUser = await UsersDAO.updateKYC(createdUser.uid, kycUpdates);

      // Assert
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.kycProvider).toBe("jumio");
      expect(updatedUser?.kycStatus).toBe("pending");
      expect(updatedUser?.kycSubmittedAt).toBe(kycUpdates.submittedAt);
    });

    it("should update KYC to approved status", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const approvalTime = new Date().toISOString();
      const kycUpdates = {
        status: "approved",
        approvedAt: approvalTime,
      };

      // Act
      const updatedUser = await UsersDAO.updateKYC(createdUser.uid, kycUpdates);

      // Assert
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.kycStatus).toBe("approved");
      expect(updatedUser?.kycApprovedAt).toBe(approvalTime);
    });

    it("should update KYC to rejected status with reason", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const rejectionTime = new Date().toISOString();
      const kycUpdates = {
        status: "rejected",
        rejectedAt: rejectionTime,
        rejectionReason: "Document quality insufficient",
      };

      // Act
      const updatedUser = await UsersDAO.updateKYC(createdUser.uid, kycUpdates);

      // Assert
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.kycStatus).toBe("rejected");
      expect(updatedUser?.kycRejectedAt).toBe(rejectionTime);
      expect(updatedUser?.kycRejectionReason).toBe(
        "Document quality insufficient",
      );
    });
  });

  describe("Preferences Operations", () => {
    it("should update user preferences", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const preferencesUpdates = {
        theme: "light",
        defaultQuote: "EUR",
        news: false,
        orderFills: true,
        riskAlerts: true,
        statements: false,
        hintsEnabled: false,
      };

      // Act
      const updatedUser = await UsersDAO.updatePreferences(
        createdUser.uid,
        preferencesUpdates,
      );

      // Assert
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.preferencesTheme).toBe("light");
      expect(updatedUser?.preferencesDefaultQuote).toBe("EUR");
      expect(updatedUser?.preferencesNews).toBe(false);
      expect(updatedUser?.preferencesOrderFills).toBe(true);
      expect(updatedUser?.preferencesRiskAlerts).toBe(true);
      expect(updatedUser?.preferencesStatements).toBe(false);
      expect(updatedUser?.preferencesHintsEnabled).toBe(false);
    });

    it("should update partial preferences", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      // Act
      const updatedUser = await UsersDAO.updatePreferences(createdUser.uid, {
        theme: "light",
        news: false,
      });

      // Assert
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.preferencesTheme).toBe("light");
      expect(updatedUser?.preferencesNews).toBe(false);
      // Other preferences should remain unchanged (default values)
      expect(updatedUser?.preferencesOrderFills).toBe(true); // default
      expect(updatedUser?.preferencesDefaultQuote).toBe("USDC"); // default
    });
  });

  describe("Error Handling", () => {
    it("should handle unique constraint violation for email", async () => {
      // Arrange
      const userData1 = TestDataGenerator.generateUser();
      const userData2 = TestDataGenerator.generateUser({
        email: userData1.email, // Same email
      });

      await UsersDAO.create(userData1);
      TestCleanup.trackUser(userData1.uid);

      // Act & Assert
      await expect(UsersDAO.create(userData2)).rejects.toThrow();
    });

    it("should handle unique constraint violation for UID", async () => {
      // Arrange
      const userData1 = TestDataGenerator.generateUser();
      const userData2 = TestDataGenerator.generateUser({
        uid: userData1.uid, // Same UID
      });

      await UsersDAO.create(userData1);
      TestCleanup.trackUser(userData1.uid);

      // Act & Assert
      await expect(UsersDAO.create(userData2)).rejects.toThrow();
    });
  });

  describe("Query Operations", () => {
    it("should get all users with pagination", async () => {
      // Arrange
      const users = await Promise.all([
        UsersDAO.create(TestDataGenerator.generateUser()),
        UsersDAO.create(TestDataGenerator.generateUser()),
        UsersDAO.create(TestDataGenerator.generateUser()),
      ]);

      users.forEach((user) => TestCleanup.trackUser(user.uid));

      // Act
      const allUsers = await UsersDAO.getAll(2, 0);

      // Assert
      expect(allUsers).toBeDefined();
      expect(allUsers.length).toBeGreaterThanOrEqual(2);
    });
  });
});
