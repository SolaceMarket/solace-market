import { client } from "@/turso/database";
import type {
  User,
  OnboardingStep,
  UserConsents,
  UserProfile,
  UserKYC,
  UserWallet,
  UserBroker,
  UserSecurity,
  UserPreferences,
  Jurisdiction,
  Locale,
  ExperienceLevel,
  KYCStatus,
  TwoFAMethod,
  Theme,
  DefaultQuote,
  BrokerStatus,
} from "@/types/onboarding";

// Database row interface
interface UserRow {
  uid: string;
  email: string;
  created_at: string;
  locale: string;
  jurisdiction: string;
  onboarding_started_at: string;
  onboarding_current_step: string;
  onboarding_completed_steps: string;
  onboarding_completed: number;
  onboarding_completed_at: string | null;
  onboarding_last_activity_at: string;
  consents_tos_version?: string;
  consents_tos_accepted_at?: string;
  consents_privacy_version?: string;
  consents_privacy_accepted_at?: string;
  consents_risk_version?: string;
  consents_risk_accepted_at?: string;
  profile_first_name?: string;
  profile_last_name?: string;
  profile_dob?: string;
  profile_country?: string;
  profile_tax_residency?: string;
  profile_address?: string;
  profile_phone?: string;
  profile_experience?: string;
  kyc_provider?: string;
  kyc_status?: string;
  kyc_last_checked_at?: string;
  kyc_submitted_at?: string;
  kyc_approved_at?: string;
  kyc_rejected_at?: string;
  kyc_rejection_reason?: string;
  wallet_chain?: string;
  wallet_public_key?: string;
  wallet_verified_at?: string;
  wallet_is_generated?: number;
  broker_provider?: string;
  broker_sub_account_id?: string;
  broker_status?: string;
  broker_created_at?: string;
  broker_last_sync_at?: string;
  security_2fa_method?: string;
  security_2fa_enabled?: number;
  security_2fa_enabled_at?: string;
  preferences_news?: number;
  preferences_order_fills?: number;
  preferences_risk_alerts?: number;
  preferences_statements?: number;
  preferences_theme?: string;
  preferences_default_quote?: string;
  preferences_hints_enabled?: number;
  updated_at: string;
}

// Convert database row to User object
function rowToUser(row: UserRow): User {
  return {
    uid: row.uid,
    email: row.email,
    createdAt: row.created_at,
    locale: row.locale as Locale,
    jurisdiction: row.jurisdiction as Jurisdiction,
    onboarding: {
      startedAt: row.onboarding_started_at,
      currentStep: row.onboarding_current_step as OnboardingStep,
      completedSteps: JSON.parse(row.onboarding_completed_steps || "[]"),
      completed: Boolean(row.onboarding_completed),
      completedAt: row.onboarding_completed_at || undefined,
      lastActivityAt: row.onboarding_last_activity_at,
    },
    ...(row.consents_tos_version &&
      row.consents_tos_accepted_at &&
      row.consents_privacy_version &&
      row.consents_privacy_accepted_at &&
      row.consents_risk_version &&
      row.consents_risk_accepted_at && {
        consents: {
          tos: {
            version: row.consents_tos_version,
            acceptedAt: row.consents_tos_accepted_at,
          },
          privacy: {
            version: row.consents_privacy_version,
            acceptedAt: row.consents_privacy_accepted_at,
          },
          risk: {
            version: row.consents_risk_version,
            acceptedAt: row.consents_risk_accepted_at,
          },
        },
      }),
    ...(row.profile_first_name &&
      row.profile_last_name &&
      row.profile_dob &&
      row.profile_country &&
      row.profile_tax_residency &&
      row.profile_address &&
      row.profile_experience && {
        profile: {
          firstName: row.profile_first_name,
          lastName: row.profile_last_name,
          dob: row.profile_dob,
          country: row.profile_country,
          taxResidency: row.profile_tax_residency,
          address: row.profile_address,
          phone: row.profile_phone,
          experience: row.profile_experience as ExperienceLevel, // Safe since we check existence above
        },
      }),
    ...(row.kyc_provider &&
      row.kyc_status &&
      row.kyc_last_checked_at && {
        kyc: {
          provider: row.kyc_provider as "mock", // Safe cast since only mock is implemented
          status: row.kyc_status as KYCStatus, // Type assertion for KYC status
          level: "basic", // Default level for existing records
          riskLevel: "low", // Default risk level for existing records
          lastCheckedAt: row.kyc_last_checked_at,
          submittedAt: row.kyc_submitted_at || undefined,
          approvedAt: row.kyc_approved_at || undefined,
          rejectedAt: row.kyc_rejected_at || undefined,
          rejectionReason: row.kyc_rejection_reason || undefined,
          checks: {
            // Default empty checks for existing records
            // These would be populated by actual KYC data in a real implementation
          },
        },
      }),
    ...(row.wallet_chain &&
      row.wallet_public_key &&
      row.wallet_verified_at && {
        wallet: {
          chain: row.wallet_chain as "solana", // Safe cast since only Solana is supported
          publicKey: row.wallet_public_key,
          verifiedAt: row.wallet_verified_at,
          isGenerated: Boolean(row.wallet_is_generated),
        },
      }),
    ...(row.broker_provider &&
      row.broker_sub_account_id &&
      row.broker_status &&
      row.broker_created_at && {
        broker: {
          provider: row.broker_provider as "mock", // Safe cast since only mock is implemented
          subAccountId: row.broker_sub_account_id,
          status: row.broker_status as BrokerStatus, // Type assertion for broker status
          createdAt: row.broker_created_at,
          lastSyncAt: row.broker_last_sync_at || undefined,
        },
      }),
    ...(row.security_2fa_enabled &&
      row.security_2fa_method &&
      row.security_2fa_enabled_at && {
        security: {
          twoFA: {
            method: row.security_2fa_method as TwoFAMethod, // Type assertion for 2FA method
            enabled: Boolean(row.security_2fa_enabled),
            enabledAt: row.security_2fa_enabled_at,
          },
        },
      }),
    ...(row.preferences_theme &&
      row.preferences_default_quote && {
        preferences: {
          news: Boolean(row.preferences_news),
          orderFills: Boolean(row.preferences_order_fills),
          riskAlerts: Boolean(row.preferences_risk_alerts),
          statements: Boolean(row.preferences_statements),
          theme: row.preferences_theme as Theme,
          defaultQuote: row.preferences_default_quote as DefaultQuote,
          hintsEnabled: Boolean(row.preferences_hints_enabled),
        },
      }),
  };
}

