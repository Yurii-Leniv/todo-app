"use client";

import { useAuth } from "@/lib/auth-context";

export default function UserInfo() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="text-gray-600">{user.email}</span>
      <button
        onClick={logout}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        Log Out
      </button>
    </div>
  );
}
