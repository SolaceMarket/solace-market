// Universal SQLite queries that work in any database environment
export const UNIVERSAL_QUERIES = {
  "List all tables": `
    SELECT name, type 
    FROM sqlite_schema 
    WHERE type IN ('table', 'view') 
    AND name NOT LIKE 'sqlite_%'
    ORDER BY name;
  `,
  "Database info": `
    SELECT 
      (SELECT COUNT(*) FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%') as tables,
      (SELECT COUNT(*) FROM sqlite_schema WHERE type = 'index' AND name NOT LIKE 'sqlite_%') as indexes,
      (SELECT COUNT(*) FROM sqlite_schema WHERE type = 'view') as views;
  `,
  "Show table schemas": `
    SELECT name, sql 
    FROM sqlite_schema 
    WHERE type = 'table' 
    AND name NOT LIKE 'sqlite_%'
    ORDER BY name;
  `,
  "Show indexes": `
    SELECT name, tbl_name, sql 
    FROM sqlite_schema 
    WHERE type = 'index' 
    AND name NOT LIKE 'sqlite_%'
    ORDER BY tbl_name, name;
  `,
  "Database size info": `
    SELECT 
      COUNT(*) as total_objects,
      SUM(CASE WHEN type = 'table' THEN 1 ELSE 0 END) as tables,
      SUM(CASE WHEN type = 'index' THEN 1 ELSE 0 END) as indexes,
      SUM(CASE WHEN type = 'view' THEN 1 ELSE 0 END) as views,
      SUM(CASE WHEN type = 'trigger' THEN 1 ELSE 0 END) as triggers
    FROM sqlite_schema
    WHERE name NOT LIKE 'sqlite_%';
  `,
} as const;

// Project-specific queries for Solace Market
// These can be customized based on your database schema
export const PROJECT_QUERIES = {
  "Users overview": `
    SELECT 
      COUNT(*) as total_users,
      COUNT(CASE WHEN onboarding_completed = 1 THEN 1 END) as completed_onboarding,
      COUNT(DISTINCT jurisdiction) as jurisdictions,
      COUNT(DISTINCT onboarding_current_step) as current_steps
    FROM users;
  `,
  "Assets overview": `
    SELECT 
      COUNT(*) as total_assets,
      COUNT(DISTINCT exchange) as exchanges,
      COUNT(DISTINCT class) as asset_classes,
      COUNT(CASE WHEN tradable = 1 THEN 1 END) as tradable_assets
    FROM assets;
  `,
  "Portfolios overview": `
    SELECT 
      COUNT(*) as total_portfolios,
      COUNT(DISTINCT user_id) as users_with_portfolios,
      ROUND(AVG(total_value), 2) as avg_portfolio_value,
      ROUND(SUM(total_value), 2) as total_portfolio_value
    FROM portfolios;
  `,
  "Recent users": `
    SELECT uid, email, created_at, onboarding_current_step, jurisdiction
    FROM users 
    ORDER BY created_at DESC 
    LIMIT 10;
  `,
  "Active portfolios": `
    SELECT p.name, p.total_value, p.day_change_percent, u.email
    FROM portfolios p
    LEFT JOIN users u ON p.user_id = u.uid
    WHERE p.total_value > 0
    ORDER BY p.updated_at DESC
    LIMIT 10;
  `,
  "Onboarding progress": `
    SELECT 
      onboarding_current_step as step,
      COUNT(*) as user_count,
      ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users), 2) as percentage
    FROM users
    GROUP BY onboarding_current_step
    ORDER BY user_count DESC;
  `,
  "Exchange distribution": `
    SELECT 
      exchange,
      COUNT(*) as asset_count,
      COUNT(CASE WHEN tradable = 1 THEN 1 END) as tradable_count
    FROM assets
    GROUP BY exchange
    ORDER BY asset_count DESC;
  `,
} as const;

// Combined queries object for backward compatibility
export const COMMON_QUERIES = {
  ...UNIVERSAL_QUERIES,
  ...PROJECT_QUERIES,
} as const;

export type UniversalQueryKey = keyof typeof UNIVERSAL_QUERIES;
export type ProjectQueryKey = keyof typeof PROJECT_QUERIES;
export type CommonQueryKey = keyof typeof COMMON_QUERIES;
