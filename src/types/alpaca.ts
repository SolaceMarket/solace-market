import type {
  alpacaAccountsTable,
  alpacaContactsTable,
  alpacaIdentitiesTable,
  usersTable,
} from "@/database/drizzle/schemas";

/**
 * Type for Alpaca account with its related database records
 */
export type AccountWithRelations = {
  alpacaAccount: typeof alpacaAccountsTable.$inferSelect;
  user: typeof usersTable.$inferSelect | null;
  contact: typeof alpacaContactsTable.$inferSelect | null;
  identity: typeof alpacaIdentitiesTable.$inferSelect | null;
};

/**
 * Request body types for account operations
 */
export type LinkAccountRequest = {
  alpacaAccountId: string;
  userId: string;
  action: "link";
};

export type UnlinkAccountRequest = {
  alpacaAccountId: string;
  action: "unlink";
};

export type SyncSingleAccountRequest = {
  alpacaAccountId: string;
  userId?: string;
  action: "syncSingle";
};

export type AccountOperationRequest =
  | LinkAccountRequest
  | UnlinkAccountRequest
  | SyncSingleAccountRequest;

/**
 * API Response types
 */
export interface AccountsApiResponse {
  success: boolean;
  accounts: AccountWithRelations[];
  total: number;
}

export interface AccountOperationResponse {
  success: boolean;
  message: string;
}

export interface ApiErrorResponse {
  error: string;
}
