"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/firebase/InitializeFirebase";
import Loader from "@/components/ui/Loader";
import AdminHeader from "@/components/admin/AdminHeader";
import UserFilters from "@/components/admin/UserFilters";
import AlpacaAccountsSection from "@/components/admin/AlpacaAccountsSection";
import UsersTable from "@/components/admin/UsersTable";
import { useUsers, useAlpacaAccounts } from "@/hooks/useAdmin";

export default function AdminUsersPage() {
  const router = useRouter();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAlpacaAccounts, setShowAlpacaAccounts] = useState(false);

  // Custom hooks for data management
  const { users, pagination, filters, handleFilterChange, handlePageChange } =
    useUsers(firebaseUser);

  const {
    alpacaAccounts,
    loading: alpacaLoading,
    fetchAlpacaAccounts,
  } = useAlpacaAccounts(firebaseUser);

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
        return;
      }
      setFirebaseUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleToggleAlpacaAccounts = () => {
    if (!showAlpacaAccounts) {
      fetchAlpacaAccounts(true);
    }
    setShowAlpacaAccounts(!showAlpacaAccounts);
  };

  const handleRefreshAlpacaAccounts = () => {
    fetchAlpacaAccounts(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        firebaseUser={firebaseUser}
        showAlpacaAccounts={showAlpacaAccounts}
        onToggleAlpacaAccounts={handleToggleAlpacaAccounts}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Alpaca Accounts Section */}
        {showAlpacaAccounts && (
          <AlpacaAccountsSection
            accounts={alpacaAccounts}
            loading={alpacaLoading}
            onRefresh={handleRefreshAlpacaAccounts}
          />
        )}

        <UsersTable
          users={users}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
