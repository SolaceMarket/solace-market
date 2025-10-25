"use client";

import { useState, useMemo } from "react";
import { useEligibleUsers } from "@/hooks/useAdminQueries";
import type { UserData } from "@/types/admin";

interface UserSelectorProps {
  selectedUser: UserData | null;
  onUserSelect: (user: UserData | null) => void;
  disabled?: boolean;
}

export function UserSelector({
  selectedUser,
  onUserSelect,
  disabled,
}: UserSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: users = [],
    isLoading,
    error,
  } = useEligibleUsers({
    search: searchTerm || undefined,
    limit: 50,
  });

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.profile?.firstName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ??
            false) ||
          (user.profile?.lastName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ??
            false),
      ),
    [users, searchTerm],
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const displayName = (user: UserData) => {
    if (user.profile?.firstName && user.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user.email;
  };

  return (
    <div className="relative">
      <div className="block text-sm font-medium text-gray-700 mb-2">
        Select User to Trade For
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center">
            <span className="w-4 h-4 text-gray-400 mr-2">👤</span>
            <span className="block truncate">
              {selectedUser ? displayName(selectedUser) : "Select a user..."}
            </span>
          </span>
          <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <span className="h-5 w-5 text-gray-400">▼</span>
          </span>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
            {/* Search input */}
            <div className="sticky top-0 bg-white px-3 py-2 border-b border-gray-200">
              <div className="relative">
                <span className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {isLoading && (
              <div className="px-3 py-2 text-sm text-gray-500">
                Loading users...
              </div>
            )}

            {error && (
              <div className="px-3 py-2 text-sm text-red-600">
                Error: {error.message || "Failed to load users"}
              </div>
            )}

            {!isLoading && !error && filteredUsers.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No eligible users found
              </div>
            )}

            {!isLoading &&
              !error &&
              filteredUsers.map((user) => (
                <button
                  key={user.uid}
                  type="button"
                  onClick={() => {
                    onUserSelect(user);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {displayName(user)}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.broker && (
                        <div className="text-xs text-green-600">
                          {user.broker.provider} • Account:{" "}
                          {user.broker.subAccountId}
                        </div>
                      )}
                    </div>
                    {user.profile?.country && (
                      <div className="text-xs text-gray-400 uppercase">
                        {user.profile.country}
                      </div>
                    )}
                  </div>
                </button>
              ))}

            {/* Clear selection option */}
            {selectedUser && (
              <div className="border-t border-gray-200 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    onUserSelect(null);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none"
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="mt-2 p-3 bg-blue-50 rounded-md">
          <div className="text-sm">
            <div className="font-medium text-blue-900">
              Selected: {displayName(selectedUser)}
            </div>
            <div className="text-blue-700">{selectedUser.email}</div>
            {selectedUser.broker && (
              <div className="text-blue-600 text-xs mt-1">
                Broker: {selectedUser.broker.provider} • Account:{" "}
                {selectedUser.broker.subAccountId}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
