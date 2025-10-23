"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function CreatePortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    initial_cash: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const portfolio = await response.json();
        router.push(`/portfolio/${portfolio.id}`);
      } else {
        console.error("Failed to create portfolio");
        // Handle error - show toast or error message
      }
    } catch (error) {
      console.error("Error creating portfolio:", error);
      // Handle error - show toast or error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create New Portfolio
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Start tracking your investments
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Portfolio Name *
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="My Investment Portfolio"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional description of your investment strategy or goals"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="initial_cash"
                className="block text-sm font-medium text-gray-700"
              >
                Initial Cash Balance
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="initial_cash"
                  name="initial_cash"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.initial_cash}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      initial_cash: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                You can add more cash later through transactions
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading || !formData.name.trim()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Portfolio"}
              </button>

              <Link
                href="/portfolio"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
