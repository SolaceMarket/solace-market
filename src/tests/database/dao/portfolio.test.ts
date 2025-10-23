import { describe, it, expect, beforeEach } from 'vitest';
import { PortfoliosDAO, HoldingsDAO, TransactionsDAO, UsersDAO, AssetsDAO } from '@/database/drizzle';
import { TestDataGenerator } from '../../utils/test-helpers';
import type { SelectUser } from '@/database/drizzle/schemas/users';
import type { SelectPortfolio } from '@/database/drizzle/schemas/portfolios';
import type { SelectAsset } from '@/database/drizzle/schemas/assets';

describe('PortfoliosDAO', () => {
  let testUser: SelectUser;

  beforeEach(async () => {
    TestDataGenerator.resetCounter();
    
    // Create test user for portfolio tests
    const userData = {
      uid: `USER-${TestDataGenerator.generateUid()}`,
      email: `test-${TestDataGenerator.generateUid()}@example.com`,
      displayName: `Test User ${TestDataGenerator.generateUid()}`,
      role: 'user',
      status: 'active',
      kycStatus: 'pending',
    };
    testUser = await UsersDAO.create(userData);
  });

  describe('Basic CRUD Operations', () => {
    it('should create a new portfolio', async () => {
      // Arrange
      const portfolioData = {
        id: `PORTFOLIO-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Test Portfolio ${TestDataGenerator.generateUid()}`,
        description: 'A test portfolio',
      };

      // Act
      const createdPortfolio = await PortfoliosDAO.create(portfolioData);

      // Assert
      expect(createdPortfolio).toBeDefined();
      expect(createdPortfolio.userId).toBe(testUser.uid);
      expect(createdPortfolio.name).toBe(portfolioData.name);
      expect(createdPortfolio.description).toBe('A test portfolio');
    });

    it('should get portfolio by ID', async () => {
      // Arrange
      const portfolioData = {
        id: `PORTFOLIO-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Test Portfolio ${TestDataGenerator.generateUid()}`,
        description: 'A test portfolio',
      };
      const createdPortfolio = await PortfoliosDAO.create(portfolioData);

      // Act
      const retrievedPortfolio = await PortfoliosDAO.getById(createdPortfolio.id);

      // Assert
      expect(retrievedPortfolio).toBeDefined();
      expect(retrievedPortfolio?.id).toBe(createdPortfolio.id);
      expect(retrievedPortfolio?.name).toBe(portfolioData.name);
    });

    it('should get portfolios by user ID', async () => {
      // Arrange
      const portfolio1Data = {
        id: `PORTFOLIO1-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Portfolio 1 ${TestDataGenerator.generateUid()}`,
      };
      const portfolio2Data = {
        id: `PORTFOLIO2-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Portfolio 2 ${TestDataGenerator.generateUid()}`,
      };

      await PortfoliosDAO.create(portfolio1Data);
      await PortfoliosDAO.create(portfolio2Data);

      // Act
      const userPortfolios = await PortfoliosDAO.getByUserId(testUser.uid);

      // Assert
      expect(userPortfolios).toBeDefined();
      expect(userPortfolios.length).toBe(2);
    });

    it('should update portfolio', async () => {
      // Arrange
      const portfolioData = {
        id: `PORTFOLIO-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Test Portfolio ${TestDataGenerator.generateUid()}`,
      };
      const createdPortfolio = await PortfoliosDAO.create(portfolioData);

      const updates = {
        name: 'Updated Portfolio Name',
        description: 'Updated description',
      };

      // Act
      const updatedPortfolio = await PortfoliosDAO.update(createdPortfolio.id, updates);

      // Assert
      expect(updatedPortfolio).toBeDefined();
      expect(updatedPortfolio?.name).toBe('Updated Portfolio Name');
      expect(updatedPortfolio?.description).toBe('Updated description');
    });

    it('should delete portfolio', async () => {
      // Arrange
      const portfolioData = {
        id: `PORTFOLIO-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Test Portfolio ${TestDataGenerator.generateUid()}`,
      };
      const createdPortfolio = await PortfoliosDAO.create(portfolioData);

      // Act
      const deleted = await PortfoliosDAO.delete(createdPortfolio.id);

      // Assert
      expect(deleted).toBe(true);

      // Verify portfolio is deleted
      const retrievedPortfolio = await PortfoliosDAO.getById(createdPortfolio.id);
      expect(retrievedPortfolio).toBeNull();
    });
  });

  describe('Default Values', () => {
    it('should use default values for optional fields', async () => {
      // Arrange
      const portfolioData = {
        id: `PORTFOLIO-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Test Portfolio ${TestDataGenerator.generateUid()}`,
      };

      // Act
      const createdPortfolio = await PortfoliosDAO.create(portfolioData);

      // Assert
      expect(createdPortfolio.totalValue).toBe(0);
      expect(createdPortfolio.dayChangeValue).toBe(0);
      expect(createdPortfolio.dayChangePercent).toBe(0);
      expect(createdPortfolio.totalReturnValue).toBe(0);
      expect(createdPortfolio.totalReturnPercent).toBe(0);
      expect(createdPortfolio.cashBalance).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should return null for non-existent portfolio ID', async () => {
      // Act
      const retrievedPortfolio = await PortfoliosDAO.getById('non-existent-id');

      // Assert
      expect(retrievedPortfolio).toBeNull();
    });

    it('should return false when deleting non-existent portfolio', async () => {
      // Act
      const deleted = await PortfoliosDAO.delete('non-existent-id');

      // Assert
      expect(deleted).toBe(false);
    });
  });
});

