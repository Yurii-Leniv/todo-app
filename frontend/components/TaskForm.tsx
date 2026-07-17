"use client";

import { useState, FormEvent } from "react";

type Props = {
  onCreate: (title: string, priority: number) => Promise<void>;
};

export default function TaskForm({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onCreate(title.trim(), priority);
      setTitle("");
      setPriority(5);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 flex gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-md backdrop-blur-sm"
    >
      <input
        type="text"
        placeholder="New task..."
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-base transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
      <input
        type="number"
        min={1}
        max={10}
        value={priority}
        onChange={(e) => setPriority(Number(e.target.value))}
        title="Priority (1-10)"
        className="w-24 rounded-xl border border-gray-300 px-4 py-3 text-base transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
      >
        {submitting ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
