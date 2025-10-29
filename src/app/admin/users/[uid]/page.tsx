"use client";

import { type User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  AdminUserDetailHeader,
  AlpacaAccountCard,
  BasicInfoCard,
  BrokerInfoCard,
  type DetailedUser,
  EditModal,
  type EditMode,
  FirebaseInfoCard,
  KYCComplianceCard,
  KYCDocumentsCard,
  KYCInfoCard,
  OnboardingStatusCard,
  PreferencesCard,
  ProfileInfoCard,
  SecurityInfoCard,
  WalletInfoCard,
} from "@/components/admin/user-detail";
import Loader from "@/components/ui/Loader";
import { auth } from "@/firebase/InitializeFirebase";

export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const uid = params.uid as string;

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<DetailedUser | null>(null);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [activeTab, setActiveTab] = useState<
    "finance" | "technical" | "settings"
  >("technical");

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
        return;
      }
      setFirebaseUser(user);
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch user details
  const fetchUser = useCallback(async () => {
    if (!firebaseUser || !uid) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/admin/users/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
    }
  }, [firebaseUser, uid]);

  useEffect(() => {
    if (firebaseUser) {
      fetchUser();
    }
  }, [firebaseUser, fetchUser]);

  // Update user
  const updateUser = async (action: string, data: Record<string, unknown>) => {
    if (!firebaseUser || !uid) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/admin/users/${uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, data }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Refresh user data
      await fetchUser();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  // Handle edit mode
  const handleEdit = (mode: EditMode) => {
    setEditMode(mode);
  };

  const handleSaveEdit = async (data: Record<string, unknown>) => {
    if (!editMode) return;
    await updateUser(
      `update${editMode.charAt(0).toUpperCase() + editMode.slice(1)}`,
      data,
    );
    setEditMode(null);
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            User Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The user with UID {uid} could not be found.
          </p>
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminUserDetailHeader user={user} firebaseUser={firebaseUser} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab("finance")}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "finance"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Finance
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("technical")}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "technical"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Technical
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "finance" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BasicInfoCard user={user} />
            <OnboardingStatusCard
              user={user}
              onUpdate={updateUser}
              onEdit={handleEdit}
            />
            <BrokerInfoCard user={user} onEdit={handleEdit} />
            <AlpacaAccountCard user={user} onRefresh={fetchUser} />
            {/* TODO: Add portfolio/balance cards when implemented */}
          </div>
        )}

        {activeTab === "technical" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BasicInfoCard user={user} />
            <OnboardingStatusCard
              user={user}
              onUpdate={updateUser}
              onEdit={handleEdit}
            />
            <ProfileInfoCard user={user} onEdit={handleEdit} />
            <WalletInfoCard user={user} onEdit={handleEdit} />

            {/* KYC Section - spans full width if user has KYC data */}
            {user.kyc && (
              <>
                <div className="lg:col-span-2">
                  <KYCComplianceCard user={user} />
                </div>
                <KYCInfoCard
                  user={user}
                  onEdit={handleEdit}
                  onUpdate={updateUser}
                />
                <KYCDocumentsCard user={user} />
              </>
            )}
            {!user.kyc && (
              <KYCInfoCard
                user={user}
                onEdit={handleEdit}
                onUpdate={updateUser}
              />
            )}

            <AlpacaAccountCard user={user} onRefresh={fetchUser} />
            <FirebaseInfoCard user={user} onEdit={handleEdit} />
            <SecurityInfoCard user={user} onEdit={handleEdit} />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BasicInfoCard user={user} />
            <PreferencesCard user={user} onEdit={handleEdit} />
            <SecurityInfoCard user={user} onEdit={handleEdit} />
            <ProfileInfoCard user={user} onEdit={handleEdit} />
          </div>
        )}
      </div>

      <EditModal
        mode={editMode}
        user={user}
        onClose={() => setEditMode(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
