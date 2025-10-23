import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { AccountsDAO, UsersDAO } from "@/database/drizzle";
import { TestDataGenerator, TestCleanup } from "@/tests/utils/test-helpers";

describe("AccountsDAO", () => {
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

  describe("Basic CRUD Operations", () => {
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
  });

  describe("Default Values", () => {
    it("should use default values for balance fields", async () => {
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
});
