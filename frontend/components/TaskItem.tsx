"use client";

import { Task } from "@/lib/api";

type Props = {
  task: Task;
  onToggleDone: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export default function TaskItem({ task, onToggleDone, onDelete }: Props) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-md border border-gray-200 px-4 py-3">
      <label className="flex flex-1 items-center gap-3">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggleDone(task)}
          className="h-4 w-4"
        />
        <span className={task.done ? "text-gray-400 line-through" : ""}>{task.title}</span>
        <span className="ml-auto text-xs text-gray-500">priority {task.priority}</span>
      </label>
      <button
        onClick={() => onDelete(task)}
        className="text-sm text-red-600 hover:underline"
      >
        Delete
      </button>
    </li>
  );
}
