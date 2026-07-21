"use client";

import { useState, FormEvent } from "react";
import { TaskInput } from "@/lib/api";

type Props = {
  categories: string[];
  onCreate: (input: TaskInput) => Promise<void>;
};

export default function TaskForm({ categories, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(5);
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onCreate({
        title: title.trim(),
        priority,
        due_date: dueDate || null,
        category: category.trim() || null,
      });
      setTitle("");
      setPriority(5);
      setDueDate("");
      setCategory("");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "rounded-xl border border-gray-300 px-4 py-3 text-base transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-md backdrop-blur-sm"
    >
      <input
        type="text"
        placeholder="New task..."
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={`w-full ${inputClass}`}
      />
      <div className="flex flex-wrap gap-3">
        <input
          type="number"
          min={1}
          max={10}
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          title="Priority (1-10)"
          className={`w-20 ${inputClass}`}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          title="Due date (optional)"
          className={`min-w-0 flex-1 ${inputClass} sm:flex-none`}
        />
        <input
          type="text"
          list="task-categories"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          maxLength={50}
          className={`min-w-0 flex-1 ${inputClass}`}
        />
        <datalist id="task-categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 sm:flex-none"
        >
          {submitting ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}
