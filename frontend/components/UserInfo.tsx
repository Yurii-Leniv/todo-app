"use client";

import { useAuth } from "@/lib/auth-context";

export default function UserInfo() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex min-w-0 items-center gap-2 text-sm sm:gap-4">
      <span className="truncate text-gray-600">{user.email}</span>
      <button
        onClick={logout}
        className="shrink-0 whitespace-nowrap rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:px-4"
      >
        Log Out
      </button>
    </div>
  );
}
