import { client } from "@/turso/database";

export async function createUsersTable() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        uid TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        locale TEXT NOT NULL DEFAULT 'de',
        jurisdiction TEXT NOT NULL DEFAULT 'EU',
        
        -- Onboarding state
        onboarding_started_at TEXT NOT NULL,
        onboarding_current_step TEXT NOT NULL DEFAULT 'welcome',
        onboarding_completed_steps TEXT NOT NULL DEFAULT '[]', -- JSON array
        onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
        onboarding_completed_at TEXT,
        onboarding_last_activity_at TEXT NOT NULL,
        
        -- Legal consents
        consents_tos_version TEXT,
        consents_tos_accepted_at TEXT,
        consents_privacy_version TEXT,
        consents_privacy_accepted_at TEXT,
        consents_risk_version TEXT,
        consents_risk_accepted_at TEXT,
        
        -- Profile
        profile_first_name TEXT,
        profile_last_name TEXT,
        profile_dob TEXT,
        profile_country TEXT,
        profile_tax_residency TEXT,
        profile_address TEXT,
        profile_phone TEXT,
        profile_experience TEXT,
        
        -- KYC
        kyc_provider TEXT,
        kyc_status TEXT,
        kyc_last_checked_at TEXT,
        kyc_submitted_at TEXT,
        kyc_approved_at TEXT,
        kyc_rejected_at TEXT,
        kyc_rejection_reason TEXT,
        
        -- Wallet
        wallet_chain TEXT,
        wallet_public_key TEXT,
        wallet_verified_at TEXT,
        wallet_is_generated BOOLEAN DEFAULT FALSE,
        
        -- Broker
        broker_provider TEXT,
        broker_sub_account_id TEXT,
        broker_status TEXT,
        broker_created_at TEXT,
        broker_last_sync_at TEXT,
        
        -- Security
        security_2fa_method TEXT,
        security_2fa_enabled BOOLEAN DEFAULT FALSE,
        security_2fa_enabled_at TEXT,
        
        -- Preferences
        preferences_news BOOLEAN DEFAULT TRUE,
        preferences_order_fills BOOLEAN DEFAULT TRUE,
        preferences_risk_alerts BOOLEAN DEFAULT TRUE,
        preferences_statements BOOLEAN DEFAULT TRUE,
        preferences_theme TEXT DEFAULT 'dark',
        preferences_default_quote TEXT DEFAULT 'USDC',
        preferences_hints_enabled BOOLEAN DEFAULT TRUE,
        
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for common queries
    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);

    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_users_onboarding_step ON users(onboarding_current_step)
    `);

    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_users_wallet_public_key ON users(wallet_public_key)
    `);

    console.log("Users table created successfully");
  } catch (error) {
    console.error("Error creating users table:", error);
    throw error;
  }
}
