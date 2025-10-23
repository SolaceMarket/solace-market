import { sql } from 'drizzle-orm';
import { sqliteTable, text, real, unique } from 'drizzle-orm/sqlite-core';
import { usersTable } from './users';
import { assetsTable } from './assets';

// Portfolios table
export const portfoliosTable = sqliteTable('portfolios', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => usersTable.uid),
  name: text('name').notNull(),
  description: text('description'),
  totalValue: real('total_value').default(0),
  dayChangeValue: real('day_change_value').default(0),
  dayChangePercent: real('day_change_percent').default(0),
  totalReturnValue: real('total_return_value').default(0),
  totalReturnPercent: real('total_return_percent').default(0),
  cashBalance: real('cash_balance').default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  uniqueUserPortfolio: unique().on(table.userId, table.name),
}));

// Holdings table
export const holdingsTable = sqliteTable('holdings', {
  id: text('id').primaryKey(),
  portfolioId: text('portfolio_id').notNull().references(() => portfoliosTable.id, { onDelete: 'cascade' }),
  assetId: text('asset_id').notNull().references(() => assetsTable.id),
  symbol: text('symbol').notNull(),
  quantity: real('quantity').notNull().default(0),
  averageCost: real('average_cost').notNull().default(0),
  currentPrice: real('current_price').default(0),
  marketValue: real('market_value').default(0),
  unrealizedPl: real('unrealized_pl').default(0),
  unrealizedPlPercent: real('unrealized_pl_percent').default(0),
  dayChangeValue: real('day_change_value').default(0),
  dayChangePercent: real('day_change_percent').default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  uniquePortfolioAsset: unique().on(table.portfolioId, table.assetId),
}));

// Transactions table
export const transactionsTable = sqliteTable('transactions', {
  id: text('id').primaryKey(),
  portfolioId: text('portfolio_id').notNull().references(() => portfoliosTable.id, { onDelete: 'cascade' }),
  assetId: text('asset_id').notNull().references(() => assetsTable.id),
  symbol: text('symbol').notNull(),
  type: text('type', { enum: ['buy', 'sell', 'deposit', 'withdrawal', 'dividend', 'fee'] }).notNull(),
  quantity: real('quantity').notNull().default(0),
  price: real('price').notNull().default(0),
  totalValue: real('total_value').notNull().default(0),
  fee: real('fee').default(0),
  notes: text('notes'),
  transactionDate: text('transaction_date').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type InsertPortfolio = typeof portfoliosTable.$inferInsert;
export type SelectPortfolio = typeof portfoliosTable.$inferSelect;

export type InsertHolding = typeof holdingsTable.$inferInsert;
export type SelectHolding = typeof holdingsTable.$inferSelect;

export type InsertTransaction = typeof transactionsTable.$inferInsert;
export type SelectTransaction = typeof transactionsTable.$inferSelect;