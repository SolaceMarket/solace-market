import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAllAccountsWithDetails } from "@/alpaca/accounts/getAccountById";
import { getAccounts } from "@/alpaca/accounts/getAccounts";
import { verifyAdminAccess } from "@/lib/adminMiddleware";
import {
  findUserByEmail,
  linkAlpacaAccount,
  syncSingleAlpacaAccount,
  unlinkAlpacaAccount,
} from "@/services/alpaca/accountOperations";
import {
  filterAccountsWithUsers,
  getAllAccountsWithRelations,
} from "@/services/alpaca/accountQueries";
import { syncAlpacaAccountToDb } from "@/services/alpaca/accountSync";
import type {
  AccountOperationRequest,
  AccountOperationResponse,
  AccountsApiResponse,
} from "@/types/alpaca";

// Force dynamic rendering for this API route
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Check admin authentication
  const authResult = await verifyAdminAccess(request);
  if (!authResult.isValid && authResult.error) {
    return authResult.error;
  }

  const accounts = await getAccounts();
  console.log("Fetched accounts:", accounts);
  return NextResponse.json({ success: true, accounts });
}

// export async function GET(request: NextRequest) {
//   try {
//     // Check admin authentication
//     const authResult = await verifyAdminAccess(request);
//     if (!authResult.isValid && authResult.error) {
//       return authResult.error;
//     }

//     const { searchParams } = new URL(request.url);
//     const includeOrphans = searchParams.get("includeOrphans") === "true";
//     const syncFresh = searchParams.get("sync") === "true";

//     if (syncFresh) {
//       // Fetch fresh data from Alpaca and sync to database
//       console.log("Syncing fresh data from Alpaca Markets...");
//       const alpacaAccounts = await getAllAccountsWithDetails();

//       for (const alpacaAccount of alpacaAccounts) {
//         // Try to find matching internal user by email
//         const matchedUser = await findUserByEmail(
//           alpacaAccount.contact.email_address,
//         );
//         const matchedUserId = matchedUser?.uid;

//         // Sync to database
//         await syncAlpacaAccountToDb(alpacaAccount, matchedUserId);
//       }
//     }

//     // Fetch accounts from database with user info
//     const dbAccounts = await getAllAccountsWithRelations();

//     const accounts = includeOrphans
//       ? dbAccounts
//       : filterAccountsWithUsers(dbAccounts);

//     const response: AccountsApiResponse = {
//       success: true,
//       accounts,
//       total: accounts.length,
//     };

//     return NextResponse.json(response);
//   } catch (error) {
//     console.error("Error in Alpaca accounts API:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 },
//     );
//   }
// }

// Link an Alpaca account to an internal user
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await verifyAdminAccess(request);
    if (!authResult.isValid && authResult.error) {
      return authResult.error;
    }

    const body = (await request.json()) as AccountOperationRequest;
    const { alpacaAccountId, action } = body;

    let response: AccountOperationResponse;

    switch (action) {
      case "link": {
        const { userId } = body;
        await linkAlpacaAccount(alpacaAccountId, userId);
        response = {
          success: true,
          message: "Account linked successfully",
        };
        break;
      }

      case "unlink": {
        await unlinkAlpacaAccount(alpacaAccountId);
        response = {
          success: true,
          message: "Account unlinked successfully",
        };
        break;
      }

      case "syncSingle": {
        const { userId } = body;
        await syncSingleAlpacaAccount(alpacaAccountId, userId);
        response = {
          success: true,
          message: "Account synced successfully",
        };
        break;
      }

      default: {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating Alpaca account:", error);

    if (
      error instanceof Error &&
      error.message === "Account not found in Alpaca Markets"
    ) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
