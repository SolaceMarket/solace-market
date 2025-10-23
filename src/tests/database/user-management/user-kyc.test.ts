import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { UsersDAO } from "@/database/drizzle";
import { TestDataGenerator, TestCleanup } from "@/tests/utils/test-helpers";

describe("User KYC Operations", () => {
  beforeEach(() => {
    TestDataGenerator.resetCounter();
  });

  afterEach(async () => {
    await TestCleanup.cleanupUsers();
  });

  describe("KYC Status Management", () => {
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

  describe("KYC Workflow", () => {
    it("should handle complete KYC workflow", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const submissionTime = new Date().toISOString();
      const approvalTime = new Date(Date.now() + 1000).toISOString();

      // Act & Assert - Initial submission
      const submittedUser = await UsersDAO.updateKYC(createdUser.uid, {
        provider: "jumio",
        status: "pending",
        submittedAt: submissionTime,
      });

      expect(submittedUser?.kycStatus).toBe("pending");
      expect(submittedUser?.kycProvider).toBe("jumio");
      expect(submittedUser?.kycSubmittedAt).toBe(submissionTime);

      // Act & Assert - Approval
      const approvedUser = await UsersDAO.updateKYC(createdUser.uid, {
        status: "approved",
        approvedAt: approvalTime,
      });

      expect(approvedUser?.kycStatus).toBe("approved");
      expect(approvedUser?.kycApprovedAt).toBe(approvalTime);
      expect(approvedUser?.kycProvider).toBe("jumio"); // Should preserve previous data
    });

    it("should handle KYC rejection and resubmission", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const rejectionTime = new Date().toISOString();
      const resubmissionTime = new Date(Date.now() + 2000).toISOString();

      // Act & Assert - Initial rejection
      const rejectedUser = await UsersDAO.updateKYC(createdUser.uid, {
        status: "rejected",
        rejectedAt: rejectionTime,
        rejectionReason: "Photo unclear",
      });

      expect(rejectedUser?.kycStatus).toBe("rejected");
      expect(rejectedUser?.kycRejectedAt).toBe(rejectionTime);
      expect(rejectedUser?.kycRejectionReason).toBe("Photo unclear");

      // Act & Assert - Resubmission
      const resubmittedUser = await UsersDAO.updateKYC(createdUser.uid, {
        status: "pending",
        submittedAt: resubmissionTime,
        rejectionReason: undefined, // Clear previous rejection reason
      });

      expect(resubmittedUser?.kycStatus).toBe("pending");
      expect(resubmittedUser?.kycSubmittedAt).toBe(resubmissionTime);
      expect(resubmittedUser?.kycRejectionReason).toBeNull();
    });

    it("should support different KYC providers", async () => {
      // Arrange
      const users = await Promise.all([
        UsersDAO.create(TestDataGenerator.generateUser()),
        UsersDAO.create(TestDataGenerator.generateUser()),
        UsersDAO.create(TestDataGenerator.generateUser()),
      ]);

      for (const user of users) {
        TestCleanup.trackUser(user.uid);
      }

      const providers = ["jumio", "onfido", "sumsub"];

      // Act & Assert
      for (let i = 0; i < users.length; i++) {
        const updatedUser = await UsersDAO.updateKYC(users[i].uid, {
          provider: providers[i],
          status: "pending",
          submittedAt: new Date().toISOString(),
        });

        expect(updatedUser?.kycProvider).toBe(providers[i]);
        expect(updatedUser?.kycStatus).toBe("pending");
      }
    });
  });

  describe("KYC Validation", () => {
    it("should handle KYC updates for non-existent user", async () => {
      // Act
      const result = await UsersDAO.updateKYC("non-existent-uid", {
        status: "pending",
      });

      // Assert
      expect(result).toBeNull();
    });

    it("should preserve other user data during KYC updates", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      const originalEmail = createdUser.email;
      const originalLocale = createdUser.locale;

      // Act
      const updatedUser = await UsersDAO.updateKYC(createdUser.uid, {
        status: "pending",
        provider: "jumio",
      });

      // Assert
      expect(updatedUser?.email).toBe(originalEmail);
      expect(updatedUser?.locale).toBe(originalLocale);
      expect(updatedUser?.kycStatus).toBe("pending");
      expect(updatedUser?.kycProvider).toBe("jumio");
    });

    it("should handle partial KYC updates", async () => {
      // Arrange
      const userData = TestDataGenerator.generateUser();
      const createdUser = await UsersDAO.create(userData);
      TestCleanup.trackUser(createdUser.uid);

      // First update - set provider and status
      await UsersDAO.updateKYC(createdUser.uid, {
        provider: "jumio",
        status: "pending",
        submittedAt: new Date().toISOString(),
      });

      // Act - Update only status
      const updatedUser = await UsersDAO.updateKYC(createdUser.uid, {
        status: "approved",
        approvedAt: new Date().toISOString(),
      });

      // Assert
      expect(updatedUser?.kycProvider).toBe("jumio"); // Should preserve
      expect(updatedUser?.kycStatus).toBe("approved"); // Should update
      expect(updatedUser?.kycApprovedAt).toBeDefined();
    });
  });
});
