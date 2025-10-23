import { describe, it, expect, beforeEach } from "vitest";
import { AssetsDAO } from "@/database/drizzle";
import { TestDataGenerator } from "@/tests/utils/test-helpers";

describe("Asset Management", () => {
  beforeEach(() => {
    TestDataGenerator.resetCounter();
  });

  describe("Asset Creation and Retrieval", () => {
    it("should create a new crypto asset", async () => {
      // Arrange
      const assetData = {
        id: `ASSET-${TestDataGenerator.generateUid()}`,
        class: "crypto",
        exchange: "BINANCE",
        symbol: "BTC",
        name: `Bitcoin-${Date.now()}`,
        status: "active",
        tradable: true,
        marginable: false,
        shortable: false,
        easyToBorrow: false,
        fractionable: true,
      };

      // Act
      const createdAsset = await AssetsDAO.create(assetData);

      // Assert
      expect(createdAsset).toBeDefined();
      expect(createdAsset.id).toBe(assetData.id);
      expect(createdAsset.symbol).toBe("BTC");
      expect(createdAsset.class).toBe("crypto");
      expect(createdAsset.tradable).toBe(true);
      expect(createdAsset.marginable).toBe(false);
      expect(createdAsset.fractionable).toBe(true);
    });

    it("should create a new stock asset", async () => {
      // Arrange
      const assetData = {
        id: `ASSET-${TestDataGenerator.generateUid()}`,
        class: "stock",
        exchange: "NYSE",
        symbol: "AAPL",
        name: `Apple Inc-${Date.now()}`,
        status: "active",
        tradable: true,
        marginable: true,
        shortable: true,
        easyToBorrow: true,
        fractionable: true,
      };

      // Act
      const createdAsset = await AssetsDAO.create(assetData);

      // Assert
      expect(createdAsset).toBeDefined();
      expect(createdAsset.class).toBe("stock");
      expect(createdAsset.exchange).toBe("NYSE");
      expect(createdAsset.marginable).toBe(true);
      expect(createdAsset.shortable).toBe(true);
      expect(createdAsset.easyToBorrow).toBe(true);
    });

    it("should get asset by ID", async () => {
      // Arrange
      const assetData = {
        id: `ASSET-${TestDataGenerator.generateUid()}`,
        class: "crypto",
        exchange: "COINBASE",
        symbol: "ETH",
        name: `Ethereum-${Date.now()}`,
        status: "active",
        tradable: true,
      };
      const createdAsset = await AssetsDAO.create(assetData);

      // Act
      const retrievedAsset = await AssetsDAO.getById(createdAsset.id);

      // Assert
      expect(retrievedAsset).toBeDefined();
      expect(retrievedAsset?.id).toBe(createdAsset.id);
      expect(retrievedAsset?.symbol).toBe("ETH");
      expect(retrievedAsset?.exchange).toBe("COINBASE");
    });

    it("should return null for non-existent asset ID", async () => {
      // Act
      const retrievedAsset = await AssetsDAO.getById("non-existent-id");

      // Assert
      expect(retrievedAsset).toBeNull();
    });

    it("should get asset by symbol", async () => {
      // Arrange
      const uniqueSymbol = `TEST${Date.now()}`;
      const assetData = {
        id: `ASSET-${TestDataGenerator.generateUid()}`,
        class: "crypto",
        exchange: "COINBASE",
        symbol: uniqueSymbol,
        name: `Test Asset-${Date.now()}`,
        status: "active",
        tradable: true,
      };
      await AssetsDAO.create(assetData);

      // Act
      const retrievedAsset = await AssetsDAO.getBySymbol(uniqueSymbol);

      // Assert
      expect(retrievedAsset).toBeDefined();
      expect(retrievedAsset?.symbol).toBe(uniqueSymbol);
      expect(retrievedAsset?.exchange).toBe("COINBASE");
    });
  });

  describe("Asset Discovery and Filtering", () => {
    it("should get assets by exchange", async () => {
      // Arrange
      const exchangeName = `EXCHANGE_${Date.now()}`;

      await AssetsDAO.create({
        id: `ASSET1-${TestDataGenerator.generateUid()}`,
        class: "crypto",
        exchange: exchangeName,
        symbol: `BTC${Date.now()}`,
        name: `Bitcoin-${Date.now()}-1`,
        status: "active",
        tradable: true,
      });

      await AssetsDAO.create({
        id: `ASSET2-${TestDataGenerator.generateUid()}`,
        class: "crypto",
        exchange: exchangeName,
        symbol: `ETH${Date.now()}`,
        name: `Ethereum-${Date.now()}-2`,
        status: "active",
        tradable: true,
      });

      // Act
      const exchangeAssets = await AssetsDAO.getByExchange(exchangeName);

      // Assert
      expect(exchangeAssets).toBeDefined();
      expect(exchangeAssets.length).toBe(2);
      expect(
        exchangeAssets.every((asset) => asset.exchange === exchangeName),
      ).toBe(true);
    });

    it("should search assets by symbol pattern", async () => {
      // Arrange
      const baseSymbol = `SEARCH${Date.now()}`;

      await AssetsDAO.create({
        id: `ASSET1-${TestDataGenerator.generateUid()}`,
        class: "crypto",
        exchange: "TEST_EXCHANGE",
        symbol: `${baseSymbol}_BTC`,
        name: `Bitcoin Search Test-${Date.now()}`,
        status: "active",
        tradable: true,
      });

      await AssetsDAO.create({
        id: `ASSET2-${TestDataGenerator.generateUid()}`,
        class: "crypto",
        exchange: "TEST_EXCHANGE",
        symbol: `${baseSymbol}_ETH`,
        name: `Ethereum Search Test-${Date.now()}`,
        status: "active",
        tradable: true,
      });

      // Act
      const searchResults = await AssetsDAO.search(baseSymbol);

      // Assert
      expect(searchResults).toBeDefined();
      expect(searchResults.length).toBeGreaterThanOrEqual(2);
      expect(
        searchResults.every((asset) => asset.symbol.includes(baseSymbol)),
      ).toBe(true);
    });

    it("should get tradable assets only", async () => {
      // Arrange
      const uniqueId1 = TestDataGenerator.generateUid();
      const uniqueId2 = TestDataGenerator.generateUid();

      // Create tradable asset
      await AssetsDAO.create({
        id: `TRADABLE-${uniqueId1}`,
        class: "crypto",
        exchange: "TEST_EXCHANGE",
        symbol: `TRADABLE${uniqueId1}`,
        name: `Tradable Asset-${uniqueId1}`,
        status: "active",
        tradable: true,
      });

      // Create non-tradable asset
      await AssetsDAO.create({
        id: `NON_TRADABLE-${uniqueId2}`,
        class: "crypto",
        exchange: "TEST_EXCHANGE",
        symbol: `NON_TRADABLE${uniqueId2}`,
        name: `Non-Tradable Asset-${uniqueId2}`,
        status: "active",
        tradable: false,
      });

      // Act
      const tradableAssets = await AssetsDAO.getTradable(10, 0);

      // Assert
      expect(tradableAssets).toBeDefined();
      expect(tradableAssets.every((asset) => asset.tradable === true)).toBe(
        true,
      );
      expect(
        tradableAssets.some((asset) => asset.id === `TRADABLE-${uniqueId1}`),
      ).toBe(true);
      expect(
        tradableAssets.some(
          (asset) => asset.id === `NON_TRADABLE-${uniqueId2}`,
        ),
      ).toBe(false);
    });

    it("should filter assets by class", async () => {
      // Arrange
      const timestamp = Date.now();

      await AssetsDAO.create({
        id: `CRYPTO-${TestDataGenerator.generateUid()}`,
        class: "crypto",
        exchange: "BINANCE",
        symbol: `CRYPTO${timestamp}`,
        name: `Crypto Asset-${timestamp}`,
        status: "active",
        tradable: true,
      });

      await AssetsDAO.create({
        id: `STOCK-${TestDataGenerator.generateUid()}`,
        class: "stock",
        exchange: "NYSE",
        symbol: `STOCK${timestamp}`,
        name: `Stock Asset-${timestamp}`,
        status: "active",
        tradable: true,
      });

      // Act - Get all tradable assets and filter by class
      const allAssets = await AssetsDAO.getTradable(100, 0);
      const cryptoAssets = allAssets.filter(
        (asset) => asset.class === "crypto",
      );
      const stockAssets = allAssets.filter((asset) => asset.class === "stock");

      // Assert
      expect(cryptoAssets.length).toBeGreaterThan(0);
      expect(stockAssets.length).toBeGreaterThan(0);
      expect(cryptoAssets.every((asset) => asset.class === "crypto")).toBe(
        true,
      );
      expect(stockAssets.every((asset) => asset.class === "stock")).toBe(true);
    });
  });

  describe("Asset Updates and Lifecycle", () => {
    it("should update asset status", async () => {
      // Arrange
      const assetData = {
        id: `ASSET-${TestDataGenerator.generateUid()}`,
        class: "crypto",
        exchange: "BINANCE",
        symbol: "BTC",
        name: `Bitcoin-${Date.now()}`,
        status: "active",
        tradable: true,
      };
      const createdAsset = await AssetsDAO.create(assetData);

      const updates = {
        status: "inactive",
        tradable: false,
      };

      // Act
      const updatedAsset = await AssetsDAO.update(createdAsset.id, updates);

      // Assert
      expect(updatedAsset).toBeDefined();
      expect(updatedAsset?.status).toBe("inactive");
      expect(updatedAsset?.tradable).toBe(false);
    });

    it("should update asset trading properties", async () => {
      // Arrange
      const assetData = {
        id: `ASSET-${TestDataGenerator.generateUid()}`,
        class: "stock",
        exchange: "NYSE",
        symbol: "AAPL",
        name: `Apple Inc-${Date.now()}`,
        status: "active",
        tradable: true,
        marginable: false,
        shortable: false,
        easyToBorrow: false,
        fractionable: false,
      };
      const createdAsset = await AssetsDAO.create(assetData);

      const updates = {
        marginable: true,
        shortable: true,
        easyToBorrow: true,
        fractionable: true,
      };

      // Act
      const updatedAsset = await AssetsDAO.update(createdAsset.id, updates);

      // Assert
      expect(updatedAsset?.marginable).toBe(true);
      expect(updatedAsset?.shortable).toBe(true);
      expect(updatedAsset?.easyToBorrow).toBe(true);
      expect(updatedAsset?.fractionable).toBe(true);
    });

    it("should delete asset", async () => {
      // Arrange
      const assetData = {
        id: `ASSET-${TestDataGenerator.generateUid()}`,
        class: "crypto",
        exchange: "BINANCE",
        symbol: "BTC",
        name: `Bitcoin-${Date.now()}`,
        status: "active",
        tradable: true,
      };
      const createdAsset = await AssetsDAO.create(assetData);

      // Act
      const deleted = await AssetsDAO.delete(createdAsset.id);

      // Assert
      expect(deleted).toBe(true);

      // Verify asset is deleted
      const retrievedAsset = await AssetsDAO.getById(createdAsset.id);
      expect(retrievedAsset).toBeNull();
    });
  });

  describe("Asset Validation and Constraints", () => {
    it("should use default values for boolean fields", async () => {
      // Arrange
      const assetData = {
        id: `ASSET-${TestDataGenerator.generateUid()}`,
        class: "crypto",
        exchange: "BINANCE",
        symbol: "BTC",
        name: `Bitcoin-${Date.now()}`,
        status: "active",
      };

      // Act
      const createdAsset = await AssetsDAO.create(assetData);

      // Assert - Check default values
      expect(createdAsset.tradable).toBe(false);
      expect(createdAsset.marginable).toBe(false);
      expect(createdAsset.shortable).toBe(false);
      expect(createdAsset.easyToBorrow).toBe(false);
      expect(createdAsset.fractionable).toBe(false);
    });

    it("should handle unique constraint violation for name", async () => {
      // Arrange
      const uniqueName = `Unique Asset-${Date.now()}`;

      const asset1 = {
        id: `ASSET1-${TestDataGenerator.generateUid()}`,
        class: "crypto",
        exchange: "BINANCE",
        symbol: "BTC1",
        name: uniqueName,
        status: "active",
        tradable: true,
      };

      const asset2 = {
        id: `ASSET2-${TestDataGenerator.generateUid()}`,
        class: "crypto",
        exchange: "COINBASE",
        symbol: "BTC2",
        name: uniqueName, // Same name
        status: "active",
        tradable: true,
      };

      await AssetsDAO.create(asset1);

      // Act & Assert
      await expect(AssetsDAO.create(asset2)).rejects.toThrow();
    });

    it("should return false when deleting non-existent asset", async () => {
      // Act
      const deleted = await AssetsDAO.delete("non-existent-id");

      // Assert
      expect(deleted).toBe(false);
    });

    it("should return null when updating non-existent asset", async () => {
      // Act
      const updated = await AssetsDAO.update("non-existent-id", {
        status: "inactive",
      });

      // Assert
      expect(updated).toBeNull();
    });

    it("should handle assets with various asset classes", async () => {
      // Arrange
      const assetClasses = ["crypto", "stock", "forex", "commodity"];
      const createdAssets = [];

      // Act
      for (const assetClass of assetClasses) {
        const asset = await AssetsDAO.create({
          id: `ASSET-${assetClass}-${TestDataGenerator.generateUid()}`,
          class: assetClass,
          exchange: "TEST_EXCHANGE",
          symbol: `${assetClass.toUpperCase()}${Date.now()}`,
          name: `${assetClass} Asset-${Date.now()}`,
          status: "active",
          tradable: true,
        });
        createdAssets.push(asset);
      }

      // Assert
      expect(createdAssets.length).toBe(4);
      expect(createdAssets.map((a) => a.class)).toEqual(assetClasses);
    });
  });
});
