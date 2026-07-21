"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/lib/api";

type Props = {
  task: Task;
  pending: boolean;
  removing: boolean;
  draggable: boolean;
  onToggleDone: (task: Task) => void;
  onDelete: (task: Task) => void;
};

function priorityBadgeClass(priority: number): string {
  if (priority >= 8) return "bg-red-100 text-red-700";
  if (priority >= 4) return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-600";
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDueDate(iso: string): string {
  // Parse as a local date (not UTC) to avoid an off-by-one day near midnight.
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function TaskItem({
  task,
  pending,
  removing,
  draggable,
  onToggleDone,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !draggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const overdue = Boolean(
    task.due_date && !task.done && task.due_date < todayIso(),
  );

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg sm:gap-4 sm:px-5 sm:py-4 ${
        isDragging ? "z-10 opacity-70 shadow-lg" : ""
      } ${removing ? "animate-task-out" : isDragging ? "" : "animate-task-in"}`}
    >
      {draggable && (
        <button
          type="button"
          aria-label="Drag to reorder"
          className="shrink-0 cursor-grab touch-none text-gray-400 hover:text-gray-600 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="3" r="1.4" />
            <circle cx="11" cy="3" r="1.4" />
            <circle cx="5" cy="8" r="1.4" />
            <circle cx="11" cy="8" r="1.4" />
            <circle cx="5" cy="13" r="1.4" />
            <circle cx="11" cy="13" r="1.4" />
          </svg>
        </button>
      )}
      <label className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <input
          type="checkbox"
          checked={task.done}
          disabled={pending}
          onChange={() => onToggleDone(task)}
          className="h-5 w-5 shrink-0 accent-indigo-600 disabled:opacity-50"
        />
        <div className="flex min-w-0 flex-col">
          <span
            className={`break-words text-base ${task.done ? "text-gray-400 line-through" : "text-gray-800"}`}
          >
            {task.title}
          </span>
          {(task.due_date || task.category) && (
            <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
              {task.due_date && (
                <span
                  className={
                    overdue ? "font-medium text-red-600" : "text-gray-500"
                  }
                >
                  📅 {formatDueDate(task.due_date)}
                </span>
              )}
              {task.category && (
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700">
                  {task.category}
                </span>
              )}
            </span>
          )}
        </div>
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
