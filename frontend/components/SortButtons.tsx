"use client";

import { TaskOrder } from "@/lib/api";

type Props = {
  value: TaskOrder | null;
  onChange: (value: TaskOrder | null) => void;
};

export default function SortButtons({ value, onChange }: Props) {
  function toggle(order: TaskOrder) {
    onChange(value === order ? null : order);
  }

  return (
    <div className="flex w-full gap-1 rounded-xl border border-white/60 bg-white/50 p-1 shadow-sm backdrop-blur-sm sm:w-auto">
      <button
        type="button"
        onClick={() => toggle("asc")}
        className={`flex-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors sm:flex-none ${
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
        className={`flex-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors sm:flex-none ${
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
