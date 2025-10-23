import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { UsersDAO } from "@/database/drizzle";
import { TestDataGenerator, TestCleanup } from "@/tests/utils/test-helpers";

describe("User Onboarding Operations", () => {
  beforeEach(() => {
    TestDataGenerator.resetCounter();
  });

  afterEach(async () => {
    await TestCleanup.cleanupUsers();
  });

  describe("Onboarding Flow", () => {
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

    it("should track onboarding progress step by step", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      // Act & Assert - Step 1: Welcome
      const step1 = await UsersDAO.updateOnboarding(createdUser.uid, {
        currentStep: "welcome",
        completedSteps: [],
        lastActivityAt: new Date().toISOString(),
      });
      expect(step1?.onboardingCurrentStep).toBe("welcome");

      // Act & Assert - Step 2: Profile
      const step2 = await UsersDAO.updateOnboarding(createdUser.uid, {
        currentStep: "profile",
        completedSteps: ["welcome"],
        lastActivityAt: new Date().toISOString(),
      });
      expect(step2?.onboardingCurrentStep).toBe("profile");
      expect(step2?.onboardingCompletedSteps).toBe(JSON.stringify(["welcome"]));

      // Act & Assert - Final step: Completion
      const finalStep = await UsersDAO.updateOnboarding(createdUser.uid, {
        currentStep: "confirmation",
        completedSteps: ["welcome", "profile", "kyc"],
        completed: true,
        completedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      });
      expect(finalStep?.onboardingCompleted).toBe(true);
      expect(finalStep?.onboardingCompletedAt).toBeDefined();
    });

    it("should update onboarding activity timestamp", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const initialActivity = createdUser.onboardingLastActivityAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      const newActivityTime = new Date().toISOString();

      // Act
      const updatedUser = await UsersDAO.updateOnboarding(createdUser.uid, {
        lastActivityAt: newActivityTime,
      });

      // Assert
      expect(updatedUser?.onboardingLastActivityAt).toBe(newActivityTime);
      expect(updatedUser?.onboardingLastActivityAt).not.toBe(initialActivity);
    });
  });

  describe("Onboarding Validation", () => {
    it("should handle onboarding updates for non-existent user", async () => {
      // Act
      const result = await UsersDAO.updateOnboarding("non-existent-uid", {
        currentStep: "welcome",
      });

      // Assert
      expect(result).toBeNull();
    });

    it("should preserve other user data during onboarding updates", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const originalEmail = createdUser.email;
      const originalLocale = createdUser.locale;

      // Act
      const updatedUser = await UsersDAO.updateOnboarding(createdUser.uid, {
        currentStep: "profile",
        lastActivityAt: new Date().toISOString(),
      });

      // Assert
      expect(updatedUser?.email).toBe(originalEmail);
      expect(updatedUser?.locale).toBe(originalLocale);
      expect(updatedUser?.onboardingCurrentStep).toBe("profile");
    });
  });
});
