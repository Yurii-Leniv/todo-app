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
    <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
      <input
        type="text"
        placeholder="New task..."
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
      />
      <input
        type="number"
        min={1}
        max={10}
        value={priority}
        onChange={(e) => setPriority(Number(e.target.value))}
        title="Priority (1-10)"
        className="w-20 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Add
      </button>
    </form>
  );
}
