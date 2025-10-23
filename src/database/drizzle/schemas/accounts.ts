import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';
import { usersTable } from './users';

export const accountsTable = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => usersTable.uid),
  assetId: text('asset_id').notNull(),
  balance: real('balance').notNull().default(0),
  available: real('available').notNull().default(0),
  locked: real('locked').notNull().default(0),
});

export type InsertAccount = typeof accountsTable.$inferInsert;
export type SelectAccount = typeof accountsTable.$inferSelect;