"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import TaskList from "@/components/TaskList";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-sm rounded-3xl border border-white/60 bg-white/80 p-10 text-center shadow-xl backdrop-blur-sm">
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-indigo-950">Welcome</h1>
        <p className="mb-8 text-gray-600">Log in or sign up to manage your tasks.</p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return <TaskList />;
}
