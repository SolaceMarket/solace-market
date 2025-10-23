import { describe, it, expect, beforeEach } from "vitest";
import { PortfoliosDAO, UsersDAO } from "@/database/drizzle";
import { TestDataGenerator } from "@/tests/utils/test-helpers";
import type { SelectUser } from "@/database/drizzle/schemas/users";

describe("Portfolio Core Operations", () => {
  let testUser: SelectUser;

  beforeEach(async () => {
    TestDataGenerator.resetCounter();

    // Create test user for portfolio tests
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
  });

  describe("Portfolio Creation and Management", () => {
    it("should create a new portfolio", async () => {
      // Arrange
      const portfolioData = {
        id: `PORTFOLIO-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Test Portfolio ${TestDataGenerator.generateUid()}`,
        description: "A test portfolio",
      };

      // Act
      const createdPortfolio = await PortfoliosDAO.create(portfolioData);

      // Assert
      expect(createdPortfolio).toBeDefined();
      expect(createdPortfolio.userId).toBe(testUser.uid);
      expect(createdPortfolio.name).toBe(portfolioData.name);
      expect(createdPortfolio.description).toBe("A test portfolio");
      expect(createdPortfolio.id).toBe(portfolioData.id);
    });

    it("should get portfolio by ID", async () => {
      // Arrange
      const portfolioData = {
        id: `PORTFOLIO-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Test Portfolio ${TestDataGenerator.generateUid()}`,
        description: "A test portfolio",
      };
      const createdPortfolio = await PortfoliosDAO.create(portfolioData);

      // Act
      const retrievedPortfolio = await PortfoliosDAO.getById(
        createdPortfolio.id,
      );

      // Assert
      expect(retrievedPortfolio).toBeDefined();
      expect(retrievedPortfolio?.id).toBe(createdPortfolio.id);
      expect(retrievedPortfolio?.name).toBe(portfolioData.name);
      expect(retrievedPortfolio?.userId).toBe(testUser.uid);
    });

    it("should get portfolios by user ID", async () => {
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
      expect(
        userPortfolios.every((portfolio) => portfolio.userId === testUser.uid),
      ).toBe(true);
    });

    it("should update portfolio", async () => {
      // Arrange
      const portfolioData = {
        id: `PORTFOLIO-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Test Portfolio ${TestDataGenerator.generateUid()}`,
      };
      const createdPortfolio = await PortfoliosDAO.create(portfolioData);

      const updates = {
        name: "Updated Portfolio Name",
        description: "Updated description",
      };

      // Act
      const updatedPortfolio = await PortfoliosDAO.update(
        createdPortfolio.id,
        updates,
      );

      // Assert
      expect(updatedPortfolio).toBeDefined();
      expect(updatedPortfolio?.name).toBe("Updated Portfolio Name");
      expect(updatedPortfolio?.description).toBe("Updated description");
      expect(updatedPortfolio?.userId).toBe(testUser.uid); // Should preserve
    });

    it("should delete portfolio", async () => {
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
      const retrievedPortfolio = await PortfoliosDAO.getById(
        createdPortfolio.id,
      );
      expect(retrievedPortfolio).toBeNull();
    });
  });

  describe("Portfolio Value Tracking", () => {
    it("should create portfolio with default financial values", async () => {
      // Arrange
      const portfolioData = {
        id: `PORTFOLIO-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Test Portfolio ${TestDataGenerator.generateUid()}`,
      };

      // Act
      const createdPortfolio = await PortfoliosDAO.create(portfolioData);

      // Assert - Check default values
      expect(createdPortfolio.totalValue).toBe(0);
      expect(createdPortfolio.dayChangeValue).toBe(0);
      expect(createdPortfolio.dayChangePercent).toBe(0);
      expect(createdPortfolio.totalReturnValue).toBe(0);
      expect(createdPortfolio.totalReturnPercent).toBe(0);
      expect(createdPortfolio.cashBalance).toBe(0);
    });

    it("should update portfolio financial values", async () => {
      // Arrange
      const portfolioData = {
        id: `PORTFOLIO-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Test Portfolio ${TestDataGenerator.generateUid()}`,
      };
      const createdPortfolio = await PortfoliosDAO.create(portfolioData);

      const financialUpdates = {
        totalValue: 10000.5,
        dayChangeValue: 150.25,
        dayChangePercent: 1.52,
        totalReturnValue: 500.75,
        totalReturnPercent: 5.25,
        cashBalance: 2500.0,
      };

      // Act
      const updatedPortfolio = await PortfoliosDAO.update(
        createdPortfolio.id,
        financialUpdates,
      );

      // Assert
      expect(updatedPortfolio).toBeDefined();
      expect(updatedPortfolio?.totalValue).toBe(10000.5);
      expect(updatedPortfolio?.dayChangeValue).toBe(150.25);
      expect(updatedPortfolio?.dayChangePercent).toBe(1.52);
      expect(updatedPortfolio?.totalReturnValue).toBe(500.75);
      expect(updatedPortfolio?.totalReturnPercent).toBe(5.25);
      expect(updatedPortfolio?.cashBalance).toBe(2500.0);
    });

    it("should handle negative portfolio values", async () => {
      // Arrange
      const portfolioData = {
        id: `PORTFOLIO-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: `Test Portfolio ${TestDataGenerator.generateUid()}`,
      };
      const createdPortfolio = await PortfoliosDAO.create(portfolioData);

      const negativeUpdates = {
        dayChangeValue: -250.75,
        dayChangePercent: -2.45,
        totalReturnValue: -150.5,
        totalReturnPercent: -1.25,
      };

      // Act
      const updatedPortfolio = await PortfoliosDAO.update(
        createdPortfolio.id,
        negativeUpdates,
      );

      // Assert
      expect(updatedPortfolio?.dayChangeValue).toBe(-250.75);
      expect(updatedPortfolio?.dayChangePercent).toBe(-2.45);
      expect(updatedPortfolio?.totalReturnValue).toBe(-150.5);
      expect(updatedPortfolio?.totalReturnPercent).toBe(-1.25);
    });
  });

  describe("Portfolio Validation", () => {
    it("should return null for non-existent portfolio ID", async () => {
      // Act
      const retrievedPortfolio = await PortfoliosDAO.getById("non-existent-id");

      // Assert
      expect(retrievedPortfolio).toBeNull();
    });

    it("should return false when deleting non-existent portfolio", async () => {
      // Act
      const deleted = await PortfoliosDAO.delete("non-existent-id");

      // Assert
      expect(deleted).toBe(false);
    });

    it("should return null when updating non-existent portfolio", async () => {
      // Act
      const updated = await PortfoliosDAO.update("non-existent-id", {
        name: "Updated Name",
      });

      // Assert
      expect(updated).toBeNull();
    });

    it("should handle multiple portfolios for same user", async () => {
      // Arrange
      const portfolioCount = 5;
      const portfolios = [];

      // Act - Create multiple portfolios
      for (let i = 0; i < portfolioCount; i++) {
        const portfolio = await PortfoliosDAO.create({
          id: `PORTFOLIO${i}-${TestDataGenerator.generateUid()}`,
          userId: testUser.uid,
          name: `Portfolio ${i + 1}`,
          description: `Portfolio ${i + 1} description`,
        });
        portfolios.push(portfolio);
      }

      // Act - Retrieve all user portfolios
      const userPortfolios = await PortfoliosDAO.getByUserId(testUser.uid);

      // Assert
      expect(userPortfolios.length).toBe(portfolioCount);
      expect(
        portfolios.every((portfolio) =>
          userPortfolios.some(
            (userPortfolio) => userPortfolio.id === portfolio.id,
          ),
        ),
      ).toBe(true);
    });

    it("should handle portfolio name uniqueness per user", async () => {
      // Arrange
      const portfolioName = `Unique Portfolio ${TestDataGenerator.generateUid()}`;

      const portfolio1Data = {
        id: `PORTFOLIO1-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: portfolioName,
      };

      const portfolio2Data = {
        id: `PORTFOLIO2-${TestDataGenerator.generateUid()}`,
        userId: testUser.uid,
        name: portfolioName, // Same name, same user
      };

      await PortfoliosDAO.create(portfolio1Data);

      // Act & Assert - Should prevent duplicate names per user
      await expect(PortfoliosDAO.create(portfolio2Data)).rejects.toThrow();
    });

    it("should return empty array for user with no portfolios", async () => {
      // Arrange - Create another user
      const newUserData = {
        uid: `USER-${TestDataGenerator.generateUid()}`,
        email: `newuser-${TestDataGenerator.generateUid()}@example.com`,
        role: "user",
        status: "active",
        kycStatus: "pending",
        createdAt: new Date().toISOString(),
        onboardingStartedAt: new Date().toISOString(),
        onboardingLastActivityAt: new Date().toISOString(),
      };
      const newUser = await UsersDAO.create(newUserData);

      // Act
      const userPortfolios = await PortfoliosDAO.getByUserId(newUser.uid);

      // Assert
      expect(userPortfolios).toBeDefined();
      expect(userPortfolios.length).toBe(0);
    });
  });
});