describe('HoldingsDAO', () => {
  let testUser: SelectUser;
  let testPortfolio: SelectPortfolio;
  let testAsset: SelectAsset;

  beforeEach(async () => {
    TestDataGenerator.resetCounter();
    
    // Create test dependencies
    const userData = {
      uid: `USER-${TestDataGenerator.generateUid()}`,
      email: `test-${TestDataGenerator.generateUid()}@example.com`,
      displayName: `Test User ${TestDataGenerator.generateUid()}`,
      role: 'user',
      status: 'active',
      kycStatus: 'pending',
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
      class: 'crypto',
      exchange: 'BINANCE',
      symbol: `BTC${Date.now()}`,
      name: `Bitcoin-${Date.now()}`,
      status: 'active',
      tradable: true,
    };
    testAsset = await AssetsDAO.create(assetData);
  });

  describe('Basic CRUD Operations', () => {
    it('should create a new holding', async () => {
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
    });

    it('should get holding by ID', async () => {
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
    });

    it('should get holdings by portfolio ID', async () => {
      // Arrange
      const holding1Data = {
        id: `HOLDING1-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        quantity: 1.0,
        averageCost: 50000,
      };

      // Create another asset for second holding
      const asset2Data = {
        id: `ASSET2-${TestDataGenerator.generateUid()}`,
        class: 'crypto',
        exchange: 'COINBASE',
        symbol: `ETH${Date.now()}`,
        name: `Ethereum-${Date.now()}`,
        status: 'active',
        tradable: true,
      };
      const testAsset2 = await AssetsDAO.create(asset2Data);

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
      const portfolioHoldings = await HoldingsDAO.getByPortfolioId(testPortfolio.id);

      // Assert
      expect(portfolioHoldings).toBeDefined();
      expect(portfolioHoldings.length).toBe(2);
    });

    it('should update holding', async () => {
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
      };

      // Act
      const updatedHolding = await HoldingsDAO.update(createdHolding.id, updates);

      // Assert
      expect(updatedHolding).toBeDefined();
      expect(updatedHolding?.quantity).toBe(2.0);
      expect(updatedHolding?.marketValue).toBe(100000);
    });

    it('should delete holding', async () => {
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

  describe('Default Values', () => {
    it('should use default values for optional fields', async () => {
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

      // Assert
      expect(createdHolding.marketValue).toBe(0);
      expect(createdHolding.unrealizedPl).toBe(0);
      expect(createdHolding.unrealizedPlPercent).toBe(0);
    });
  });
});

describe('TransactionsDAO', () => {
  let testUser: SelectUser;
  let testPortfolio: SelectPortfolio;
  let testAsset: SelectAsset;

  beforeEach(async () => {
    TestDataGenerator.resetCounter();
    
    // Create test dependencies
    const userData = {
      uid: `USER-${TestDataGenerator.generateUid()}`,
      email: `test-${TestDataGenerator.generateUid()}@example.com`,
      displayName: `Test User ${TestDataGenerator.generateUid()}`,
      role: 'user',
      status: 'active',
      kycStatus: 'pending',
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
      class: 'crypto',
      exchange: 'BINANCE',
      symbol: `BTC${Date.now()}`,
      name: `Bitcoin-${Date.now()}`,
      status: 'active',
      tradable: true,
    };
    testAsset = await AssetsDAO.create(assetData);
  });

  describe('Basic CRUD Operations', () => {
    it('should create a new transaction', async () => {
      // Arrange
      const transactionData = {
        id: `TRANSACTION-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: 'buy' as const,
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
      expect(createdTransaction.type).toBe('buy');
      expect(createdTransaction.quantity).toBe(1.0);
      expect(createdTransaction.price).toBe(50000);
    });

    it('should get transaction by ID', async () => {
      // Arrange
      const transactionData = {
        id: `TRANSACTION-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: 'sell' as const,
        quantity: 0.5,
        price: 55000,
        totalValue: 27500,
        transactionDate: new Date().toISOString(),
      };
      const createdTransaction = await TransactionsDAO.create(transactionData);

      // Act
      const retrievedTransaction = await TransactionsDAO.getById(createdTransaction.id);

      // Assert
      expect(retrievedTransaction).toBeDefined();
      expect(retrievedTransaction?.id).toBe(createdTransaction.id);
      expect(retrievedTransaction?.type).toBe('sell');
    });

    it('should get transactions by portfolio ID', async () => {
      // Arrange
      const transaction1Data = {
        id: `TRANSACTION1-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: 'buy',
        quantity: 1.0,
        price: 50000,
        totalValue: 50000,
        transactionDate: new Date().toISOString(),
      };

      const transaction2Data = {
        id: `TRANSACTION2-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: 'sell' as const,
        quantity: 0.5,
        price: 55000,
        totalValue: 27500,
        transactionDate: new Date().toISOString(),
      };

      await TransactionsDAO.create(transaction1Data);
      await TransactionsDAO.create(transaction2Data);

      // Act
      const portfolioTransactions = await TransactionsDAO.getByPortfolioId(testPortfolio.id);

      // Assert
      expect(portfolioTransactions).toBeDefined();
      expect(portfolioTransactions.length).toBe(2);
    });

    it('should delete transaction', async () => {
      // Arrange
      const transactionData = {
        id: `TRANSACTION-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: 'buy',
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
      const retrievedTransaction = await TransactionsDAO.getById(createdTransaction.id);
      expect(retrievedTransaction).toBeNull();
    });
  });

  describe('Default Values', () => {
    it('should use default values for optional fields', async () => {
      // Arrange
      const transactionData = {
        id: `TRANSACTION-${TestDataGenerator.generateUid()}`,
        portfolioId: testPortfolio.id,
        assetId: testAsset.id,
        symbol: testAsset.symbol,
        type: 'buy',
        quantity: 1.0,
        price: 50000,
        totalValue: 50000,
        transactionDate: new Date().toISOString(),
      };

      // Act
      const createdTransaction = await TransactionsDAO.create(transactionData);

      // Assert
      expect(createdTransaction.fee).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should return null for non-existent transaction ID', async () => {
      // Act
      const retrievedTransaction = await TransactionsDAO.getById('non-existent-id');

      // Assert
      expect(retrievedTransaction).toBeNull();
    });

    it('should return false when deleting non-existent transaction', async () => {
      // Act
      const deleted = await TransactionsDAO.delete('non-existent-id');

      // Assert
      expect(deleted).toBe(false);
    });
  });
});