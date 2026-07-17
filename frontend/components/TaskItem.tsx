"use client";

import { Task } from "@/lib/api";

type Props = {
  task: Task;
  pending: boolean;
  removing: boolean;
  onToggleDone: (task: Task) => void;
  onDelete: (task: Task) => void;
};

// Колір бейджа залежить від пріоритету: чим вищий, тим "тривожніший" колір.
function priorityBadgeClass(priority: number): string {
  if (priority >= 8) return "bg-red-100 text-red-700";
  if (priority >= 4) return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-600";
}

export default function TaskItem({ task, pending, removing, onToggleDone, onDelete }: Props) {
  return (
    <li
      className={`flex items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg ${
        removing ? "animate-task-out" : "animate-task-in"
      }`}
    >
      <label className="flex flex-1 items-center gap-4">
        <input
          type="checkbox"
          checked={task.done}
          disabled={pending}
          onChange={() => onToggleDone(task)}
          className="h-5 w-5 accent-indigo-600 disabled:opacity-50"
        />
        <span className={`text-base ${task.done ? "text-gray-400 line-through" : "text-gray-800"}`}>
          {task.title}
        </span>
        {pending && <span className="text-xs text-gray-400">saving...</span>}
        <span
          className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${priorityBadgeClass(task.priority)}`}
        >
          P{task.priority}
        </span>
      </label>
      <button
        onClick={() => onDelete(task)}
        disabled={removing}
        className="text-sm font-semibold text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </li>
  );
}
