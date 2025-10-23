import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { AccountsDAO, UsersDAO } from "@/database/drizzle";
import { TestDataGenerator, TestCleanup } from "@/tests/utils/test-helpers";

describe("Account Management", () => {
  let testUserId: string;

  beforeEach(async () => {
    TestDataGenerator.resetCounter();

    // Create a test user for account operations
    const userData = TestDataGenerator.generateUser();
    const user = await UsersDAO.create(userData);
    testUserId = user.uid;
    TestCleanup.trackUser(testUserId);
  });

  afterEach(async () => {
    await TestCleanup.cleanupUsers();
  });

  describe("Account Creation and Retrieval", () => {
    it("should create a new account", async () => {
      // Arrange
      const accountData = {
        id: TestDataGenerator.generateUid(),
        userId: testUserId,
        assetId: "BTC",
        balance: 100.0,
        available: 90.0,
        locked: 10.0,
      };

      // Act
      const createdAccount = await AccountsDAO.create(accountData);

      // Assert
      expect(createdAccount).toBeDefined();
      expect(createdAccount.id).toBe(accountData.id);
      expect(createdAccount.userId).toBe(testUserId);
      expect(createdAccount.assetId).toBe("BTC");
      expect(createdAccount.balance).toBe(100.0);
      expect(createdAccount.available).toBe(90.0);
      expect(createdAccount.locked).toBe(10.0);
    });

    it("should get account by ID", async () => {
      // Arrange
      const accountData = {
        id: TestDataGenerator.generateUid(),
        userId: testUserId,
        assetId: "ETH",
        balance: 50.0,
        available: 50.0,
        locked: 0.0,
      };
      const createdAccount = await AccountsDAO.create(accountData);

      // Act
      const retrievedAccount = await AccountsDAO.getById(createdAccount.id);

      // Assert
      expect(retrievedAccount).toBeDefined();
      expect(retrievedAccount?.id).toBe(createdAccount.id);
      expect(retrievedAccount?.assetId).toBe("ETH");
    });

    it("should return null for non-existent account ID", async () => {
      // Act
      const retrievedAccount = await AccountsDAO.getById("non-existent-id");

      // Assert
      expect(retrievedAccount).toBeNull();
    });

    it("should get accounts by user ID", async () => {
      // Arrange
      await AccountsDAO.create({
        id: TestDataGenerator.generateUid(),
        userId: testUserId,
        assetId: "BTC",
        balance: 100.0,
        available: 100.0,
        locked: 0.0,
      });

      await AccountsDAO.create({
        id: TestDataGenerator.generateUid(),
        userId: testUserId,
        assetId: "ETH",
        balance: 50.0,
        available: 50.0,
        locked: 0.0,
      });

      // Act
      const userAccounts = await AccountsDAO.getByUserId(testUserId);

      // Assert
      expect(userAccounts).toBeDefined();
      expect(userAccounts.length).toBe(2);

      const assetIds = userAccounts.map((acc) => acc.assetId);
      expect(assetIds).toContain("BTC");
      expect(assetIds).toContain("ETH");
    });

    it("should get account by user and asset", async () => {
      // Arrange
      const accountData = {
        id: TestDataGenerator.generateUid(),
        userId: testUserId,
        assetId: "USDC",
        balance: 1000.0,
        available: 800.0,
        locked: 200.0,
      };
      await AccountsDAO.create(accountData);

      // Act
      const retrievedAccount = await AccountsDAO.getByUserAndAsset(
        testUserId,
        "USDC",
      );

      // Assert
      expect(retrievedAccount).toBeDefined();
      expect(retrievedAccount?.userId).toBe(testUserId);
      expect(retrievedAccount?.assetId).toBe("USDC");
      expect(retrievedAccount?.balance).toBe(1000.0);
    });
  });

  describe("Account Balance Management", () => {
    it("should update account balance", async () => {
      // Arrange
      const accountData = {
        id: TestDataGenerator.generateUid(),
        userId: testUserId,
        assetId: "BTC",
        balance: 100.0,
        available: 100.0,
        locked: 0.0,
      };
      const createdAccount = await AccountsDAO.create(accountData);

      const balanceUpdates = {
        balance: 150.0,
        available: 120.0,
        locked: 30.0,
      };

      // Act
      const updatedAccount = await AccountsDAO.updateBalance(
        createdAccount.id,
        balanceUpdates,
      );

      // Assert
      expect(updatedAccount).toBeDefined();
      expect(updatedAccount?.balance).toBe(150.0);
      expect(updatedAccount?.available).toBe(120.0);
      expect(updatedAccount?.locked).toBe(30.0);
    });

    it("should handle partial balance updates", async () => {
      // Arrange
      const accountData = {
        id: TestDataGenerator.generateUid(),
        userId: testUserId,
        assetId: "ETH",
        balance: 100.0,
        available: 80.0,
        locked: 20.0,
      };
      const createdAccount = await AccountsDAO.create(accountData);

      // Act - Update only available balance
      const updatedAccount = await AccountsDAO.updateBalance(
        createdAccount.id,
        { available: 60.0, locked: 40.0 },
      );

      // Assert
      expect(updatedAccount?.balance).toBe(100.0); // Should remain unchanged
      expect(updatedAccount?.available).toBe(60.0);
      expect(updatedAccount?.locked).toBe(40.0);
    });

    it("should handle zero balances", async () => {
      // Arrange
      const accountData = {
        id: TestDataGenerator.generateUid(),
        userId: testUserId,
        assetId: "BTC",
        balance: 100.0,
        available: 100.0,
        locked: 0.0,
      };
      const createdAccount = await AccountsDAO.create(accountData);

      // Act - Zero out all balances
      const updatedAccount = await AccountsDAO.updateBalance(
        createdAccount.id,
        {
          balance: 0.0,
          available: 0.0,
          locked: 0.0,
        },
      );

      // Assert
      expect(updatedAccount?.balance).toBe(0.0);
      expect(updatedAccount?.available).toBe(0.0);
      expect(updatedAccount?.locked).toBe(0.0);
    });

    it("should handle large balance values", async () => {
      // Arrange
      const accountData = {
        id: TestDataGenerator.generateUid(),
        userId: testUserId,
        assetId: "USDC",
        balance: 0.0,
        available: 0.0,
        locked: 0.0,
      };
      const createdAccount = await AccountsDAO.create(accountData);

      const largeValue = 999999999.999999;

      // Act
      const updatedAccount = await AccountsDAO.updateBalance(
        createdAccount.id,
        {
          balance: largeValue,
          available: largeValue * 0.9,
          locked: largeValue * 0.1,
        },
      );

      // Assert
      expect(updatedAccount?.balance).toBeCloseTo(largeValue, 5);
      expect(updatedAccount?.available).toBeCloseTo(largeValue * 0.9, 5);
      expect(updatedAccount?.locked).toBeCloseTo(largeValue * 0.1, 5);
    });
  });

  describe("Account Lifecycle", () => {
    it("should delete account", async () => {
      // Arrange
      const accountData = {
        id: TestDataGenerator.generateUid(),
        userId: testUserId,
        assetId: "BTC",
        balance: 100.0,
        available: 100.0,
        locked: 0.0,
      };
      const createdAccount = await AccountsDAO.create(accountData);

      // Act
      const deleted = await AccountsDAO.delete(createdAccount.id);

      // Assert
      expect(deleted).toBe(true);

      // Verify account is deleted
      const retrievedAccount = await AccountsDAO.getById(createdAccount.id);
      expect(retrievedAccount).toBeNull();
    });

    it("should handle multiple accounts for same user", async () => {
      // Arrange
      const assets = ["BTC", "ETH", "USDC", "ADA"];
      const createdAccounts = [];

      // Act - Create multiple accounts
      for (const asset of assets) {
        const account = await AccountsDAO.create({
          id: TestDataGenerator.generateUid(),
          userId: testUserId,
          assetId: asset,
          balance: 100.0,
          available: 100.0,
          locked: 0.0,
        });
        createdAccounts.push(account);
      }

      // Act - Retrieve all user accounts
      const userAccounts = await AccountsDAO.getByUserId(testUserId);

      // Assert
      expect(userAccounts.length).toBe(4);
      expect(
        createdAccounts.every((acc) =>
          userAccounts.some((userAcc) => userAcc.id === acc.id),
        ),
      ).toBe(true);
    });

    it("should handle account creation with default values", async () => {
      // Arrange
      const accountData = {
        id: TestDataGenerator.generateUid(),
        userId: testUserId,
        assetId: "BTC",
      };

      // Act
      const createdAccount = await AccountsDAO.create(accountData);

      // Assert
      expect(createdAccount.balance).toBe(0);
      expect(createdAccount.available).toBe(0);
      expect(createdAccount.locked).toBe(0);
    });
  });

  describe("Error Handling", () => {
    it("should return false when deleting non-existent account", async () => {
      // Act
      const deleted = await AccountsDAO.delete("non-existent-id");

      // Assert
      expect(deleted).toBe(false);
    });

    it("should return null when updating non-existent account", async () => {
      // Act
      const updated = await AccountsDAO.updateBalance("non-existent-id", {
        balance: 100.0,
      });

      // Assert
      expect(updated).toBeNull();
    });

    it("should return null for non-existent user-asset combination", async () => {
      // Act
      const account = await AccountsDAO.getByUserAndAsset(
        testUserId,
        "NON_EXISTENT_ASSET",
      );

      // Assert
      expect(account).toBeNull();
    });

    it("should return empty array for user with no accounts", async () => {
      // Arrange - Create another user
      const newUserData = TestDataGenerator.generateUser();
      const newUser = await UsersDAO.create(newUserData);
      TestCleanup.trackUser(newUser.uid);

      // Act
      const userAccounts = await AccountsDAO.getByUserId(newUser.uid);

      // Assert
      expect(userAccounts).toBeDefined();
      expect(userAccounts.length).toBe(0);
    });
  });
});
