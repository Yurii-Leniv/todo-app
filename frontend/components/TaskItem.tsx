"use client";

import { Task } from "@/lib/api";

type Props = {
  task: Task;
  pending: boolean;
  removing: boolean;
  onToggleDone: (task: Task) => void;
  onDelete: (task: Task) => void;
};

function priorityBadgeClass(priority: number): string {
  if (priority >= 8) return "bg-red-100 text-red-700";
  if (priority >= 4) return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-600";
}

export default function TaskItem({
  task,
  pending,
  removing,
  onToggleDone,
  onDelete,
}: Props) {
  return (
    <li
      className={`flex items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg sm:gap-4 sm:px-5 sm:py-4 ${
        removing ? "animate-task-out" : "animate-task-in"
      }`}
    >
      <label className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <input
          type="checkbox"
          checked={task.done}
          disabled={pending}
          onChange={() => onToggleDone(task)}
          className="h-5 w-5 shrink-0 accent-indigo-600 disabled:opacity-50"
        />
        <span
          className={`min-w-0 break-words text-base ${task.done ? "text-gray-400 line-through" : "text-gray-800"}`}
        >
          {task.title}
        </span>
        {pending && (
          <span className="shrink-0 text-xs text-gray-400">saving...</span>
        )}
        <span
          className={`ml-auto shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${priorityBadgeClass(task.priority)}`}
        >
          P{task.priority}
        </span>
      </label>
      <button
        onClick={() => onDelete(task)}
        disabled={removing}
        className="shrink-0 text-sm font-semibold text-red-600 hover:text-red-800 hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </li>
  );
}
