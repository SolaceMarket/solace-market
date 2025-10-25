"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { adminApi, AdminApiError } from "@/services/adminApi";
import type { TradeRequest } from "@/types/admin";

// Query Keys
export const adminQueryKeys = {
  all: ["admin"] as const,
  adminStatus: () => [...adminQueryKeys.all, "status"] as const,
  users: () => [...adminQueryKeys.all, "users"] as const,
  usersList: (params?: { search?: string; limit?: number; page?: number }) =>
    [...adminQueryKeys.users(), "list", params] as const,
};

// Check if current user is admin
export function useAdminStatus() {
  return useQuery({
    queryKey: adminQueryKeys.adminStatus(),
    queryFn: adminApi.checkAdminStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: unknown) => {
      // Don't retry on 403 (not admin) or 401 (not authenticated)
      if (
        error instanceof AdminApiError &&
        (error.status === 403 || error.status === 401)
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// Fetch eligible users for trading
export function useEligibleUsers(params?: {
  search?: string;
  limit?: number;
  page?: number;
}) {
  return useQuery({
    queryKey: adminQueryKeys.usersList(params),
    queryFn: () => adminApi.fetchEligibleUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: true, // Always enabled, params are optional
  });
}

// Execute trade mutation
export function useExecuteTrade() {
  return useMutation({
    mutationFn: (tradeData: TradeRequest) => adminApi.executeTrade(tradeData),
    onSuccess: () => {
      // Optionally invalidate relevant queries after successful trade
      // For now, we don't need to invalidate anything specific
    },
    onError: (error) => {
      console.error("Trade execution failed:", error);
    },
  });
}
