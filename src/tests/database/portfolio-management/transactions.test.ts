import { describe, it, expect, beforeEach } from "vitest";
import {
  TransactionsDAO,
  PortfoliosDAO,
  UsersDAO,
  AssetsDAO,
} from "@/database/drizzle";
import { TestDataGenerator } from "@/tests/utils/test-helpers";
import type {
  SelectUser,
  SelectPortfolio,
  SelectAsset,
} from "@/database/drizzle/schemas";

describe("Portfolio Transactions Management", () => {
  let testUser: SelectUser;
  let testPortfolio: SelectPortfolio;
  let testAsset: SelectAsset;
  let testAsset2: SelectAsset;

  beforeEach(async () => {
    TestDataGenerator.resetCounter();

    // Create test dependencies
    const userData = {
      uid: `USER-${TestDataGenerator.generateUid()}`,
      email: `test-${TestDataGenerator.generateUid()}@example.com`,
      role: "user",
      status: "active",
      kycStatus: "pending",
      createdAt: new Date().toISOString(),
      onboardingStartedAt: new Date().toISOString(),
      onboardingLastActivityAt: new Date().toISOString(),
    };
    testUser = await UsersDAO.create(userData);

    const portfolioData = {
      id: `PORTFOLIO-${TestDataGenerator.generateUid()}`,
      userId: testUser.uid,
      name: `Test Portfolio ${TestDataGenerator.generateUid()}`,
    };
    testPortfolio = await PortfoliosDAO.create(portfolioData);

    const assetData = {
      id: `ASSET-${TestDataGenerator.generateUid()}`,
      class: "crypto",
      exchange: "BINANCE",
      symbol: `BTC${Date.now()}`,
      name: `Bitcoin-${Date.now()}`,
      status: "active",
      tradable: true,
    };
    testAsset = await AssetsDAO.create(assetData);

    const asset2Data = {
      id: `ASSET2-${TestDataGenerator.generateUid()}`,
      class: "crypto",
      exchange: "COINBASE",
      symbol: `ETH${Date.now()}`,
      name: `Ethereum-${Date.now()}`,
      status: "active",
      tradable: true,
    };
    testAsset2 = await AssetsDAO.create(asset2Data);
  });

  describe("Transaction Creation and Types", () => {
    it("should create a buy transaction", async () => {
      // Arrange
      const transactionData = {
        id: `TRANSACTION-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "buy" as const,
        quantity: 1.0,
        price: 50000,
        totalValue: 50000,
        transactionDate: new Date().toISOString(),
      };

      // Act
      const createdTransaction = await TransactionsDAO.create(transactionData);

      // Assert
      expect(createdTransaction).toBeDefined();
      expect(createdTransaction.portfolioId).toBe(testPortfolio.id);
      expect(createdTransaction.type).toBe("buy");
      expect(createdTransaction.quantity).toBe(1.0);
      expect(createdTransaction.price).toBe(50000);
      expect(createdTransaction.totalValue).toBe(50000);
    });

    it("should create a sell transaction", async () => {
      // Arrange
      const transactionData = {
        id: `TRANSACTION-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "sell" as const,
        quantity: 0.5,
        price: 55000,
        totalValue: 27500,
        transactionDate: new Date().toISOString(),
      };

      // Act
      const createdTransaction = await TransactionsDAO.create(transactionData);

      // Assert
      expect(createdTransaction).toBeDefined();
      expect(createdTransaction.type).toBe("sell");
      expect(createdTransaction.quantity).toBe(0.5);
      expect(createdTransaction.price).toBe(55000);
      expect(createdTransaction.totalValue).toBe(27500);
    });

    it("should create deposit and withdrawal transactions", async () => {
      // Arrange - Deposit
      const depositData = {
        id: `DEPOSIT-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "deposit" as const,
        quantity: 5000,
        price: 1, // For cash deposits
        totalValue: 5000,
        transactionDate: new Date().toISOString(),
      };

      // Arrange - Withdrawal
      const withdrawalData = {
        id: `WITHDRAWAL-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "withdrawal" as const,
        quantity: 1000,
        price: 1,
        totalValue: 1000,
        transactionDate: new Date().toISOString(),
      };

      // Act
      const deposit = await TransactionsDAO.create(depositData);
      const withdrawal = await TransactionsDAO.create(withdrawalData);

      // Assert
      expect(deposit.type).toBe("deposit");
      expect(withdrawal.type).toBe("withdrawal");
      expect(deposit.totalValue).toBe(5000);
      expect(withdrawal.totalValue).toBe(1000);
    });

    it("should create dividend and fee transactions", async () => {
      // Arrange - Dividend
      const dividendData = {
        id: `DIVIDEND-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "dividend" as const,
        quantity: 100,
        price: 1,
        totalValue: 100,
        transactionDate: new Date().toISOString(),
      };

      // Arrange - Fee
      const feeData = {
        id: `FEE-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "fee" as const,
        quantity: 25,
        price: 1,
        totalValue: 25,
        transactionDate: new Date().toISOString(),
      };

      // Act
      const dividend = await TransactionsDAO.create(dividendData);
      const fee = await TransactionsDAO.create(feeData);

      // Assert
      expect(dividend.type).toBe("dividend");
      expect(fee.type).toBe("fee");
      expect(dividend.totalValue).toBe(100);
      expect(fee.totalValue).toBe(25);
    });
  });

  describe("Transaction Retrieval and Queries", () => {
    it("should get transaction by ID", async () => {
      // Arrange
      const transactionData = {
        id: `TRANSACTION-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "buy" as const,
        quantity: 2.0,
        price: 45000,
        totalValue: 90000,
        transactionDate: new Date().toISOString(),
      };
      const createdTransaction = await TransactionsDAO.create(transactionData);

      // Act
      const retrievedTransaction = await TransactionsDAO.getById(
        createdTransaction.id,
      );

      // Assert
      expect(retrievedTransaction).toBeDefined();
      expect(retrievedTransaction?.id).toBe(createdTransaction.id);
      expect(retrievedTransaction?.type).toBe("buy");
      expect(retrievedTransaction?.quantity).toBe(2.0);
    });

    it("should get transactions by portfolio ID", async () => {
      // Arrange
      const transaction1Data = {
        id: `TRANSACTION1-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "buy" as const,
        quantity: 1.0,
        price: 50000,
        totalValue: 50000,
        transactionDate: new Date().toISOString(),
      };

      const transaction2Data = {
        id: `TRANSACTION2-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset2.id,
        symbol: testAsset2.symbol,
        type: "buy" as const,
        quantity: 10.0,
        price: 3000,
        totalValue: 30000,
        transactionDate: new Date().toISOString(),
      };

      await TransactionsDAO.create(transaction1Data);
      await TransactionsDAO.create(transaction2Data);

      // Act
      const portfolioTransactions = await TransactionsDAO.getByPortfolioId(
        testPortfolio.id,
      );

      // Assert
      expect(portfolioTransactions).toBeDefined();
      expect(portfolioTransactions.length).toBe(2);
      expect(
        portfolioTransactions.every(
          (tx) => tx.portfolioId === testPortfolio.id,
        ),
      ).toBe(true);
    });

    it("should get transactions by portfolio and asset", async () => {
      // Arrange - Create transactions for different assets
      await TransactionsDAO.create({
        id: `TX1-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "buy" as const,
        quantity: 1.0,
        price: 50000,
        totalValue: 50000,
        transactionDate: new Date().toISOString(),
      });

      await TransactionsDAO.create({
        id: `TX2-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "sell" as const,
        quantity: 0.5,
        price: 55000,
        totalValue: 27500,
        transactionDate: new Date().toISOString(),
      });

      await TransactionsDAO.create({
        id: `TX3-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset2.id,
        symbol: testAsset2.symbol,
        type: "buy" as const,
        quantity: 5.0,
        price: 3000,
        totalValue: 15000,
        transactionDate: new Date().toISOString(),
      });

      // Act
      const assetTransactions = await TransactionsDAO.getByPortfolioAndAsset(
        testPortfolio.id,
        testAsset.id,
      );

      // Assert
      expect(assetTransactions).toBeDefined();
      expect(assetTransactions.length).toBe(2);
      expect(assetTransactions.every((tx) => tx.assetId === testAsset.id)).toBe(
        true,
      );
    });

    it("should order transactions by date descending", async () => {
      // Arrange - Create transactions with different dates
      const baseDate = new Date();

      const oldTransaction = {
        id: `OLD-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "buy" as const,
        quantity: 1.0,
        price: 40000,
        totalValue: 40000,
        transactionDate: new Date(baseDate.getTime() - 86400000).toISOString(), // 1 day ago
      };

      const newTransaction = {
        id: `NEW-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "sell" as const,
        quantity: 0.5,
        price: 60000,
        totalValue: 30000,
        transactionDate: baseDate.toISOString(), // Now
      };

      await TransactionsDAO.create(oldTransaction);
      await TransactionsDAO.create(newTransaction);

      // Act
      const transactions = await TransactionsDAO.getByPortfolioId(
        testPortfolio.id,
      );

      // Assert - Should be ordered by date descending (newest first)
      expect(transactions.length).toBe(2);
      expect(
        new Date(transactions[0].transactionDate).getTime(),
      ).toBeGreaterThan(new Date(transactions[1].transactionDate).getTime());
    });
  });

  describe("Transaction Financial Details", () => {
    it("should handle transaction fees", async () => {
      // Arrange
      const transactionData = {
        id: `TRANSACTION-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "buy" as const,
        quantity: 1.0,
        price: 50000,
        totalValue: 50000,
        fee: 25.5, // Transaction fee
        transactionDate: new Date().toISOString(),
      };

      // Act
      const createdTransaction = await TransactionsDAO.create(transactionData);

      // Assert
      expect(createdTransaction.fee).toBe(25.5);
    });

    it("should use default values for optional fields", async () => {
      // Arrange
      const transactionData = {
        id: `TRANSACTION-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "buy" as const,
        quantity: 1.0,
        price: 50000,
        totalValue: 50000,
        transactionDate: new Date().toISOString(),
      };

      // Act
      const createdTransaction = await TransactionsDAO.create(transactionData);

      // Assert - Check default values
      expect(createdTransaction.fee).toBe(0);
      expect(createdTransaction.notes).toBeNull();
    });

    it("should handle transaction notes", async () => {
      // Arrange
      const transactionData = {
        id: `TRANSACTION-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "buy" as const,
        quantity: 1.0,
        price: 50000,
        totalValue: 50000,
        notes: "Dollar cost averaging purchase",
        transactionDate: new Date().toISOString(),
      };

      // Act
      const createdTransaction = await TransactionsDAO.create(transactionData);

      // Assert
      expect(createdTransaction.notes).toBe("Dollar cost averaging purchase");
    });

    it("should handle fractional quantities and prices", async () => {
      // Arrange
      const transactionData = {
        id: `TRANSACTION-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "buy" as const,
        quantity: 0.123456789,
        price: 50000.123456,
        totalValue: 6172.839506784,
        fee: 5.15,
        transactionDate: new Date().toISOString(),
      };

      // Act
      const createdTransaction = await TransactionsDAO.create(transactionData);

      // Assert
      expect(createdTransaction.quantity).toBeCloseTo(0.123456789, 9);
      expect(createdTransaction.price).toBeCloseTo(50000.123456, 6);
      expect(createdTransaction.totalValue).toBeCloseTo(6172.839506784, 6);
      expect(createdTransaction.fee).toBe(5.15);
    });
  });

  describe("Bulk Operations and Performance", () => {
    it("should handle bulk insert transactions", async () => {
      // Arrange
      const transactions = [];
      for (let i = 0; i < 5; i++) {
        transactions.push({
          id: `BULK-${i}-${TestDataGenerator.generateUid()}`,
          portfolioId: testPortfolio.id,
          assetId: testAsset.id,
          symbol: testAsset.symbol,
          type: "buy" as const,
          quantity: 1.0 + i,
          price: 50000 + i * 1000,
          totalValue: (1.0 + i) * (50000 + i * 1000),
          transactionDate: new Date(Date.now() + i * 1000).toISOString(),
        });
      }

      // Act
      const createdTransactions =
        await TransactionsDAO.bulkInsert(transactions);

      // Assert
      expect(createdTransactions.length).toBe(5);
      expect(
        createdTransactions.every((tx) => tx.portfolioId === testPortfolio.id),
      ).toBe(true);
    });

    it("should handle pagination in portfolio queries", async () => {
      // Arrange - Create multiple transactions
      const transactionPromises = [];
      for (let i = 0; i < 10; i++) {
        transactionPromises.push(
          TransactionsDAO.create({
            id: `PAGE-${i}-${TestDataGenerator.generateUid()}`,
            portfolioId: testPortfolio.id,
            assetId: testAsset.id,
            symbol: testAsset.symbol,
            type: "buy" as const,
            quantity: 1.0,
            price: 50000,
            totalValue: 50000,
            transactionDate: new Date(Date.now() + i * 1000).toISOString(),
          }),
        );
      }
      await Promise.all(transactionPromises);

      // Act - Get first page
      const firstPage = await TransactionsDAO.getByPortfolioId(
        testPortfolio.id,
        5,
        0,
      );

      // Act - Get second page
      const secondPage = await TransactionsDAO.getByPortfolioId(
        testPortfolio.id,
        5,
        5,
      );

      // Assert
      expect(firstPage.length).toBe(5);
      expect(secondPage.length).toBe(5);
      expect(firstPage[0].id).not.toBe(secondPage[0].id);
    });
  });

  describe("Transaction Validation and Error Handling", () => {
    it("should delete transaction", async () => {
      // Arrange
      const transactionData = {
        id: `TRANSACTION-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "buy" as const,
        quantity: 1.0,
        price: 50000,
        totalValue: 50000,
        transactionDate: new Date().toISOString(),
      };
      const createdTransaction = await TransactionsDAO.create(transactionData);

      // Act
      const deleted = await TransactionsDAO.delete(createdTransaction.id);

      // Assert
      expect(deleted).toBe(true);

      // Verify transaction is deleted
      const retrievedTransaction = await TransactionsDAO.getById(
        createdTransaction.id,
      );
      expect(retrievedTransaction).toBeNull();
    });

    it("should return null for non-existent transaction ID", async () => {
      // Act
      const retrievedTransaction =
        await TransactionsDAO.getById("non-existent-id");

      // Assert
      expect(retrievedTransaction).toBeNull();
    });

    it("should return false when deleting non-existent transaction", async () => {
      // Act
      const deleted = await TransactionsDAO.delete("non-existent-id");

      // Assert
      expect(deleted).toBe(false);
    });

    it("should return empty array for portfolio with no transactions", async () => {
      // Arrange - Create empty portfolio
      const emptyPortfolioData = {
        id: `EMPTY-PORTFOLIO-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Empty Portfolio ${TestDataGenerator.generateUid()}`,
      };
      const emptyPortfolio = await PortfoliosDAO.create(emptyPortfolioData);

      // Act
      const transactions = await TransactionsDAO.getByPortfolioId(
        emptyPortfolio.id,
      );

      // Assert
      expect(transactions).toBeDefined();
      expect(transactions.length).toBe(0);
    });

    it("should return empty array for non-existent portfolio-asset combination", async () => {
      // Act
      const transactions = await TransactionsDAO.getByPortfolioAndAsset(
        "non-existent-portfolio",
        "non-existent-asset",
      );

      // Assert
      expect(transactions).toBeDefined();
      expect(transactions.length).toBe(0);
    });

    it("should handle large transaction values", async () => {
      // Arrange
      const largeValue = 999999999.999999;
      const transactionData = {
        id: `LARGE-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: "buy" as const,
        quantity: 10000.123456,
        price: 99999.999999,
        totalValue: largeValue,
        transactionDate: new Date().toISOString(),
      };

      // Act
      const createdTransaction = await TransactionsDAO.create(transactionData);

      // Assert
      expect(createdTransaction.totalValue).toBeCloseTo(largeValue, 5);
      expect(createdTransaction.quantity).toBeCloseTo(10000.123456, 6);
      expect(createdTransaction.price).toBeCloseTo(99999.999999, 6);
    });
  });
});
