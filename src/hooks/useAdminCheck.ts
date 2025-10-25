"use client";

import { useAdminStatus } from "./useAdminQueries";

export function useAdminCheck() {
  const { data: isAdmin = false, isLoading: loading, error } = useAdminStatus();

  return {
    isAdmin,
    loading,
    error: error instanceof Error ? error.message : null,
  };
}
