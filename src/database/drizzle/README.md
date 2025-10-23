# Drizzle ORM Setup

This directory contains the complete Drizzle ORM setup for the Solace Market application, replacing the previous raw SQL implementations.

## Structure

```
src/database/drizzle/
├── client.ts              # Database client configuration
├── schema.ts              # Main schema export file
├── index.ts               # Main export file
├── schemas/               # Individual schema definitions
│   ├── users.ts           # Users table schema
│   ├── accounts.ts        # Accounts table schema
│   ├── assets.ts          # Assets table schema
│   ├── portfolios.ts      # Portfolios, holdings, transactions schemas
│   └── index.ts           # Schema exports
└── dao/                   # Data Access Objects
    ├── users.ts           # Users DAO with CRUD operations
    ├── accounts.ts        # Accounts DAO
    ├── assets.ts          # Assets DAO
    ├── portfolios.ts      # Portfolios, Holdings, Transactions DAOs
    └── index.ts           # DAO exports
```

## Usage

### Import the database client and DAOs

```typescript
import { db, UsersDAO, AccountsDAO, AssetsDAO } from '@/database/drizzle';
```

### Using DAOs (Recommended)

```typescript
// Create a user
const newUser = await UsersDAO.create({
  uid: 'user-123',
  email: 'user@example.com',
  createdAt: new Date().toISOString(),
  onboardingStartedAt: new Date().toISOString(),
  onboardingLastActivityAt: new Date().toISOString(),
});

// Get user by UID
const user = await UsersDAO.getByUid('user-123');

// Update user preferences
await UsersDAO.updatePreferences('user-123', {
  theme: 'dark',
  defaultQuote: 'USDC',
  news: true,
});

// Update KYC status
await UsersDAO.updateKYC('user-123', {
  provider: 'jumio',
  status: 'approved',
  approvedAt: new Date().toISOString(),
});
```

### Using raw Drizzle queries

```typescript
import { db, usersTable } from '@/database/drizzle';
import { eq } from 'drizzle-orm';

// Select with conditions
const users = await db.select().from(usersTable).where(eq(usersTable.locale, 'en'));

// Join queries
const usersWithAccounts = await db
  .select()
  .from(usersTable)
  .leftJoin(accountsTable, eq(usersTable.uid, accountsTable.userId));
```

## Schema Features

### Users Table
- Comprehensive user data including onboarding, profile, KYC, wallet, broker, security, and preferences
- Proper TypeScript types with `InsertUser` and `SelectUser`
- All fields match the existing Turso schema structure

### Accounts Table
- User account balances for different assets
- Foreign key relationship to users table
- Balance tracking (total, available, locked)

### Assets Table
- Trading asset information
- Tradability and margin requirements
- Extended attributes support via JSON field

### Portfolio Tables
- **Portfolios**: User portfolio containers
- **Holdings**: Asset positions within portfolios
- **Transactions**: Trade and transaction history
- Proper foreign key relationships and cascading deletes

## Environment Variables

Make sure these are set in your `.env` file:

```
TURSO_CONNECTION_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token
```

## Migration

To generate and run migrations:

```bash
# Generate migration
npx drizzle-kit generate

# Push schema to database  
npx drizzle-kit push

# Run migrations
npx drizzle-kit migrate
```

## Type Safety

All schemas provide full TypeScript type safety:

```typescript
import { type SelectUser, type InsertUser } from '@/database/drizzle';

// InsertUser - for creating new records (some fields optional)
const newUserData: InsertUser = {
  uid: 'user-123',
  email: 'user@example.com',
  // ... other fields
};

// SelectUser - for reading from database (all fields present)
const user: SelectUser = await UsersDAO.getByUid('user-123');
```

## Migration from Raw SQL

To migrate from the existing raw SQL code:

1. Replace imports from `@/turso/...` with `@/database/drizzle`
2. Use DAOs instead of raw SQL queries for better type safety
3. Update function signatures to use Drizzle types
4. Replace manual SQL with Drizzle query builder methods

Example migration:

```typescript
// Old way
import { client } from '@/turso/database';
const result = await client.execute('SELECT * FROM users WHERE uid = ?', [uid]);

// New way  
import { UsersDAO } from '@/database/drizzle';
const user = await UsersDAO.getByUid(uid);
```