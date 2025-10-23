import { eq } from 'drizzle-orm';
import { db } from '../client';
import { usersTable, type InsertUser, type SelectUser } from '../schemas/users';

export class UsersDAO {
  // Create a new user
  static async create(user: InsertUser): Promise<SelectUser> {
    const [insertedUser] = await db.insert(usersTable).values(user).returning();
    return insertedUser;
  }

  // Get user by UID
  static async getByUid(uid: string): Promise<SelectUser | null> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.uid, uid));
    return user || null;
  }

  // Get user by email
  static async getByEmail(email: string): Promise<SelectUser | null> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return user || null;
  }

  // Update user
  static async update(uid: string, updates: Partial<InsertUser>): Promise<SelectUser | null> {
    const [updatedUser] = await db
      .update(usersTable)
      .set({ ...updates, updatedAt: new Date().toISOString() })
      .where(eq(usersTable.uid, uid))
      .returning();
    return updatedUser || null;
  }

  // Delete user
  static async delete(uid: string): Promise<boolean> {
    const result = await db.delete(usersTable).where(eq(usersTable.uid, uid));
    return result.rowsAffected > 0;
  }

  // Get all users (for admin)
  static async getAll(limit = 50, offset = 0): Promise<SelectUser[]> {
    return await db.select().from(usersTable).limit(limit).offset(offset);
  }

  // Update onboarding status
  static async updateOnboarding(
    uid: string, 
    updates: {
      currentStep?: string;
      completedSteps?: string[];
      completed?: boolean;
      completedAt?: string;
      lastActivityAt?: string;
    }
  ): Promise<SelectUser | null> {
    const updateData: Partial<InsertUser> = {
      updatedAt: new Date().toISOString(),
    };

    if (updates.currentStep) updateData.onboardingCurrentStep = updates.currentStep;
    if (updates.completedSteps) updateData.onboardingCompletedSteps = JSON.stringify(updates.completedSteps);
    if (updates.completed !== undefined) updateData.onboardingCompleted = updates.completed;
    if (updates.completedAt) updateData.onboardingCompletedAt = updates.completedAt;
    if (updates.lastActivityAt) updateData.onboardingLastActivityAt = updates.lastActivityAt;

    return this.update(uid, updateData);
  }

  // Update KYC status
  static async updateKYC(
    uid: string,
    updates: {
      provider?: string;
      status?: string;
      lastCheckedAt?: string;
      submittedAt?: string;
      approvedAt?: string;
      rejectedAt?: string;
      rejectionReason?: string;
    }
  ): Promise<SelectUser | null> {
    const updateData: Partial<InsertUser> = {
      updatedAt: new Date().toISOString(),
    };

    if (updates.provider) updateData.kycProvider = updates.provider;
    if (updates.status) updateData.kycStatus = updates.status;
    if (updates.lastCheckedAt) updateData.kycLastCheckedAt = updates.lastCheckedAt;
    if (updates.submittedAt) updateData.kycSubmittedAt = updates.submittedAt;
    if (updates.approvedAt) updateData.kycApprovedAt = updates.approvedAt;
    if (updates.rejectedAt) updateData.kycRejectedAt = updates.rejectedAt;
    if (updates.rejectionReason) updateData.kycRejectionReason = updates.rejectionReason;

    return this.update(uid, updateData);
  }

  // Update preferences
  static async updatePreferences(
    uid: string,
    updates: {
      news?: boolean;
      orderFills?: boolean;
      riskAlerts?: boolean;
      statements?: boolean;
      theme?: string;
      defaultQuote?: string;
      hintsEnabled?: boolean;
    }
  ): Promise<SelectUser | null> {
    const updateData: Partial<InsertUser> = {
      updatedAt: new Date().toISOString(),
    };

    if (updates.news !== undefined) updateData.preferencesNews = updates.news;
    if (updates.orderFills !== undefined) updateData.preferencesOrderFills = updates.orderFills;
    if (updates.riskAlerts !== undefined) updateData.preferencesRiskAlerts = updates.riskAlerts;
    if (updates.statements !== undefined) updateData.preferencesStatements = updates.statements;
    if (updates.theme) updateData.preferencesTheme = updates.theme;
    if (updates.defaultQuote) updateData.preferencesDefaultQuote = updates.defaultQuote;
    if (updates.hintsEnabled !== undefined) updateData.preferencesHintsEnabled = updates.hintsEnabled;

    return this.update(uid, updateData);
  }
}