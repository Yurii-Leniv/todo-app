"use client";

import { TaskStatus } from "@/lib/api";

type Props = {
  value: TaskStatus;
  onChange: (value: TaskStatus) => void;
};

const OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "done", label: "Done" },
  { value: "undone", label: "Undone" },
];

export default function FilterButtons({ value, onChange }: Props) {
  return (
    <div className="flex w-full gap-1 rounded-xl border border-white/60 bg-white/50 p-1 shadow-sm backdrop-blur-sm sm:w-auto">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors sm:flex-none ${
            value === opt.value
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
