import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { UsersDAO } from "@/database/drizzle";
import { TestDataGenerator, TestCleanup } from "@/tests/utils/test-helpers";

describe("User Preferences Operations", () => {
  beforeEach(() => {
    TestDataGenerator.resetCounter();
  });

  afterEach(async () => {
    await TestCleanup.cleanupUsers();
  });

  describe("Preferences Management", () => {
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

    it("should handle theme preferences", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const themes = ["light", "dark", "auto"];

      // Act & Assert
      for (const theme of themes) {
        const updatedUser = await UsersDAO.updatePreferences(createdUser.uid, {
          theme,
        });

        expect(updatedUser?.preferencesTheme).toBe(theme);
      }
    });

    it("should handle currency preferences", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const currencies = ["USD", "EUR", "USDC", "BTC"];

      // Act & Assert
      for (const currency of currencies) {
        const updatedUser = await UsersDAO.updatePreferences(createdUser.uid, {
          defaultQuote: currency,
        });

        expect(updatedUser?.preferencesDefaultQuote).toBe(currency);
      }
    });

    it("should handle notification preferences", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      // Act - Enable all notifications
      const allEnabled = await UsersDAO.updatePreferences(createdUser.uid, {
        news: true,
        orderFills: true,
        riskAlerts: true,
        statements: true,
      });

      // Assert
      expect(allEnabled?.preferencesNews).toBe(true);
      expect(allEnabled?.preferencesOrderFills).toBe(true);
      expect(allEnabled?.preferencesRiskAlerts).toBe(true);
      expect(allEnabled?.preferencesStatements).toBe(true);

      // Act - Disable all notifications
      const allDisabled = await UsersDAO.updatePreferences(createdUser.uid, {
        news: false,
        orderFills: false,
        riskAlerts: false,
        statements: false,
      });

      // Assert
      expect(allDisabled?.preferencesNews).toBe(false);
      expect(allDisabled?.preferencesOrderFills).toBe(false);
      expect(allDisabled?.preferencesRiskAlerts).toBe(false);
      expect(allDisabled?.preferencesStatements).toBe(false);
    });
  });

  describe("Preferences Validation", () => {
    it("should handle preferences updates for non-existent user", async () => {
      // Act
      const result = await UsersDAO.updatePreferences("non-existent-uid", {
        theme: "light",
      });

      // Assert
      expect(result).toBeNull();
    });

    it("should preserve other user data during preferences updates", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const originalEmail = createdUser.email;
      const originalKycStatus = createdUser.kycStatus;

      // Act
      const updatedUser = await UsersDAO.updatePreferences(createdUser.uid, {
        theme: "dark",
        news: false,
      });

      // Assert
      expect(updatedUser?.email).toBe(originalEmail);
      expect(updatedUser?.kycStatus).toBe(originalKycStatus);
      expect(updatedUser?.preferencesTheme).toBe("dark");
      expect(updatedUser?.preferencesNews).toBe(false);
    });

    it("should handle empty preferences update", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const originalTheme = createdUser.preferencesTheme;

      // Act
      const updatedUser = await UsersDAO.updatePreferences(createdUser.uid, {});

      // Assert
      expect(updatedUser?.preferencesTheme).toBe(originalTheme);
      expect(updatedUser?.updatedAt).toBeDefined(); // Should still update timestamp
    });
  });

  describe("Default Preferences", () => {
    it("should have correct default preferences on user creation", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();

      // Act
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      // Assert - Check default values
      expect(createdUser.preferencesTheme).toBe("dark");
      expect(createdUser.preferencesDefaultQuote).toBe("USDC");
      expect(createdUser.preferencesNews).toBe(true);
      expect(createdUser.preferencesOrderFills).toBe(true);
      expect(createdUser.preferencesRiskAlerts).toBe(true);
      expect(createdUser.preferencesStatements).toBe(true);
      expect(createdUser.preferencesHintsEnabled).toBe(true);
    });

    it("should preserve preferences across multiple updates", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      // Act - First update
      await UsersDAO.updatePreferences(createdUser.uid, {
        theme: "light",
        defaultQuote: "EUR",
      });

      // Act - Second update (different fields)
      const secondUpdate = await UsersDAO.updatePreferences(createdUser.uid, {
        news: false,
        riskAlerts: false,
      });

      // Assert - Previous preferences should be preserved
      expect(secondUpdate?.preferencesTheme).toBe("light"); // From first update
      expect(secondUpdate?.preferencesDefaultQuote).toBe("EUR"); // From first update
      expect(secondUpdate?.preferencesNews).toBe(false); // From second update
      expect(secondUpdate?.preferencesRiskAlerts).toBe(false); // From second update
      expect(secondUpdate?.preferencesOrderFills).toBe(true); // Default, unchanged
    });
  });
});
