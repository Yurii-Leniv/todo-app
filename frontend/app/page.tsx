"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import TaskList from "@/components/TaskList";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <h1 className="mb-4 text-2xl font-semibold">Welcome</h1>
        <p className="mb-6 text-gray-600">Log in or sign up to manage your tasks.</p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return <TaskList />;
}
