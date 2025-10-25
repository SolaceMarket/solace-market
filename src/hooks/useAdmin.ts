import { useState, useEffect, useCallback } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import type {
  AdminUser,
  AlpacaAccountInfo,
  Pagination,
  UserFilters,
} from "@/types/admin";
import { AlpacaAccount } from "@/alpaca/accounts/Account";

export function useUsers(firebaseUser: FirebaseUser | null) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    status: "",
    jurisdiction: "",
  });

  const fetchUsers = useCallback(async () => {
    if (!firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.jurisdiction && { jurisdiction: filters.jurisdiction }),
      });

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, [
    firebaseUser,
    pagination.page,
    pagination.limit,
    filters.search,
    filters.status,
    filters.jurisdiction,
  ]);

  useEffect(() => {
    if (firebaseUser) {
      fetchUsers();
    }
  }, [firebaseUser, fetchUsers]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return {
    users,
    pagination,
    filters,
    handleFilterChange,
    handlePageChange,
    refetch: fetchUsers,
  };
}

export function useAlpacaAccounts(firebaseUser: FirebaseUser | null) {
  const [alpacaAccounts, setAlpacaAccounts] = useState<AlpacaAccount[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAlpacaAccounts = useCallback(
    async (includeOrphans = true) => {
      if (!firebaseUser) return;

      setLoading(true);
      try {
        const token = await firebaseUser.getIdToken();
        const params = new URLSearchParams({
          includeOrphans: includeOrphans.toString(),
          sync: "false", // Set to true to sync fresh data from Alpaca
        });

        const response = await fetch(`/api/admin/alpaca-accounts?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Alpaca accounts");
        }

        const data = await response.json();
        setAlpacaAccounts(data.accounts);
      } catch (error) {
        console.error("Error fetching Alpaca accounts:", error);
      } finally {
        setLoading(false);
      }
    },
    [firebaseUser],
  );

  return {
    alpacaAccounts,
    loading,
    fetchAlpacaAccounts,
  };
}
