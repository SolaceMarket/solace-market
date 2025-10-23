import { describe, it, expect, beforeEach } from "vitest";
import {
  HoldingsDAO,
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

describe("Portfolio Holdings Management", () => {
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

  describe("Holdings Creation and Management", () => {
    it("should create a new holding", async () => {
      // Arrange
      const holdingData = {
        id: `HOLDING-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 1.5,
        averageCost: 50000,
        marketValue: 75000,
        unrealizedPl: 25000,
        unrealizedPlPercent: 50,
      };

      // Act
      const createdHolding = await HoldingsDAO.create(holdingData);

      // Assert
      expect(createdHolding).toBeDefined();
      expect(createdHolding.portfolioId).toBe(testPortfolio.id);
      expect(createdHolding.assetId).toBe(testAsset.id);
      expect(createdHolding.quantity).toBe(1.5);
      expect(createdHolding.averageCost).toBe(50000);
      expect(createdHolding.marketValue).toBe(75000);
      expect(createdHolding.unrealizedPl).toBe(25000);
      expect(createdHolding.unrealizedPlPercent).toBe(50);
    });

    it("should get holding by ID", async () => {
      // Arrange
      const holdingData = {
        id: `HOLDING-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 2.0,
        averageCost: 45000,
      };
      const createdHolding = await HoldingsDAO.create(holdingData);

      // Act
      const retrievedHolding = await HoldingsDAO.getById(createdHolding.id);

      // Assert
      expect(retrievedHolding).toBeDefined();
      expect(retrievedHolding?.id).toBe(createdHolding.id);
      expect(retrievedHolding?.quantity).toBe(2.0);
      expect(retrievedHolding?.averageCost).toBe(45000);
    });

    it("should get holdings by portfolio ID", async () => {
      // Arrange
      const holding1Data = {
        id: `HOLDING1-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 1.0,
        averageCost: 50000,
      };

      const holding2Data = {
        id: `HOLDING2-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset2.id,
        symbol: testAsset2.symbol,
        quantity: 10.0,
        averageCost: 3000,
      };

      await HoldingsDAO.create(holding1Data);
      await HoldingsDAO.create(holding2Data);

      // Act
      const portfolioHoldings = await HoldingsDAO.getByPortfolioId(
        testPortfolio.id,
      );

      // Assert
      expect(portfolioHoldings).toBeDefined();
      expect(portfolioHoldings.length).toBe(2);
      expect(
        portfolioHoldings.every(
          (holding) => holding.portfolioId === testPortfolio.id,
        ),
      ).toBe(true);
    });

    it("should get holding by portfolio and asset", async () => {
      // Arrange
      const holdingData = {
        id: `HOLDING-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 3.0,
        averageCost: 40000,
      };
      await HoldingsDAO.create(holdingData);

      // Act
      const retrievedHolding = await HoldingsDAO.getByPortfolioAndAsset(
        testPortfolio.id,
        testAsset.id,
      );

      // Assert
      expect(retrievedHolding).toBeDefined();
      expect(retrievedHolding?.portfolioId).toBe(testPortfolio.id);
      expect(retrievedHolding?.assetId).toBe(testAsset.id);
      expect(retrievedHolding?.quantity).toBe(3.0);
    });

    it("should update holding", async () => {
      // Arrange
      const holdingData = {
        id: `HOLDING-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 1.0,
        averageCost: 50000,
      };
      const createdHolding = await HoldingsDAO.create(holdingData);

      const updates = {
        quantity: 2.0,
        marketValue: 100000,
        unrealizedPl: 50000,
        unrealizedPlPercent: 100,
      };

      // Act
      const updatedHolding = await HoldingsDAO.update(
        createdHolding.id,
        updates,
      );

      // Assert
      expect(updatedHolding).toBeDefined();
      expect(updatedHolding?.quantity).toBe(2.0);
      expect(updatedHolding?.marketValue).toBe(100000);
      expect(updatedHolding?.unrealizedPl).toBe(50000);
      expect(updatedHolding?.unrealizedPlPercent).toBe(100);
    });

    it("should delete holding", async () => {
      // Arrange
      const holdingData = {
        id: `HOLDING-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 1.0,
        averageCost: 50000,
      };
      const createdHolding = await HoldingsDAO.create(holdingData);

      // Act
      const deleted = await HoldingsDAO.delete(createdHolding.id);

      // Assert
      expect(deleted).toBe(true);

      // Verify holding is deleted
      const retrievedHolding = await HoldingsDAO.getById(createdHolding.id);
      expect(retrievedHolding).toBeNull();
    });
  });

  describe("Holdings Financial Calculations", () => {
    it("should use default values for optional fields", async () => {
      // Arrange
      const holdingData = {
        id: `HOLDING-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 1.0,
        averageCost: 50000,
      };

      // Act
      const createdHolding = await HoldingsDAO.create(holdingData);

      // Assert - Check default values
      expect(createdHolding.marketValue).toBe(0);
      expect(createdHolding.unrealizedPl).toBe(0);
      expect(createdHolding.unrealizedPlPercent).toBe(0);
      expect(createdHolding.dayChangeValue).toBe(0);
      expect(createdHolding.dayChangePercent).toBe(0);
    });

    it("should handle positive P&L calculations", async () => {
      // Arrange
      const holdingData = {
        id: `HOLDING-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 2.0,
        averageCost: 30000,
        currentPrice: 35000,
        marketValue: 70000,
        unrealizedPl: 10000,
        unrealizedPlPercent: 16.67,
      };

      // Act
      const createdHolding = await HoldingsDAO.create(holdingData);

      // Assert
      expect(createdHolding.unrealizedPl).toBe(10000);
      expect(createdHolding.unrealizedPlPercent).toBeCloseTo(16.67, 2);
      expect(createdHolding.marketValue).toBe(70000);
    });

    it("should handle negative P&L calculations", async () => {
      // Arrange
      const holdingData = {
        id: `HOLDING-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 1.0,
        averageCost: 50000,
        currentPrice: 40000,
        marketValue: 40000,
        unrealizedPl: -10000,
        unrealizedPlPercent: -20,
      };

      // Act
      const createdHolding = await HoldingsDAO.create(holdingData);

      // Assert
      expect(createdHolding.unrealizedPl).toBe(-10000);
      expect(createdHolding.unrealizedPlPercent).toBe(-20);
      expect(createdHolding.marketValue).toBe(40000);
    });

    it("should handle day change calculations", async () => {
      // Arrange
      const holdingData = {
        id: `HOLDING-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 5.0,
        averageCost: 1000,
        dayChangeValue: 250,
        dayChangePercent: 5.0,
      };

      // Act
      const createdHolding = await HoldingsDAO.create(holdingData);

      // Assert
      expect(createdHolding.dayChangeValue).toBe(250);
      expect(createdHolding.dayChangePercent).toBe(5.0);
    });
  });

  describe("Holdings Advanced Operations", () => {
    it("should handle upsert operation - insert new holding", async () => {
      // Arrange
      const holdingData = {
        id: `HOLDING-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 1.0,
        averageCost: 50000,
      };

      // Act
      const upsertedHolding = await HoldingsDAO.upsert(holdingData);

      // Assert
      expect(upsertedHolding).toBeDefined();
      expect(upsertedHolding.id).toBe(holdingData.id);
      expect(upsertedHolding.quantity).toBe(1.0);
    });

    it("should handle upsert operation - update existing holding", async () => {
      // Arrange - Create initial holding
      const initialHoldingData = {
        id: `HOLDING-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 1.0,
        averageCost: 50000,
      };
      await HoldingsDAO.create(initialHoldingData);

      // Arrange - Upsert data with same portfolio and asset
      const upsertData = {
        id: `HOLDING-NEW-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 2.0,
        averageCost: 55000,
      };

      // Act
      const upsertedHolding = await HoldingsDAO.upsert(upsertData);

      // Assert - Should update existing holding
      expect(upsertedHolding).toBeDefined();
      expect(upsertedHolding.quantity).toBe(2.0);
      expect(upsertedHolding.averageCost).toBe(55000);

      // Verify only one holding exists for this portfolio-asset combination
      const allHoldings = await HoldingsDAO.getByPortfolioId(testPortfolio.id);
      const assetHoldings = allHoldings.filter(
        (h) => h.assetId === testAsset.id,
      );
      expect(assetHoldings.length).toBe(1);
    });

    it("should handle fractional quantities", async () => {
      // Arrange
      const holdingData = {
        id: `HOLDING-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 0.123456789,
        averageCost: 50000.123456,
        marketValue: 6172.839506784,
      };

      // Act
      const createdHolding = await HoldingsDAO.create(holdingData);

      // Assert
      expect(createdHolding.quantity).toBeCloseTo(0.123456789, 9);
      expect(createdHolding.averageCost).toBeCloseTo(50000.123456, 6);
      expect(createdHolding.marketValue).toBeCloseTo(6172.839506784, 6);
    });
  });

  describe("Holdings Validation and Error Handling", () => {
    it("should return null for non-existent holding ID", async () => {
      // Act
      const retrievedHolding = await HoldingsDAO.getById("non-existent-id");

      // Assert
      expect(retrievedHolding).toBeNull();
    });

    it("should return false when deleting non-existent holding", async () => {
      // Act
      const deleted = await HoldingsDAO.delete("non-existent-id");

      // Assert
      expect(deleted).toBe(false);
    });

    it("should return null when updating non-existent holding", async () => {
      // Act
      const updated = await HoldingsDAO.update("non-existent-id", {
        quantity: 5.0,
      });

      // Assert
      expect(updated).toBeNull();
    });

    it("should return null for non-existent portfolio-asset combination", async () => {
      // Act
      const holding = await HoldingsDAO.getByPortfolioAndAsset(
        "non-existent-portfolio",
        "non-existent-asset",
      );

      // Assert
      expect(holding).toBeNull();
    });

    it("should return empty array for portfolio with no holdings", async () => {
      // Arrange - Create empty portfolio
      const emptyPortfolioData = {
        id: `EMPTY-PORTFOLIO-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Empty Portfolio ${TestDataGenerator.generateUid()}`,
      };
      const emptyPortfolio = await PortfoliosDAO.create(emptyPortfolioData);

      // Act
      const holdings = await HoldingsDAO.getByPortfolioId(emptyPortfolio.id);

      // Assert
      expect(holdings).toBeDefined();
      expect(holdings.length).toBe(0);
    });

    it("should enforce unique portfolio-asset constraint", async () => {
      // Arrange - Create first holding
      const holding1Data = {
        id: `HOLDING1-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 1.0,
        averageCost: 50000,
      };

      const holding2Data = {
        id: `HOLDING2-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id, // Same asset in same portfolio
        symbol: testAsset.symbol,
        quantity: 2.0,
        averageCost: 55000,
      };

      await HoldingsDAO.create(holding1Data);

      // Act & Assert - Should prevent duplicate portfolio-asset combination
      await expect(HoldingsDAO.create(holding2Data)).rejects.toThrow();
    });
  });
});
