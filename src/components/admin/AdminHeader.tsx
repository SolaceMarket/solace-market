import { useRouter } from "next/navigation";
import type { User as FirebaseUser } from "firebase/auth";
import { auth } from "@/firebase/InitializeFirebase";

interface AdminHeaderProps {
  firebaseUser: FirebaseUser | null;
  showAlpacaAccounts: boolean;
  onToggleAlpacaAccounts: () => void;
}

export default function AdminHeader({
  firebaseUser,
  showAlpacaAccounts,
  onToggleAlpacaAccounts,
}: AdminHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage users and system data
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => router.push("/admin/assets")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Assets
            </button>
            <button
              type="button"
              onClick={onToggleAlpacaAccounts}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                showAlpacaAccounts
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-orange-100 hover:bg-orange-200 text-orange-800"
              }`}
            >
              {showAlpacaAccounts ? "Hide" : "Show"} Alpaca Accounts
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
