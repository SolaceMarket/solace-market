"use client";

import { useRouter } from "next/navigation";
import { auth } from "@/firebase/InitializeFirebase";
import type { User as FirebaseUser } from "firebase/auth";

interface AssetsPageHeaderProps {
  firebaseUser: FirebaseUser | null;
}

export default function AssetsPageHeader({
  firebaseUser,
}: AssetsPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard - Assets
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage trading assets and financial instruments
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => router.push("/admin/users")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Users
            </button>
            <span className="text-sm text-gray-500">{firebaseUser?.email}</span>
            <button
              type="button"
              onClick={() => auth.signOut()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
