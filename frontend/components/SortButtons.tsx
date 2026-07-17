"use client";

import { TaskOrder } from "@/lib/api";

type Props = {
  value: TaskOrder | null;
  onChange: (value: TaskOrder | null) => void;
};

export default function SortButtons({ value, onChange }: Props) {
  function toggle(order: TaskOrder) {
    // Clicking an already-active button again clears the sort.
    onChange(value === order ? null : order);
  }

  return (
    <div className="flex gap-1 rounded-xl border border-white/60 bg-white/50 p-1 shadow-sm backdrop-blur-sm">
      <button
        type="button"
        onClick={() => toggle("asc")}
        className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
          value === "asc"
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Ascending
      </button>
      <button
        type="button"
        onClick={() => toggle("desc")}
        className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
          value === "desc"
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Descending
      </button>
    </div>
  );
}