// Get user document
export async function getUser(uid: string): Promise<User | null> {
  try {
    const result = await client.execute({
      sql: "SELECT * FROM users WHERE uid = ?",
      args: [uid],
    });

    if (result.rows.length === 0) {
      return null;
    }

    return rowToUser(result.rows[0] as unknown as UserRow);
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error("Failed to get user");
  }
}

// Create initial user document
export async function createUser(
  uid: string,
  email: string,
  locale: Locale = "de",
): Promise<User> {
  try {
    // Check if user already exists
    const existingUser = await getUser(uid);
    if (existingUser) {
      return existingUser;
    }

    const now = new Date().toISOString();

    await client.execute({
      sql: `
        INSERT INTO users (
          uid, email, created_at, locale, jurisdiction,
          onboarding_started_at, onboarding_current_step, onboarding_completed_steps,
          onboarding_completed, onboarding_last_activity_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        uid,
        email,
        now,
        locale,
        "EU", // Will be updated in profile step
        now,
        "welcome",
        "[]",
        false,
        now,
        now,
      ],
    });

    // Return the created user
    const user = await getUser(uid);
    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

// Update onboarding step
export async function updateOnboardingStep(
  uid: string,
  step: OnboardingStep,
  completed: boolean = false,
): Promise<void> {
  try {
    const user = await getUser(uid);
    if (!user) {
      throw new Error("User not found");
    }

    const completedSteps = completed
      ? [...new Set([...user.onboarding.completedSteps, step])]
      : user.onboarding.completedSteps;

    const now = new Date().toISOString();

    if (step === "done" && completed) {
      await client.execute({
        sql: `
          UPDATE users SET 
            onboarding_current_step = ?,
            onboarding_completed_steps = ?,
            onboarding_completed = TRUE,
            onboarding_completed_at = ?,
            onboarding_last_activity_at = ?,
            updated_at = ?
          WHERE uid = ?
        `,
        args: [step, JSON.stringify(completedSteps), now, now, now, uid],
      });
    } else {
      await client.execute({
        sql: `
          UPDATE users SET 
            onboarding_current_step = ?,
            onboarding_completed_steps = ?,
            onboarding_last_activity_at = ?,
            updated_at = ?
          WHERE uid = ?
        `,
        args: [step, JSON.stringify(completedSteps), now, now, uid],
      });
    }
  } catch (error) {
    console.error("Error updating onboarding step:", error);
    throw new Error("Failed to update onboarding step");
  }
}

// Save user consents
export async function saveConsents(
  uid: string,
  consents: UserConsents,
): Promise<void> {
  try {
    const now = new Date().toISOString();

    await client.execute({
      sql: `
        UPDATE users SET 
          consents_tos_version = ?,
          consents_tos_accepted_at = ?,
          consents_privacy_version = ?,
          consents_privacy_accepted_at = ?,
          consents_risk_version = ?,
          consents_risk_accepted_at = ?,
          onboarding_last_activity_at = ?,
          updated_at = ?
        WHERE uid = ?
      `,
      args: [
        consents.tos.version,
        consents.tos.acceptedAt,
        consents.privacy.version,
        consents.privacy.acceptedAt,
        consents.risk.version,
        consents.risk.acceptedAt,
        now,
        now,
        uid,
      ],
    });
  } catch (error) {
    console.error("Error saving consents:", error);
    throw new Error("Failed to save consents");
  }
}

// Save user profile
export async function saveProfile(
  uid: string,
  profile: UserProfile,
  jurisdiction: Jurisdiction,
): Promise<void> {
  try {
    const now = new Date().toISOString();

    await client.execute({
      sql: `
        UPDATE users SET 
          profile_first_name = ?,
          profile_last_name = ?,
          profile_dob = ?,
          profile_country = ?,
          profile_tax_residency = ?,
          profile_address = ?,
          profile_phone = ?,
          profile_experience = ?,
          jurisdiction = ?,
          onboarding_last_activity_at = ?,
          updated_at = ?
        WHERE uid = ?
      `,
      args: [
        profile.firstName,
        profile.lastName,
        profile.dob,
        profile.country,
        profile.taxResidency,
        profile.address,
        profile.phone || null,
        profile.experience,
        jurisdiction,
        now,
        now,
        uid,
      ],
    });
  } catch (error) {
    console.error("Error saving profile:", error);
    throw new Error("Failed to save profile");
  }
}

// Save KYC information
export async function saveKYC(uid: string, kyc: UserKYC): Promise<void> {
  try {
    const now = new Date().toISOString();

    await client.execute({
      sql: `
        UPDATE users SET 
          kyc_provider = ?,
          kyc_status = ?,
          kyc_last_checked_at = ?,
          kyc_submitted_at = ?,
          kyc_approved_at = ?,
          kyc_rejected_at = ?,
          kyc_rejection_reason = ?,
          onboarding_last_activity_at = ?,
          updated_at = ?
        WHERE uid = ?
      `,
      args: [
        kyc.provider,
        kyc.status,
        kyc.lastCheckedAt,
        kyc.submittedAt || null,
        kyc.approvedAt || null,
        kyc.rejectedAt || null,
        kyc.rejectionReason || null,
        now,
        now,
        uid,
      ],
    });
  } catch (error) {
    console.error("Error saving KYC:", error);
    throw new Error("Failed to save KYC");
  }
}

// Save wallet information
export async function saveWallet(
  uid: string,
  wallet: UserWallet,
): Promise<void> {
  try {
    const now = new Date().toISOString();

    await client.execute({
      sql: `
        UPDATE users SET 
          wallet_chain = ?,
          wallet_public_key = ?,
          wallet_verified_at = ?,
          wallet_is_generated = ?,
          onboarding_last_activity_at = ?,
          updated_at = ?
        WHERE uid = ?
      `,
      args: [
        wallet.chain,
        wallet.publicKey,
        wallet.verifiedAt,
        wallet.isGenerated || false,
        now,
        now,
        uid,
      ],
    });
  } catch (error) {
    console.error("Error saving wallet:", error);
    throw new Error("Failed to save wallet");
  }
}

// Save broker information
export async function saveBroker(
  uid: string,
  broker: UserBroker,
): Promise<void> {
  try {
    const now = new Date().toISOString();

    await client.execute({
      sql: `
        UPDATE users SET 
          broker_provider = ?,
          broker_sub_account_id = ?,
          broker_status = ?,
          broker_created_at = ?,
          broker_last_sync_at = ?,
          onboarding_last_activity_at = ?,
          updated_at = ?
        WHERE uid = ?
      `,
      args: [
        broker.provider,
        broker.subAccountId,
        broker.status,
        broker.createdAt,
        broker.lastSyncAt || null,
        now,
        now,
        uid,
      ],
    });
  } catch (error) {
    console.error("Error saving broker:", error);
    throw new Error("Failed to save broker");
  }
}

// Save security information
export async function saveSecurity(
  uid: string,
  security: UserSecurity,
): Promise<void> {
  try {
    const now = new Date().toISOString();

    await client.execute({
      sql: `
        UPDATE users SET 
          security_2fa_method = ?,
          security_2fa_enabled = ?,
          security_2fa_enabled_at = ?,
          onboarding_last_activity_at = ?,
          updated_at = ?
        WHERE uid = ?
      `,
      args: [
        security.twoFA.method,
        security.twoFA.enabled,
        security.twoFA.enabledAt,
        now,
        now,
        uid,
      ],
    });
  } catch (error) {
    console.error("Error saving security:", error);
    throw new Error("Failed to save security");
  }
}

// Save preferences
export async function savePreferences(
  uid: string,
  preferences: UserPreferences,
): Promise<void> {
  try {
    const now = new Date().toISOString();

    await client.execute({
      sql: `
        UPDATE users SET 
          preferences_news = ?,
          preferences_order_fills = ?,
          preferences_risk_alerts = ?,
          preferences_statements = ?,
          preferences_theme = ?,
          preferences_default_quote = ?,
          preferences_hints_enabled = ?,
          onboarding_last_activity_at = ?,
          updated_at = ?
        WHERE uid = ?
      `,
      args: [
        preferences.news,
        preferences.orderFills,
        preferences.riskAlerts,
        preferences.statements,
        preferences.theme,
        preferences.defaultQuote,
        preferences.hintsEnabled,
        now,
        now,
        uid,
      ],
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    throw new Error("Failed to save preferences");
  }
}

// Check if step is accessible (previous steps completed)
export function isStepAccessible(
  user: User,
  targetStep: OnboardingStep,
): boolean {
  const stepOrder: OnboardingStep[] = [
    "welcome",
    "consents",
    "profile",
    "kyc",
    "wallet",
    "broker",
    "security",
    "preferences",
    "tour",
    "done",
  ];

  const targetIndex = stepOrder.indexOf(targetStep);
  const currentIndex = stepOrder.indexOf(user.onboarding.currentStep);

  // Allow going back to completed steps or current step
  if (targetIndex <= currentIndex) {
    return true;
  }

  // Allow advancing one step if current step is completed
  if (
    targetIndex === currentIndex + 1 &&
    user.onboarding.completedSteps.includes(user.onboarding.currentStep)
  ) {
    return true;
  }

  return false;
}

// Get next step in sequence
export function getNextStep(
  currentStep: OnboardingStep,
): OnboardingStep | null {
  const stepOrder: OnboardingStep[] = [
    "welcome",
    "consents",
    "profile",
    "kyc",
    "wallet",
    "broker",
    "security",
    "preferences",
    "tour",
    "done",
  ];

  const currentIndex = stepOrder.indexOf(currentStep);
  if (currentIndex >= 0 && currentIndex < stepOrder.length - 1) {
    return stepOrder[currentIndex + 1];
  }

  return null;
}

// Determine jurisdiction from country
export function getJurisdictionFromCountry(country: string): Jurisdiction {
  const countryUpper = country.toUpperCase();

  if (countryUpper === "DE" || countryUpper === "GERMANY") {
    return "DE";
  }

  // EU countries (simplified list)
  const euCountries = [
    "AT",
    "BE",
    "BG",
    "HR",
    "CY",
    "CZ",
    "DK",
    "EE",
    "FI",
    "FR",
    "GR",
    "HU",
    "IE",
    "IT",
    "LV",
    "LT",
    "LU",
    "MT",
    "NL",
    "PL",
    "PT",
    "RO",
    "SK",
    "SI",
    "ES",
    "SE",
  ];

  if (euCountries.includes(countryUpper)) {
    return "EU";
  }

  if (
    countryUpper === "US" ||
    countryUpper === "USA" ||
    countryUpper === "UNITED STATES"
  ) {
    return "US";
  }

  return "Other";
}

// Check if wallet is already linked to another user
export async function isWalletAlreadyLinked(
  publicKey: string,
  currentUid: string,
): Promise<boolean> {
  try {
    const result = await client.execute({
      sql: "SELECT uid FROM users WHERE wallet_public_key = ? AND uid != ?",
      args: [publicKey, currentUid],
    });

    return result.rows.length > 0;
  } catch (error) {
    console.error("Error checking wallet linkage:", error);
    return false;
  }
}
