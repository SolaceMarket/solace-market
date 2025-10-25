import { getAuth } from "firebase/auth";
import type {
  UserData,
  TradeRequest,
  TradeResponse,
  UsersResponse,
} from "@/types/admin";

class AdminApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

async function getAuthToken(): Promise<string> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new AdminApiError("Not authenticated", 401);
  }

  return await user.getIdToken();
}

async function makeAuthorizedRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new AdminApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData.error,
    );
  }

  return response.json();
}

export const adminApi = {
  // Check if current user is admin
  checkAdminStatus: async (): Promise<boolean> => {
    try {
      await makeAuthorizedRequest("/api/admin/users?limit=1");
      return true;
    } catch (error) {
      if (error instanceof AdminApiError && error.status === 403) {
        return false;
      }
      throw error;
    }
  },

  // Fetch eligible users for trading
  fetchEligibleUsers: async (params?: {
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<UserData[]> => {
    const searchParams = new URLSearchParams();

    // TODO: Uncomment for production code
    // searchParams.set("status", "completed");
    // searchParams.set("limit", (params?.limit || 50).toString());

    // if (params?.search) {
    //   searchParams.set("search", params.search);
    // }
    // if (params?.page) {
    //   searchParams.set("page", params.page.toString());
    // }

    const response = await makeAuthorizedRequest<UsersResponse>(
      `/api/admin/users?${searchParams.toString()}`,
    );

    // Filter users who have broker accounts set up
    return response.users.filter(
      // TODO: Uncomment for production code
      //   (user) => user.broker && user.broker.status === "active",
      // TODO: Remove for production code
      (user) => user,
    );
  },

  // Execute trade on behalf of user
  executeTrade: async (tradeData: TradeRequest): Promise<TradeResponse> => {
    return makeAuthorizedRequest<TradeResponse>("/api/admin/trade", {
      method: "POST",
      body: JSON.stringify(tradeData),
    });
  },
};

export { AdminApiError };
