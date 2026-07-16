"use client";

import { useAuth } from "@/lib/auth-context";

export default function UserInfo() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-600">{user.email}</span>
      <button
        onClick={logout}
        className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-100"
      >
        Log Out
      </button>
    </div>
  );
}
