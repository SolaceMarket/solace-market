// Export all schemas
export * from './users';
export * from './accounts';
export * from './assets';
export * from './portfolios';

// Re-export specific tables for convenience
export { usersTable } from './users';
export { accountsTable } from './accounts';
export { assetsTable } from './assets';
export { portfoliosTable, holdingsTable, transactionsTable } from './portfolios';

// Export all types
export type { InsertUser, SelectUser } from './users';
export type { InsertAccount, SelectAccount } from './accounts';
export type { InsertAsset, SelectAsset } from './assets';
export type { 
  InsertPortfolio, 
  SelectPortfolio,
  InsertHolding,
  SelectHolding,
  InsertTransaction,
  SelectTransaction
} from './portfolios';